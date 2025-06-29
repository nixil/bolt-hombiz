/*
  # Link User to System Tenant

  1. Purpose
    - Create a secure link between the registered user (alexleebiti@gmail.com) and the system tenant
    - Ensure proper foreign key constraints and unique indexes are in place
    - Assign appropriate system administrator role

  2. Operations
    - Retrieve user from auth.users table
    - Locate system tenant record
    - Update user record with system tenant mapping
    - Set appropriate role and permissions

  3. Security
    - Validate system tenant exists
    - Ensure user exists in auth system
    - Apply proper role-based access controls
*/

-- First, let's ensure we have the proper constraints and indexes
-- (These should already exist from previous migrations, but we'll check)

-- Verify foreign key constraints exist
DO $$
BEGIN
    -- Check if the foreign key constraint exists for users.tenant_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_tenant_id_fkey' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE users 
        ADD CONSTRAINT users_tenant_id_fkey 
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Ensure unique index on users.id (should already exist as primary key)
-- This is automatically created with the primary key constraint

-- Now, let's create the mapping between the user and system tenant
DO $$
DECLARE
    user_auth_id UUID;
    system_tenant_id UUID;
    user_exists BOOLEAN := FALSE;
    tenant_exists BOOLEAN := FALSE;
BEGIN
    -- Get the system tenant ID
    SELECT id INTO system_tenant_id 
    FROM tenants 
    WHERE is_system_tenant = true 
    AND slug = 'system_admin';
    
    IF system_tenant_id IS NULL THEN
        RAISE EXCEPTION 'System tenant not found. Please ensure the system tenant migration has been applied.';
    END IF;
    
    tenant_exists := TRUE;
    RAISE NOTICE 'System tenant found: %', system_tenant_id;
    
    -- Get the user ID from auth.users table
    SELECT id INTO user_auth_id 
    FROM auth.users 
    WHERE email = 'alexleebiti@gmail.com';
    
    IF user_auth_id IS NULL THEN
        RAISE EXCEPTION 'User with email alexleebiti@gmail.com not found in auth.users table. Please ensure the user has been registered through Supabase Auth.';
    END IF;
    
    user_exists := TRUE;
    RAISE NOTICE 'Auth user found: %', user_auth_id;
    
    -- Check if user already exists in users table
    IF EXISTS (SELECT 1 FROM users WHERE id = user_auth_id) THEN
        -- Update existing user record
        UPDATE users 
        SET 
            tenant_id = system_tenant_id,
            role = 'tenant_admin',
            is_active = true,
            updated_at = NOW()
        WHERE id = user_auth_id;
        
        RAISE NOTICE 'Updated existing user record for: %', user_auth_id;
    ELSE
        -- Create new user record in users table
        INSERT INTO users (
            id,
            tenant_id,
            email,
            name,
            role,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            user_auth_id,
            system_tenant_id,
            'alexleebiti@gmail.com',
            'Alex Lee Biti', -- Default name, can be updated by user
            'tenant_admin',
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user record for: %', user_auth_id;
    END IF;
    
    -- Verify the mapping was created successfully
    IF EXISTS (
        SELECT 1 
        FROM users u 
        JOIN tenants t ON u.tenant_id = t.id 
        WHERE u.id = user_auth_id 
        AND t.is_system_tenant = true 
        AND u.role = 'tenant_admin'
    ) THEN
        RAISE NOTICE 'SUCCESS: User alexleebiti@gmail.com has been successfully linked to the system tenant with tenant_admin role';
    ELSE
        RAISE EXCEPTION 'FAILED: User mapping verification failed';
    END IF;
    
END $$;

-- Create an audit log entry for this administrative action
INSERT INTO audit_logs (
    tenant_id,
    user_id,
    table_name,
    record_id,
    action,
    new_values,
    ip_address,
    user_agent,
    created_at
) 
SELECT 
    t.id as tenant_id,
    u.id as user_id,
    'users' as table_name,
    u.id as record_id,
    'UPDATE' as action,
    jsonb_build_object(
        'action_type', 'system_admin_assignment',
        'email', 'alexleebiti@gmail.com',
        'role', 'tenant_admin',
        'tenant_type', 'system_admin',
        'assigned_by', 'database_migration',
        'reason', 'Initial system administrator setup'
    ) as new_values,
    '127.0.0.1'::inet as ip_address,
    'Database Migration Script' as user_agent,
    NOW() as created_at
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.email = 'alexleebiti@gmail.com'
AND t.is_system_tenant = true;

-- Add a comment to document this operation
COMMENT ON TABLE users IS 'User profiles linked to tenants. System administrators are linked to the system tenant (is_system_tenant = true) with role = tenant_admin.';

-- Verify the final state
DO $$
DECLARE
    verification_result RECORD;
BEGIN
    SELECT 
        u.id as user_id,
        u.email,
        u.name,
        u.role,
        u.is_active,
        t.id as tenant_id,
        t.name as tenant_name,
        t.is_system_tenant,
        t.slug as tenant_slug
    INTO verification_result
    FROM users u
    JOIN tenants t ON u.tenant_id = t.id
    WHERE u.email = 'alexleebiti@gmail.com';
    
    IF verification_result IS NOT NULL THEN
        RAISE NOTICE '=== VERIFICATION SUCCESSFUL ===';
        RAISE NOTICE 'User ID: %', verification_result.user_id;
        RAISE NOTICE 'Email: %', verification_result.email;
        RAISE NOTICE 'Name: %', verification_result.name;
        RAISE NOTICE 'Role: %', verification_result.role;
        RAISE NOTICE 'Active: %', verification_result.is_active;
        RAISE NOTICE 'Tenant ID: %', verification_result.tenant_id;
        RAISE NOTICE 'Tenant Name: %', verification_result.tenant_name;
        RAISE NOTICE 'Is System Tenant: %', verification_result.is_system_tenant;
        RAISE NOTICE 'Tenant Slug: %', verification_result.tenant_slug;
        RAISE NOTICE '================================';
    ELSE
        RAISE EXCEPTION 'VERIFICATION FAILED: User mapping not found';
    END IF;
END $$;