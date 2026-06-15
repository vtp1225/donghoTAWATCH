import { useCallback, useEffect, useState } from 'react'
import { colorService } from '../../services/colorService'

const FORM_DEFAULT = { name: '', hexCode: '#000000', isActive: true }

function ColorSwatch({ hex, size = 'md' }) {
  const sz = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'
  return (
    <span
      className={`${sz} inline-block flex-shrink-0 rounded-full border border-white/20 shadow-sm`}
      style={{ background: hex || '#ccc' }}
    />
  )
}

function ColorFormModal({ open, color, onClose, onSuccess }) {
  const [form, setForm] = useState(FORM_DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setError('')
    setForm(color ? { name: color.name, hexCode: color.hexCode || '#000000', isActive: color.isActive } : FORM_DEFAULT)
  }, [open, color])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Tên màu không được để trống.'); return }
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(form.hexCode)) { setError('Mã hex không hợp lệ (ví dụ: #B76E79).'); return }

    setSaving(true)
    setError('')
    try {
      const payload = { name: form.name.trim(), hexCode: form.hexCode, isActive: form.isActive }
      if (color) {
        await colorService.update(color.id, payload)
      } else {
        await colorService.create(payload)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'Không thể lưu màu.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 w-full max-w-sm mx-4 shadow-2xl">
        <div className="mb-8">
          <p className="font-label-caps text-[10px] text-primary tracking-[0.4em] mb-1 uppercase">COLOR MANAGEMENT</p>
          <h2 className="font-headline-sm text-headline-sm text-on-background">
            {color ? 'Cập nhật màu' : 'Thêm màu mới'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 border border-error/30 bg-error/10 font-label-caps text-[10px] text-error tracking-widest">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60 uppercase mb-2">
              Tên màu <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ví dụ: Rose Gold"
              className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none py-2 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors"
            />
          </div>

          <div>
            <label className="block font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60 uppercase mb-2">
              Mã màu HEX
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={form.hexCode}
                onChange={(e) => set('hexCode', e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-outline-variant/30 bg-transparent p-0.5"
              />
              <input
                type="text"
                value={form.hexCode}
                onChange={(e) => set('hexCode', e.target.value)}
                placeholder="#000000"
                className="flex-1 bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none py-2 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors uppercase tracking-widest"
              />
              <ColorSwatch hex={form.hexCode} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${form.isActive ? 'bg-primary' : 'bg-outline-variant/30'}`}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${form.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">
              {form.isActive ? 'Đang hoạt động' : 'Tắt'}
            </span>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all"
          >
            HUỶ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-primary text-background font-label-caps text-xs tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'ĐANG LƯU...' : color ? 'LƯU THAY ĐỔI' : 'TẠO MÀU'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManageColor() {
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [filterActive, setFilterActive] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await colorService.getAll()
      setColors(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Không thể tải danh sách màu.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await colorService.remove(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      alert(err?.message || 'Không thể xoá màu.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = colors.filter((c) => {
    if (filterActive === 'active') return c.isActive
    if (filterActive === 'inactive') return !c.isActive
    return true
  })

  return (
    <main className="ml-72 mt-20 p-gutter min-h-screen">
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">COLOR MANAGEMENT</span>
            <h2 className="font-display-lg text-display-lg text-on-background">Quản lý Màu Sắc</h2>
          </div>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true) }}
            className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm Màu
          </button>
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {/* Filter + refresh */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-8">
          {[
            { label: 'TẤT CẢ', value: 'all' },
            { label: 'HOẠT ĐỘNG', value: 'active' },
            { label: 'TẮT', value: 'inactive' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterActive(f.value)}
              className={`font-label-caps text-xs pb-2 tracking-widest transition-colors ${
                filterActive === f.value ? 'text-primary border-b border-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={load} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Làm mới">
          refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="py-24 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI...</div>
      )}
      {!loading && error && (
        <div className="py-16 text-center font-label-caps text-xs text-error tracking-widest">{error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="section-container">
          <div className="w-full overflow-hidden border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  {['Màu sắc', 'Tên', 'Mã HEX', 'Trạng thái', ''].map((h, i) => (
                    <th
                      key={i}
                      className={`px-8 py-5 font-label-caps text-[10px] tracking-widest text-on-surface-variant/75 uppercase ${i === 4 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">
                      KHÔNG CÓ MÀU SẮC
                    </td>
                  </tr>
                )}
                {filtered.map((color) => (
                  <tr
                    key={color.id}
                    className="group hover:bg-surface-container-high transition-all duration-300"
                    style={{ transition: 'transform 0.3s ease-out' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                  >
                    <td className="px-8 py-5">
                      <div
                        className="h-10 w-10 rounded border border-white/10 shadow-md"
                        style={{ background: color.hexCode || '#ccc' }}
                      />
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-body-md text-sm text-on-surface">{color.name}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-label-caps text-xs tracking-widest text-on-surface-variant uppercase">
                        {color.hexCode || '—'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`font-label-caps text-[10px] tracking-widest ${color.isActive ? 'text-green-500' : 'text-on-surface-variant/40'}`}>
                        {color.isActive ? '● HOẠT ĐỘNG' : '○ TẮT'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => { setEditTarget(color); setModalOpen(true) }}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                          title="Cập nhật"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(color)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                          title="Xoá"
                        >
                          delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-between items-center px-4">
            <p className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-widest">
              HIỂN THỊ {filtered.length} / {colors.length} MÀU
            </p>
          </div>
        </div>
      )}

      <footer className="mt-section-gap-desktop pb-8 opacity-20">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Color Console · Admin</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2026 Horological</p>
        </div>
      </footer>

      <ColorFormModal
        open={modalOpen}
        color={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null) }}
        onSuccess={load}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 max-w-sm w-full mx-4">
            <p className="font-label-caps text-[10px] text-error tracking-widest mb-4 uppercase">Xác nhận xoá</p>
            <div className="flex items-center gap-4 mb-2">
              <div className="h-8 w-8 rounded border border-white/10" style={{ background: deleteTarget.hexCode || '#ccc' }} />
              <p className="font-headline-sm text-headline-sm text-on-background">{deleteTarget.name}</p>
            </div>
            <p className="font-label-caps text-[10px] text-on-surface-variant mb-8">{deleteTarget.hexCode}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60 mb-8">Xoá màu này sẽ không ảnh hưởng đến biến thể đã tồn tại. Không thể hoàn tác.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all">HUỶ</button>
              <button onClick={confirmDelete} disabled={deleting} className="flex-1 py-3 bg-error text-background font-label-caps text-xs tracking-widest hover:bg-error/80 transition-all disabled:opacity-50">
                {deleting ? 'ĐANG XOÁ...' : 'XOÁ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
