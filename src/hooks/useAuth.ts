import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getRedirectPath, isSystemAdmin, clearSupabaseSession } from '../utils/auth'

export interface UserProfile {
  id: string
  tenant_id: string
  email: string
  name: string
  phone: string | null
  avatar_url: string | null
  role: string
  specialization: string | null
  license_number: string | null
  is_active: boolean
  last_login_at: string | null
  settings: any
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  })

  // Fetch user profile with simplified error handling
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('👤 Fetching user profile for:', userId)
      
      // Simple, direct query with shorter timeout
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Database error fetching user profile:', error.message)
        return null
      }

      if (!data) {
        console.warn('⚠️ No user profile found for ID:', userId)
        return null
      }

      console.log('✅ User profile fetched successfully')
      return data
    } catch (error) {
      console.error('💥 Error fetching user profile:', error instanceof Error ? error.message : 'Unknown error')
      return null
    }
  }

  // Update last login timestamp
  const updateLastLogin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId)
      
      if (error) {
        console.error('❌ Error updating last login:', error.message)
      }
    } catch (error) {
      console.error('💥 Error updating last login:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Sign up new user
  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      name: string
      phone?: string
      role?: string
      tenantId?: string
    }
  ) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone
          }
        }
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('User creation failed')
      }

      // If we have a tenant ID, create the user profile
      if (userData.tenantId && authData.user.id) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            tenant_id: userData.tenantId,
            email: email,
            name: userData.name,
            phone: userData.phone || null,
            role: userData.role || 'patient'
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError.message)
        }
      }

      return { user: authData.user, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { user: null, error: errorMessage }
    }
  }

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      console.log('🔐 Attempting sign in for:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Supabase auth error:', error.message)
        throw error
      }

      if (data.user) {
        console.log('data:', data)
        console.log('✅ Auth successful for user ID:', data.user.id)
        
        // Fetch user profile
        const profile = await fetchUserProfile(data.user.id)
        
        if (profile) {
          console.log('✅ Profile fetched successfully, role:', profile.role)
          
          // Update last login (don't wait for it)
          updateLastLogin(data.user.id).catch(err => 
            console.warn('⚠️ Failed to update last login:', err)
          )
          
          // Update auth state
          setAuthState({
            user: data.user,
            profile,
            session: data.session,
            loading: false,
            error: null
          })
        } else {
          console.warn('⚠️ User profile not found')
          
          // Still set the auth state with user but no profile
          setAuthState({
            user: data.user,
            profile: null,
            session: data.session,
            loading: false,
            error: 'User profile not found. Please contact support.'
          })
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      console.error('💥 Sign in error:', errorMessage)
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { user: null, error: errorMessage }
    }
  }

  // Sign out user
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      console.log('🚪 Signing out user...')
      
      // Clear local auth state first
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null
      })

      // Clear Supabase session cookies
      clearSupabaseSession()

      // Call Supabase signOut to clear server-side session
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('⚠️ Supabase signOut error:', error.message)
        // Don't throw error here since we've already cleared local state
      }

      console.log('✅ Sign out successful')
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      console.error('💥 Sign out error:', errorMessage)
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      return { error: errorMessage }
    }
  }

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed'
      return { error: errorMessage }
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) {
        throw new Error('No authenticated user')
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authState.user.id)

      if (error) {
        throw error
      }

      // Refresh profile
      const updatedProfile = await fetchUserProfile(authState.user.id)
      if (updatedProfile) {
        setAuthState(prev => ({ ...prev, profile: updatedProfile }))
      }

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      return { error: errorMessage }
    }
  }

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    return authState.profile?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return authState.profile ? roles.includes(authState.profile.role) : false
  }

  // Check if user is system admin
  const isSystemAdminUser = (): boolean => {
    if (!authState.profile) return false
    return isSystemAdmin(authState.profile.role, authState.profile.tenant_id)
  }

  // Get redirect path for user
  const getUserRedirectPath = (): string => {
    if (!authState.profile) {
      console.warn('⚠️ No profile available, defaulting to clinic dashboard')
      return '/clinic'
    }
    return getRedirectPath(authState.profile.role, isSystemAdminUser())
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error.message)
          setAuthState(prev => ({ ...prev, loading: false, error: error.message }))
          return
        }

        if (session?.user) {
          console.log('✅ Session found for user:', session.user.id)
          const profile = await fetchUserProfile(session.user.id)
          setAuthState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null
          })
        } else {
          console.log('ℹ️ No session found')
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('💥 Error in getInitialSession:', error instanceof Error ? error.message : 'Unknown error')
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Session error'
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('🔄 Auth state change:', event)
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ User signed in, fetching profile...')
            const profile = await fetchUserProfile(session.user.id)
            setAuthState({
              user: session.user,
              profile,
              session,
              loading: false,
              error: null
            })
          } else if (event === 'SIGNED_OUT') {
            console.log('🚪 User signed out')
            setAuthState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: null
            })
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('🔄 Token refreshed')
            const profile = await fetchUserProfile(session.user.id)
            setAuthState(prev => ({
              ...prev,
              user: session.user,
              profile,
              session,
              error: null
            }))
          }
        } catch (error) {
          console.error('💥 Error in auth state change:', error instanceof Error ? error.message : 'Unknown error')
          setAuthState(prev => ({ 
            ...prev, 
            loading: false,
            error: error instanceof Error ? error.message : 'Auth state error'
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    hasRole,
    hasAnyRole,
    isSystemAdmin: isSystemAdminUser,
    getUserRedirectPath,
    isAuthenticated: !!authState.user,
    isLoading: authState.loading
  }
}