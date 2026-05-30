import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0f172a', color: '#94a3b8', fontSize: 14,
      }}>
        Yükleniyor...
      </div>
    )
  }

  if (!user) return <Navigate to="/giris" replace />
  if (!isAdmin) return <Navigate to="/yetkisiz" replace />

  return <Outlet />
}
