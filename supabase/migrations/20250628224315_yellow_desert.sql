/*
  # Add is_system_tenant column to tenants table

  1. Column Addition
    - Add `is_system_tenant` boolean column with NOT NULL constraint and default false
    - Update existing records to ensure they are not system tenants

  2. Constraint Updates
    - Update subscription_plan_check constraint to include 'enterprise' plan
    - Add unique constraint to ensure only one system tenant exists
    - Add check constraint for system tenant properties

  3. System Tenant Creation
    - Create the system administrator tenant with enterprise plan
    - Set unlimited resources and special system settings

  4. Security and Validation
    - Create trigger function to protect system tenant operations
    - Add RLS policies for system tenant access
    - Create helper function for system admin checks

  5. Documentation
    - Add comments for new column and constraints
*/

-- First, update the subscription_plan_check constraint to include 'enterprise'
ALTER TABLE tenants 
DROP CONSTRAINT IF EXISTS tenants_subscription_plan_check;

ALTER TABLE tenants 
ADD CONSTRAINT tenants_subscription_plan_check 
CHECK (subscription_plan = ANY (ARRAY['basic'::text, 'professional'::text, 'premium'::text, 'enterprise'::text]));

-- Add the is_system_tenant column
ALTER TABLE tenants 
ADD COLUMN is_system_tenant BOOLEAN NOT NULL DEFAULT false;

-- Update all existing tenant records to ensure they are not system tenants
UPDATE tenants 
SET is_system_tenant = false 
WHERE is_system_tenant IS NULL OR is_system_tenant = true;

-- Create a unique partial index to ensure only one system tenant can exist
CREATE UNIQUE INDEX idx_tenants_unique_system_tenant 
ON tenants (is_system_tenant) 
WHERE is_system_tenant = true;

-- Insert the system administrator tenant
INSERT INTO tenants (
    id,
    name,
    slug,
    subscription_plan,
    subscription_status,
    max_clinics,
    max_users,
    settings,
    is_system_tenant,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'System Administrator',
    'system_admin',
    'enterprise',
    'active',
    999999,  -- Unlimited clinics
    999999,  -- Unlimited users
    jsonb_build_object(
        'system_tenant', true,
        'deletion_protected', true,
        'admin_privileges', true,
        'resource_limits_exempt', true,
        'audit_level', 'comprehensive',
        'security_level', 'maximum'
    ),
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    is_system_tenant = true,
    name = 'System Administrator',
    slug = 'system_admin',
    subscription_plan = 'enterprise',
    max_clinics = 999999,
    max_users = 999999,
    settings = jsonb_build_object(
        'system_tenant', true,
        'deletion_protected', true,
        'admin_privileges', true,
        'resource_limits_exempt', true,
        'audit_level', 'comprehensive',
        'security_level', 'maximum'
    ),
    updated_at = NOW();

-- Add a check constraint to ensure data integrity for system tenant
ALTER TABLE tenants 
ADD CONSTRAINT check_system_tenant_properties 
CHECK (
    (is_system_tenant = false) OR 
    (is_system_tenant = true AND slug = 'system_admin' AND subscription_plan = 'enterprise')
);

-- Create a function to validate system tenant operations
CREATE OR REPLACE FUNCTION validate_system_tenant_operations()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent deletion of system tenant
    IF TG_OP = 'DELETE' AND OLD.is_system_tenant = true THEN
        RAISE EXCEPTION 'System tenant cannot be deleted';
    END IF;
    
    -- Prevent changing system tenant flag to false
    IF TG_OP = 'UPDATE' AND OLD.is_system_tenant = true AND NEW.is_system_tenant = false THEN
        RAISE EXCEPTION 'System tenant flag cannot be changed to false';
    END IF;
    
    -- Prevent creating multiple system tenants
    IF TG_OP = 'INSERT' AND NEW.is_system_tenant = true THEN
        IF EXISTS (SELECT 1 FROM tenants WHERE is_system_tenant = true AND id != NEW.id) THEN
            RAISE EXCEPTION 'Only one system tenant is allowed';
        END IF;
    END IF;
    
    -- Prevent updating non-system tenant to system tenant
    IF TG_OP = 'UPDATE' AND OLD.is_system_tenant = false AND NEW.is_system_tenant = true THEN
        IF NEW.id != '00000000-0000-0000-0000-000000000001'::uuid THEN
            RAISE EXCEPTION 'Only the designated system tenant can have is_system_tenant = true';
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce system tenant validation
CREATE TRIGGER trigger_validate_system_tenant_operations
    BEFORE INSERT OR UPDATE OR DELETE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION validate_system_tenant_operations();

-- Create helper function to check if current user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users u
        JOIN tenants t ON u.tenant_id = t.id
        WHERE u.id = auth.uid() 
        AND t.is_system_tenant = true
        AND u.role = 'tenant_admin'
        AND u.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policy for system tenant access (only if it doesn't already exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tenants' 
        AND policyname = 'System tenant has full access'
    ) THEN
        CREATE POLICY "System tenant has full access" ON tenants
            FOR ALL USING (
                is_system_tenant = true AND 
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() 
                    AND tenant_id = tenants.id 
                    AND role = 'tenant_admin'
                )
            );
    END IF;
END $$;

-- Add comments to document the new features
COMMENT ON COLUMN tenants.is_system_tenant IS 'Identifies the system administrator tenant. Only one tenant can have this set to true.';
COMMENT ON INDEX idx_tenants_unique_system_tenant IS 'Ensures only one system tenant can exist in the database.';
COMMENT ON CONSTRAINT check_system_tenant_properties ON tenants IS 'Ensures system tenant has proper slug and subscription plan.';
COMMENT ON FUNCTION validate_system_tenant_operations() IS 'Trigger function to protect system tenant from unauthorized operations.';
COMMENT ON FUNCTION is_system_admin() IS 'Helper function to check if current user is a system administrator.';