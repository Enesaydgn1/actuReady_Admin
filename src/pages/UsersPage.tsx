import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/supabase/types'

type Row = UserProfile & { email?: string }

const EXAM_LABELS: Record<string, string> = {
  LEVEL_1: 'Level 1', LEVEL_2: 'Level 2', LEVEL_3: 'Level 3',
  LEVEL_4: 'Level 4', SEGEM_TPYS: 'SEGEM/TPYS',
}

export default function UsersPage() {
  const [users, setUsers] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers((data ?? []) as Row[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleAdmin = async (row: Row) => {
    const newVal = !row.is_admin
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_admin: newVal } as never)
      .eq('id', row.id)
    if (error) { showToast('Güncelleme başarısız.', false); return }
    setUsers(prev => prev.map(u => u.id === row.id ? { ...u, is_admin: newVal } : u))
    showToast(`${row.full_name} ${newVal ? 'admin yapıldı' : 'admin yetkisi alındı'}.`)
  }

  const deleteUser = async (row: Row) => {
    if (!confirm(`"${row.full_name}" kullanıcısını silmek istediğinize emin misiniz?`)) return
    const { error } = await supabase.from('user_profiles').delete().eq('id', row.id)
    if (error) { showToast('Silme başarısız.', false); return }
    setUsers(prev => prev.filter(u => u.id !== row.id))
    showToast(`${row.full_name} silindi.`)
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.exam_type.toLowerCase().includes(search.toLowerCase())
  )

  const tdStyle: React.CSSProperties = {
    padding: '0.75rem 1rem', borderBottom: '1px solid #1e293b',
    fontSize: 13, color: '#cbd5e1', verticalAlign: 'middle',
  }
  const thStyle: React.CSSProperties = {
    padding: '0.65rem 1rem', textAlign: 'left', fontSize: 11, fontWeight: 600,
    color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #334155',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Kullanıcı Yönetimi</h1>
        <span style={{ fontSize: 13, color: '#64748b' }}>{users.length} kullanıcı</span>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="İsim veya sınav türü ara..."
        style={{
          background: '#1e293b', border: '1px solid #334155', borderRadius: 8,
          padding: '0.6rem 1rem', color: '#f1f5f9', fontSize: 13,
          width: 280, marginBottom: 20, outline: 'none',
        }}
      />

      {loading ? (
        <p style={{ color: '#64748b' }}>Yükleniyor...</p>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Ad Soyad</th>
                <th style={thStyle}>Sınav Türü</th>
                <th style={thStyle}>Onboarding</th>
                <th style={thStyle}>Admin</th>
                <th style={thStyle}>Kayıt Tarihi</th>
                <th style={thStyle}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#475569', padding: '2rem' }}>
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : filtered.map(u => (
                <tr key={u.id} style={{ transition: 'background 0.1s' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{u.full_name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{u.user_id.slice(0, 8)}…</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      background: '#334155', color: '#94a3b8',
                    }}>
                      {EXAM_LABELS[u.exam_type] ?? u.exam_type}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: u.onboarding_completed ? '#22c55e' : '#ef4444', fontSize: 13 }}>
                      {u.onboarding_completed ? '✓ Tamamlandı' : '✗ Eksik'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => toggleAdmin(u)}
                      style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        cursor: 'pointer', border: 'none',
                        background: u.is_admin ? 'rgba(245,158,11,0.15)' : '#334155',
                        color: u.is_admin ? '#f59e0b' : '#64748b',
                      }}
                    >
                      {u.is_admin ? '🛡️ Admin' : 'Kullanıcı'}
                    </button>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: '#475569' }}>
                    {new Date(u.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => deleteUser(u)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 12,
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#ef4444', cursor: 'pointer',
                      }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.ok ? '#166534' : '#7f1d1d',
          border: `1px solid ${toast.ok ? '#16a34a' : '#991b1b'}`,
          color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 10,
          fontSize: 13, fontWeight: 500,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
