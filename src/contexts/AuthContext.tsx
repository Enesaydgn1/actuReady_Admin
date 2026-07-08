import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  isAdmin: boolean
  loading: boolean
  isAdminLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  isAdminLoading: false,
})

async function checkAdmin(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle()
    return (data as { is_admin: boolean } | null)?.is_admin === true
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAdminLoading, setIsAdminLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    // .catch() şart: getSession() reddedilirse loading hiç false olmaz ve
    // AdminRoute sonsuza dek "Yükleniyor..." spinner'ında kalır.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return

      if (error || !session) {
        setSession(null)
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        setIsAdminLoading(false)
        return
      }

      setSession(session)
      setUser(session.user)
      setLoading(false)
      setIsAdminLoading(true)

      checkAdmin(session.user.id).then((admin) => {
        if (!mounted) return
        setIsAdmin(admin)
        setIsAdminLoading(false)
      })
    }).catch(() => {
      if (!mounted) return
      setSession(null)
      setUser(null)
      setIsAdmin(false)
      setLoading(false)
      setIsAdminLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
        setIsAdminLoading(true)

        if (session?.user) {
          checkAdmin(session.user.id).then((admin) => {
            if (!mounted) return
            setIsAdmin(admin)
            setIsAdminLoading(false)
            setLoading(false)
          })
        } else {
          setIsAdmin(false)
          setIsAdminLoading(false)
          setLoading(false)
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setIsAdmin(false)
        setIsAdminLoading(false)
        setLoading(false)
      } else if ((event as string) === 'TOKEN_REFRESH_FAILED') {
        setSession(null)
        setUser(null)
        setIsAdmin(false)
        setIsAdminLoading(false)
        setLoading(false)
        window.location.href = '/giris'
      } else {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, isAdminLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
