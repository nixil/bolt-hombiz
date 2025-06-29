import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Home } from 'lucide-react'

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator 
            if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </div>

          {/* Help */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600">
              Contact support at{' '}
              <a href="mailto:support@clinicflow.com" className="text-blue-600 hover:text-blue-700">
                support@clinicflow.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage