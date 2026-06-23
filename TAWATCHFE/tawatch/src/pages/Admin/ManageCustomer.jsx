import { useState } from 'react'
import CustomerTable from '../../components/admin/CustomerTable'
import CustomerDetailModal from '../../components/admin/CustomerDetailModal'
import { userService } from '../../services/userService'
import useAuth from '../../hooks/useAuth'

export default function ManageCustomer() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [viewTarget, setViewTarget] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [newUser, setNewUser] = useState({ username: '', fullName: '', email: '', phone: '', password: '', role: 'CUSTOMER' })
  const [skipVerify, setSkipVerify] = useState(true)
  const { user: authUser } = useAuth()
  const isAdmin = authUser?.role === 'ADMIN'

  function handleSuccess() { setRefreshKey((k) => k + 1) }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await userService.deleteUser(deleteTarget.id)
      setDeleteTarget(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      alert(err?.message || 'Không thể xoá người dùng.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreateError('')
    if (!isAdmin) {
      setCreateError('Bạn cần quyền ADMIN để tạo user.')
      return
    }
    if (!newUser.email || !newUser.fullName) {
      setCreateError('Vui lòng nhập họ tên và email.')
      return
    }
    setCreating(true)
    try {
      const payload = {
        username: newUser.username || (newUser.email ? newUser.email.split('@')[0] : undefined),
        email: newUser.email,
        passwordHash: newUser.password || '',
        fullName: newUser.fullName,
        phone: newUser.phone,
        authProvider: 'LOCAL',
        role: newUser.role,
        isVerified: skipVerify === true,
      }
      await userService.addUser(payload)
      setCreateOpen(false)
      setNewUser({ username: '', fullName: '', email: '', phone: '', password: '', role: 'CUSTOMER' })
      setSkipVerify(true)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setCreateError(err?.message || 'Không thể tạo người dùng.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="ml-72 mt-20 p-gutter min-h-screen">
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">CUSTOMER MANAGEMENT</span>
            <h2 className="font-display-lg text-display-lg text-on-background">Quản lý Khách Hàng</h2>
          </div>
            <div className="flex items-center gap-3">
            <button disabled={!isAdmin} onClick={() => setCreateOpen(true)} title={!isAdmin ? 'Cần quyền ADMIN để tạo user' : ''} className={`px-6 py-3 border ${isAdmin ? 'border-primary text-primary hover:bg-primary hover:text-background' : 'border-outline-variant/20 text-on-surface-variant cursor-not-allowed'} font-label-caps text-xs tracking-[0.2em] uppercase transition-all duration-500 active:scale-95 flex items-center gap-2`}>
              <span className="material-symbols-outlined text-sm">add</span>
              Tạo user
            </button>
          </div>
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      <CustomerTable
        refreshKey={refreshKey}
        onDelete={setDeleteTarget}
        onView={(u) => setViewTarget(u)}
      />

      <footer className="mt-section-gap-desktop pb-8 opacity-20">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Customer Console · Admin</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2026 Horological</p>
        </div>
      </footer>

      {createOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
          <form onSubmit={handleCreate} className="relative bg-surface-container-low border border-outline-variant/20 p-8 max-w-lg w-full mx-4">
            <h3 className="font-headline-sm text-headline-sm mb-4">Tạo người dùng mới</h3>
            {createError && <p className="mb-3 font-body-md text-xs text-error">{createError}</p>}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Tên đăng nhập</label>
                <input value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Họ và tên</label>
                <input value={newUser.fullName} onChange={(e) => setNewUser((p) => ({ ...p, fullName: e.target.value }))} className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Email</label>
                <input value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Mật khẩu</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Số điện thoại</label>
                <input value={newUser.phone} onChange={(e) => setNewUser((p) => ({ ...p, phone: e.target.value }))} className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Vai trò</label>
                <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary">
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-6 py-2 border border-outline-variant/30 hover:border-primary hover:text-primary">Huỷ</button>
              <label className="flex items-center gap-3 mr-4 text-sm">
                <input type="checkbox" checked={skipVerify} onChange={(e) => setSkipVerify(e.target.checked)} className="accent-primary" />
                <span className="text-on-surface-variant/80">Bỏ qua xác thực (đánh dấu đã verify)</span>
              </label>
              <button type="submit" disabled={creating} className="px-6 py-2 bg-primary text-background font-label-caps text-xs tracking-widest disabled:opacity-50">{creating ? 'ĐANG TẠO...' : 'TẠO'}</button>
            </div>
          </form>
        </div>
      )}

      <CustomerDetailModal
        user={viewTarget}
        authUser={authUser}
        onClose={() => setViewTarget(null)}
        onUpdate={(updated) => {
          setViewTarget((prev) => prev ? { ...prev, ...updated } : prev)
          setRefreshKey((k) => k + 1)
        }}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 max-w-sm w-full mx-4">
            <p className="font-label-caps text-[10px] text-error tracking-widest mb-4 uppercase">Xác nhận xoá</p>
            <p className="font-headline-sm text-headline-sm text-on-background mb-2">{deleteTarget.fullName || deleteTarget.email}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60 mb-8">Hành động này sẽ xoá người dùng và dữ liệu liên quan. Không thể hoàn tác.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all">HUỶ</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 py-3 bg-error text-background font-label-caps text-xs tracking-widest hover:bg-error/80 transition-all disabled:opacity-50">{deleting ? 'ĐANG XOÁ...' : 'XOÁ'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
