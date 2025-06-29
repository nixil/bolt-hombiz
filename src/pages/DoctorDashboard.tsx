import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DoctorOverview from '../components/doctor/DoctorOverview';
import DoctorPatients from '../components/doctor/DoctorPatients';
import DoctorSchedule from '../components/doctor/DoctorSchedule';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/doctor' },
    { icon: <Users className="w-5 h-5" />, label: 'My Patients', path: '/doctor/patients' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', path: '/doctor/schedule' },
    { icon: <FileText className="w-5 h-5" />, label: 'Reports', path: '/doctor/reports' }
  ];

  return (
    <DashboardLayout
      title="Doctor Portal"
      subtitle="Manage your patients and appointments"
      menuItems={menuItems}
      userRole="doctor"
    >
      <Routes>
        <Route path="/" element={<DoctorOverview />} />
        <Route path="/patients" element={<DoctorPatients />} />
        <Route path="/schedule" element={<DoctorSchedule />} />
        <Route path="/reports" element={<div className="p-6">Reports Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default DoctorDashboard;