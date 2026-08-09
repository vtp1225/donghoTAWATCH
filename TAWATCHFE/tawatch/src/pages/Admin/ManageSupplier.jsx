import { useState, useEffect, useCallback } from 'react'
import { supplierService } from '../../services/supplierService'
import { brandService } from '../../services/brandService'
import useAuth from '../../hooks/useAuth'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  isActive: true,
  brandIds: [],
}

function SupplierModal({ open, supplier, brands, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setError('')
      if (supplier) {
        setForm({
          name: supplier.name || '',
          email: supplier.email || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          isActive: supplier.isActive ?? true,
          brandIds: supplier.brands?.map((b) => b.id) ?? [],
        })
      } else {
        setForm(EMPTY_FORM)
      }
    }
  }, [open, supplier])

  function toggleBrand(id) {
    setForm((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(id)
        ? prev.brandIds.filter((b) => b !== id)
        : [...prev.brandIds, id],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Vui lòng điền đầy đủ tên, email và số điện thoại.')
      return
    }
    setSaving(true)
    try {
      if (supplier) {
        await supplierService.update(supplier.id, form)
      } else {
        await supplierService.create(form)
      }
      onSuccess()
      onClose()
    } catch (err) {
      setError(err?.message || 'Không thể lưu nhà cung cấp.')
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
          {supplier ? 'Chỉnh sửa' : 'Thêm mới'}
        </p>
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">
          {supplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp'}
        </h3>

        {error && (
          <p className="mb-4 font-body-md text-xs text-error">{error}</p>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
              Tên nhà cung cấp *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary"
              placeholder="Công ty ABC"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary"
                placeholder="supplier@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
                Số điện thoại *
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary"
                placeholder="0909123456"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
              Địa chỉ
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm outline-none focus:border-primary"
              placeholder="123 Đường ABC, TP.HCM"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="accent-primary"
            />
            <label htmlFor="isActive" className="font-body-md text-sm text-on-surface-variant">
              Đang hoạt động
            </label>
          </div>

          {brands.length > 0 && (
            <div>
              <label className="mb-2 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">
                Thương hiệu cung cấp
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const selected = form.brandIds.includes(brand.id)
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => toggleBrand(brand.id)}
                      className={`px-3 py-1 text-xs font-label-caps tracking-wider border transition-all ${
                        selected
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-outline-variant/30 text-on-surface-variant/60 hover:border-primary/50'
                      }`}
                    >
                      {brand.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
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
            {saving ? 'ĐANG LƯU...' : supplier ? 'CẬP NHẬT' : 'TẠO'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ManageSupplier() {
  const { user: authUser } = useAuth()
  const isAdmin = authUser?.role === 'ADMIN'
  const [suppliers, setSuppliers] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [sup, br] = await Promise.all([supplierService.getAll(), brandService.getAll()])
      setSuppliers(sup)
      setBrands(br)
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
      await supplierService.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      alert(err?.message || 'Không thể xoá nhà cung cấp.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = suppliers.filter((s) =>
    !search.trim() ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="ml-72 mt-20 min-h-screen overflow-x-hidden" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">
              SUPPLIER MANAGEMENT
            </span>
            <h2 className="font-display-lg text-display-lg text-on-background">Nhà Cung Cấp</h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setEditTarget(null); setModalOpen(true) }}
              className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm nhà cung cấp
            </button>
          )}
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Tổng nhà cung cấp', value: suppliers.length, icon: 'local_shipping' },
          { label: 'Đang hoạt động', value: suppliers.filter((s) => s.isActive).length, icon: 'check_circle' },
          { label: 'Tạm dừng', value: suppliers.filter((s) => !s.isActive).length, icon: 'pause_circle' },
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
          placeholder="Tìm theo tên hoặc email..."
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
        {/* Table header */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-6 py-3 border-b border-outline-variant/10">
          {['Tên', 'Email', 'Điện thoại', 'Thương hiệu', 'Trạng thái', ''].map((col) => (
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
              {search ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có nhà cung cấp nào'}
            </p>
          </div>
        ) : (
          filtered.map((supplier, idx) => (
            <div
              key={supplier.id}
              className={`grid grid-cols-[2fr_2fr_1.5fr_1.5fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-surface-container/50 transition-colors ${
                idx !== filtered.length - 1 ? 'border-b border-outline-variant/10' : ''
              }`}
            >
              <div>
                <p className="font-body-md text-sm text-on-background font-medium">{supplier.name}</p>
                {supplier.address && (
                  <p className="text-xs text-on-surface-variant/50 mt-0.5 truncate">{supplier.address}</p>
                )}
              </div>
              <p className="font-body-md text-sm text-on-surface-variant/80 truncate">{supplier.email}</p>
              <p className="font-body-md text-sm text-on-surface-variant/80">{supplier.phone}</p>
              <div className="flex flex-wrap gap-1">
                {supplier.brands?.length > 0 ? (
                  supplier.brands.slice(0, 2).map((b) => (
                    <span
                      key={b.id}
                      className="px-2 py-0.5 text-[9px] font-label-caps tracking-wider border border-outline-variant/20 text-on-surface-variant/60"
                    >
                      {b.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-on-surface-variant/30">—</span>
                )}
                {supplier.brands?.length > 2 && (
                  <span className="text-[9px] text-on-surface-variant/40">+{supplier.brands.length - 2}</span>
                )}
              </div>
              <div>
                <span
                  className={`px-2 py-0.5 text-[9px] font-label-caps tracking-wider ${
                    supplier.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-outline-variant/10 text-on-surface-variant/40 border border-outline-variant/20'
                  }`}
                >
                  {supplier.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => { setEditTarget(supplier); setModalOpen(true) }}
                      className="p-1.5 hover:bg-primary/10 hover:text-primary text-on-surface-variant/40 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(supplier)}
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
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Supplier Console · Admin</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2026 Horological</p>
        </div>
      </footer>

      <SupplierModal
        open={modalOpen}
        supplier={editTarget}
        brands={brands}
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
              Hành động này không thể hoàn tác. Nhà cung cấp sẽ bị xoá khỏi hệ thống.
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
