import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Loader2, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    console.log('[Login] signIn result:', { user: data?.user?.id, authErr })
    if (authErr || !data.user) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
      return
    }
    const { data: profileData, error: profileErr } = await supabase
      .from('user_profiles').select('is_admin').eq('user_id', data.user.id).maybeSingle()
    console.log('[Login] profile result:', { profileData, profileErr })
    if (profileErr) {
      await supabase.auth.signOut()
      setError(`Profil sorgusu başarısız: ${profileErr.message}`)
      setLoading(false)
      return
    }
    if (!(profileData as { is_admin: boolean } | null)?.is_admin) {
      await supabase.auth.signOut()
      setError('Bu hesabın admin yetkisi bulunmuyor.')
      setLoading(false)
      return
    }
    console.log('[Login] navigating to /dashboard')
    navigate('/dashboard')
  }

  return (
    <div className="login-bg min-h-screen flex">
      {/* Sol panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] flex-shrink-0 p-10"
        style={{ background: 'linear-gradient(160deg, #0d1f3c 0%, #0a0f1e 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <img src="/actureadyLogo.svg" alt="ActuReady" className="h-8" />
        </div>

        <div>
          <p className="text-3xl font-black text-white leading-snug mb-3">
            Aktüerya Sınav<br />Yönetim Paneli
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Kullanıcı yönetimi, soru bankası, konu içerikleri ve sınav takvimini tek yerden yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(194,68,90,0.12)' }}>
            <Lock className="w-3.5 h-3.5" style={{ color: '#c2445a' }} />
          </div>
          <p className="text-xs text-slate-600">Yalnızca yetkili admin hesapları giriş yapabilir.</p>
        </div>
      </div>

      {/* Sağ panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px]">

          {/* Mobil logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/actureadyLogo.svg" alt="ActuReady" className="h-10 mx-auto mb-3" />
            <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">Admin Panel</p>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Giriş Yap</h2>
          <p className="text-sm text-slate-600 mb-7">Admin panelinize erişin.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@actu.com"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-700"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(194,68,90,0.5)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl py-3 pl-10 pr-11 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-700"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(194,68,90,0.5)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{
                background: 'linear-gradient(135deg, #c2445a 0%, #a03248 100%)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(194,68,90,0.35)',
              }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-700 mt-8">ActuReady Admin &copy; 2025</p>
        </div>
      </div>
    </div>
  )
}
