import { useState, useEffect, useCallback } from 'react'
import { shipperService } from '../../services/shipperService'
import useAuth from '../../hooks/useAuth'

const EMPTY_FORM = {
  name: '',
  apiEndpoint: '',
  apiKey: '',
  isActive: true,
}

function ShipperModal({ open, shipper, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    if (open) {
      setError('')
      setShowKey(false)
      if (shipper) {
        setForm({
          name: shipper.name || '',
          apiEndpoint: shipper.apiEndpoint || '',
          apiKey: '',
          isActive: shipper.isActive ?? true,
        })
      } else {
        setForm(EMPTY_FORM)
      }
    }
  }, [open, shipper])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên đơn vị vận chuyển.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        apiEndpoint: form.apiEndpoint || null,
        isActive: form.isActive,
      }
      if (form.apiKey.trim()) payload.apiKey = form.apiKey
      if (shipper) {
        await shipperService.update(shipper.id, payload)
      } else {
        await shipperService.create(payload)
      }
      onSuccess()
      onClose()
    } catch (err) {
      setError(err?.message || 'Không thể lưu đơn vị vận chuyển.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-surface-container-low border border-outline-variant/20 p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <p className="font-label-caps text-[9px] tracking-[0.3em] text-primary mb-2 uppercase">
          {shipper ? 'Chỉnh sửa' : 'Thêm mới'}
        </p>
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">
          {shipper ? 'Cập nhật đơn vị vận chuyển' : 'Thêm đơn vị vận chuyển'}
        </h3>

        {error && (
          <p className="mb-4 font-body-md text-xs text-error">{error}</p>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
              Tên đơn vị *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary"
              placeholder="VD: Giao Hàng Nhanh, GHTK..."
            />
          </div>

          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
              API Endpoint
            </label>
            <input
              value={form.apiEndpoint}
              onChange={(e) => setForm((p) => ({ ...p, apiEndpoint: e.target.value }))}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary font-mono"
              placeholder="https://api.example.com/v2"
            />
          </div>

          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
              API Key {shipper && <span className="normal-case">(để trống nếu không đổi)</span>}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={form.apiKey}
                onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
                className="w-full border-b border-outline-variant/25 bg-transparent py-2 pr-8 font-body-md text-sm outline-none focus:border-primary font-mono"
                placeholder={shipper ? '••••••••••••' : 'Token xác thực API'}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-0 top-2 text-on-surface-variant/40 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {showKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="shipperIsActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="accent-primary"
            />
            <label htmlFor="shipperIsActive" className="font-body-md text-sm text-on-surface-variant">
              Đang hoạt động
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all"
          >
            HUỶ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-background font-label-caps text-xs tracking-widest hover:bg-primary/80 transition-all disabled:opacity-50"
          >
            {saving ? 'ĐANG LƯU...' : shipper ? 'CẬP NHẬT' : 'TẠO'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ManageShipper() {
  const { user: authUser } = useAuth()
  const isAdmin = authUser?.role === 'ADMIN'
  const [shippers, setShippers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await shipperService.getAll()
      setShippers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await shipperService.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      alert(err?.message || 'Không thể xoá đơn vị vận chuyển.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = shippers.filter((s) =>
    !search.trim() || s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="ml-72 mt-20 min-h-screen overflow-x-hidden" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">
              SHIPPER MANAGEMENT
            </span>
            <h2 className="font-display-lg text-display-lg text-on-background">Đơn Vị Vận Chuyển</h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setEditTarget(null); setModalOpen(true) }}
              className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm shipper
            </button>
          )}
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Tổng đơn vị', value: shippers.length, icon: 'local_shipping' },
          { label: 'Đang hoạt động', value: shippers.filter((s) => s.isActive).length, icon: 'check_circle' },
          { label: 'Tạm dừng', value: shippers.filter((s) => !s.isActive).length, icon: 'pause_circle' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="border border-outline-variant/15 bg-surface-container-low/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary/60 text-xl">{icon}</span>
              <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/50 uppercase">{label}</p>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-surface-container-highest animate-pulse rounded" />
            ) : (
              <p className="font-headline-md text-3xl text-on-background">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 border-b border-outline-variant/15 pb-4">
        <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên đơn vị vận chuyển..."
          className="flex-1 bg-transparent font-body-md text-sm text-on-background placeholder:text-on-surface-variant/40 outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-outline-variant/15 bg-surface-container-low/30">
        <div className="grid grid-cols-[2fr_3fr_1.5fr_auto] gap-4 px-6 py-3 border-b border-outline-variant/10">
          {['Tên', 'API Endpoint', 'Trạng thái', ''].map((col) => (
            <span key={col} className="font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/40 uppercase">
              {col}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="flex gap-1">
              {[0, 150, 300].map((d) => (
                <div key={d} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/20 mb-2 block">local_shipping</span>
            <p className="font-body-md text-sm text-on-surface-variant/40">
              {search ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có đơn vị vận chuyển nào'}
            </p>
          </div>
        ) : (
          filtered.map((shipper, idx) => (
            <div
              key={shipper.id}
              className={`grid grid-cols-[2fr_3fr_1.5fr_auto] gap-4 items-center px-6 py-4 hover:bg-surface-container/50 transition-colors ${
                idx !== filtered.length - 1 ? 'border-b border-outline-variant/10' : ''
              }`}
            >
              <div>
                <p className="font-body-md text-sm text-on-background font-medium">{shipper.name}</p>
                <p className="text-[10px] text-on-surface-variant/40 mt-0.5 font-label-caps tracking-wider">
                  ID #{shipper.id}
                </p>
              </div>

              <div>
                {shipper.apiEndpoint ? (
                  <p className="font-mono text-xs text-on-surface-variant/70 truncate">{shipper.apiEndpoint}</p>
                ) : (
                  <span className="text-xs text-on-surface-variant/30">—</span>
                )}
              </div>

              <div>
                <span
                  className={`px-2 py-0.5 text-[9px] font-label-caps tracking-wider ${
                    shipper.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-outline-variant/10 text-on-surface-variant/40 border border-outline-variant/20'
                  }`}
                >
                  {shipper.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => { setEditTarget(shipper); setModalOpen(true) }}
                      className="p-1.5 hover:bg-primary/10 hover:text-primary text-on-surface-variant/40 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(shipper)}
                      className="p-1.5 hover:bg-error/10 hover:text-error text-on-surface-variant/40 transition-colors"
                      title="Xoá"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="mt-24 pb-8 opacity-20">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Shipper Console · Admin</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2026 Horological</p>
        </div>
      </footer>

      <ShipperModal
        open={modalOpen}
        shipper={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null) }}
        onSuccess={load}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 max-w-sm w-full mx-4">
            <p className="font-label-caps text-[10px] text-error tracking-widest mb-4 uppercase">Xác nhận xoá</p>
            <p className="font-headline-sm text-headline-sm text-on-background mb-2">{deleteTarget.name}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60 mb-8">
              Hành động này không thể hoàn tác. Đơn vị vận chuyển sẽ bị xoá khỏi hệ thống.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all"
              >
                HUỶ
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-error text-background font-label-caps text-xs tracking-widest hover:bg-error/80 transition-all disabled:opacity-50"
              >
                {deleting ? 'ĐANG XOÁ...' : 'XOÁ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
