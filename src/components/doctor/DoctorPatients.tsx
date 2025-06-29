import React, { useState } from 'react';
import {
  Search,
  Filter,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  AlertTriangle,
  Heart,
  Edit,
  Eye
} from 'lucide-react';
import { mockPatients } from '../../data/mockData';

const DoctorPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Extended mock data for doctor's patients
  const doctorPatients = [
    ...mockPatients,
    {
      id: '3',
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '(555) 555-0127',
      dateOfBirth: '1975-11-08',
      address: '321 Oak Avenue, City',
      emergencyContact: 'Lisa Wilson - (555) 555-0128',
      medicalHistory: [
        { date: '2024-01-12', condition: 'Diabetes Type 2', treatment: 'Medication adjustment' },
        { date: '2023-12-15', condition: 'High Cholesterol', treatment: 'Statin prescribed' }
      ],
      allergies: ['Sulfa drugs'],
      bloodType: 'B+',
      insuranceProvider: 'United Healthcare',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-02-12',
      status: 'needs-attention',
      riskLevel: 'medium'
    },
    {
      id: '4',
      name: 'Jennifer Adams',
      email: 'jennifer.adams@email.com',
      phone: '(555) 555-0129',
      dateOfBirth: '1988-04-25',
      address: '789 Pine Street, City',
      emergencyContact: 'Mark Adams - (555) 555-0130',
      medicalHistory: [
        { date: '2024-01-20', condition: 'Pregnancy - 2nd Trimester', treatment: 'Routine prenatal care' },
        { date: '2024-01-06', condition: 'Morning Sickness', treatment: 'Dietary recommendations' }
      ],
      allergies: ['None known'],
      bloodType: 'A+',
      insuranceProvider: 'Cigna',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-20',
      status: 'stable',
      riskLevel: 'low'
    }
  ];

  const filteredPatients = doctorPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'high-risk') return matchesSearch && patient.riskLevel === 'high';
    if (filterBy === 'needs-attention') return matchesSearch && patient.status === 'needs-attention';
    if (filterBy === 'recent') return matchesSearch && new Date(patient.lastVisit) > new Date('2024-01-15');
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600">Manage your patient records and treatment plans</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">Total Patients: </span>
            <span className="font-semibold text-gray-900">{doctorPatients.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Patients</p>
              <p className="text-2xl font-bold text-green-600">
                {doctorPatients.filter(p => p.status === 'stable').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Need Attention</p>
              <p className="text-2xl font-bold text-yellow-600">
                {doctorPatients.filter(p => p.status === 'needs-attention').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {doctorPatients.filter(p => p.riskLevel === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Visits</p>
              <p className="text-2xl font-bold text-blue-600">
                {doctorPatients.filter(p => new Date(p.lastVisit) > new Date('2024-01-15')).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Patients</option>
              <option value="needs-attention">Needs Attention</option>
              <option value="high-risk">High Risk</option>
              <option value="recent">Recent Visits</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Patients ({filteredPatients.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {patient.status.replace('-', ' ')}
                      </span>
                      <span className={`text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                        {patient.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {patient.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {patient.phone}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Born {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">Last visit: <strong>{patient.lastVisit}</strong></span>
                      <span className="text-gray-600">Next: <strong>{patient.nextAppointment}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedPatient(patient)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Records"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Medical Info */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Blood Type:</span>
                    <span className="ml-2 text-sm text-gray-900">{patient.bloodType}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Insurance:</span>
                    <span className="ml-2 text-sm text-gray-900">{patient.insuranceProvider}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Allergies:</span>
                    <span className="ml-2 text-sm text-red-600">
                      {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None known'}
                    </span>
                  </div>
                </div>

                {/* Recent Medical History */}
                {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700">Recent:</span>
                    <div className="ml-2 inline-block">
                      <span className="text-sm text-gray-900">
                        {patient.medicalHistory[0].condition}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({patient.medicalHistory[0].date})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedPatient.avatar}
                    alt={selectedPatient.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <User className="w-6 h-6 rotate-45" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="text-gray-900">{selectedPatient.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Type:</span>
                      <span className="text-gray-900">{selectedPatient.bloodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance:</span>
                      <span className="text-gray-900">{selectedPatient.insuranceProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency Contact:</span>
                      <span className="text-gray-900">{selectedPatient.emergencyContact}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Allergies:</span>
                      <div className="mt-1">
                        {selectedPatient.allergies.map((allergy: string, index: number) => (
                          <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`ml-2 font-medium ${getRiskColor(selectedPatient.riskLevel)}`}>
                        {selectedPatient.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-4">
                  {selectedPatient.medicalHistory.map((record: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{record.condition}</h4>
                        <span className="text-sm text-gray-500">{record.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{record.treatment}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;