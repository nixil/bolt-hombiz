import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Plus,
  Filter,
  Bell
} from 'lucide-react';

const DoctorSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Sample appointments for the doctor
  const appointments = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      time: '09:00',
      duration: 30,
      type: 'Follow-up',
      status: 'confirmed',
      location: 'Room 101',
      notes: 'Hypertension check',
      patientPhone: '(555) 123-4567',
      date: '2024-01-22'
    },
    {
      id: '2',
      patientName: 'Michael Brown',
      time: '10:30',
      duration: 45,
      type: 'New Patient',
      status: 'confirmed',
      location: 'Room 102',
      notes: 'General consultation',
      patientPhone: '(555) 234-5678',
      date: '2024-01-22'
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      time: '14:00',
      duration: 60,
      type: 'Treatment',
      status: 'in-progress',
      location: 'Room 103',
      notes: 'Physical therapy session',
      patientPhone: '(555) 345-6789',
      date: '2024-01-22'
    },
    {
      id: '4',
      patientName: 'John Wilson',
      time: '15:30',
      duration: 30,
      type: 'Consultation',
      status: 'pending',
      location: 'Room 101',
      notes: 'Chest pain evaluation',
      patientPhone: '(555) 456-7890',
      date: '2024-01-22'
    }
  ];

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getAppointmentForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.find(apt => 
      apt.date === dateStr && apt.time === time
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-300 text-green-800';
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'completed': return 'bg-gray-100 border-gray-300 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  ).length;

  const weeklyHours = appointments.reduce((total, apt) => total + apt.duration, 0) / 60;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600">Manage your appointments and availability</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{todayAppointments}</div>
              <div className="text-xs text-gray-500">Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{weeklyHours.toFixed(1)}h</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
          </div>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Block Time
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-blue-600">{todayAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Hours</p>
              <p className="text-2xl font-bold text-green-600">{weeklyHours.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next Patient</p>
              <p className="text-lg font-bold text-purple-600">10:30 AM</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Michael Brown</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Free Time</p>
              <p className="text-2xl font-bold text-orange-600">2.5h</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {weekDates[0].toLocaleDateString('en', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['day', 'week', 'month'] as const).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === viewType
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 bg-gray-50 border-r border-gray-200">
            <span className="text-sm font-medium text-gray-600">Time</span>
          </div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-600">{weekDays[index]}</div>
              <div className={`text-lg font-semibold mt-1 ${
                date.toDateString() === new Date().toDateString() 
                  ? 'text-blue-600' 
                  : 'text-gray-900'
              }`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="max-h-[600px] overflow-y-auto">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
              <div className="p-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-600 font-medium">
                {time}
              </div>
              {weekDates.map((date, dateIndex) => {
                const appointment = getAppointmentForSlot(date, time);
                return (
                  <div key={dateIndex} className="p-2 border-r border-gray-100 last:border-r-0 min-h-[60px] relative">
                    {appointment && (
                      <div className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(appointment.status)}`}>
                        <div className="font-medium truncate">{appointment.patientName}</div>
                        <div className="truncate">{appointment.type}</div>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{appointment.location}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {appointment.duration}min
                        </div>
                      </div>
                    )}
                    {/* Available slot indicator */}
                    {!appointment && date.getDay() !== 0 && date.getDay() !== 6 && (
                      <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule Summary */}
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                    <div className="text-xs text-gray-500">{appointment.duration}min</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-xs text-gray-500">{appointment.notes}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{appointment.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Block Time Off
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Set Available Hours
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View Patient Records
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
              <Bell className="w-4 h-4 mr-2" />
              Notification Settings
            </button>
          </div>
        </div>
      </div>

      {/* Block Time Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Block Time</h2>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Personal Time</option>
                  <option>Lunch Break</option>
                  <option>Administrative Work</option>
                  <option>Emergency</option>
                  <option>Vacation</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>Half day</option>
                    <option>Full day</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Block Time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;