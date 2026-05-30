import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/giris')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16, color: '#f1f5f9', textAlign: 'center',
    }}>
      <div style={{ fontSize: 48 }}>🚫</div>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Yetkisiz Erişim</h1>
      <p style={{ fontSize: 14, color: '#64748b', maxWidth: 320 }}>
        Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekiyor.
      </p>
      <button
        onClick={handleSignOut}
        style={{
          marginTop: 8, padding: '0.65rem 1.5rem', borderRadius: 10,
          background: '#334155', border: 'none', color: '#94a3b8',
          fontSize: 13, cursor: 'pointer',
        }}
      >
        Çıkış Yap
      </button>
    </div>
  )
}
