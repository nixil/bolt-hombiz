import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ClinicDashboard from './pages/ClinicDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PublicClinicSite from './pages/PublicClinicSite';
import AppointmentBooking from './pages/AppointmentBooking';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Public Clinic Sites */}
            <Route path="/c/:clinicSlug" element={<PublicClinicSite />} />
            <Route path="/c/:clinicSlug/book" element={<AppointmentBooking />} />

            {/* Protected Routes */}
            <Route 
              path="/clinic/*" 
              element={
                <ProtectedRoute requiredRoles={['clinic_owner', 'tenant_admin', 'doctor', 'nurse', 'receptionist']}>
                  <ClinicDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/doctor/*" 
              element={
                <ProtectedRoute requiredRoles={['doctor', 'clinic_owner', 'tenant_admin']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/patient/*" 
              element={
                <ProtectedRoute requiredRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireSystemAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;