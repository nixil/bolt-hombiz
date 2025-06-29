// Authentication utility functions

export const getRedirectPath = (userRole: string, isSystemAdmin: boolean = false): string => {
  console.log('🎯 Getting redirect path for role:', userRole, 'isSystemAdmin:', isSystemAdmin)
  
  // System admin gets special treatment
  if (isSystemAdmin) {
    return '/admin'
  }
  
  switch (userRole) {
    case 'tenant_admin':
      return '/admin'
    case 'clinic_owner':
      return '/clinic'
    case 'doctor':
      return '/doctor'
    case 'nurse':
    case 'receptionist':
      return '/clinic'
    case 'patient':
      return '/patient'
    default:
      console.warn('⚠️ Unknown role, defaulting to clinic dashboard:', userRole)
      return '/clinic'
  }
}

export const isValidRole = (role: string): boolean => {
  const validRoles = [
    'tenant_admin',
    'clinic_owner', 
    'doctor',
    'nurse',
    'receptionist',
    'patient'
  ]
  return validRoles.includes(role)
}

export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    'tenant_admin': 'System Administrator',
    'clinic_owner': 'Clinic Owner',
    'doctor': 'Doctor',
    'nurse': 'Nurse',
    'receptionist': 'Receptionist',
    'patient': 'Patient'
  }
  return roleNames[role] || role
}

export const canAccessRoute = (userRole: string, requiredRoles: string[]): boolean => {
  if (requiredRoles.length === 0) return true
  return requiredRoles.includes(userRole)
}

export const isSystemAdmin = (userRole: string, tenantId: string): boolean => {
  return userRole === 'tenant_admin' && tenantId === '00000000-0000-0000-0000-000000000001'
}