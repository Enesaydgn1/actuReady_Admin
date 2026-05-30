import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { QuizAttempt } from '@/lib/supabase/types'

type Row = QuizAttempt

export default function QuestionsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
      setRows((data ?? []) as Row[])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = rows.filter(r => {
    const matchSearch =
      r.topic.toLowerCase().includes(search.toLowerCase()) ||
      r.question_text.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'correct' ? r.is_correct === true :
      r.is_correct === false
    return matchSearch && matchFilter
  })

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const correctCount = rows.filter(r => r.is_correct === true).length
  const wrongCount = rows.filter(r => r.is_correct === false).length
  const accuracy = rows.length ? Math.round((correctCount / rows.length) * 100) : 0

  const tdStyle: React.CSSProperties = {
    padding: '0.65rem 0.9rem', borderBottom: '1px solid #1e293b',
    fontSize: 12.5, color: '#cbd5e1', verticalAlign: 'middle',
  }
  const thStyle: React.CSSProperties = {
    padding: '0.6rem 0.9rem', textAlign: 'left', fontSize: 11, fontWeight: 600,
    color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #334155',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Quiz Denemeleri</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
          <span style={{ color: '#22c55e' }}>✓ {correctCount} doğru</span>
          <span style={{ color: '#ef4444' }}>✗ {wrongCount} yanlış</span>
          <span style={{ color: '#f59e0b' }}>%{accuracy} başarı</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          placeholder="Konu veya soru ara..."
          style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: 8,
            padding: '0.55rem 0.9rem', color: '#f1f5f9', fontSize: 13,
            width: 260, outline: 'none',
          }}
        />
        {(['all', 'correct', 'wrong'] as const).map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(0) }}
            style={{
              padding: '0.5rem 0.9rem', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              border: `1px solid ${filter === f ? '#f59e0b' : '#334155'}`,
              background: filter === f ? 'rgba(245,158,11,0.1)' : 'transparent',
              color: filter === f ? '#f59e0b' : '#64748b', fontWeight: 600,
            }}
          >
            {f === 'all' ? 'Tümü' : f === 'correct' ? 'Doğrular' : 'Yanlışlar'}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>
          {filtered.length} sonuç
        </span>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Yükleniyor...</p>
      ) : (
        <>
          <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Konu</th>
                  <th style={{ ...thStyle, maxWidth: 320 }}>Soru</th>
                  <th style={thStyle}>Doğru Cevap</th>
                  <th style={thStyle}>Kullanıcı Cevabı</th>
                  <th style={thStyle}>Sonuç</th>
                  <th style={thStyle}>Süre (sn)</th>
                  <th style={thStyle}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#475569', padding: '2rem' }}>
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : paged.map(r => (
                  <tr key={r.id}>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                        background: '#334155', color: '#94a3b8', whiteSpace: 'nowrap',
                      }}>
                        {r.topic}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 320 }}>
                      <div style={{
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', maxWidth: 300, color: '#94a3b8',
                      }} title={r.question_text}>
                        {r.question_text}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: '#22c55e' }}>{r.correct_answer}</td>
                    <td style={{ ...tdStyle, color: r.is_correct ? '#22c55e' : '#ef4444' }}>
                      {r.user_answer ?? '—'}
                    </td>
                    <td style={tdStyle}>
                      {r.is_correct === null ? (
                        <span style={{ color: '#475569' }}>—</span>
                      ) : r.is_correct ? (
                        <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: '#475569' }}>{r.time_to_answer_sec ?? '—'}</td>
                    <td style={{ ...tdStyle, color: '#475569', whiteSpace: 'nowrap', fontSize: 11 }}>
                      {new Date(r.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={pageBtnStyle(page === 0)}
              >← Önceki</button>
              <span style={{ padding: '0.45rem 0.75rem', fontSize: 12, color: '#64748b' }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                style={pageBtnStyle(page === totalPages - 1)}
              >Sonraki →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '0.45rem 0.9rem', borderRadius: 8, fontSize: 12, cursor: disabled ? 'default' : 'pointer',
    background: 'transparent', border: '1px solid #334155',
    color: disabled ? '#334155' : '#94a3b8',
  }
}
