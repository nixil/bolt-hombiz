import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminOverview from '../components/admin/AdminOverview';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/admin' },
    { icon: <Building2 className="w-5 h-5" />, label: 'Clinics', path: '/admin/clinics' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' }
  ];

  return (
    <DashboardLayout
      title="Platform Administration"
      subtitle="Manage the entire ClinicFlow platform"
      menuItems={menuItems}
      userRole="admin"
    >
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/clinics" element={<div className="p-6">Clinic Management Coming Soon</div>} />
        <Route path="/users" element={<div className="p-6">User Management Coming Soon</div>} />
        <Route path="/analytics" element={<div className="p-6">Platform Analytics Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;