import React from 'react';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const DoctorOverview: React.FC = () => {
  const doctorStats = {
    todayAppointments: 8,
    weeklyAppointments: 32,
    totalPatients: 145,
    averageRating: 4.9,
    completedTreatments: 287
  };

  const todaySchedule = [
    {
      time: '09:00 AM',
      patient: 'Sarah Johnson',
      type: 'Follow-up',
      status: 'confirmed',
      notes: 'Hypertension check'
    },
    {
      time: '10:30 AM',
      patient: 'Michael Brown',
      type: 'New Patient',
      status: 'confirmed',
      notes: 'General consultation'
    },
    {
      time: '11:00 AM',
      patient: 'Emily Davis',
      type: 'Treatment',
      status: 'in-progress',
      notes: 'Physical therapy session'
    },
    {
      time: '02:00 PM',
      patient: 'John Wilson',
      type: 'Consultation',
      status: 'pending',
      notes: 'Chest pain evaluation'
    }
  ];

  const recentPatients = [
    {
      name: 'Alice Cooper',
      lastVisit: '2024-01-18',
      condition: 'Diabetes Management',
      status: 'stable',
      nextAppointment: '2024-02-15'
    },
    {
      name: 'Robert Taylor',
      lastVisit: '2024-01-17',
      condition: 'Post-surgery Recovery',
      status: 'improving',
      nextAppointment: '2024-01-25'
    },
    {
      name: 'Maria Garcia',
      lastVisit: '2024-01-16',
      condition: 'Routine Checkup',
      status: 'healthy',
      nextAppointment: '2024-07-16'
    }
  ];

  const pendingTasks = [
    {
      type: 'prescription',
      description: 'Review and approve prescription for John Smith',
      priority: 'high',
      dueDate: 'Today'
    },
    {
      type: 'report',
      description: 'Complete treatment summary for Emily Johnson',
      priority: 'medium',
      dueDate: 'Tomorrow'
    },
    {
      type: 'referral',
      description: 'Process specialist referral for Michael Brown',
      priority: 'low',
      dueDate: 'This week'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'improving': return 'bg-green-100 text-green-800';
      case 'healthy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Davis!</h1>
        <p className="text-green-100 text-lg">You have {doctorStats.todayAppointments} appointments scheduled for today.</p>
        <div className="flex items-center mt-6 text-green-100">
          <Clock className="w-5 h-5 mr-2" />
          <span>Next appointment in 45 minutes</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Today</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctorStats.todayAppointments}</h3>
          <p className="text-gray-600 text-sm">Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctorStats.totalPatients}</h3>
          <p className="text-gray-600 text-sm">Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">Completed</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctorStats.completedTreatments}</h3>
          <p className="text-gray-600 text-sm">Treatments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-orange-50">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-600">Rating</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctorStats.averageRating}</h3>
          <p className="text-gray-600 text-sm">Average Rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-red-50">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">This week</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctorStats.weeklyAppointments}</h3>
          <p className="text-gray-600 text-sm">Appointments</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Calendar
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todaySchedule.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <p className="text-xs text-gray-500">{appointment.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Next: Michael Brown at 10:30 AM</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                New patient consultation - please review patient intake form
              </p>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pending Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{task.description}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="text-xs text-gray-500 ml-2">Due: {task.dueDate}</span>
                      </div>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                  {index < pendingTasks.length - 1 && <hr className="border-gray-200" />}
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              View All Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Patients
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {recentPatients.map((patient, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="text-gray-900">{patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="text-gray-900">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next:</span>
                    <span className="text-gray-900">{patient.nextAppointment}</span>
                  </div>
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  View Records
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">New Prescription</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Patient Lookup</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Schedule Time Off</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Emergency Protocol</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;