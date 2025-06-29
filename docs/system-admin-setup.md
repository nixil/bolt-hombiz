# System Administrator Setup Guide

## Overview

This guide provides instructions for setting up and managing the system administrator tenant in the ClinicFlow multi-tenant platform. The system admin tenant has root-level access and comprehensive management capabilities across all tenants.

## Initial Setup

### 1. Database Migration

The system admin tenant is automatically created during database migration with the following characteristics:

- **Tenant ID**: `00000000-0000-0000-0000-000000000001`
- **Name**: "System Administrator"
- **Slug**: `system_admin`
- **Subscription Plan**: `enterprise`
- **Deletion Protection**: Cannot be deleted through normal operations

### 2. Creating the System Administrator User

After running the migrations, you need to create the initial system administrator user:

```sql
-- 1. First, create the auth user through Supabase Auth API or dashboard
-- 2. Then run this function to set up the system admin user
SELECT create_system_admin_user(
  'admin@clinicflow.system',  -- Admin email
  'System Administrator',     -- Admin name
  '+1-555-000-0000'          -- Admin phone (optional)
);
```

### 3. Security Configuration

The system admin user is configured with maximum security settings:

- **MFA Required**: Multi-factor authentication is mandatory
- **Session Timeout**: 15 minutes (shorter than regular users)
- **Security Clearance**: Level 5 (maximum)
- **Audit Logging**: All actions are comprehensively logged
- **Account Lockout**: After 3 failed login attempts (30-minute lockout)

## Administrative Capabilities

### Tenant Management

System administrators can perform the following tenant operations:

#### Create New Tenant
```sql
SELECT admin_create_tenant(
  'New Clinic Network',      -- Tenant name
  'new-clinic-network',      -- Tenant slug
  'professional',            -- Subscription plan
  5,                         -- Max clinics (optional)
  50                         -- Max users (optional)
);
```

#### Update Tenant Configuration
```sql
SELECT admin_update_tenant(
  'tenant-uuid-here',
  jsonb_build_object(
    'subscription_plan', 'premium',
    'max_clinics', 10,
    'max_users', 100
  )
);
```

#### Suspend/Activate Tenant
```sql
-- Suspend tenant
SELECT admin_set_tenant_status(
  'tenant-uuid-here',
  'suspended',
  'Payment overdue'
);

-- Reactivate tenant
SELECT admin_set_tenant_status(
  'tenant-uuid-here',
  'active',
  'Payment received'
);
```

### System Monitoring

#### Get Tenant Resource Usage
```sql
SELECT admin_get_tenant_usage('tenant-uuid-here');
```

Returns detailed usage information including:
- Current resource utilization
- Subscription limits
- Storage usage
- Activity metrics

#### System-Wide Metrics
```sql
-- Overview metrics
SELECT admin_get_system_metrics('overview', '30 days');

-- Performance metrics
SELECT admin_get_system_metrics('performance');

-- Security metrics
SELECT admin_get_system_metrics('security', '7 days');
```

### Report Generation

#### Tenant Activity Report
```sql
SELECT admin_generate_report(
  'tenant_activity',
  '2024-01-01'::date,
  '2024-01-31'::date
);
```

#### Security Events Report
```sql
SELECT admin_generate_report(
  'security_events',
  CURRENT_DATE - INTERVAL '7 days',
  CURRENT_DATE
);
```

#### System Health Report
```sql
SELECT admin_generate_report(
  'system_health',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE
);
```

## Security Features

### Access Control

The system implements multiple layers of security:

1. **Row Level Security (RLS)**: Database-level tenant isolation
2. **Function-Level Security**: Admin functions require system admin privileges
3. **Audit Logging**: All administrative actions are logged
4. **IP Restrictions**: Optional IP-based access control
5. **Session Management**: Automatic session timeout and validation

### Audit Logging

All system admin actions are logged in the `tenant_management_audit` table:

```sql
-- View recent admin actions
SELECT 
  tma.created_at,
  u.name as admin_name,
  tma.action,
  tma.risk_level,
  t.name as target_tenant,
  tma.action_details
FROM tenant_management_audit tma
LEFT JOIN users u ON tma.admin_user_id = u.id
LEFT JOIN tenants t ON tma.target_tenant_id = t.id
ORDER BY tma.created_at DESC
LIMIT 50;
```

### Security Monitoring

Monitor security events and potential threats:

```sql
-- High-risk events in the last 24 hours
SELECT *
FROM tenant_management_audit
WHERE risk_level = 'high'
AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Failed login attempts
SELECT 
  sa.user_id,
  u.email,
  sa.failed_login_attempts,
  sa.account_locked_until
FROM system_administrators sa
JOIN users u ON sa.user_id = u.id
WHERE sa.failed_login_attempts > 0
OR sa.account_locked_until > NOW();
```

## System Configuration

### Configuration Management

System-wide settings are managed through the `system_configuration` table:

```sql
-- Update system configuration
SELECT admin_update_system_config(
  'session_timeout_minutes',
  '{"default": 60, "admin": 30, "system_admin": 15}',
  'Session timeout settings by user type'
);

-- View current configuration
SELECT 
  config_key,
  config_value,
  config_type,
  description,
  last_modified_at
FROM system_configuration
ORDER BY config_type, config_key;
```

### Feature Flags

Control platform features through configuration:

```sql
-- Enable/disable features
SELECT admin_update_system_config(
  'feature_flags',
  jsonb_build_object(
    'multi_clinic_support', true,
    'advanced_analytics', true,
    'api_access', false,
    'mobile_app', true
  ),
  'Platform feature toggles'
);
```

## Monitoring and Alerts

### Dashboard Views

Use the provided views for monitoring:

```sql
-- System admin dashboard
SELECT * FROM system_admin_dashboard
ORDER BY tenant_created DESC;

-- System health metrics
SELECT * FROM system_health_metrics;
```

### Performance Monitoring

Track system performance and resource usage:

```sql
-- Insert custom metrics
INSERT INTO system_metrics (
  metric_name,
  metric_value,
  metric_unit,
  tenant_id,
  metric_metadata
) VALUES (
  'api_response_time',
  125.5,
  'milliseconds',
  NULL, -- System-wide metric
  jsonb_build_object('endpoint', '/api/appointments', 'method', 'GET')
);
```

## Backup and Recovery

### Database Backup

Ensure regular backups are configured:

1. **Automated Daily Backups**: Configure through Supabase dashboard
2. **Point-in-Time Recovery**: Enable WAL archiving
3. **Cross-Region Replication**: For disaster recovery
4. **Audit Log Archival**: Long-term retention for compliance

### Emergency Procedures

In case of system issues:

1. **Emergency Access**: Use emergency access codes if available
2. **Account Recovery**: Reset admin passwords through Supabase Auth
3. **System Restore**: Use point-in-time recovery if needed
4. **Incident Response**: Follow security incident procedures

## Compliance and Legal

### HIPAA Compliance

Ensure the following for healthcare data protection:

1. **Data Encryption**: All data encrypted at rest and in transit
2. **Access Logging**: Comprehensive audit trails maintained
3. **User Authentication**: Strong authentication requirements
4. **Data Minimization**: Only necessary data collected and stored

### Data Retention

Configure appropriate retention policies:

```sql
-- Set retention policies
SELECT admin_update_system_config(
  'data_retention_policies',
  jsonb_build_object(
    'audit_logs_days', 2555,      -- 7 years
    'medical_records_days', 3650, -- 10 years
    'user_activity_days', 365,    -- 1 year
    'system_logs_days', 90        -- 3 months
  ),
  'Data retention policies for compliance'
);
```

## Troubleshooting

### Common Issues

1. **Admin Account Locked**: Use emergency access or reset through Supabase
2. **Permission Denied**: Verify system admin role and active status
3. **Audit Log Full**: Implement log rotation and archival
4. **Performance Issues**: Monitor system metrics and optimize queries

### Support Contacts

For technical support and emergency assistance:

- **System Administrator**: admin@clinicflow.system
- **Technical Support**: support@clinicflow.com
- **Security Issues**: security@clinicflow.com
- **Emergency Hotline**: +1-555-CLINIC-1

## Best Practices

1. **Regular Security Reviews**: Monthly security audits
2. **Access Monitoring**: Daily review of admin actions
3. **Backup Verification**: Weekly backup integrity checks
4. **Performance Monitoring**: Continuous system health monitoring
5. **Documentation Updates**: Keep procedures current
6. **Staff Training**: Regular security awareness training
7. **Incident Response**: Maintain updated response procedures

This system administrator setup provides comprehensive management capabilities while maintaining the highest security standards for the ClinicFlow platform.