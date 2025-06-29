import React from 'react';
import {
  Calendar,
  Clock,
  Heart,
  FileText,
  Bell,
  User,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PatientOverview: React.FC = () => {
  const patientData = {
    name: 'John Smith',
    nextAppointment: {
      date: '2024-01-25',
      time: '10:30 AM',
      doctor: 'Dr. Sarah Johnson',
      type: 'Follow-up Consultation',
      location: 'Sunshine Family Clinic, Room 101'
    },
    recentVisits: [
      {
        date: '2024-01-15',
        doctor: 'Dr. Sarah Johnson',
        type: 'General Consultation',
        diagnosis: 'Hypertension Management',
        status: 'completed'
      },
      {
        date: '2023-12-20',
        doctor: 'Dr. Emily Davis',
        type: 'Physical Therapy',
        diagnosis: 'Back Pain Treatment',
        status: 'completed'
      }
    ],
    healthMetrics: {
      bloodPressure: '128/82',
      heartRate: 72,
      weight: 75,
      lastUpdated: '2024-01-15'
    },
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        remaining: 28,
        refillDate: '2024-02-15'
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        remaining: 15,
        refillDate: '2024-02-01'
      }
    ],
    upcomingReminders: [
      {
        type: 'appointment',
        message: 'Follow-up appointment in 3 days',
        date: '2024-01-25',
        priority: 'high'
      },
      {
        type: 'medication',
        message: 'Metformin refill needed soon',
        date: '2024-02-01',
        priority: 'medium'
      },
      {
        type: 'test',
        message: 'Annual blood work due',
        date: '2024-02-15',
        priority: 'low'
      }
    ]
  };

  const healthScore = 85; // Example health score

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'medication': return <Heart className="w-4 h-4" />;
      case 'test': return <Activity className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {patientData.name}!</h1>
        <p className="text-purple-100 text-lg">Track your health journey and manage your care</p>
        <div className="flex items-center mt-6 text-purple-100">
          <Heart className="w-5 h-5 mr-2" />
          <span>Your health score: {healthScore}/100 - Keep up the great work!</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Next</span>
          </div>
          <h3  className="text-lg font-bold text-gray-900 mb-1">Jan 25</h3>
          <p className="text-gray-600 text-sm">Next Appointment</p>
          <p className="text-xs text-gray-500 mt-1">{patientData.nextAppointment.time}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-red-50">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">Latest</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{patientData.healthMetrics.bloodPressure}</h3>
          <p className="text-gray-600 text-sm">Blood Pressure</p>
          <p className="text-xs text-gray-500 mt-1">mmHg</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Current</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{patientData.healthMetrics.heartRate}</h3>
          <p className="text-gray-600 text-sm">Heart Rate</p>
          <p className="text-xs text-gray-500 mt-1">bpm</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">Score</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{healthScore}</h3>
          <p className="text-gray-600 text-sm">Health Score</p>
          <p className="text-xs text-green-500 mt-1">+5 this month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Next Appointment */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Next Appointment</h2>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {patientData.nextAppointment.type}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(patientData.nextAppointment.date).toLocaleDateString('en', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{patientData.nextAppointment.time}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{patientData.nextAppointment.doctor}</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      <span>{patientData.nextAppointment.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mb-2">
                    In 3 days
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Preparation Checklist</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">Bring insurance card</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">List current medications</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-700">Prepare questions for doctor</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Reminders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Reminders</h2>
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {patientData.upcomingReminders.map((reminder, index) => (
                <div key={index} className={`p-3 rounded-lg ${getPriorityColor(reminder.priority)}`}>
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {getReminderIcon(reminder.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reminder.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(reminder.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
              View All Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity & Medications */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Visits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Visits</h2>
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {patientData.recentVisits.map((visit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{visit.type}</h3>
                    <span className="text-sm text-gray-500">{visit.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{visit.doctor}</p>
                  <p className="text-sm text-blue-600 font-medium">{visit.diagnosis}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              View Medical History
            </button>
          </div>
        </div>

        {/* Current Medications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Current Medications</h2>
              <Heart className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {patientData.medications.map((medication, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{medication.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      medication.remaining < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {medication.remaining} pills left
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Dosage:</strong> {medication.dosage}</p>
                    <p><strong>Frequency:</strong> {medication.frequency}</p>
                    <p><strong>Refill by:</strong> {medication.refillDate}</p>
                  </div>
                  {medication.remaining < 10 && (
                    <div className="mt-2 flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Refill needed soon</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Request Prescription Refill
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Book Appointment</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Records</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Update Health Data</span>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Contact Doctor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;