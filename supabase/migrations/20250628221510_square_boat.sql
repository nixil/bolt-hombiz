/*
  # Performance Optimization Indexes

  1. Primary Indexes
    - Foreign key indexes for optimal join performance
    - Tenant isolation indexes
    - Business key indexes

  2. Composite Indexes
    - Tenant + frequently queried columns
    - Multi-column indexes for complex queries

  3. Specialized Indexes
    - Text search indexes
    - Date range indexes for appointments
    - Status-based indexes
*/

-- Tenants table indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_status ON tenants(subscription_status);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON users(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(tenant_id, is_active);

-- Clinics table indexes
CREATE INDEX IF NOT EXISTS idx_clinics_tenant_id ON clinics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(tenant_id, slug);
CREATE INDEX IF NOT EXISTS idx_clinics_active ON clinics(tenant_id, is_active);

-- Clinic members table indexes
CREATE INDEX IF NOT EXISTS idx_clinic_members_tenant_id ON clinic_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinic_members_clinic_id ON clinic_members(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_members_user_id ON clinic_members(user_id);
CREATE INDEX IF NOT EXISTS idx_clinic_members_role ON clinic_members(tenant_id, role);
CREATE INDEX IF NOT EXISTS idx_clinic_members_active ON clinic_members(tenant_id, is_active);

-- Patients table indexes
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id ON patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_number ON patients(tenant_id, patient_number);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(tenant_id, name);

-- Services table indexes
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_clinic_id ON services(clinic_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(tenant_id, category);
CREATE INDEX IF NOT EXISTS idx_services_bookable ON services(tenant_id, is_bookable_online);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(tenant_id, is_active);

-- Appointments table indexes
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_number ON appointments(tenant_id, appointment_number);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(tenant_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_range ON appointments(tenant_id, scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, scheduled_at);

-- Medical records table indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_tenant_id ON medical_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_clinic_id ON medical_records(clinic_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_appointment_id ON medical_records(appointment_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_type ON medical_records(tenant_id, record_type);
CREATE INDEX IF NOT EXISTS idx_medical_records_recorded_at ON medical_records(tenant_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_date ON medical_records(patient_id, recorded_at);

-- Prescriptions table indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_tenant_id ON prescriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_clinic_id ON prescriptions(clinic_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_medical_record_id ON prescriptions(medical_record_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_number ON prescriptions(tenant_id, prescription_number);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_expires_at ON prescriptions(tenant_id, expires_at);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_clinic_id ON payments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient_id ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_number ON payments(tenant_id, payment_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(tenant_id, payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(tenant_id, payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(tenant_id, paid_at);

-- Audit logs table indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(tenant_id, created_at);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_patients_name_search ON patients USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_medical_records_search ON medical_records USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(diagnosis, '')));