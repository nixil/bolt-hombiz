import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Clock,
  DollarSign,
  Users,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
  Eye,
  Edit
} from 'lucide-react';

const ClinicSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [clinicData, setClinicData] = useState({
    name: 'Sunshine Family Clinic',
    slug: 'sunshine-family-clinic',
    description: 'Providing comprehensive healthcare services for the whole family.',
    address: '123 Health Street, Medical District',
    phone: '(555) 123-4567',
    email: 'info@sunshineclinic.com',
    website: 'www.sunshineclinic.com',
    logo: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '10:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '17:00', closed: true }
  });

  const [services, setServices] = useState([
    { id: '1', name: 'General Consultation', price: 150, duration: 30, active: true },
    { id: '2', name: 'Dental Checkup', price: 120, duration: 45, active: true },
    { id: '3', name: 'Physical Therapy', price: 80, duration: 60, active: true }
  ]);

  const [theme, setTheme] = useState({
    primaryColor: '#2563EB',
    secondaryColor: '#059669',
    accentColor: '#DC2626'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <Building2 className="w-5 h-5" /> },
    { id: 'website', label: 'Website', icon: <Globe className="w-5 h-5" /> },
    { id: 'hours', label: 'Hours', icon: <Clock className="w-5 h-5" /> },
    { id: 'services', label: 'Services', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> }
  ];

  const handleSave = () => {
    // Save settings logic
    console.log('Settings saved');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
          <p className="text-gray-600">Manage your clinic profile and configurations</p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href={`/c/${clinicData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </a>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-3">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">General Information</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clinic Name *
                      </label>
                      <input
                        type="text"
                        value={clinicData.name}
                        onChange={(e) => setClinicData({...clinicData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          clinicflow.com/c/
                        </span>
                        <input
                          type="text"
                          value={clinicData.slug}
                          onChange={(e) => setClinicData({...clinicData, slug: e.target.value})}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={clinicData.description}
                      onChange={(e) => setClinicData({...clinicData, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={clinicData.phone}
                        onChange={(e) => setClinicData({...clinicData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={clinicData.email}
                        onChange={(e) => setClinicData({...clinicData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={clinicData.address}
                      onChange={(e) => setClinicData({...clinicData, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={clinicData.logo}
                        alt="Clinic Logo"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Website Settings */}
            {activeTab === 'website' && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Website Customization</h2>
                
                <div className="space-y-8">
                  {/* Theme Colors */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Colors</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={theme.primaryColor}
                            onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                            className="w-12 h-12 rounded-lg border border-gray-300"
                          />
                          <input
                            type="text"
                            value={theme.primaryColor}
                            onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={theme.secondaryColor}
                            onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})}
                            className="w-12 h-12 rounded-lg border border-gray-300"
                          />
                          <input
                            type="text"
                            value={theme.secondaryColor}
                            onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accent Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={theme.accentColor}
                            onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                            className="w-12 h-12 rounded-lg border border-gray-300"
                          />
                          <input
                            type="text"
                            value={theme.accentColor}
                            onChange={(e) => setTheme({...theme, accentColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* SEO Settings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          placeholder="Best Family Clinic in Your City"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Professional healthcare services with experienced doctors..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours */}
            {activeTab === 'hours' && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Working Hours</h2>
                
                <div className="space-y-4">
                  {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => setWorkingHours({
                            ...workingHours,
                            [day]: { ...hours, closed: !e.target.checked }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span className="font-medium text-gray-900 capitalize w-24">{day}</span>
                      </div>
                      
                      {!hours.closed ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setWorkingHours({
                              ...workingHours,
                              [day]: { ...hours, open: e.target.value }
                            })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setWorkingHours({
                              ...workingHours,
                              [day]: { ...hours, close: e.target.value }
                            })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {activeTab === 'services' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Services & Pricing</h2>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Add Service
                  </button>
                </div>
                
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 grid md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Service Name
                            </label>
                            <input
                              type="text"
                              value={service.name}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              value={service.price}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (min)
                            </label>
                            <input
                              type="number"
                              value={service.duration}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={service.active}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                              />
                              <span className="text-sm text-gray-700">Active</span>
                            </label>
                          </div>
                        </div>
                        
                        <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs can be implemented similarly */}
            {activeTab === 'team' && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Display Settings</h2>
                <div className="text-gray-600">
                  <p>Configure which team members appear on your public website.</p>
                  <p className="mt-2">Coming soon: Advanced team profile customization.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                <div className="text-gray-600">
                  <p>Configure appointment reminders, email notifications, and SMS alerts.</p>
                  <p className="mt-2">Coming soon: Advanced notification automation.</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security & Privacy</h2>
                <div className="text-gray-600">
                  <p>Manage HIPAA compliance settings, data retention policies, and access controls.</p>
                  <p className="mt-2">Coming soon: Advanced security configuration.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicSettings;