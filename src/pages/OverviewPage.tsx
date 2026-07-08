import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Users, CheckCircle2, ShieldCheck, BookOpenCheck, Target, TrendingUp, Zap, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

const EXAM_LABELS: Record<string, string> = {
  LEVEL_1: 'Aktüer 1', LEVEL_2: 'Aktüer 2',
  LEVEL_3: 'Aktüer 3', LEVEL_4: 'Aktüer 4',
  SEGEM_TPYS: 'SEGEM/TPYS',
}

interface Stats {
  totalUsers: number
  adminCount: number
  onboardedCount: number
  totalQuizAttempts: number
  correctAnswers: number
  accuracyPct: number
  totalXp: number
  examTypeDist: { exam_type: string; count: number }[]
}

const ICON_COLORS: Record<string, { bg: string; color: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa' },
  green:  { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80' },
  amber:  { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  violet: { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa' },
  cyan:   { bg: 'rgba(6,182,212,0.12)',   color: '#22d3ee' },
}

function StatCard({ label, value, icon: Icon, colorKey }: {
  label: string; value: string | number; icon: React.ElementType; colorKey: keyof typeof ICON_COLORS
}) {
  const c = ICON_COLORS[colorKey]
  return (
    <div
      className="rounded-xl p-5 flex items-start gap-4"
      style={{
        background: '#131d33',
        border: '1px solid rgba(148,163,184,0.1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
        <Icon className="w-5 h-5" style={{ color: c.color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">{label}</p>
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [profilesRes, attemptsRes, xpRes] = await Promise.all([
        supabase.from('user_profiles').select('is_admin, onboarding_completed, exam_type'),
        supabase.from('quiz_attempts').select('is_correct'),
        supabase.from('xp_events').select('xp_amount'),
      ])
      type PRow = { is_admin: boolean; onboarding_completed: boolean; exam_type: string }
      type ARow = { is_correct: boolean | null }
      type XRow = { xp_amount: number }
      const profiles = (profilesRes.data ?? []) as PRow[]
      const attempts = (attemptsRes.data ?? []) as ARow[]
      const xpEvents = (xpRes.data ?? []) as XRow[]
      const correct = attempts.filter(a => a.is_correct === true).length
      const totalXp = xpEvents.reduce((s, e) => s + (e.xp_amount ?? 0), 0)
      const dist: Record<string, number> = {}
      for (const p of profiles) {
        if (p.exam_type) dist[p.exam_type] = (dist[p.exam_type] ?? 0) + 1
      }
      setStats({
        totalUsers: profiles.length,
        adminCount: profiles.filter(p => p.is_admin).length,
        onboardedCount: profiles.filter(p => p.onboarding_completed).length,
        totalQuizAttempts: attempts.length,
        correctAnswers: correct,
        accuracyPct: attempts.length ? Math.round((correct / attempts.length) * 100) : 0,
        totalXp,
        examTypeDist: Object.entries(dist).map(([exam_type, count]) => ({ exam_type, count })),
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-600 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
      </div>
    )
  }
  if (!stats) return null

  return (
    <div>
      <PageHeader title="Genel Bakış" subtitle="Platform istatistikleri ve kullanım özeti" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Toplam Kullanıcı"      value={stats.totalUsers}                icon={Users}         colorKey="blue" />
        <StatCard label="Onboarding Tamamlayan" value={stats.onboardedCount}            icon={CheckCircle2}  colorKey="green" />
        <StatCard label="Admin Sayısı"          value={stats.adminCount}               icon={ShieldCheck}   colorKey="amber" />
        <StatCard label="Toplam Quiz"           value={stats.totalQuizAttempts}        icon={BookOpenCheck} colorKey="violet" />
        <StatCard label="Doğru Cevap"           value={stats.correctAnswers}           icon={Target}        colorKey="green" />
        <StatCard label="Genel Başarı"          value={`%${stats.accuracyPct}`}        icon={TrendingUp}    colorKey="cyan" />
        <StatCard label="Toplam XP"             value={stats.totalXp.toLocaleString('tr-TR')} icon={Zap}  colorKey="amber" />
      </div>

      {/* Exam type distribution */}
      <div
        className="rounded-xl p-5 max-w-md"
        style={{
          background: '#131d33',
          border: '1px solid rgba(148,163,184,0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sınav Türü Dağılımı</h3>
        {stats.examTypeDist.length === 0 ? (
          <p className="text-sm text-slate-600">Henüz veri yok.</p>
        ) : (
          <div className="space-y-3">
            {stats.examTypeDist.map(({ exam_type, count }) => (
              <div key={exam_type}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-slate-300 font-medium">{EXAM_LABELS[exam_type] ?? exam_type}</span>
                  <span className="text-xs text-slate-600">{count} kullanıcı</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((count / stats.totalUsers) * 100)}%`,
                      background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
