import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function AdminRoute() {
  const { user, isAdmin, loading, isAdminLoading } = useAuth()

  if (loading || isAdminLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Yükleniyor...
      </div>
    )
  }

  if (!user) return <Navigate to="/giris" replace />
  if (!isAdmin) return <Navigate to="/yetkisiz" replace />

  return <Outlet />
}
