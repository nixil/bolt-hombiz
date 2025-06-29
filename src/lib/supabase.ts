import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Configuration:')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Anon Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  throw new Error('Missing Supabase environment variables')
}

// Function to clear auth state
const clearAuthState = () => {
  const storageKey = `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
  localStorage.removeItem(storageKey)
  sessionStorage.removeItem(storageKey)
  document.cookie = `${storageKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Clear any existing auth state before initializing
clearAuthState()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'clinicflow-auth-token'
  },
  global: {
    headers: {
      'X-Client-Info': 'clinicflow-web'
    }
  }
})

// Add error listener for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Auth state changed:', event, session)
  if (event === 'SIGNED_OUT') {
    clearAuthState()
  }
})

// Simple connection test without aggressive timeouts
const testConnection = async () => {
  try {
    console.log('🔌 Testing Supabase connection...')
    
    // Quick auth session check (most reliable)
    const { error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('⚠️ Auth session check failed:', error.message)
    } else {
      console.log('✅ Supabase client initialized successfully')
    }
  } catch (err) {
    console.warn('⚠️ Supabase connection test failed:', err instanceof Error ? err.message : 'Unknown error')
  }
}

// Run connection test without blocking
testConnection()

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          subscription_plan: string
          subscription_status: string
          max_clinics: number
          max_users: number
          settings: any
          is_system_tenant: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          subscription_plan?: string
          subscription_status?: string
          max_clinics?: number
          max_users?: number
          settings?: any
          is_system_tenant?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          subscription_plan?: string
          subscription_status?: string
          max_clinics?: number
          max_users?: number
          settings?: any
          is_system_tenant?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
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
        Insert: {
          id: string
          tenant_id: string
          email: string
          name: string
          phone?: string | null
          avatar_url?: string | null
          role: string
          specialization?: string | null
          license_number?: string | null
          is_active?: boolean
          last_login_at?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          email?: string
          name?: string
          phone?: string | null
          avatar_url?: string | null
          role?: string
          specialization?: string | null
          license_number?: string | null
          is_active?: boolean
          last_login_at?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}