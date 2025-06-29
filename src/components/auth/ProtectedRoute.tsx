import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requireSystemAdmin?: boolean
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireSystemAdmin = false,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading, hasAnyRole, isSystemAdmin, profile } = useAuthContext()
  const location = useLocation()

  console.log('🛡️ ProtectedRoute check:', {
    isAuthenticated,
    isLoading,
    profile: profile?.role,
    requiredRoles,
    requireSystemAdmin,
    currentPath: location.pathname
  })

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login')
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check system admin requirement
  if (requireSystemAdmin && !isSystemAdmin()) {
    console.log('❌ System admin required but user is not system admin')
    return <Navigate to="/unauthorized" replace />
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    console.log('❌ Required roles not met:', { userRole: profile?.role, requiredRoles })
    return <Navigate to="/unauthorized" replace />
  }

  console.log('✅ Access granted')
  return <>{children}</>
}

export default ProtectedRoute