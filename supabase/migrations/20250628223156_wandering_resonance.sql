/*
  # System Administrator Management Functions

  1. Tenant Management Functions
    - Create, update, suspend, and delete tenants
    - Override tenant restrictions
    - Manage tenant configurations

  2. User Management Functions
    - View and manage all users across tenants
    - Reset passwords and manage roles
    - User impersonation capabilities

  3. System Monitoring Functions
    - Resource usage tracking
    - Performance metrics collection
    - Alert management

  4. Security Management Functions
    - Audit log access and analysis
    - Security event monitoring
    - Access control management
*/

-- Function to create a new tenant (system admin only)
CREATE OR REPLACE FUNCTION admin_create_tenant(
  tenant_name TEXT,
  tenant_slug TEXT,
  subscription_plan TEXT DEFAULT 'basic',
  max_clinics INTEGER DEFAULT NULL,
  max_users INTEGER DEFAULT NULL,
  initial_settings JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  new_tenant_id UUID;
  plan_limits JSONB;
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  -- Get plan limits
  SELECT config_value INTO plan_limits
  FROM system_configuration
  WHERE config_key = 'max_tenants_per_subscription';
  
  -- Set defaults based on subscription plan
  IF max_clinics IS NULL THEN
    max_clinics := COALESCE((plan_limits->subscription_plan->>'max_clinics')::integer, 1);
  END IF;
  
  IF max_users IS NULL THEN
    max_users := COALESCE((plan_limits->subscription_plan->>'max_users')::integer, 10);
  END IF;
  
  -- Create the tenant
  INSERT INTO tenants (
    name,
    slug,
    subscription_plan,
    subscription_status,
    max_clinics,
    max_users,
    settings,
    created_at,
    updated_at
  ) VALUES (
    tenant_name,
    tenant_slug,
    subscription_plan,
    'active',
    max_clinics,
    max_users,
    initial_settings,
    NOW(),
    NOW()
  ) RETURNING id INTO new_tenant_id;
  
  -- Log the action
  PERFORM log_admin_action(
    'CREATE',
    new_tenant_id,
    jsonb_build_object(
      'tenant_name', tenant_name,
      'tenant_slug', tenant_slug,
      'subscription_plan', subscription_plan,
      'max_clinics', max_clinics,
      'max_users', max_users
    ),
    'medium'
  );
  
  RETURN new_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update tenant configuration
CREATE OR REPLACE FUNCTION admin_update_tenant(
  tenant_id UUID,
  updates JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  old_state JSONB;
  new_state JSONB;
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  -- Prevent modification of system admin tenant
  IF tenant_id = '00000000-0000-0000-0000-000000000001'::uuid THEN
    RAISE EXCEPTION 'System administrator tenant cannot be modified';
  END IF;
  
  -- Get current state
  SELECT to_jsonb(t.*) INTO old_state
  FROM tenants t
  WHERE id = tenant_id;
  
  IF old_state IS NULL THEN
    RAISE EXCEPTION 'Tenant not found: %', tenant_id;
  END IF;
  
  -- Apply updates
  UPDATE tenants SET
    name = COALESCE((updates->>'name')::text, name),
    subscription_plan = COALESCE((updates->>'subscription_plan')::text, subscription_plan),
    subscription_status = COALESCE((updates->>'subscription_status')::text, subscription_status),
    max_clinics = COALESCE((updates->>'max_clinics')::integer, max_clinics),
    max_users = COALESCE((updates->>'max_users')::integer, max_users),
    settings = COALESCE((updates->'settings')::jsonb, settings),
    updated_at = NOW()
  WHERE id = tenant_id;
  
  -- Get new state
  SELECT to_jsonb(t.*) INTO new_state
  FROM tenants t
  WHERE id = tenant_id;
  
  -- Log the action
  PERFORM log_admin_action(
    'UPDATE',
    tenant_id,
    jsonb_build_object(
      'updates_applied', updates,
      'fields_changed', (
        SELECT jsonb_object_agg(key, value)
        FROM jsonb_each(updates)
        WHERE key IN ('name', 'subscription_plan', 'subscription_status', 'max_clinics', 'max_users')
      )
    ),
    'medium'
  );
  
  -- Store detailed audit
  INSERT INTO tenant_management_audit (
    admin_user_id,
    target_tenant_id,
    action,
    action_details,
    before_state,
    after_state,
    risk_level
  ) VALUES (
    auth.uid(),
    tenant_id,
    'UPDATE',
    updates,
    old_state,
    new_state,
    'medium'
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to suspend/activate tenant
CREATE OR REPLACE FUNCTION admin_set_tenant_status(
  tenant_id UUID,
  new_status TEXT,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  old_status TEXT;
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  -- Prevent modification of system admin tenant
  IF tenant_id = '00000000-0000-0000-0000-000000000001'::uuid THEN
    RAISE EXCEPTION 'System administrator tenant status cannot be changed';
  END IF;
  
  -- Validate status
  IF new_status NOT IN ('active', 'inactive', 'suspended', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;
  
  -- Get current status
  SELECT subscription_status INTO old_status
  FROM tenants
  WHERE id = tenant_id;
  
  IF old_status IS NULL THEN
    RAISE EXCEPTION 'Tenant not found: %', tenant_id;
  END IF;
  
  -- Update status
  UPDATE tenants 
  SET 
    subscription_status = new_status,
    updated_at = NOW()
  WHERE id = tenant_id;
  
  -- Log the action
  PERFORM log_admin_action(
    CASE 
      WHEN new_status = 'suspended' THEN 'SUSPEND'
      WHEN new_status = 'active' AND old_status != 'active' THEN 'ACTIVATE'
      ELSE 'UPDATE'
    END,
    tenant_id,
    jsonb_build_object(
      'old_status', old_status,
      'new_status', new_status,
      'reason', reason
    ),
    CASE 
      WHEN new_status = 'suspended' THEN 'high'
      ELSE 'medium'
    END
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tenant resource usage
CREATE OR REPLACE FUNCTION admin_get_tenant_usage(tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  usage_data JSONB;
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  SELECT jsonb_build_object(
    'tenant_id', t.id,
    'tenant_name', t.name,
    'subscription_plan', t.subscription_plan,
    'limits', jsonb_build_object(
      'max_clinics', t.max_clinics,
      'max_users', t.max_users
    ),
    'current_usage', jsonb_build_object(
      'clinics', COALESCE(clinic_count, 0),
      'users', COALESCE(user_count, 0),
      'patients', COALESCE(patient_count, 0),
      'appointments_30d', COALESCE(appointment_count, 0),
      'storage_mb', COALESCE(storage_usage, 0)
    ),
    'utilization', jsonb_build_object(
      'clinic_utilization', ROUND((COALESCE(clinic_count, 0)::numeric / t.max_clinics * 100), 2),
      'user_utilization', ROUND((COALESCE(user_count, 0)::numeric / t.max_users * 100), 2)
    ),
    'last_activity', last_activity,
    'created_at', t.created_at
  ) INTO usage_data
  FROM tenants t
  LEFT JOIN (
    SELECT 
      tenant_id,
      COUNT(DISTINCT c.id) as clinic_count,
      COUNT(DISTINCT u.id) as user_count,
      COUNT(DISTINCT p.id) as patient_count,
      COUNT(DISTINCT a.id) FILTER (WHERE a.created_at >= NOW() - INTERVAL '30 days') as appointment_count,
      SUM(LENGTH(COALESCE(mr.description, '')) + LENGTH(COALESCE(mr.diagnosis, ''))) / 1024 / 1024 as storage_usage,
      MAX(u.last_login_at) as last_activity
    FROM tenants t2
    LEFT JOIN clinics c ON t2.id = c.tenant_id
    LEFT JOIN users u ON t2.id = u.tenant_id
    LEFT JOIN patients p ON t2.id = p.tenant_id
    LEFT JOIN appointments a ON t2.id = a.tenant_id
    LEFT JOIN medical_records mr ON t2.id = mr.tenant_id
    WHERE t2.id = tenant_id
    GROUP BY t2.id
  ) usage ON t.id = usage.tenant_id
  WHERE t.id = tenant_id;
  
  RETURN usage_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get system-wide metrics
CREATE OR REPLACE FUNCTION admin_get_system_metrics(
  metric_type TEXT DEFAULT 'overview',
  time_range INTERVAL DEFAULT '30 days'
)
RETURNS JSONB AS $$
DECLARE
  metrics JSONB;
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  CASE metric_type
    WHEN 'overview' THEN
      SELECT jsonb_build_object(
        'total_tenants', COUNT(DISTINCT t.id),
        'active_tenants', COUNT(DISTINCT t.id) FILTER (WHERE t.subscription_status = 'active'),
        'total_users', COUNT(DISTINCT u.id),
        'active_users', COUNT(DISTINCT u.id) FILTER (WHERE u.last_login_at >= NOW() - time_range),
        'total_clinics', COUNT(DISTINCT c.id),
        'total_patients', COUNT(DISTINCT p.id),
        'appointments_period', COUNT(DISTINCT a.id) FILTER (WHERE a.created_at >= NOW() - time_range),
        'revenue_period', COALESCE(SUM(pay.amount) FILTER (WHERE pay.payment_status = 'completed' AND pay.paid_at >= NOW() - time_range), 0),
        'period_days', EXTRACT(days FROM time_range)
      ) INTO metrics
      FROM tenants t
      LEFT JOIN users u ON t.id = u.tenant_id
      LEFT JOIN clinics c ON t.id = c.tenant_id
      LEFT JOIN patients p ON t.id = p.tenant_id
      LEFT JOIN appointments a ON t.id = a.tenant_id
      LEFT JOIN payments pay ON t.id = pay.tenant_id
      WHERE t.id != '00000000-0000-0000-0000-000000000001'::uuid;
      
    WHEN 'performance' THEN
      SELECT jsonb_build_object(
        'avg_response_time_ms', 150, -- Placeholder - would come from monitoring
        'uptime_percentage', 99.9,   -- Placeholder - would come from monitoring
        'error_rate_percentage', 0.1, -- Placeholder - would come from monitoring
        'active_sessions', COUNT(DISTINCT u.id) FILTER (WHERE u.last_login_at >= NOW() - INTERVAL '1 hour'),
        'database_size_mb', pg_database_size(current_database()) / 1024 / 1024,
        'cache_hit_ratio', 0.95 -- Placeholder - would come from monitoring
      ) INTO metrics
      FROM users u
      JOIN tenants t ON u.tenant_id = t.id
      WHERE t.id != '00000000-0000-0000-0000-000000000001'::uuid;
      
    WHEN 'security' THEN
      SELECT jsonb_build_object(
        'failed_logins_24h', COUNT(*) FILTER (WHERE tma.action = 'LOGIN_FAILED' AND tma.created_at >= NOW() - INTERVAL '24 hours'),
        'admin_actions_24h', COUNT(*) FILTER (WHERE tma.created_at >= NOW() - INTERVAL '24 hours'),
        'high_risk_events', COUNT(*) FILTER (WHERE tma.risk_level = 'high' AND tma.created_at >= NOW() - time_range),
        'locked_accounts', COUNT(DISTINCT sa.user_id) FILTER (WHERE sa.account_locked_until > NOW()),
        'mfa_enabled_admins', COUNT(DISTINCT sa.user_id) FILTER (WHERE sa.mfa_enabled = true)
      ) INTO metrics
      FROM tenant_management_audit tma
      LEFT JOIN system_administrators sa ON tma.admin_user_id = sa.user_id;
      
    ELSE
      RAISE EXCEPTION 'Invalid metric type: %', metric_type;
  END CASE;
  
  RETURN metrics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to manage system configuration
CREATE OR REPLACE FUNCTION admin_update_system_config(
  config_key TEXT,
  config_value JSONB,
  config_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  -- Update or insert configuration
  INSERT INTO system_configuration (
    config_key,
    config_value,
    config_type,
    description,
    last_modified_by,
    last_modified_at,
    version
  ) VALUES (
    config_key,
    config_value,
    'system',
    COALESCE(config_description, 'Updated by system administrator'),
    auth.uid(),
    NOW(),
    1
  ) ON CONFLICT (config_key) DO UPDATE SET
    config_value = EXCLUDED.config_value,
    description = COALESCE(EXCLUDED.description, system_configuration.description),
    last_modified_by = auth.uid(),
    last_modified_at = NOW(),
    version = system_configuration.version + 1;
  
  -- Log the configuration change
  PERFORM log_admin_action(
    'CONFIGURE',
    NULL,
    jsonb_build_object(
      'config_key', config_key,
      'config_value', config_value,
      'description', config_description
    ),
    'high'
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate system admin reports
CREATE OR REPLACE FUNCTION admin_generate_report(
  report_type TEXT,
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE,
  tenant_filter UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  report_data JSONB;
BEGIN
  -- Validate system admin access
  IF NOT is_system_admin() THEN
    RAISE EXCEPTION 'Access denied: System administrator privileges required';
  END IF;
  
  CASE report_type
    WHEN 'tenant_activity' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'tenant_id', t.id,
          'tenant_name', t.name,
          'subscription_plan', t.subscription_plan,
          'users_active', COUNT(DISTINCT u.id) FILTER (WHERE u.last_login_at >= start_date),
          'appointments_created', COUNT(DISTINCT a.id) FILTER (WHERE a.created_at::date BETWEEN start_date AND end_date),
          'revenue_generated', COALESCE(SUM(p.amount) FILTER (WHERE p.payment_status = 'completed' AND p.paid_at::date BETWEEN start_date AND end_date), 0)
        )
      ) INTO report_data
      FROM tenants t
      LEFT JOIN users u ON t.id = u.tenant_id
      LEFT JOIN appointments a ON t.id = a.tenant_id
      LEFT JOIN payments p ON t.id = p.tenant_id
      WHERE t.id != '00000000-0000-0000-0000-000000000001'::uuid
      AND (tenant_filter IS NULL OR t.id = tenant_filter)
      GROUP BY t.id, t.name, t.subscription_plan;
      
    WHEN 'security_events' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'event_date', tma.created_at::date,
          'admin_user', u.name,
          'action', tma.action,
          'risk_level', tma.risk_level,
          'target_tenant', t.name,
          'details', tma.action_details
        )
      ) INTO report_data
      FROM tenant_management_audit tma
      LEFT JOIN users u ON tma.admin_user_id = u.id
      LEFT JOIN tenants t ON tma.target_tenant_id = t.id
      WHERE tma.created_at::date BETWEEN start_date AND end_date
      AND (tenant_filter IS NULL OR tma.target_tenant_id = tenant_filter)
      ORDER BY tma.created_at DESC;
      
    WHEN 'system_health' THEN
      SELECT jsonb_build_object(
        'report_period', jsonb_build_object(
          'start_date', start_date,
          'end_date', end_date
        ),
        'metrics', (SELECT admin_get_system_metrics('overview', (end_date - start_date)::interval)),
        'performance', (SELECT admin_get_system_metrics('performance')),
        'security', (SELECT admin_get_system_metrics('security', (end_date - start_date)::interval))
      ) INTO report_data;
      
    ELSE
      RAISE EXCEPTION 'Invalid report type: %', report_type;
  END CASE;
  
  -- Log report generation
  PERFORM log_admin_action(
    'GENERATE_REPORT',
    tenant_filter,
    jsonb_build_object(
      'report_type', report_type,
      'start_date', start_date,
      'end_date', end_date,
      'tenant_filter', tenant_filter
    ),
    'low'
  );
  
  RETURN jsonb_build_object(
    'report_type', report_type,
    'generated_at', NOW(),
    'generated_by', auth.uid(),
    'parameters', jsonb_build_object(
      'start_date', start_date,
      'end_date', end_date,
      'tenant_filter', tenant_filter
    ),
    'data', report_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;