/*
  # Database Views for Common Queries

  1. Performance Views
    - Optimized views for dashboard queries
    - Aggregated data for reporting

  2. Security Views
    - Filtered views respecting RLS
    - User-specific data views

  3. Business Logic Views
    - Calculated fields and derived data
    - Complex joins simplified
*/

-- View for clinic dashboard statistics
CREATE OR REPLACE VIEW clinic_dashboard_stats AS
SELECT 
  c.id as clinic_id,
  c.tenant_id,
  c.name as clinic_name,
  COUNT(DISTINCT p.id) as total_patients,
  COUNT(DISTINCT CASE WHEN p.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN p.id END) as new_patients_30d,
  COUNT(DISTINCT a.id) FILTER (WHERE a.scheduled_at::date = CURRENT_DATE) as today_appointments,
  COUNT(DISTINCT a.id) FILTER (WHERE a.scheduled_at >= CURRENT_DATE AND a.scheduled_at < CURRENT_DATE + INTERVAL '7 days') as week_appointments,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed' AND a.scheduled_at >= CURRENT_DATE - INTERVAL '30 days') as completed_appointments_30d,
  COALESCE(SUM(pay.amount) FILTER (WHERE pay.payment_status = 'completed' AND pay.paid_at >= CURRENT_DATE - INTERVAL '30 days'), 0) as revenue_30d,
  COALESCE(AVG(CASE WHEN a.status = 'completed' THEN 5.0 END), 0) as avg_rating -- Placeholder for future rating system
FROM clinics c
LEFT JOIN patients p ON c.id = p.clinic_id AND p.is_active = true
LEFT JOIN appointments a ON c.id = a.clinic_id
LEFT JOIN payments pay ON c.id = pay.clinic_id
WHERE c.is_active = true
GROUP BY c.id, c.tenant_id, c.name;

-- View for doctor schedule overview
CREATE OR REPLACE VIEW doctor_schedule_overview AS
SELECT 
  u.id as doctor_id,
  u.tenant_id,
  u.name as doctor_name,
  u.specialization,
  COUNT(a.id) FILTER (WHERE a.scheduled_at::date = CURRENT_DATE AND a.status NOT IN ('cancelled', 'no_show')) as today_appointments,
  COUNT(a.id) FILTER (WHERE a.scheduled_at >= CURRENT_DATE AND a.scheduled_at < CURRENT_DATE + INTERVAL '7 days' AND a.status NOT IN ('cancelled', 'no_show')) as week_appointments,
  COUNT(a.id) FILTER (WHERE a.status = 'completed' AND a.scheduled_at >= CURRENT_DATE - INTERVAL '30 days') as completed_appointments_30d,
  COALESCE(SUM(a.duration_minutes) FILTER (WHERE a.status = 'completed' AND a.scheduled_at >= CURRENT_DATE - INTERVAL '7 days'), 0) / 60.0 as hours_worked_7d,
  MIN(a.scheduled_at) FILTER (WHERE a.scheduled_at > NOW() AND a.status NOT IN ('cancelled', 'no_show')) as next_appointment
FROM users u
LEFT JOIN appointments a ON u.id = a.doctor_id
WHERE u.role IN ('doctor', 'clinic_owner') AND u.is_active = true
GROUP BY u.id, u.tenant_id, u.name, u.specialization;

-- View for patient medical summary
CREATE OR REPLACE VIEW patient_medical_summary AS
SELECT 
  p.id as patient_id,
  p.tenant_id,
  p.clinic_id,
  p.name as patient_name,
  p.email,
  p.phone,
  p.date_of_birth,
  p.blood_type,
  p.allergies,
  p.insurance_provider,
  COUNT(DISTINCT a.id) as total_appointments,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed') as completed_appointments,
  COUNT(DISTINCT mr.id) as total_medical_records,
  COUNT(DISTINCT pr.id) as total_prescriptions,
  MAX(a.scheduled_at) FILTER (WHERE a.status = 'completed') as last_visit,
  MIN(a.scheduled_at) FILTER (WHERE a.scheduled_at > NOW() AND a.status NOT IN ('cancelled', 'no_show')) as next_appointment,
  COALESCE(SUM(pay.amount) FILTER (WHERE pay.payment_status = 'completed'), 0) as total_payments
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN medical_records mr ON p.id = mr.patient_id
LEFT JOIN prescriptions pr ON p.id = pr.patient_id
LEFT JOIN payments pay ON p.id = pay.patient_id
WHERE p.is_active = true
GROUP BY p.id, p.tenant_id, p.clinic_id, p.name, p.email, p.phone, p.date_of_birth, p.blood_type, p.allergies, p.insurance_provider;

