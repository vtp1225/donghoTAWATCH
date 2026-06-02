import { useState, useEffect } from 'react'
import { userService } from '../../services/userService'

export default function CustomerTable({ refreshKey, onDelete, onView }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function fetchUsers() {
      setLoading(true)
      setError('')
      try {
        const list = await userService.getAllUsers()
        if (!active) return
        setUsers(list || [])
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Không thể tải danh sách khách hàng.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchUsers()

    return () => { active = false }
  }, [refreshKey])

  return (
    <section className="section-container relative">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-background">Danh sách Khách Hàng</h3>
        <button onClick={() => window.location.reload()} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Làm mới">refresh</button>
      </div>

      {loading && (
        <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI...</div>
      )}

      {!loading && error && (
        <div className="py-8 text-center font-label-caps text-xs text-error tracking-widest">{error}</div>
      )}

      {!loading && !error && (
        <div className="w-full overflow-hidden border border-outline-variant/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                {['Tên', 'Email', 'Số điện thoại', 'Vai trò', 'Tham gia', 'Hành động'].map((h, i) => (
                  <th key={i} className="px-6 py-4 font-label-caps text-[10px] tracking-widest text-on-surface-variant/75 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">KHÔNG CÓ KHÁCH HÀNG</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="group hover:bg-surface-container-high transition-all duration-300">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-headline-sm text-sm text-on-background">{u.fullName || u.name || '—'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5"><span className="font-body-md text-sm text-on-surface-variant">{u.email || '—'}</span></td>
                  <td className="px-6 py-5"><span className="font-body-md text-sm text-on-surface-variant">{u.phone || '—'}</span></td>
                  <td className="px-6 py-5"><span className="font-label-caps text-xs tracking-widest text-on-surface-variant/75">{u.role || 'CUSTOMER'}</span></td>
                  <td className="px-6 py-5"><span className="font-body-md text-sm text-on-surface-variant">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}</span></td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => onView?.(u)} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Xem">visibility</button>
                      <button onClick={() => onDelete?.(u)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" title="Xoá">delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
