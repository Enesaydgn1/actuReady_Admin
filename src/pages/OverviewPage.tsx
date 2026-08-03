import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Users, CheckCircle2, ShieldCheck, BookOpenCheck,
  Target, TrendingUp, Zap, Loader2, BookOpen, HelpCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  ResponsiveContainer,
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { format, subDays, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'

// ── Constants ────────────────────────────────────────────────────────────────

const EXAM_LABELS: Record<string, string> = {
  LEVEL_1: 'Aktüer 1',
  LEVEL_2: 'Aktüer 2',
  LEVEL_3: 'Aktüer 3',
  LEVEL_4: 'Aktüer 4',
  SEGEM_TPYS: 'SEGEM/TPYS',
}

const CHART_COLORS = ['#c2445a', '#60a5fa', '#fbbf24', '#4ade80', '#a78bfa', '#22d3ee']
const GRID_STROKE    = 'rgba(255,255,255,0.04)'
const AXIS_STROKE    = '#334155'
const AXIS_TICK      = '#475569'
const CARD_STYLE     = {
  background: '#131d33',
  border: '1px solid rgba(148,163,184,0.08)',
  boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
  borderRadius: '0.875rem',
  padding: '1.25rem',
}

const ICON_COLORS: Record<string, { bg: string; color: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa' },
  green:  { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80' },
  amber:  { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  violet: { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa' },
  cyan:   { bg: 'rgba(6,182,212,0.12)',   color: '#22d3ee' },
  rose:   { bg: 'rgba(194,68,90,0.12)',   color: '#c2445a' },
}

// ── Types ────────────────────────────────────────────────────────────────────

interface DayPoint  { date: string; quiz: number; dogru: number }
interface RegPoint  { date: string; kayit: number }
interface ExamPoint { name: string; value: number }
interface SubjPoint { subject: string; oran: number; toplam: number }

interface Stats {
  totalUsers: number
  adminCount: number
  onboardedCount: number
  totalQuizAttempts: number
  correctAnswers: number
  accuracyPct: number
  totalXp: number
  totalTopics: number
  topicsWithContent: number
  totalQuestions: number
  daily: DayPoint[]
  registration: RegPoint[]
  examDist: ExamPoint[]
  subjectAcc: SubjPoint[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) =>
    format(subDays(new Date(), n - 1 - i), 'yyyy-MM-dd')
  )
}

function shortDate(iso: string) {
  return format(parseISO(iso), 'd MMM', { locale: tr })
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, colorKey }: {
  label: string; value: string | number; icon: React.ElementType; colorKey: keyof typeof ICON_COLORS
}) {
  const c = ICON_COLORS[colorKey]
  return (
    <div style={CARD_STYLE} className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: c.bg }}>
        <Icon className="w-5 h-5" style={{ color: c.color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">{label}</p>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div style={CARD_STYLE}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

const CustomTooltipStyle: React.CSSProperties = {
  background: '#0d1526',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: '0.5rem',
  fontSize: '0.78rem',
  color: '#cbd5e1',
  padding: '0.5rem 0.75rem',
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const DAYS = 14
      const since = subDays(new Date(), DAYS).toISOString()

      const [profilesRes, attemptsRes, attemptsFullRes, xpRes, topicsRes, topicsContentRes, questionsRes] = await Promise.all([
        supabase.from('user_profiles').select('is_admin, onboarding_completed, exam_type, created_at'),
        supabase.from('quiz_attempts').select('is_correct'),
        supabase.from('quiz_attempts').select('is_correct, subject, created_at').gte('created_at', since),
        supabase.from('xp_events').select('xp_amount'),
        supabase.from('topic_content').select('*', { count: 'exact', head: true }),
        supabase.from('topic_content').select('*', { count: 'exact', head: true }).not('content_markdown', 'is', null).neq('content_markdown', ''),
        supabase.from('question_bank').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ])

      type PRow = { is_admin: boolean; onboarding_completed: boolean; exam_type: string; created_at: string }
      type ARow = { is_correct: boolean | null }
      type AFRow = { is_correct: boolean | null; subject: string | null; created_at: string }
      type XRow  = { xp_amount: number }

      const profiles    = (profilesRes.data   ?? []) as PRow[]
      const attempts    = (attemptsRes.data    ?? []) as ARow[]
      const recent      = (attemptsFullRes.data ?? []) as AFRow[]
      const xpEvents    = (xpRes.data          ?? []) as XRow[]

      const correct     = attempts.filter(a => a.is_correct === true).length
      const totalXp     = xpEvents.reduce((s, e) => s + (e.xp_amount ?? 0), 0)

      // Exam type distribution
      const examMap: Record<string, number> = {}
      for (const p of profiles) {
        if (p.exam_type) examMap[p.exam_type] = (examMap[p.exam_type] ?? 0) + 1
      }
      const examDist: ExamPoint[] = Object.entries(examMap).map(([k, v]) => ({
        name: EXAM_LABELS[k] ?? k,
        value: v,
      }))

      // Daily quiz activity (last 14 days)
      const days = buildDays(DAYS)
      const dailyQuiz: Record<string, { total: number; correct: number }> = {}
      for (const d of days) dailyQuiz[d] = { total: 0, correct: 0 }
      for (const a of recent) {
        const d = a.created_at.slice(0, 10)
        if (dailyQuiz[d]) {
          dailyQuiz[d].total += 1
          if (a.is_correct) dailyQuiz[d].correct += 1
        }
      }
      const daily: DayPoint[] = days.map(d => ({
        date: shortDate(d),
        quiz: dailyQuiz[d].total,
        dogru: dailyQuiz[d].correct,
      }))

      // Registration trend (last 14 days)
      const regMap: Record<string, number> = {}
      for (const d of days) regMap[d] = 0
      for (const p of profiles) {
        const d = p.created_at?.slice(0, 10)
        if (d && regMap[d] !== undefined) regMap[d] += 1
      }
      const registration: RegPoint[] = days.map(d => ({
        date: shortDate(d),
        kayit: regMap[d],
      }))

      // Subject accuracy
      const subjMap: Record<string, { total: number; correct: number }> = {}
      for (const a of recent) {
        const s = a.subject ?? 'bilinmeyen'
        if (!subjMap[s]) subjMap[s] = { total: 0, correct: 0 }
        subjMap[s].total += 1
        if (a.is_correct) subjMap[s].correct += 1
      }
      const subjectAcc: SubjPoint[] = Object.entries(subjMap)
        .filter(([, v]) => v.total >= 3)
        .map(([k, v]) => ({
          subject: k.replace(/-/g, ' '),
          oran: Math.round((v.correct / v.total) * 100),
          toplam: v.total,
        }))
        .sort((a, b) => b.toplam - a.toplam)
        .slice(0, 8)

      setStats({
        totalUsers: profiles.length,
        adminCount: profiles.filter(p => p.is_admin).length,
        onboardedCount: profiles.filter(p => p.onboarding_completed).length,
        totalQuizAttempts: attempts.length,
        correctAnswers: correct,
        accuracyPct: attempts.length ? Math.round((correct / attempts.length) * 100) : 0,
        totalXp,
        totalTopics: topicsRes.count ?? 0,
        topicsWithContent: topicsContentRes.count ?? 0,
        totalQuestions: questionsRes.count ?? 0,
        daily,
        registration,
        examDist,
        subjectAcc,
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

  const noChartData = stats.daily.every(d => d.quiz === 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Genel Bakış" subtitle="Platform istatistikleri ve kullanım özeti" />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Toplam Kullanıcı"      value={stats.totalUsers}                      icon={Users}         colorKey="blue"   />
        <StatCard label="Onboarding Tamamlayan" value={stats.onboardedCount}                  icon={CheckCircle2}  colorKey="green"  />
        <StatCard label="Toplam Quiz"           value={stats.totalQuizAttempts.toLocaleString('tr-TR')} icon={BookOpenCheck} colorKey="violet" />
        <StatCard label="Toplam XP"             value={stats.totalXp.toLocaleString('tr-TR')} icon={Zap}           colorKey="amber"  />
        <StatCard label="Admin Sayısı"          value={stats.adminCount}                      icon={ShieldCheck}   colorKey="rose"   />
        <StatCard label="Doğru Cevap"           value={stats.correctAnswers.toLocaleString('tr-TR')} icon={Target} colorKey="green"  />
        <StatCard label="Genel Başarı"          value={`%${stats.accuracyPct}`}               icon={TrendingUp}    colorKey="cyan"   />
        <StatCard label="Konu / İçerikli"       value={`${stats.topicsWithContent} / ${stats.totalTopics}`} icon={BookOpen}  colorKey="cyan"   />
        <StatCard label="Aktif Soru"            value={stats.totalQuestions.toLocaleString('tr-TR')} icon={HelpCircle} colorKey="violet" />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Quiz Aktivitesi */}
        <ChartCard title="Quiz Aktivitesi" subtitle="Son 14 gün — çözülen ve doğru cevap sayısı">
          {noChartData ? (
            <div className="h-52 flex items-center justify-center text-sm text-slate-600">
              Henüz yeterli veri yok.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.daily} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gQuiz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c2445a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c2445a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDogru" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_STROKE} />
                <XAxis dataKey="date" stroke={AXIS_STROKE} tick={{ fill: AXIS_TICK, fontSize: 11 }} />
                <YAxis stroke={AXIS_STROKE} tick={{ fill: AXIS_TICK, fontSize: 11 }} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 8 }} />
                <Area type="monotone" dataKey="quiz"  name="Toplam" stroke="#c2445a" fill="url(#gQuiz)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="dogru" name="Doğru"  stroke="#4ade80" fill="url(#gDogru)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Sınav Türü Dağılımı */}
        <ChartCard title="Sınav Türü Dağılımı" subtitle="Kullanıcıların seçtiği sınav türleri">
          {stats.examDist.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-slate-600">
              Henüz veri yok.
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.examDist}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stats.examDist.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CustomTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {stats.examDist.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-xs text-slate-400 truncate">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-300 flex-shrink-0">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Konu Başarı Oranı */}
        <ChartCard title="Konu Başarı Oranı" subtitle="Son 14 gün — en az 3 denemesi olan konular">
          {stats.subjectAcc.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-slate-600">
              Henüz yeterli quiz verisi yok.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, stats.subjectAcc.length * 36)}>
              <BarChart
                data={stats.subjectAcc}
                layout="vertical"
                margin={{ top: 0, right: 32, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `%${v}`}
                  stroke={AXIS_STROKE} tick={{ fill: AXIS_TICK, fontSize: 11 }} />
                <YAxis type="category" dataKey="subject" width={110}
                  stroke={AXIS_STROKE} tick={{ fill: AXIS_TICK, fontSize: 10 }} />
                <Tooltip
                  contentStyle={CustomTooltipStyle}
                  formatter={(v) => [`%${v}`, 'Başarı']}
                />
                <Bar dataKey="oran" name="Başarı %" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {stats.subjectAcc.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.oran >= 70 ? '#4ade80' : d.oran >= 50 ? '#fbbf24' : '#c2445a'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Kullanıcı Kayıt Trendi */}
        <ChartCard title="Kullanıcı Kayıt Trendi" subtitle="Son 14 gün — günlük yeni kayıt sayısı">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.registration} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} />
              <XAxis dataKey="date" stroke={AXIS_STROKE} tick={{ fill: AXIS_TICK, fontSize: 11 }} />
              <YAxis stroke={AXIS_STROKE} tick={{ fill: AXIS_TICK, fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={CustomTooltipStyle} />
              <Line
                type="monotone" dataKey="kayit" name="Yeni Kayıt"
                stroke="#60a5fa" strokeWidth={2}
                dot={{ r: 3, fill: '#60a5fa', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