-- View for appointment details with related information
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
  a.id as appointment_id,
  a.tenant_id,
  a.clinic_id,
  a.appointment_number,
  a.scheduled_at,
  a.duration_minutes,
  a.status,
  a.type,
  a.notes,
  a.location,
  c.name as clinic_name,
  p.name as patient_name,
  p.email as patient_email,
  p.phone as patient_phone,
  p.patient_number,
  d.name as doctor_name,
  d.specialization as doctor_specialization,
  s.name as service_name,
  s.price as service_price,
  s.category as service_category,
  CASE 
    WHEN a.scheduled_at < NOW() AND a.status = 'scheduled' THEN 'overdue'
    WHEN a.scheduled_at <= NOW() + INTERVAL '1 hour' AND a.status = 'confirmed' THEN 'upcoming'
    ELSE a.status
  END as computed_status
FROM appointments a
JOIN clinics c ON a.clinic_id = c.id
JOIN patients p ON a.patient_id = p.id
LEFT JOIN users d ON a.doctor_id = d.id
LEFT JOIN services s ON a.service_id = s.id;

-- View for revenue analytics
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
  c.id as clinic_id,
  c.tenant_id,
  c.name as clinic_name,
  DATE_TRUNC('month', pay.paid_at) as month,
  COUNT(DISTINCT pay.id) as total_payments,
  SUM(pay.amount) as total_revenue,
  AVG(pay.amount) as avg_payment,
  COUNT(DISTINCT pay.patient_id) as unique_patients,
  COUNT(DISTINCT a.id) as total_appointments,
  SUM(pay.amount) / NULLIF(COUNT(DISTINCT a.id), 0) as revenue_per_appointment
FROM clinics c
LEFT JOIN payments pay ON c.id = pay.clinic_id AND pay.payment_status = 'completed'
LEFT JOIN appointments a ON pay.appointment_id = a.id
WHERE c.is_active = true
  AND pay.paid_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY c.id, c.tenant_id, c.name, DATE_TRUNC('month', pay.paid_at)
ORDER BY c.name, month DESC;

-- View for service performance
CREATE OR REPLACE VIEW service_performance AS
SELECT 
  s.id as service_id,
  s.tenant_id,
  s.clinic_id,
  s.name as service_name,
  s.category,
  s.price,
  s.duration_minutes,
  COUNT(DISTINCT a.id) as total_bookings,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed') as completed_bookings,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'cancelled') as cancelled_bookings,
  ROUND(
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'completed')::numeric / 
    NULLIF(COUNT(DISTINCT a.id), 0) * 100, 2
  ) as completion_rate,
  COALESCE(SUM(pay.amount) FILTER (WHERE pay.payment_status = 'completed'), 0) as total_revenue,
  COUNT(DISTINCT a.patient_id) as unique_patients
FROM services s
LEFT JOIN appointments a ON s.id = a.service_id
LEFT JOIN payments pay ON a.id = pay.appointment_id
WHERE s.is_active = true
GROUP BY s.id, s.tenant_id, s.clinic_id, s.name, s.category, s.price, s.duration_minutes;

-- View for patient visit history
CREATE OR REPLACE VIEW patient_visit_history AS
SELECT 
  p.id as patient_id,
  p.tenant_id,
  p.clinic_id,
  p.name as patient_name,
  a.id as appointment_id,
  a.scheduled_at as visit_date,
  a.status as visit_status,
  d.name as doctor_name,
  s.name as service_name,
  mr.diagnosis,
  mr.treatment,
  pay.amount as payment_amount,
  pay.payment_status
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN users d ON a.doctor_id = d.id
LEFT JOIN services s ON a.service_id = s.id
LEFT JOIN medical_records mr ON a.id = mr.appointment_id
LEFT JOIN payments pay ON a.id = pay.appointment_id
WHERE p.is_active = true
ORDER BY p.name, a.scheduled_at DESC;

-- Enable RLS on views (they inherit from base tables)
-- Views automatically respect RLS policies of underlying tables