import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import PatientOverview from '../components/patient/PatientOverview';
import PatientAppointments from '../components/patient/PatientAppointments';
import PatientRecords from '../components/patient/PatientRecords';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Heart
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/patient' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Appointments', path: '/patient/appointments' },
    { icon: <FileText className="w-5 h-5" />, label: 'Medical Records', path: '/patient/records' },
    { icon: <Heart className="w-5 h-5" />, label: 'Health Profile', path: '/patient/health' }
  ];

  return (
    <DashboardLayout
      title="Patient Portal"
      subtitle="Track your health and manage appointments"
      menuItems={menuItems}
      userRole="patient"
    >
      <Routes>
        <Route path="/" element={<PatientOverview />} />
        <Route path="/appointments" element={<PatientAppointments />} />
        <Route path="/records" element={<PatientRecords />} />
        <Route path="/health" element={<div className="p-6">Health Profile Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default PatientDashboard;