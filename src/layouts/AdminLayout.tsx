import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import {
  LayoutDashboard, Users, BookOpen, FileText, Calendar,
  ClipboardList, Settings, LogOut, Menu, ChevronRight, Sigma, Trophy,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

const BRAND = '#c2445a'

const navItems = [
  { to: '/dashboard',     label: 'Genel Bakış',     icon: LayoutDashboard },
  { to: '/kullanicilar',  label: 'Kullanıcılar',     icon: Users },
  { to: '/soru-bankasi',  label: 'Soru Bankası',     icon: BookOpen },
  { to: '/konu-icerigi',  label: 'Konu İçerikleri',  icon: FileText },
  { to: '/formul-kutuphanesi', label: 'Formül Kütüph.', icon: Sigma },
  { to: '/sinav-takvimi', label: 'Sınav Takvimi',    icon: Calendar },
  { to: '/quiz-kayitlar', label: 'Quiz Kayıtları',   icon: ClipboardList },
  { to: '/liderlik',      label: 'XP Lider Tablosu', icon: Trophy },
  { to: '/ayarlar',       label: 'Sistem Ayarları',  icon: Settings },
]

const SIDEBAR_BG     = '#0d1526'
const SIDEBAR_BORDER = 'rgba(148,163,184,0.08)'

// Logo ikonu — SVG'den sadece hexagon kısmı
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 78 78" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="m28 1.6h22l26.4 26.4v22l-26.4 26.4h-22l-26.4-26.4v-22z"
        fill="#1c1015" stroke="#8b1f35" strokeWidth="1.7" />
      <path d="m21.4 54.4l17.6-35.2 17.6 35.2" fillRule="evenodd"
        fill="none" stroke="#c2445a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <path d="m27.45 43.4h23.1" fillRule="evenodd"
        fill="none" stroke="#c2445a" strokeLinecap="round" strokeWidth="1.7" />
      <circle cx="39" cy="19.2" r="2.75" fill="#e87a92" />
    </svg>
  )
}

const SidebarLogo = () => (
  <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
    <LogoIcon className="w-9 h-9 flex-shrink-0" />
    <div>
      <p className="text-sm font-extrabold text-white leading-none tracking-tight">ActuReady</p>
      <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-[0.15em] mt-0.5">Admin</p>
    </div>
  </div>
)

function SidebarNav({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')
  const { settings } = useSiteSettings()
  return (
    <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
          style={isActive(to) ? {
            background: `rgba(194,68,90,0.12)`,
            color: BRAND,
            fontWeight: 600,
          } : {
            color: '#64748b',
            fontWeight: 500,
          }}
          onMouseEnter={e => { if (!isActive(to)) { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = '#cbd5e1' } }}
          onMouseLeave={e => { if (!isActive(to)) { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#64748b' } }}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{label}</span>
          {to === '/ayarlar' && settings.maintenance_mode && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#f87171' }}
              title="Bakım modu aktif"
            />
          )}
          {isActive(to) && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
        </Link>
      ))}
    </nav>
  )
}

function SidebarFooter({ email, onLogoutClick }: { email?: string; onLogoutClick: () => void }) {
  const initials = email?.slice(0, 2).toUpperCase() ?? 'A'
  return (
    <div className="px-2.5 py-3" style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
      <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: 'rgba(194,68,90,0.15)', color: BRAND }}
        >
          {initials}
        </div>
        <p className="text-xs text-slate-500 truncate flex-1">{email}</p>
      </div>
      <button
        onClick={onLogoutClick}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
        style={{ color: '#64748b' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(239,68,68,0.08)'; el.style.color = '#f87171' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#64748b' }}
      >
        <LogOut className="w-4 h-4" />
        Çıkış Yap
      </button>
    </div>
  )
}

export default function AdminLayout() {
  const { user } = useAuth()
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/giris')
  }

  const sidebarContent = (
    <>
      <SidebarLogo />
      <SidebarNav pathname={pathname} onLinkClick={() => setMobileSidebar(false)} />
      <SidebarFooter email={user?.email} onLogoutClick={() => setShowLogout(true)} />
    </>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f1e' }}>
      <aside className="w-56 fixed top-0 left-0 bottom-0 z-30 flex-col hidden lg:flex"
        style={{ background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}>
        {sidebarContent}
      </aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileSidebar(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <aside className="relative w-56 h-full flex flex-col"
            style={{ background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}
            onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-20"
          style={{ background: SIDEBAR_BG, borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
          <button onClick={() => setMobileSidebar(true)}
            className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded">
            <Menu className="w-5 h-5" />
          </button>
          <LogoIcon className="w-7 h-7" />
          <span className="text-sm font-bold text-white">ActuReady Admin</span>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {showLogout && (
        <Modal title="Oturumu Kapat" onClose={() => setShowLogout(false)} maxWidth="max-w-sm">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Admin panelden çıkış yapmak istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowLogout(false)}>Vazgeç</Button>
              <Button variant="danger" className="flex-1" onClick={handleSignOut}>Evet, Çıkış Yap</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
