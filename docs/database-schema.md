# ClinicFlow Database Schema Documentation

## Overview

This document describes the comprehensive database schema for the ClinicFlow SaaS platform, designed with multi-tenant architecture, security, and performance in mind.

## Architecture Principles

### Multi-Tenancy
- **Tenant Isolation**: Every table includes a `tenant_id` column for data isolation
- **Row Level Security (RLS)**: Enforced at the database level to prevent cross-tenant data access
- **Scalable Design**: Supports multiple clinics per tenant with flexible subscription plans

### Security
- **HIPAA Compliance**: Designed with healthcare data privacy requirements
- **Role-Based Access Control**: Granular permissions based on user roles
- **Audit Logging**: Comprehensive change tracking for compliance

### Performance
- **Optimized Indexes**: Strategic indexing for common query patterns
- **Efficient Queries**: Views and functions for complex operations
- **Scalable Structure**: Designed to handle growth in data volume

## Core Tables

### 1. Tenants
**Purpose**: Root level organization management for multi-tenancy

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subscription_plan TEXT NOT NULL DEFAULT 'basic',
    subscription_status TEXT NOT NULL DEFAULT 'active',
    max_clinics INTEGER NOT NULL DEFAULT 1,
    max_users INTEGER NOT NULL DEFAULT 10,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Features**:
- Unique slug for tenant identification
- Subscription management with limits
- Flexible settings storage via JSONB

### 2. Users
**Purpose**: User authentication and profile management (extends Supabase auth.users)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('tenant_admin', 'clinic_owner', 'doctor', 'nurse', 'receptionist', 'patient')),
    specialization TEXT,
    license_number TEXT,
    is_active BOOLEAN DEFAULT true,
    -- ... additional fields
);
```

**Key Features**:
- Extends Supabase authentication
- Role-based access control
- Professional credentials tracking

### 3. Clinics
**Purpose**: Clinic information and configuration

```sql
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    working_hours JSONB DEFAULT '{}',
    theme_settings JSONB DEFAULT '{}',
    -- ... additional fields
    UNIQUE(tenant_id, slug)
);
```

**Key Features**:
- Unique slug per tenant for public URLs
- Flexible working hours configuration
- Customizable theme settings

### 4. Patients
**Purpose**: Patient records and medical information

```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    patient_number TEXT NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE,
    blood_type TEXT,
    allergies TEXT[],
    medical_conditions TEXT[],
    -- ... additional fields
    UNIQUE(tenant_id, clinic_id, patient_number)
);
```

**Key Features**:
- Auto-generated patient numbers
- Medical information storage
- Optional user account linking

### 5. Appointments
**Purpose**: Appointment scheduling and management

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    appointment_number TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    type TEXT NOT NULL DEFAULT 'in_person',
    -- ... additional fields
);
```

**Key Features**:
- Conflict detection functions
- Multiple appointment types
- Comprehensive status tracking

## Security Implementation

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:

1. **Tenant Isolation**: Users can only access data within their tenant
2. **Role-Based Access**: Different permissions based on user roles
3. **Data Privacy**: Patients can only see their own data

Example policy:
```sql
CREATE POLICY "Medical staff can view patients in their clinics" ON patients
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
    )
  );
```

### Helper Functions

- `get_current_tenant_id()`: Returns current user's tenant ID
- `user_has_role(role)`: Checks if user has specific role
- `user_is_clinic_member(clinic_id)`: Verifies clinic membership

## Performance Optimization

### Indexing Strategy

1. **Foreign Key Indexes**: All foreign key columns are indexed
2. **Tenant Isolation Indexes**: Composite indexes on `tenant_id + frequently_queried_columns`
3. **Business Logic Indexes**: Indexes supporting common query patterns
4. **Full-Text Search**: GIN indexes for text search capabilities

Example indexes:
```sql
-- Composite index for tenant + date range queries
CREATE INDEX idx_appointments_date_range ON appointments(tenant_id, scheduled_at, status);

-- Full-text search on patient names
CREATE INDEX idx_patients_name_search ON patients USING gin(to_tsvector('english', name));
```

### Database Functions

1. **Auto-Generation Functions**: Unique number generation for business entities
2. **Conflict Detection**: Appointment scheduling conflict prevention
3. **Search Functions**: Optimized patient and record search
4. **Audit Functions**: Automatic change tracking

## Business Logic

### Auto-Generated Numbers

The system automatically generates unique numbers for:
- Patient numbers: `CLI-P-00001`
- Appointment numbers: `CLI-20240122-001`
- Prescription numbers: `CLI-RX-20240122-001`
- Payment numbers: `CLI-PAY-20240122-001`

### Appointment Management

- **Conflict Detection**: Prevents double-booking of doctors
- **Availability Calculation**: Functions to find available time slots
- **Status Workflow**: Comprehensive appointment lifecycle management

### Audit Logging

All critical operations are logged in the `audit_logs` table:
- User identification
- Table and record affected
- Before/after values
- Timestamp and IP tracking

## Views and Reporting

### Dashboard Views

1. **clinic_dashboard_stats**: Aggregated clinic performance metrics
2. **doctor_schedule_overview**: Doctor workload and schedule summary
3. **patient_medical_summary**: Comprehensive patient information
4. **revenue_analytics**: Financial performance tracking

### Performance Views

1. **service_performance**: Service booking and completion rates
2. **appointment_details**: Enriched appointment information
3. **patient_visit_history**: Complete patient interaction timeline

## Migration Strategy

### Migration Files

1. **001_create_core_schema.sql**: Core table structure
2. **002_create_indexes.sql**: Performance optimization indexes
3. **003_create_rls_policies.sql**: Security policies
4. **004_create_functions.sql**: Business logic functions
5. **005_seed_data.sql**: Sample data migration
6. **006_create_views.sql**: Reporting and dashboard views

### Data Migration

The seed data migration includes:
- Demo tenant and users
- Sample clinics with services
- Patient records and appointments
- Medical records and prescriptions
- Payment history

## Maintenance and Monitoring

### Regular Tasks

1. **Index Maintenance**: Monitor and rebuild indexes as needed
2. **Audit Log Cleanup**: Archive old audit logs
3. **Performance Monitoring**: Track query performance
4. **Security Reviews**: Regular RLS policy audits

### Backup Strategy

1. **Daily Backups**: Automated daily database backups
2. **Point-in-Time Recovery**: Continuous WAL archiving
3. **Cross-Region Replication**: For disaster recovery
4. **Compliance Backups**: Long-term retention for regulatory requirements

## Compliance Considerations

### HIPAA Compliance

1. **Data Encryption**: All data encrypted at rest and in transit
2. **Access Logging**: Comprehensive audit trails
3. **Data Minimization**: Only necessary data collected
4. **User Authentication**: Strong authentication requirements

### Data Retention

1. **Medical Records**: Long-term retention as required by law
2. **Audit Logs**: Minimum 7-year retention
3. **User Data**: Configurable retention policies
4. **Backup Data**: Secure long-term storage

This schema provides a robust foundation for the ClinicFlow SaaS platform, ensuring security, performance, and compliance while maintaining flexibility for future enhancements.