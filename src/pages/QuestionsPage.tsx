import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { QuizAttempt } from '@/lib/supabase/types'
import { Search, CheckCircle2, XCircle, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TABLE_WRAP, TABLE_WRAP_STYLE, TH, TH_BORDER_STYLE, TD, TD_BORDER_STYLE, TR_HOVER } from '@/components/ui/table'

const PAGE_SIZE = 20
type FilterType = 'all' | 'correct' | 'wrong'

export default function QuestionsPage() {
  const [rows, setRows] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('quiz_attempts').select('*').order('created_at', { ascending: false }).limit(500)
      setRows((data ?? []) as QuizAttempt[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = rows.filter(r => {
    const matchSearch =
      r.topic.toLowerCase().includes(search.toLowerCase()) ||
      r.question_text.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true : filter === 'correct' ? r.is_correct === true : r.is_correct === false
    return matchSearch && matchFilter
  })

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const correctCount = rows.filter(r => r.is_correct === true).length
  const wrongCount = rows.filter(r => r.is_correct === false).length
  const accuracy = rows.length ? Math.round((correctCount / rows.length) * 100) : 0

  const CARD_STYLE = {
    background: '#131d33',
    border: '1px solid rgba(148,163,184,0.1)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  }

  return (
    <div>
      <PageHeader title="Quiz Kayıtları" subtitle="Kullanıcıların tüm quiz deneme geçmişi" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 max-w-md">
        {[
          { icon: CheckCircle2, val: correctCount, label: 'Doğru', color: '#4ade80' },
          { icon: XCircle,      val: wrongCount,   label: 'Yanlış', color: '#f87171' },
          { icon: Clock,        val: `%${accuracy}`, label: 'Başarı', color: '#fbbf24' },
        ].map(({ icon: Icon, val, label, color }) => (
          <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={CARD_STYLE}>
            <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
            <div>
              <p className="text-lg font-bold text-white leading-none">{val}</p>
              <p className="text-xs text-slate-600 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Konu veya soru ara..."
            className="rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 w-60"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.12)' }}
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'correct', 'wrong'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0) }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
              style={filter === f ? {
                background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.25)',
              } : {
                background: 'transparent', color: '#64748b', borderColor: 'rgba(148,163,184,0.12)',
              }}
            >
              {f === 'all' ? 'Tümü' : f === 'correct' ? 'Doğrular' : 'Yanlışlar'}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-600 ml-auto">{filtered.length} kayıt</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600 text-sm py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <>
          <div className={TABLE_WRAP} style={TABLE_WRAP_STYLE}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={TH_BORDER_STYLE}>
                    <th className={TH}>Konu</th>
                    <th className={TH}>Soru</th>
                    <th className={TH}>Doğru</th>
                    <th className={TH}>Cevap</th>
                    <th className={TH}>Sonuç</th>
                    <th className={TH}>Süre</th>
                    <th className={TH}>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-600">
                        Kayıt bulunamadı.
                      </td>
                    </tr>
                  ) : paged.map(r => (
                    <tr key={r.id} className={TR_HOVER} style={TD_BORDER_STYLE}>
                      <td className={TD}><Badge>{r.topic}</Badge></td>
                      <td className={`${TD} max-w-xs`}>
                        <p className="text-sm text-slate-500 truncate" title={r.question_text}>
                          {r.question_text}
                        </p>
                      </td>
                      <td className={`${TD} font-semibold`} style={{ color: '#4ade80' }}>{r.correct_answer}</td>
                      <td className={`${TD} font-semibold`} style={{ color: r.is_correct ? '#4ade80' : '#f87171' }}>
                        {r.user_answer ?? '—'}
                      </td>
                      <td className={TD}>
                        {r.is_correct === null ? (
                          <span className="text-slate-600">—</span>
                        ) : r.is_correct ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#4ade80' }} />
                        ) : (
                          <XCircle className="w-4 h-4" style={{ color: '#f87171' }} />
                        )}
                      </td>
                      <td className={`${TD} text-slate-500`}>
                        {r.time_to_answer_sec != null ? `${r.time_to_answer_sec}s` : '—'}
                      </td>
                      <td className={`${TD} text-slate-600 whitespace-nowrap text-xs`}>
                        {new Date(r.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button size="sm" variant="secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" /> Önceki
              </Button>
              <span className="text-xs text-slate-500 px-2">{page + 1} / {totalPages}</span>
              <Button size="sm" variant="secondary" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
                Sonraki <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
