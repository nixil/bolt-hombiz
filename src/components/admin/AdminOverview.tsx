import React from 'react';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Shield,
  Globe,
  BarChart3
} from 'lucide-react';

const AdminOverview: React.FC = () => {
  const platformStats = {
    totalClinics: 1247,
    activeClinics: 1156,
    totalUsers: 12456,
    monthlyRevenue: 247580,
    growth: 18.5
  };

  const recentActivities = [
    {
      type: 'clinic_registered',
      message: 'New clinic "Downtown Medical Center" registered',
      time: '2 hours ago',
      icon: <Building2 className="w-5 h-5 text-blue-600" />
    },
    {
      type: 'payment_processed',
      message: 'Subscription payment processed for Sunshine Clinic ($299)',
      time: '4 hours ago',
      icon: <DollarSign className="w-5 h-5 text-green-600" />
    },
    {
      type: 'security_alert',
      message: 'Unusual login activity detected for user ID #12847',
      time: '6 hours ago',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />
    },
    {
      type: 'feature_usage',
      message: 'Online booking feature adoption increased by 23%',
      time: '1 day ago',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />
    }
  ];

  const topClinics = [
    {
      name: 'Sunshine Family Clinic',
      revenue: 12450,
      patients: 1247,
      satisfaction: 98.2,
      status: 'Premium'
    },
    {
      name: 'Metro Dental Care',
      revenue: 9870,
      patients: 890,
      satisfaction: 96.8,
      status: 'Premium'
    },
    {
      name: 'City Heart Institute',
      revenue: 8650,
      patients: 654,
      satisfaction: 97.5,
      status: 'Professional'
    },
    {
      name: 'Wellness Center Plus',
      revenue: 7320,
      patients: 542,
      satisfaction: 95.1,
      status: 'Basic'
    }
  ];

  const systemHealth = [
    { metric: 'API Response Time', value: '127ms', status: 'good' },
    { metric: 'Database Performance', value: '99.2%', status: 'good' },
    { metric: 'Uptime', value: '99.99%', status: 'excellent' },
    { metric: 'Error Rate', value: '0.03%', status: 'good' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Professional': return 'bg-blue-100 text-blue-800';
      case 'Basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Platform Administration</h1>
        <p className="text-purple-100 text-lg">Monitor and manage the entire ClinicFlow ecosystem</p>
        <div className="flex items-center mt-6 text-purple-100">
          <Shield className="w-5 h-5 mr-2" />
          <span>System Status: All Systems Operational</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{platformStats.totalClinics.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Clinics</p>
          <p className="text-xs text-gray-500 mt-1">{platformStats.activeClinics} active</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{platformStats.totalUsers.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Platform Users</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+{platformStats.growth}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            ${platformStats.monthlyRevenue.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Monthly Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-orange-50">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5.8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">89.2M</h3>
          <p className="text-gray-600 text-sm">API Requests</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-red-50">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">97.8%</h3>
          <p className="text-gray-600 text-sm">Satisfaction Score</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{item.metric}</span>
                <div className="text-right">
                  <span className={`font-semibold ${getHealthStatus(item.status)}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-1 bg-gray-50 rounded-full">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Clinics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Top Clinics</h2>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topClinics.map((clinic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{clinic.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(clinic.status)}`}>
                      {clinic.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${clinic.revenue.toLocaleString()}/mo</span>
                    <span>{clinic.patients} patients</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Satisfaction</span>
                    <span className="font-medium text-blue-600">{clinic.satisfaction}%</span>
                  </div>
                  {index < topClinics.length - 1 && <hr className="border-gray-200" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Platform Growth</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Clinics This Month</span>
                <span className="text-2xl font-bold text-blue-600">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Churn Rate</span>
                <span className="text-2xl font-bold text-red-600">2.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Feature Adoption</span>
                <span className="text-2xl font-bold text-green-600">89%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Breakdown</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subscription Revenue</span>
                <span className="text-lg font-bold text-green-600">$198,430</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction Fees</span>
                <span className="text-lg font-bold text-blue-600">$42,150</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Setup Fees</span>
                <span className="text-lg font-bold text-purple-600">$7,000</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Revenue</span>
                  <span className="text-xl font-bold text-gray-900">$247,580</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Action Items</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Pending Reviews</h3>
            </div>
            <p className="text-gray-700 mb-3">
              12 new clinic applications require manual review and approval.
            </p>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Review Applications →
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Security Updates</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Critical security patches are available for deployment.
            </p>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Deploy Updates →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;