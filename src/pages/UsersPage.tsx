import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UserProfile, QuizAttempt } from '@/lib/supabase/types'
import { Search, ShieldCheck, Trash2, Loader2, Eye, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { TABLE_WRAP, TABLE_WRAP_STYLE, TH, TH_BORDER_STYLE, TD, TD_BORDER_STYLE, TR_HOVER } from '@/components/ui/table'

type Row = UserProfile & { email?: string }

const EXAM_LABELS: Record<string, string> = {
  LEVEL_1: 'Aktüer 1', LEVEL_2: 'Aktüer 2', LEVEL_3: 'Aktüer 3',
  LEVEL_4: 'Aktüer 4', SEGEM_TPYS: 'SEGEM/TPYS',
}

interface UserDetail {
  totalAttempts: number
  correctAttempts: number
  totalStudyMinutes: number
  xpTotal: number
  recentAttempts: QuizAttempt[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null)
  const [detailUser, setDetailUser] = useState<Row | null>(null)
  const [detail, setDetail] = useState<UserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const showToast = (msg: string, ok = true) => setToast({ msg, ok })

  const openDetail = async (row: Row) => {
    setDetailUser(row)
    setDetail(null)
    setDetailLoading(true)
    const month = new Date().toISOString().slice(0, 7)

    const [totalRes, correctRes, recentRes, studyRes, xpRes] = await Promise.all([
      supabase.from('quiz_attempts').select('*', { count: 'exact', head: true }).eq('user_id', row.user_id),
      supabase.from('quiz_attempts').select('*', { count: 'exact', head: true }).eq('user_id', row.user_id).eq('is_correct', true),
      supabase.from('quiz_attempts').select('*').eq('user_id', row.user_id).order('created_at', { ascending: false }).limit(10),
      supabase.from('progress_logs').select('time_spent_min').eq('user_id', row.user_id).limit(500),
      supabase.from('monthly_leaderboard').select('xp_total').eq('user_id', row.user_id).eq('month', month).maybeSingle(),
    ])

    const studyMinutes = ((studyRes.data ?? []) as { time_spent_min: number }[])
      .reduce((sum, r) => sum + (r.time_spent_min ?? 0), 0)

    setDetail({
      totalAttempts: totalRes.count ?? 0,
      correctAttempts: correctRes.count ?? 0,
      totalStudyMinutes: studyMinutes,
      xpTotal: (xpRes.data as { xp_total: number } | null)?.xp_total ?? 0,
      recentAttempts: (recentRes.data ?? []) as QuizAttempt[],
    })
    setDetailLoading(false)
  }

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
    setUsers((data ?? []) as Row[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleAdmin = async (row: Row) => {
    const newVal = !row.is_admin
    const { error } = await supabase.from('user_profiles').update({ is_admin: newVal } as never).eq('id', row.id)
    if (error) { showToast('Güncelleme başarısız.', false); return }
    setUsers(prev => prev.map(u => u.id === row.id ? { ...u, is_admin: newVal } : u))
    showToast(`${row.full_name} ${newVal ? 'admin yapıldı' : 'admin yetkisi alındı'}.`)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const { error } = await supabase.from('user_profiles').delete().eq('id', deleteTarget.id)
    if (error) { showToast('Silme başarısız.', false); setDeleteTarget(null); return }
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
    showToast(`${deleteTarget.full_name} silindi.`)
    setDeleteTarget(null)
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (u.full_name ?? '').toLowerCase().includes(q) || (u.exam_type ?? '').toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader
        title="Kullanıcı Yönetimi"
        count={users.length}
        subtitle="Kayıtlı kullanıcıları yönetin ve admin yetkilerini düzenleyin"
      />

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="İsim veya sınav türü..."
          className="w-full rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.12)' }}
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-600 text-sm py-8">
          <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <div className={TABLE_WRAP} style={TABLE_WRAP_STYLE}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={TH_BORDER_STYLE}>
                  <th className={TH}>Kullanıcı</th>
                  <th className={TH}>Sınav Türü</th>
                  <th className={TH}>Onboarding</th>
                  <th className={TH}>Yetki</th>
                  <th className={TH}>Kayıt</th>
                  <th className={TH}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-600">
                      Kullanıcı bulunamadı.
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className={TR_HOVER} style={TD_BORDER_STYLE}>
                    <td className={TD}>
                      <p className="font-semibold text-slate-100">{u.full_name}</p>
                      <p className="text-xs text-slate-600 mt-0.5 font-mono">{u.user_id.slice(0, 8)}…</p>
                    </td>
                    <td className={TD}><Badge>{EXAM_LABELS[u.exam_type] ?? u.exam_type}</Badge></td>
                    <td className={TD}>
                      <Badge color={u.onboarding_completed ? 'green' : 'red'}>
                        {u.onboarding_completed ? 'Tamamlandı' : 'Eksik'}
                      </Badge>
                    </td>
                    <td className={TD}>
                      <button
                        onClick={() => toggleAdmin(u)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
                        style={u.is_admin ? {
                          background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.25)',
                        } : {
                          background: 'rgba(255,255,255,0.04)', color: '#64748b', borderColor: 'rgba(148,163,184,0.12)',
                        }}
                      >
                        {u.is_admin && <ShieldCheck className="w-3.5 h-3.5" />}
                        {u.is_admin ? 'Admin' : 'Kullanıcı'}
                      </button>
                    </td>
                    <td className={`${TD} text-xs text-slate-600`}>
                      {new Date(u.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className={TD}>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openDetail(u)}>
                          <Eye className="w-3.5 h-3.5" /> Detay
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(u)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Kullanıcıyı Sil"
          message={`"${deleteTarget.full_name}" adlı kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {detailUser && (
        <Modal title={`${detailUser.full_name} — Aktivite`} onClose={() => setDetailUser(null)} maxWidth="max-w-xl">
          {detailLoading || !detail ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm py-6 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-xl py-3 px-2 text-center" style={{ background: 'rgba(45,212,170,0.08)', border: '1px solid rgba(45,212,170,0.2)' }}>
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1" style={{ color: '#2DD4AA' }} />
                  <div className="text-lg font-bold text-slate-100">{detail.correctAttempts}</div>
                  <div className="text-[0.65rem] text-slate-500">Doğru</div>
                </div>
                <div className="rounded-xl py-3 px-2 text-center" style={{ background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.2)' }}>
                  <XCircle className="w-4 h-4 mx-auto mb-1" style={{ color: '#E05C5C' }} />
                  <div className="text-lg font-bold text-slate-100">{detail.totalAttempts - detail.correctAttempts}</div>
                  <div className="text-[0.65rem] text-slate-500">Yanlış</div>
                </div>
                <div className="rounded-xl py-3 px-2 text-center" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: '#60A5FA' }} />
                  <div className="text-lg font-bold text-slate-100">{detail.totalStudyMinutes}</div>
                  <div className="text-[0.65rem] text-slate-500">Dakika</div>
                </div>
                <div className="rounded-xl py-3 px-2 text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Zap className="w-4 h-4 mx-auto mb-1" style={{ color: '#f59e0b' }} />
                  <div className="text-lg font-bold text-slate-100">{detail.xpTotal}</div>
                  <div className="text-[0.65rem] text-slate-500">XP (bu ay)</div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Son Çözülen Sorular ({detail.totalAttempts} toplam)
                </p>
                {detail.recentAttempts.length === 0 ? (
                  <p className="text-sm text-slate-600 py-4 text-center">Henüz quiz çözmemiş.</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                    {detail.recentAttempts.map(a => (
                      <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {a.is_correct ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#2DD4AA' }} />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#E05C5C' }} />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-300 truncate">{a.question_text}</p>
                          <p className="text-[0.65rem] text-slate-600">{a.topic} · {new Date(a.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}

      {toast && <Toast message={toast.msg} ok={toast.ok} onDismiss={() => setToast(null)} />}
    </div>
  )
}
