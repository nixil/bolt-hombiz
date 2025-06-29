import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState, UserProfile } from '../hooks/useAuth'

interface AuthContextType extends AuthState {
  signUp: (
    email: string, 
    password: string, 
    userData: {
      name: string
      phone?: string
      role?: string
      tenantId?: string
    }
  ) => Promise<{ user: any; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ user: any; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  clearSession: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  isSystemAdmin: () => boolean
  getUserRedirectPath: () => string
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()
  const { clearSession } = auth

  return (
    <AuthContext.Provider value={{ ...auth, clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}