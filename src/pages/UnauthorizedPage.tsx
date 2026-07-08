import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { ShieldOff, LogOut } from 'lucide-react'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/giris')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <ShieldOff className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-100 mb-2">Yetkisiz Erişim</h1>
        <p className="text-sm text-slate-500 mb-6">
          Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekiyor.
        </p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}
