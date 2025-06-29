import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Stethoscope, AlertCircle } from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'

const LoginForm: React.FC = () => {
  const { profile, getUserRedirectPath, clearSession } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()

  // If user is already signed in, redirect to appropriate dashboard
  useEffect(() => {
    if (profile) {
      const redirectPath = (location.state as any)?.from?.pathname || getUserRedirectPath()
      navigate(redirectPath, { replace: true })
    }
  }, [profile, navigate, location, getUserRedirectPath])

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { signIn, error } = useAuthContext()

  // Get the intended destination or default based on user role
  const from = (location.state as any)?.from?.pathname

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Prevent double submission
    if (isLoading) return
  
    setIsLoading(true)

    try {
      console.log('🔐 Starting login process for:', formData.email)
      
      // Clear any existing session first
      const { error: clearError } = await clearSession()
      if (clearError) {
        console.error('❌ Error clearing session:', clearError)
        throw new Error('Failed to clear existing session')
      }
      
      const { user, error: signInError } = await signIn(formData.email, formData.password)
      
      if (signInError) {
        console.error('❌ Login error:', signInError)
        throw signInError
      }

      if (user) {
        console.log('✅ Login successful, user:', user)
        
        // Wait a bit longer for auth state to fully update
        console.log('⏳ Waiting for auth state to update...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Get the appropriate redirect path
        const redirectPath = from || getUserRedirectPath()
        
        console.log('🎯 Final redirect path:', redirectPath)
        console.log('👤 Current profile:', profile)
        
        navigate(redirectPath, { replace: true })
      }
    } catch (error) {
      console.error('💥 Unexpected login error:', error)
    } finally {
      setIsLoading(false)
    }  
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Demo users for quick testing
  const demoUsers = [
    { email: 'sarah@sunshineclinic.com', role: 'Clinic Owner', password: 'demo123' },
    { email: 'michael@metrodental.com', role: 'Clinic Owner', password: 'demo123' },
    { email: 'emily@sunshineclinic.com', role: 'Doctor', password: 'demo123' },
    { email: 'john.smith@email.com', role: 'Patient', password: 'demo123' },
    { email: 'alexleebiti@gmail.com', role: 'System Admin', password: 'demo123' }
  ]

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Stethoscope className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your ClinicFlow account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-colors"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Users */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h3>
            <div className="space-y-2">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(user.email, user.password)}
                  className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <div className="font-medium text-gray-800">{user.role}</div>
                  <div className="text-gray-600">{user.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign up for free
              </Link>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <Link to="/" className="hover:text-gray-700 transition-colors">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm