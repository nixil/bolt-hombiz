# Authentication Setup Guide

## Overview

This guide provides comprehensive instructions for setting up and configuring the Supabase authentication system for the ClinicFlow application.

## Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **Database Schema**: Ensure all migrations have been applied
3. **Environment Variables**: Configure your `.env` file

## Environment Configuration

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Supabase Configuration

### 1. Authentication Settings

In your Supabase dashboard, navigate to **Authentication > Settings**:

#### Site URL Configuration
- **Site URL**: `http://localhost:5173` (for development)
- **Additional Redirect URLs**: Add your production domain

#### Email Templates
Configure custom email templates for:
- **Confirm Signup**: Welcome message with account activation
- **Reset Password**: Password reset instructions
- **Magic Link**: Alternative login method (optional)

#### Security Settings
- **Enable email confirmations**: `false` (for development, `true` for production)
- **Enable phone confirmations**: `false`
- **Minimum password length**: `8`
- **Password requirements**: Enable complexity requirements

### 2. Row Level Security (RLS)

The authentication system works with the existing RLS policies. Key policies include:

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 3. Database Functions

The system uses several helper functions:

- `get_current_tenant_id()`: Returns the current user's tenant ID
- `user_has_role(role)`: Checks if user has a specific role
- `is_system_admin()`: Checks if user is a system administrator

## Authentication Flow

### 1. User Registration

```typescript
const { user, error } = await signUp(
  'user@example.com',
  'securePassword123!',
  {
    name: 'John Doe',
    phone: '+1234567890',
    role: 'clinic_owner',
    tenantId: 'tenant-uuid'
  }
)
```

**Process**:
1. Create auth user in Supabase Auth
2. Create user profile in `users` table
3. Assign to appropriate tenant
4. Set initial role and permissions

### 2. User Login

```typescript
const { user, error } = await signIn('user@example.com', 'password')
```

**Process**:
1. Authenticate with Supabase Auth
2. Fetch user profile from database
3. Update last login timestamp
4. Establish session

### 3. Session Management

- **Auto-refresh**: Tokens automatically refresh
- **Persistence**: Sessions persist across browser restarts
- **Security**: PKCE flow for enhanced security

## Role-Based Access Control

### User Roles

1. **System Administrator** (`tenant_admin` + system tenant)
   - Full platform access
   - Tenant management
   - System configuration

2. **Clinic Owner** (`clinic_owner`)
   - Clinic management
   - Staff management
   - Financial reports

3. **Doctor** (`doctor`)
   - Patient records
   - Appointments
   - Medical records

4. **Nurse** (`nurse`)
   - Patient care
   - Appointment assistance
   - Basic records

5. **Receptionist** (`receptionist`)
   - Appointment scheduling
   - Patient check-in
   - Basic information

6. **Patient** (`patient`)
   - Personal records
   - Appointment booking
   - Medical history

### Route Protection

```typescript
// Protect routes by role
<ProtectedRoute requiredRoles={['doctor', 'clinic_owner']}>
  <DoctorDashboard />
</ProtectedRoute>

// Require system admin
<ProtectedRoute requireSystemAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

## Security Features

### 1. Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 2. Input Validation

All forms include comprehensive validation:
- Email format validation
- Password strength checking
- Phone number formatting
- Required field validation

### 3. Error Handling

Graceful error handling for:
- Network connectivity issues
- Invalid credentials
- Account lockouts
- Session expiration

### 4. Security Headers

The application implements security best practices:
- CSRF protection
- XSS prevention
- Content Security Policy
- Secure cookie settings

## Testing Authentication

### 1. Demo Accounts

The system includes demo accounts for testing:

```typescript
const demoUsers = [
  { email: 'sarah@sunshineclinic.com', role: 'Clinic Owner' },
  { email: 'emily@sunshineclinic.com', role: 'Doctor' },
  { email: 'john.smith@email.com', role: 'Patient' }
]
```

### 2. Test Scenarios

1. **Registration Flow**
   - Valid registration
   - Duplicate email handling
   - Password validation
   - Role assignment

2. **Login Flow**
   - Valid credentials
   - Invalid credentials
   - Account lockout
   - Session persistence

3. **Password Reset**
   - Email sending
   - Reset link validation
   - Password update
   - Security confirmation

## Production Deployment

### 1. Environment Variables

Update production environment:

```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

### 2. Security Configuration

- Enable email confirmations
- Configure custom SMTP
- Set up proper redirect URLs
- Enable rate limiting

### 3. Monitoring

Set up monitoring for:
- Authentication failures
- Session anomalies
- Password reset requests
- Account lockouts

## Troubleshooting

### Common Issues

1. **"Invalid JWT" Error**
   - Check environment variables
   - Verify Supabase project settings
   - Clear browser storage

2. **RLS Policy Errors**
   - Verify user profile exists
   - Check tenant assignment
   - Validate role permissions

3. **Email Not Sending**
   - Check SMTP configuration
   - Verify email templates
   - Check spam folders

### Debug Mode

Enable debug logging:

```typescript
const supabase = createClient(url, key, {
  auth: {
    debug: process.env.NODE_ENV === 'development'
  }
})
```

## Best Practices

1. **Security**
   - Always validate input on both client and server
   - Use HTTPS in production
   - Implement proper session management
   - Regular security audits

2. **User Experience**
   - Clear error messages
   - Loading states
   - Progressive enhancement
   - Accessibility compliance

3. **Performance**
   - Minimize auth checks
   - Cache user profiles
   - Optimize database queries
   - Use proper indexing

4. **Maintenance**
   - Regular dependency updates
   - Monitor authentication metrics
   - Backup authentication data
   - Document configuration changes

This authentication system provides a robust, secure foundation for the ClinicFlow application while maintaining excellent user experience and developer productivity.