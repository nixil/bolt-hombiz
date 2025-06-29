import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';

const RevenueAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [showDetails, setShowDetails] = useState(false);

  const revenueData = {
    totalRevenue: 145750,
    monthlyGrowth: 12.5,
    totalAppointments: 1247,
    averagePerAppointment: 117,
    topServices: [
      { name: 'General Consultation', revenue: 45600, appointments: 304, percentage: 31.3 },
      { name: 'Dental Checkup', revenue: 32400, appointments: 270, percentage: 22.2 },
      { name: 'Physical Therapy', revenue: 28800, appointments: 360, percentage: 19.8 },
      { name: 'Specialist Consultation', revenue: 24700, appointments: 95, percentage: 16.9 },
      { name: 'Diagnostic Tests', revenue: 14250, appointments: 218, percentage: 9.8 }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 12400, appointments: 98 },
      { month: 'Feb', revenue: 13800, appointments: 115 },
      { month: 'Mar', revenue: 15200, appointments: 128 },
      { month: 'Apr', revenue: 14600, appointments: 122 },
      { month: 'May', revenue: 16800, appointments: 142 },
      { month: 'Jun', revenue: 18900, appointments: 156 },
      { month: 'Jul', revenue: 17200, appointments: 138 },
      { month: 'Aug', revenue: 19600, appointments: 165 },
      { month: 'Sep', revenue: 21400, appointments: 178 },
      { month: 'Oct', revenue: 18700, appointments: 158 },
      { month: 'Nov', revenue: 20100, appointments: 167 },
      { month: 'Dec', revenue: 22450, appointments: 185 }
    ],
    paymentMethods: [
      { method: 'Insurance', amount: 87450, percentage: 60 },
      { method: 'Cash', amount: 43720, percentage: 30 },
      { method: 'Credit Card', amount: 14575, percentage: 10 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMaxRevenue = () => {
    return Math.max(...revenueData.monthlyRevenue.map(m => m.revenue));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600">Track your clinic's financial performance and growth</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+{revenueData.monthlyGrowth}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(revenueData.totalRevenue)}
          </h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+8.2%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {revenueData.totalAppointments.toLocaleString()}
          </h3>
          <p className="text-gray-600 text-sm">Total Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-purple-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+15.3%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(revenueData.averagePerAppointment)}
          </h3>
          <p className="text-gray-600 text-sm">Avg. per Appointment</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center text-orange-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+5.7%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">94.2%</h3>
          <p className="text-gray-600 text-sm">Payment Success Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {revenueData.monthlyRevenue.map((data, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(data.revenue)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {data.appointments} appointments
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(data.revenue / getMaxRevenue()) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {showDetails && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {revenueData.monthlyRevenue.slice(-6).map((data, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{data.month} 2024</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {data.appointments} appointments • Avg: {formatCurrency(data.revenue / data.appointments)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Top Services</h2>
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {revenueData.topServices.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatCurrency(service.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{service.appointments} appointments</span>
                    <span>{service.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Financial Summary */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {revenueData.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <span className="font-medium text-gray-900">{method.method}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(method.amount)}</div>
                    <div className="text-sm text-gray-600">{method.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total Collected</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(revenueData.paymentMethods.reduce((sum, method) => sum + method.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Financial Summary</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Gross Revenue</span>
              <span className="font-semibold text-gray-900">{formatCurrency(145750)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Operating Expenses</span>
              <span className="font-semibold text-red-600">-{formatCurrency(32400)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Staff Salaries</span>
              <span className="font-semibold text-red-600">-{formatCurrency(45600)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Equipment & Supplies</span>
              <span className="font-semibold text-red-600">-{formatCurrency(12800)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Net Profit</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(54950)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Profit margin: 37.7%
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg mt-6">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Strong Performance</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your clinic is performing 23% above industry average
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI-Powered Insights</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Revenue Optimization</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Consider promoting Physical Therapy services more - they have the highest per-appointment value but lower booking rates.
            </p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Recommendations →
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Growth Opportunity</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Your December performance shows strong growth. Consider expanding weekend hours to capitalize on demand.
            </p>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;