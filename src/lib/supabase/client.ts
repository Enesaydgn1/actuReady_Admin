import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const SINGLETON_KEY = '__supabase_singleton__'
declare global {
  interface Window { [SINGLETON_KEY]?: ReturnType<typeof createSupabaseClient<Database>> }
}

export const supabase = (window[SINGLETON_KEY] ??= createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'proje-backend-auth',
  },
}))
