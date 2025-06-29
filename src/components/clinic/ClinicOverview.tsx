import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  UserCheck,
  AlertCircle,
  Activity
} from 'lucide-react';

const ClinicOverview: React.FC = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Today\'s Appointments',
      value: '24',
      change: '+3 from yesterday',
      trend: 'up',
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$47,580',
      change: '+23.1%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-purple-600'
    },
    {
      title: 'Patient Satisfaction',
      value: '98.2%',
      change: '+0.8%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600'
    }
  ];

  const recentAppointments = [
    {
      id: '1',
      patient: 'John Smith',
      time: '10:00 AM',
      service: 'General Consultation',
      status: 'confirmed',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: '2',
      patient: 'Mary Johnson',
      time: '11:30 AM',
      service: 'Dental Checkup',
      status: 'in-progress',
      doctor: 'Dr. Michael Chen'
    },
    {
      id: '3',
      patient: 'Robert Brown',
      time: '2:00 PM',
      service: 'Physical Therapy',
      status: 'pending',
      doctor: 'Dr. Emily Davis'
    }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'Dr. Smith has 3 consecutive appointments without breaks',
      time: '2 hours ago'
    },
    {
      type: 'info',
      message: 'Monthly report for December is ready for review',
      time: '4 hours ago'
    },
    {
      type: 'error',
      message: 'Payment failed for appointment #12847',
      time: '6 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Johnson!</h1>
        <p className="text-blue-100 text-lg">Here's what's happening at your clinic today.</p>
        <div className="flex items-center mt-6 text-blue-100">
          <Clock className="w-5 h-5 mr-2" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-xs text-gray-500">with {appointment.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.time}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Add New Patient
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Schedule Appointment
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Generate Report
              </button>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">92%</h3>
              <p className="text-gray-600">Appointment Attendance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">15min</h3>
              <p className="text-gray-600">Average Wait Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">89%</h3>
              <p className="text-gray-600">Patient Retention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicOverview;