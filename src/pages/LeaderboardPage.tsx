import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  Trophy, ChevronDown, ChevronUp, Search, Loader2,
  AlertTriangle, Calendar, User, Zap,
} from 'lucide-react'
import { format, parseISO, subHours } from 'date-fns'
import { tr } from 'date-fns/locale'

// ── Types ─────────────────────────────────────────────────────────────────

interface LeaderEntry {
  user_id: string
  display_name: string
  xp_total: number
  breakdown: { correct_answer: number; task_complete: number; topic_quiz_skip: number; topic_100_pct: number; exam_pass: number }
  last_activity: string | null
  event_count: number
  suspicious: boolean
}

interface XpEvent {
  id: string
  event_type: string
  xp_amount: number
  description: string | null
  created_at: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const EVENT_LABELS: Record<string, string> = {
  correct_answer:   'Doğru Cevap',
  task_complete:    'Görev Tamamlama',
  topic_quiz_skip:  'Konu Quiz Skoru',
  topic_100_pct:    'Konu %100',
  exam_pass:        'Sınav Geçme',
}

const EVENT_COLORS: Record<string, string> = {
  correct_answer:  '#60a5fa',
  task_complete:   '#4ade80',
  topic_quiz_skip: '#fbbf24',
  topic_100_pct:   '#a78bfa',
  exam_pass:       '#c2445a',
}

const MONTHS: { value: string; label: string }[] = (() => {
  const list = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = d.toISOString().slice(0, 7)
    const label = format(d, 'MMMM yyyy', { locale: tr })
    list.push({ value, label })
  }
  list.push({ value: 'all', label: 'Tüm Zamanlar' })
  return list
})()

const CARD = {
  background: '#131d33',
  border: '1px solid rgba(148,163,184,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
}

// ── Helpers ────────────────────────────────────────────────────────────────

function medalColor(rank: number) {
  if (rank === 1) return '#f59e0b'
  if (rank === 2) return '#94a3b8'
  if (rank === 3) return '#b45309'
  return '#334155'
}

function fmtDate(iso: string) {
  return format(parseISO(iso), 'd MMM yyyy HH:mm', { locale: tr })
}

// ── Sub-components ─────────────────────────────────────────────────────────

function XpBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[0.7rem] text-slate-500 w-8 text-right flex-shrink-0">{value}</span>
    </div>
  )
}

function EventTypeBadge({ type }: { type: string }) {
  const color = EVENT_COLORS[type] ?? '#64748b'
  const label = EVENT_LABELS[type] ?? type
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.68rem] font-semibold"
      style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}
    >
      {label}
    </span>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [month, setMonth] = useState(MONTHS[0].value)
  const [search, setSearch] = useState('')
  const [entries, setEntries] = useState<LeaderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [events, setEvents] = useState<XpEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setExpanded(null)

    let rows: { user_id: string; display_name: string; xp_total: number }[] = []

    if (month === 'all') {
      // Aggregate from xp_events
      const { data } = await supabase
        .from('xp_events')
        .select('user_id, xp_amount')
      if (data) {
        const map: Record<string, number> = {}
        for (const r of data as { user_id: string; xp_amount: number }[]) {
          map[r.user_id] = (map[r.user_id] ?? 0) + r.xp_amount
        }
        // Get display names
        const ids = Object.keys(map)
        if (ids.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('user_id, full_name')
            .in('user_id', ids)
          const nameMap: Record<string, string> = {}
          for (const p of (profiles ?? []) as { user_id: string; full_name: string }[]) {
            nameMap[p.user_id] = p.full_name
          }
          rows = ids.map(id => ({
            user_id: id,
            display_name: nameMap[id] ?? 'Bilinmeyen',
            xp_total: map[id],
          }))
        }
      }
    } else {
      const { data } = await supabase
        .from('monthly_leaderboard')
        .select('user_id, display_name, xp_total')
        .eq('month', month)
      rows = (data ?? []) as { user_id: string; display_name: string; xp_total: number }[]
    }

    // Sort desc
    rows.sort((a, b) => b.xp_total - a.xp_total)

    // For each user fetch event breakdown + suspicious check
    const cutoff = subHours(new Date(), 24).toISOString()
    const detailed: LeaderEntry[] = await Promise.all(
      rows.map(async (r) => {
        let query = supabase
          .from('xp_events')
          .select('event_type, xp_amount, created_at')
          .eq('user_id', r.user_id)
        if (month !== 'all') {
          query = query
            .gte('created_at', `${month}-01`)
            .lt('created_at', `${month}-31`)
        }
        const { data: evts } = await query
        const ev = (evts ?? []) as { event_type: string; xp_amount: number; created_at: string }[]

        const breakdown = { correct_answer: 0, task_complete: 0, topic_quiz_skip: 0, topic_100_pct: 0, exam_pass: 0 }
        let last: string | null = null
        for (const e of ev) {
          const k = e.event_type as keyof typeof breakdown
          if (k in breakdown) breakdown[k] += e.xp_amount
          if (!last || e.created_at > last) last = e.created_at
        }

        // Suspicious: >50 correct_answer events in last 24h OR >3 exam_pass events total
        const recentCorrect = ev.filter(e => e.event_type === 'correct_answer' && e.created_at >= cutoff).length
        const examPassCount = ev.filter(e => e.event_type === 'exam_pass').length
        const suspicious = recentCorrect > 50 || examPassCount > 3

        return { ...r, breakdown, last_activity: last, event_count: ev.length, suspicious }
      })
    )

    setEntries(detailed)
    setLoading(false)
  }, [month])

  useEffect(() => { load() }, [load])

  const toggleExpand = async (userId: string) => {
    if (expanded === userId) { setExpanded(null); return }
    setExpanded(userId)
    setEventsLoading(true)
    let query = supabase
      .from('xp_events')
      .select('id, event_type, xp_amount, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (month !== 'all') {
      query = query
        .gte('created_at', `${month}-01`)
        .lt('created_at', `${month}-31`)
    }
    const { data } = await query
    setEvents((data ?? []) as XpEvent[])
    setEventsLoading(false)
  }

  const filtered = entries.filter(e =>
    !search || e.display_name.toLowerCase().includes(search.toLowerCase())
  )

  const maxXp = entries[0]?.xp_total ?? 1

  return (
    <div className="space-y-5">
      <PageHeader
        title="XP Lider Tablosu"
        subtitle="Kullanıcı sıralaması ve XP kaynak denetimi"
        count={filtered.length}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kullanıcı ara..."
            className="pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-100 outline-none placeholder:text-slate-600 focus:border-slate-600 w-52"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="py-2 px-3 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-600"
          >
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-12 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-600 text-sm">Bu dönem için veri yok.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => {
            const rank = entries.indexOf(entry) + 1
            const isOpen = expanded === entry.user_id
            return (
              <div key={entry.user_id} style={CARD} className="rounded-xl overflow-hidden">
                {/* Main row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => toggleExpand(entry.user_id)}
                >
                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {rank <= 3
                      ? <Trophy className="w-5 h-5 mx-auto" style={{ color: medalColor(rank) }} />
                      : <span className="text-slate-500 text-sm font-bold">#{rank}</span>
                    }
                  </div>

                  {/* Avatar placeholder */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(194,68,90,0.15)', color: '#c2445a' }}
                  >
                    {entry.display_name.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Name + suspicious badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-100 truncate">{entry.display_name}</span>
                      {entry.suspicious && (
                        <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                          <AlertTriangle className="w-2.5 h-2.5" /> Şüpheli
                        </span>
                      )}
                    </div>
                    <p className="text-[0.7rem] text-slate-600 mt-0.5">
                      {entry.event_count} işlem
                      {entry.last_activity ? ` · Son: ${fmtDate(entry.last_activity)}` : ''}
                    </p>
                  </div>

                  {/* XP breakdown bars */}
                  <div className="hidden lg:flex flex-col gap-1 w-48 flex-shrink-0">
                    {Object.entries(entry.breakdown).filter(([, v]) => v > 0).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <span className="text-[0.62rem] text-slate-600 w-24 truncate flex-shrink-0">{EVENT_LABELS[k]}</span>
                        <XpBar value={v} max={entry.xp_total} color={EVENT_COLORS[k] ?? '#64748b'} />
                      </div>
                    ))}
                  </div>

                  {/* Total XP */}
                  <div className="text-right flex-shrink-0 w-24">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-lg font-bold text-white">{entry.xp_total.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(entry.xp_total / maxXp) * 100}%`, background: 'linear-gradient(90deg, #c2445a, #f59e0b)' }}
                      />
                    </div>
                  </div>

                  {/* Expand icon */}
                  <div className="flex-shrink-0 text-slate-600">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded: XP event log */}
                {isOpen && (
                  <div className="border-t border-white/[0.05] px-5 pb-4 pt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-3 h-3" /> XP Kayıt Detayı (Son 50)
                    </p>

                    {eventsLoading ? (
                      <div className="flex items-center gap-2 text-slate-500 text-xs py-4">
                        <Loader2 className="w-3 h-3 animate-spin" /> Yükleniyor...
                      </div>
                    ) : events.length === 0 ? (
                      <p className="text-slate-600 text-xs">Bu dönem için kayıt yok.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-600 border-b border-white/[0.04]">
                              <th className="text-left pb-2 pr-4 font-medium">Tarih</th>
                              <th className="text-left pb-2 pr-4 font-medium">Olay Türü</th>
                              <th className="text-left pb-2 pr-4 font-medium">Açıklama</th>
                              <th className="text-right pb-2 font-medium">XP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {events.map(ev => (
                              <tr key={ev.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                                <td className="py-2 pr-4 text-slate-500 whitespace-nowrap">{fmtDate(ev.created_at)}</td>
                                <td className="py-2 pr-4"><EventTypeBadge type={ev.event_type} /></td>
                                <td className="py-2 pr-4 text-slate-500 max-w-xs truncate">{ev.description ?? '—'}</td>
                                <td className="py-2 text-right font-bold" style={{ color: EVENT_COLORS[ev.event_type] ?? '#fff' }}>
                                  +{ev.xp_amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
