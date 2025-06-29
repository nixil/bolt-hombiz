import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ClinicOverview from '../components/clinic/ClinicOverview';
import PatientList from '../components/clinic/PatientList';
import AppointmentCalendar from '../components/clinic/AppointmentCalendar';
import TeamManagement from '../components/clinic/TeamManagement';
import ClinicSettings from '../components/clinic/ClinicSettings';
import RevenueAnalytics from '../components/clinic/RevenueAnalytics';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCheck, 
  Settings, 
  BarChart3,
  Globe
} from 'lucide-react';

const ClinicDashboard: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/clinic' },
    { icon: <Users className="w-5 h-5" />, label: 'Patients', path: '/clinic/patients' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Calendar', path: '/clinic/calendar' },
    { icon: <UserCheck className="w-5 h-5" />, label: 'Team', path: '/clinic/team' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/clinic/analytics' },
    { icon: <Globe className="w-5 h-5" />, label: 'Website', path: '/clinic/website' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/clinic/settings' }
  ];

  return (
    <DashboardLayout
      title="Clinic Management"
      subtitle="Manage your clinic operations and patient care"
      menuItems={menuItems}
      userRole="clinic_owner"
    >
      <Routes>
        <Route path="/" element={<ClinicOverview />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/calendar" element={<AppointmentCalendar />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/analytics" element={<RevenueAnalytics />} />
        <Route path="/website" element={<ClinicSettings />} />
        <Route path="/settings" element={<ClinicSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClinicDashboard;