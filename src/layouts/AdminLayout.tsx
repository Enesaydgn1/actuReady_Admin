import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { to: '/dashboard',     label: 'Genel Bakış',      icon: '📊' },
  { to: '/kullanicilar',  label: 'Kullanıcılar',      icon: '👥' },
  { to: '/soru-bankasi',  label: 'Soru Bankası',      icon: '📚' },
  { to: '/konu-icerigi',  label: 'Konu İçerikleri',   icon: '📝' },
  { to: '/sinav-takvimi', label: 'Sınav Takvimi',     icon: '🗓️' },
  { to: '/quiz-kayitlar', label: 'Quiz Kayıtları',    icon: '❓' },
  { to: '/ayarlar',       label: 'Sistem Ayarları',   icon: '⚙️' },
]

export default function AdminLayout() {
  const { user } = useAuth()
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/giris')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#1e293b', borderRight: '1px solid #334155',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 30,
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1.25rem', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: '#fff',
            }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>ActuReady</div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.6rem 0.8rem', borderRadius: 8, textDecoration: 'none',
                fontSize: 13.5, fontWeight: 500, transition: 'all 0.15s',
                background: isActive(item.to) ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: isActive(item.to) ? '#f59e0b' : '#94a3b8',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #334155' }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, paddingLeft: 4 }}>
            {user?.email}
          </div>
          <button
            onClick={() => setShowLogout(true)}
            style={{
              width: '100%', padding: '0.55rem 0.8rem', borderRadius: 8,
              background: 'transparent', border: '1px solid #334155',
              color: '#94a3b8', fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 220, padding: '2rem', minHeight: '100vh', overflow: 'auto' }}>
        <Outlet />
      </main>

      {/* Logout Modal */}
      {showLogout && (
        <div
          onClick={() => setShowLogout(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1e293b', border: '1px solid #334155', borderRadius: 16,
              padding: '2rem', width: 340,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>🚪</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              Çıkış Yap
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
              Admin panelden çıkış yapmak istediğinize emin misiniz?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowLogout(false)}
                style={{
                  flex: 1, padding: '0.65rem', borderRadius: 8,
                  background: 'transparent', border: '1px solid #334155',
                  color: '#94a3b8', fontSize: 13, cursor: 'pointer',
                }}
              >
                Vazgeç
              </button>
              <button
                onClick={handleSignOut}
                style={{
                  flex: 1, padding: '0.65rem', borderRadius: 8,
                  background: '#ef4444', border: 'none',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Evet, Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
