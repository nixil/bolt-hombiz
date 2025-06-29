/*
  # Row Level Security (RLS) Policies

  1. Tenant Isolation
    - All tables enforce tenant_id matching
    - Users can only access data within their tenant

  2. Role-Based Access
    - Different access levels based on user roles
    - Hierarchical permissions (admin > doctor > staff > patient)

  3. Data Privacy
    - Patients can only see their own data
    - Medical staff can see patient data within their clinic
    - Clinic owners can see all clinic data
*/

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has role
CREATE OR REPLACE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = auth.uid() 
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is clinic member
CREATE OR REPLACE FUNCTION user_is_clinic_member(clinic_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM clinic_members 
    WHERE user_id = auth.uid() 
    AND clinic_id = clinic_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tenants policies
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (id = get_current_tenant_id());

CREATE POLICY "Tenant admins can update their tenant" ON tenants
  FOR UPDATE USING (
    id = get_current_tenant_id() 
    AND user_has_role('tenant_admin')
  );

-- Users policies
CREATE POLICY "Users can view users in their tenant" ON users
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Tenant admins can manage users" ON users
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND user_has_role('tenant_admin')
  );

-- Clinics policies
CREATE POLICY "Users can view clinics in their tenant" ON clinics
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Clinic owners can manage their clinics" ON clinics
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin') 
      OR user_has_role('clinic_owner')
      OR user_is_clinic_member(id)
    )
  );

-- Clinic members policies
CREATE POLICY "Users can view clinic members in their tenant" ON clinic_members
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Clinic owners can manage clinic members" ON clinic_members
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin') 
      OR user_has_role('clinic_owner')
      OR user_is_clinic_member(clinic_id)
    )
  );

-- Patients policies
CREATE POLICY "Medical staff can view patients in their clinics" ON patients
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
    )
  );

CREATE POLICY "Patients can view their own records" ON patients
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND user_id = auth.uid()
  );

CREATE POLICY "Medical staff can manage patients" ON patients
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
    )
  );

-- Services policies
CREATE POLICY "Users can view services in their tenant" ON services
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY "Clinic staff can manage services" ON services
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
    )
  );

-- Appointments policies
CREATE POLICY "Medical staff can view appointments in their clinics" ON appointments
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
      OR doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view their own appointments" ON appointments
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Medical staff can manage appointments" ON appointments
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
      OR doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() 
    AND patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

-- Medical records policies
CREATE POLICY "Medical staff can view medical records in their clinics" ON medical_records
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
      OR doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view their own medical records" ON medical_records
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
    AND is_confidential = false
  );

CREATE POLICY "Medical staff can manage medical records" ON medical_records
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
      OR doctor_id = auth.uid()
    )
  );

-- Prescriptions policies
CREATE POLICY "Medical staff can view prescriptions in their clinics" ON prescriptions
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
      OR doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view their own prescriptions" ON prescriptions
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage prescriptions" ON prescriptions
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR doctor_id = auth.uid()
      OR user_is_clinic_member(clinic_id)
    )
  );

-- Payments policies
CREATE POLICY "Clinic staff can view payments in their clinics" ON payments
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
    )
  );

CREATE POLICY "Patients can view their own payments" ON payments
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clinic staff can manage payments" ON payments
  FOR ALL USING (
    tenant_id = get_current_tenant_id() 
    AND (
      user_has_role('tenant_admin')
      OR user_is_clinic_member(clinic_id)
    )
  );

-- Audit logs policies
CREATE POLICY "Tenant admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    tenant_id = get_current_tenant_id() 
    AND user_has_role('tenant_admin')
  );

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());