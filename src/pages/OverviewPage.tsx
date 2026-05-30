import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

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

const CARD_STYLE: React.CSSProperties = {
  background: '#1e293b', border: '1px solid #334155', borderRadius: 12,
  padding: '1.25rem', flex: 1, minWidth: 160,
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

  if (loading) return <PageShell title="Genel Bakış"><p style={{ color: '#64748b' }}>Yükleniyor...</p></PageShell>
  if (!stats) return null

  return (
    <PageShell title="Genel Bakış">
      {/* Metric cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <StatCard label="Toplam Kullanıcı" value={stats.totalUsers} icon="👥" color="#3b82f6" />
        <StatCard label="Onboarding Tamamlayan" value={stats.onboardedCount} icon="✅" color="#22c55e" />
        <StatCard label="Admin Sayısı" value={stats.adminCount} icon="🛡️" color="#f59e0b" />
        <StatCard label="Toplam Quiz Denemesi" value={stats.totalQuizAttempts} icon="❓" color="#8b5cf6" />
        <StatCard label="Doğru Cevap" value={stats.correctAnswers} icon="🎯" color="#22c55e" />
        <StatCard label="Genel Başarı %" value={`${stats.accuracyPct}%`} icon="📈" color="#06b6d4" />
        <StatCard label="Toplam XP" value={stats.totalXp.toLocaleString()} icon="⚡" color="#f59e0b" />
      </div>

      {/* Exam type distribution */}
      <div style={{ ...CARD_STYLE, flex: 'none', maxWidth: 460 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Sınav Türü Dağılımı
        </h3>
        {stats.examTypeDist.length === 0 ? (
          <p style={{ color: '#475569', fontSize: 13 }}>Veri yok</p>
        ) : (
          stats.examTypeDist.map(({ exam_type, count }) => (
            <div key={exam_type} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{exam_type}</span>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{count} kullanıcı</span>
              </div>
              <div style={{ height: 6, background: '#334155', borderRadius: 4 }}>
                <div style={{
                  height: '100%', borderRadius: 4, background: '#f59e0b',
                  width: `${Math.round((count / stats.totalUsers) * 100)}%`,
                  transition: 'width 0.6s',
                }} />
              </div>
            </div>
          ))
        )}
      </div>
    </PageShell>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div style={{ ...CARD_STYLE, minWidth: 160 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, marginBottom: 12,
        background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>{title}</h1>
      {children}
    </div>
  )
}
