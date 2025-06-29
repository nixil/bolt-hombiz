import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Heart,
  Activity,
  Pill,
  TestTube,
  Image,
  Filter,
  Search
} from 'lucide-react';

const PatientRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const medicalRecords = [
    {
      id: '1',
      type: 'visit',
      title: 'General Consultation',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      clinic: 'Sunshine Family Clinic',
      category: 'Consultation',
      summary: 'Routine checkup with blood pressure monitoring',
      details: {
        vitals: {
          bloodPressure: '128/82 mmHg',
          heartRate: '72 bpm',
          temperature: '98.6°F',
          weight: '75 kg'
        },
        diagnosis: 'Hypertension - well controlled',
        treatment: 'Continue current medication regimen',
        notes: 'Patient reports feeling well. Blood pressure stable on current medication.',
        followUp: 'Return in 3 months for routine follow-up'
      },
      attachments: ['lab_results_01152024.pdf', 'prescription_01152024.pdf']
    },
    {
      id: '2',
      type: 'lab',
      title: 'Blood Work - Comprehensive Panel',
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      clinic: 'Sunshine Family Clinic',
      category: 'Laboratory',
      summary: 'Annual blood work including lipid panel and glucose',
      details: {
        results: [
          { test: 'Total Cholesterol', value: '185 mg/dL', range: '<200 mg/dL', status: 'normal' },
          { test: 'HDL Cholesterol', value: '45 mg/dL', range: '>40 mg/dL', status: 'normal' },
          { test: 'LDL Cholesterol', value: '120 mg/dL', range: '<130 mg/dL', status: 'normal' },
          { test: 'Glucose', value: '95 mg/dL', range: '70-100 mg/dL', status: 'normal' },
          { test: 'HbA1c', value: '5.8%', range: '<6.0%', status: 'normal' }
        ]
      },
      attachments: ['blood_work_01102024.pdf']
    },
    {
      id: '3',
      type: 'prescription',
      title: 'Medication Prescription',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      clinic: 'Sunshine Family Clinic',
      category: 'Prescription',
      summary: 'Lisinopril prescription renewal',
      details: {
        medications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '90 days',
            instructions: 'Take with or without food, preferably at the same time each day'
          }
        ]
      },
      attachments: ['prescription_01152024.pdf']
    },
    {
      id: '4',
      type: 'imaging',
      title: 'Chest X-Ray',
      date: '2023-12-20',
      doctor: 'Dr. Emily Davis',
      clinic: 'Sunshine Family Clinic',
      category: 'Imaging',
      summary: 'Chest X-ray for respiratory symptoms',
      details: {
        findings: 'Clear lung fields, no acute abnormalities',
        impression: 'Normal chest X-ray',
        recommendation: 'No further imaging needed at this time'
      },
      attachments: ['chest_xray_12202023.jpg', 'radiology_report_12202023.pdf']
    },
    {
      id: '5',
      type: 'visit',
      title: 'Physical Therapy Session',
      date: '2023-12-15',
      doctor: 'Dr. Emily Davis',
      clinic: 'Sunshine Family Clinic',
      category: 'Therapy',
      summary: 'Physical therapy for lower back pain',
      details: {
        assessment: 'Improved range of motion, decreased pain levels',
        exercises: ['Lumbar stretches', 'Core strengthening', 'Posture training'],
        progress: 'Patient showing good improvement, pain reduced from 7/10 to 4/10',
        plan: 'Continue current exercise program, return in 2 weeks'
      },
      attachments: ['therapy_notes_12152023.pdf']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Records', count: medicalRecords.length },
    { id: 'visit', label: 'Visits', count: medicalRecords.filter(r => r.type === 'visit').length },
    { id: 'lab', label: 'Lab Results', count: medicalRecords.filter(r => r.type === 'lab').length },
    { id: 'prescription', label: 'Prescriptions', count: medicalRecords.filter(r => r.type === 'prescription').length },
    { id: 'imaging', label: 'Imaging', count: medicalRecords.filter(r => r.type === 'imaging').length }
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'visit': return <User className="w-5 h-5" />;
      case 'lab': return <TestTube className="w-5 h-5" />;
      case 'prescription': return <Pill className="w-5 h-5" />;
      case 'imaging': return <Image className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'visit': return 'bg-blue-100 text-blue-600';
      case 'lab': return 'bg-green-100 text-green-600';
      case 'prescription': return 'bg-purple-100 text-purple-600';
      case 'imaging': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'abnormal': return 'text-red-600';
      case 'borderline': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRecords = activeTab === 'all' 
    ? medicalRecords 
    : medicalRecords.filter(record => record.type === activeTab);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600">Access your complete medical history and documents</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{medicalRecords.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Visits</p>
              <p className="text-2xl font-bold text-green-600">
                {medicalRecords.filter(r => r.type === 'visit').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lab Results</p>
              <p className="text-2xl font-bold text-purple-600">
                {medicalRecords.filter(r => r.type === 'lab').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prescriptions</p>
              <p className="text-2xl font-bold text-orange-600">
                {medicalRecords.filter(r => r.type === 'prescription').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="p-6">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">No medical records match your current filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${getRecordColor(record.type)}`}>
                        {getRecordIcon(record.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {record.category}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{new Date(record.date).toLocaleDateString('en', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span>{record.doctor}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Activity className="w-4 h-4 mr-2" />
                              <span>{record.clinic}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{record.summary}</p>
                        
                        {record.attachments && record.attachments.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Attachments:</span>
                            {record.attachments.map((attachment, index) => (
                              <button
                                key={index}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                {attachment}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => setSelectedRecord(record)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getRecordColor(selectedRecord.type)}`}>
                    {getRecordIcon(selectedRecord.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedRecord.title}</h2>
                    <p className="text-gray-600">{selectedRecord.doctor} • {selectedRecord.clinic}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FileText className="w-6 h-6 rotate-45" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(selectedRecord.date).toLocaleDateString('en', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {selectedRecord.category}
                  </span>
                </div>
                <p className="text-gray-700">{selectedRecord.summary}</p>
              </div>

              {/* Record-specific details */}
              {selectedRecord.details && (
                <div className="space-y-6">
                  {/* Vitals for visit records */}
                  {selectedRecord.details.vitals && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vital Signs</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(selectedRecord.details.vitals).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="font-medium text-gray-900">{value as string}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lab results */}
                  {selectedRecord.details.results && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Results</h3>
                      <div className="space-y-3">
                        {selectedRecord.details.results.map((result: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{result.test}</div>
                              <div className="text-sm text-gray-600">Reference: {result.range}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${getStatusColor(result.status)}`}>
                                {result.value}
                              </div>
                              <div className={`text-xs font-medium ${getStatusColor(result.status)}`}>
                                {result.status.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medications */}
                  {selectedRecord.details.medications && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Medications</h3>
                      <div className="space-y-3">
                        {selectedRecord.details.medications.map((med: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{med.name}</h4>
                              <span className="text-sm text-gray-600">{med.dosage}</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Frequency:</strong> {med.frequency}</p>
                              <p><strong>Duration:</strong> {med.duration}</p>
                              <p><strong>Instructions:</strong> {med.instructions}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other details */}
                  {selectedRecord.details.diagnosis && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Diagnosis & Treatment</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Diagnosis</div>
                          <div className="font-medium text-gray-900">{selectedRecord.details.diagnosis}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Treatment</div>
                          <div className="font-medium text-gray-900">{selectedRecord.details.treatment}</div>
                        </div>
                        {selectedRecord.details.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Notes</div>
                            <div className="font-medium text-gray-900">{selectedRecord.details.notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Attachments */}
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedRecord.attachments.map((attachment: string, index: number) => (
                      <button
                        key={index}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-900 flex-1 text-left">{attachment}</span>
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;