# User-System Tenant Mapping Documentation

## Overview

This document describes the process of linking a registered user to the system tenant, providing them with system administrator privileges.

## Migration: Link User to System Tenant

### Purpose

The migration `20250628225000_link_user_to_system_tenant.sql` creates a secure link between:
- **User**: alexleebiti@gmail.com (from auth.users table)
- **System Tenant**: The designated system administrator tenant
- **Role**: tenant_admin (system administrator role)

### Prerequisites

1. **User Registration**: The user must be registered through Supabase Auth
2. **System Tenant**: The system tenant must exist (created by previous migration)
3. **Database Schema**: All core tables and constraints must be in place

### Process Flow

#### 1. Validation Phase
```sql
-- Verify system tenant exists
SELECT id FROM tenants WHERE is_system_tenant = true AND slug = 'system_admin';

-- Verify user exists in auth.users
SELECT id FROM auth.users WHERE email = 'alexleebiti@gmail.com';
```

#### 2. Mapping Creation
```sql
-- Create or update user profile
INSERT INTO users (id, tenant_id, email, name, role, is_active)
VALUES (user_auth_id, system_tenant_id, 'alexleebiti@gmail.com', 'Alex Lee Biti', 'tenant_admin', true)
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;
```

#### 3. Verification
```sql
-- Confirm mapping was successful
SELECT u.*, t.name as tenant_name, t.is_system_tenant
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.email = 'alexleebiti@gmail.com';
```

### Security Considerations

#### Foreign Key Constraints
- **users.tenant_id** → **tenants.id**: Ensures referential integrity
- **users.id** → **auth.users.id**: Links to Supabase Auth system

#### Unique Constraints
- **users.id**: Primary key (one profile per auth user)
- **tenants.is_system_tenant**: Only one system tenant allowed

#### Row Level Security (RLS)
The mapping respects existing RLS policies:
- System admin can access all tenant data
- Regular users can only access their own tenant data

### Audit Trail

The migration creates an audit log entry:
```sql
INSERT INTO audit_logs (
    tenant_id,
    user_id,
    table_name,
    record_id,
    action,
    new_values
) VALUES (
    system_tenant_id,
    user_auth_id,
    'users',
    user_auth_id,
    'UPDATE',
    jsonb_build_object(
        'action_type', 'system_admin_assignment',
        'email', 'alexleebiti@gmail.com',
        'role', 'tenant_admin',
        'assigned_by', 'database_migration'
    )
);
```

### Expected Results

After successful execution:

1. **User Profile Created/Updated**
   - ID: [auth user UUID]
   - Email: alexleebiti@gmail.com
   - Role: tenant_admin
   - Tenant: System Administrator tenant
   - Status: Active

2. **System Access Granted**
   - Full platform administration
   - Tenant management capabilities
   - System configuration access
   - Comprehensive audit trail access

3. **Authentication Flow**
   - User can log in with existing credentials
   - Redirected to admin dashboard
   - System admin functions available

### Verification Queries

#### Check User Mapping
```sql
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    t.name as tenant_name,
    t.is_system_tenant
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.email = 'alexleebiti@gmail.com';
```

#### Verify System Admin Function
```sql
-- This should return true when called by the mapped user
SELECT is_system_admin();
```

#### Check Audit Log
```sql
SELECT *
FROM audit_logs
WHERE new_values->>'email' = 'alexleebiti@gmail.com'
AND new_values->>'action_type' = 'system_admin_assignment';
```

### Troubleshooting

#### Common Issues

1. **User Not Found in auth.users**
   - Ensure user has completed Supabase Auth registration
   - Check email spelling and case sensitivity

2. **System Tenant Not Found**
   - Verify system tenant migration was applied
   - Check tenants table for is_system_tenant = true

3. **Foreign Key Constraint Violation**
   - Ensure all required tables exist
   - Verify foreign key constraints are properly defined

#### Error Messages

- `User with email alexleebiti@gmail.com not found`: User needs to register through Supabase Auth first
- `System tenant not found`: Run system tenant creation migration
- `VERIFICATION FAILED`: Check database constraints and data integrity

### Post-Migration Steps

1. **Test Authentication**
   - User should be able to log in with existing credentials
   - Verify redirect to admin dashboard

2. **Verify Permissions**
   - Test system admin functions
   - Confirm access to tenant management
   - Check audit log visibility

3. **Security Review**
   - Verify RLS policies are working
   - Test cross-tenant data isolation
   - Confirm audit logging is active

### Rollback Procedure

If needed, the mapping can be removed:

```sql
-- Remove user from system tenant (but keep auth user)
DELETE FROM users WHERE email = 'alexleebiti@gmail.com';

-- Or reassign to different tenant
UPDATE users 
SET tenant_id = 'other-tenant-id', role = 'clinic_owner'
WHERE email = 'alexleebiti@gmail.com';
```

**Note**: This will remove system admin access but preserve the auth user account.

## Integration with Authentication System

### Login Flow
1. User authenticates with Supabase Auth
2. System fetches user profile from users table
3. Checks tenant relationship and role
4. Grants appropriate permissions based on system admin status

### Permission Checking
```typescript
// Frontend permission check
const isSystemAdmin = useAuthContext().isSystemAdmin()

// Backend permission check (in RLS policies)
SELECT is_system_admin()
```

This mapping provides secure, auditable system administrator access while maintaining the integrity of the multi-tenant architecture.