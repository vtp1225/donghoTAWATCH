import { useState, useEffect, useCallback } from 'react'
import { importReceiptService } from '../../services/importReceiptService'
import { supplierService } from '../../services/supplierService'
import { watchService, variantService } from '../../services/watchService'
import useAuth from '../../hooks/useAuth'

const STATUS_LABEL = {
  DRAFT: { label: 'Nháp', color: 'text-on-surface-variant/60 border-outline-variant/30 bg-outline-variant/10' },
  CONFIRMED: { label: 'Đã nhập', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
  COMPLETED: { label: 'Hoàn tất', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
  CANCELLED: { label: 'Đã huỷ', color: 'text-error/70 border-error/20 bg-error/10' },
  PENDING: { label: 'Chờ duyệt', color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
  REJECTED: { label: 'Bị từ chối', color: 'text-error/70 border-error/20 bg-error/10' },

}

function fmt(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}

// ─── Detail Modal ──────────────────────────────────────────────
function DetailModal({ receipt, onClose, onConfirm, onCancel, confirming, cancelling }) {
  if (!receipt) return null
  console.log('DetailModal receipt:', receipt)
  const s = STATUS_LABEL[receipt.status] || STATUS_LABEL.DRAFT
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-low border border-outline-variant/20 p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="font-label-caps text-[9px] tracking-[0.3em] text-primary mb-1 uppercase">Chi tiết phiếu nhập</p>
            <h3 className="font-headline-sm text-headline-sm text-on-background">{receipt.receiptCode}</h3>
          </div>
          <span className={`px-2.5 py-1 text-xs font-label-caps tracking-wider border ${s.color}`}>
            {s.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 mb-1 uppercase">Nhà cung cấp</p>
            <p className="text-on-background">{receipt.supplierName}</p>
          </div>
          <div>
            <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 mb-1 uppercase">Ngày nhập</p>
            <p className="text-on-background">{receipt.importDate}</p>
          </div>
          <div>
            <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 mb-1 uppercase">Người tạo</p>
            <p className="text-on-background">{receipt.createdByName}</p>
          </div>
          <div>
            <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 mb-1 uppercase">Tổng tiền</p>
            <p className="text-primary font-medium">{fmt(receipt.totalAmount)}</p>
          </div>
          {receipt.note && (
            <div className="col-span-2">
              <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 mb-1 uppercase">Ghi chú</p>
              <p className="text-on-surface-variant">{receipt.note}</p>
            </div>
          )}
        </div>

        {/* Items table */}
        <div className="border border-outline-variant/15 mb-6">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 px-4 py-2 border-b border-outline-variant/10">
            {['Sản phẩm', 'SL', 'Đơn giá', 'Thành tiền'].map((h) => (
              <span key={h} className="font-label-caps text-[8px] tracking-widest text-on-surface-variant/40 uppercase">{h}</span>
            ))}
          </div>
          {receipt.items?.map((item, i) => (
            <div key={i} className={`grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-center px-4 py-3 ${i !== receipt.items.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
              <div>
                <p className="text-sm text-on-background">{item.watchName}</p>
                <p className="text-xs text-on-surface-variant/50">{item.variantLabel}</p>
              </div>
              <p className="text-sm text-on-background">{item.quantity}</p>
              <p className="text-sm text-on-surface-variant/80">{fmt(item.unitCost)}</p>
              <p className="text-sm text-on-background font-medium">{fmt(item.totalCost)}</p>
            </div>
          ))}
        </div>

        {receipt.status === 'DRAFT' && (
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={cancelling}
              className="px-6 py-2 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-error hover:text-error transition-all disabled:opacity-50"
            >
              {cancelling ? 'ĐANG HUỶ...' : 'HUỶ PHIẾU'}
            </button>
            <button
              onClick={onConfirm}
              disabled={confirming}
              className="px-8 py-2 bg-primary text-background font-label-caps text-xs tracking-widest hover:bg-primary/80 transition-all disabled:opacity-50"
            >
              {confirming ? 'ĐANG XÁC NHẬN...' : 'XÁC NHẬN NHẬP KHO'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Create Modal ──────────────────────────────────────────────
function CreateModal({ open, suppliers, currentUserId, onClose, onSuccess }) {
  const [supplierId, setSupplierId] = useState('')
  const [importDate, setImportDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [items, setItems] = useState([{ watchVariantId: '', watchId: '', quantity: 1, unitCost: '' }])
  const [watches, setWatches] = useState([])
  const [variantsByWatch, setVariantsByWatch] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      watchService.getAllAdmin().then(setWatches).catch(() => {})
      setSupplierId('')
      setNote('')
      setImportDate(new Date().toISOString().slice(0, 10))
      setItems([{ watchVariantId: '', watchId: '', quantity: 1, unitCost: '' }])
      setError('')
    }
  }, [open])

  async function loadVariants(watchId) {
    if (!watchId || variantsByWatch[watchId]) return
    try {
      const variants = await variantService.getByWatch(watchId)
      setVariantsByWatch((prev) => ({ ...prev, [watchId]: variants }))
    } catch {}
  }

  function updateItem(idx, field, value) {
    setItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      if (field === 'watchId') {
        next[idx].watchVariantId = ''
        loadVariants(value)
      } else if (field === 'watchVariantId' && value) {
        const variant = variantsByWatch[next[idx].watchId]?.find((v) => String(v.id) === String(value))
        if (variant && variant.costPrice) {
          next[idx].unitCost = variant.costPrice
        }
      }
      return next
    })
  }

  function addItem() {
    setItems((prev) => [...prev, { watchVariantId: '', watchId: '', quantity: 1, unitCost: '' }])
  }

  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function calcTotal() {
    return items.reduce((sum, it) => {
      const cost = parseFloat(it.unitCost) || 0
      const qty = parseInt(it.quantity) || 0
      return sum + cost * qty
    }, 0)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!supplierId) { setError('Chọn nhà cung cấp.'); return }
    if (items.some((it) => !it.watchVariantId || !it.quantity || !it.unitCost)) {
      setError('Vui lòng điền đầy đủ thông tin tất cả dòng sản phẩm.')
      return
    }
    setSaving(true)
    try {
      await importReceiptService.create({
        supplierId: parseInt(supplierId),
        createdById: currentUserId,
        importDate,
        note: note || null,
        items: items.map((it) => ({
          watchVariantId: parseInt(it.watchVariantId),
          quantity: parseInt(it.quantity),
          unitCost: parseFloat(it.unitCost),
          batchNumber: null,
        })),
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err?.message || 'Không thể tạo phiếu nhập.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-surface-container-low border border-outline-variant/20 p-8 max-w-3xl w-full mx-4 max-h-[92vh] overflow-y-auto">
        <p className="font-label-caps text-[9px] tracking-[0.3em] text-primary mb-1 uppercase">Tạo phiếu nhập kho</p>
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">Phiếu nhập mới</h3>

        {error && <p className="mb-4 text-xs text-error">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Nhà cung cấp *</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 text-sm outline-none focus:border-primary text-on-background"
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Ngày nhập *</label>
            <input
              type="date"
              value={importDate}
              onChange={(e) => setImportDate(e.target.value)}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 text-sm outline-none focus:border-primary text-on-background"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Ghi chú</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border-b border-outline-variant/25 bg-transparent py-2 text-sm outline-none focus:border-primary text-on-background"
              placeholder="Ghi chú phiếu nhập..."
            />
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 uppercase">Danh sách sản phẩm *</p>
            <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs text-primary hover:text-primary/70 transition-colors">
              <span className="material-symbols-outlined text-sm">add</span> Thêm dòng
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[2fr_2fr_1fr_1.5fr_auto] gap-3 items-end border-b border-outline-variant/10 pb-3">
                <div>
                  <label className="mb-1 block font-label-caps text-[8px] tracking-widest text-on-surface-variant/40 uppercase">Sản phẩm</label>
                  <select
                    value={item.watchId}
                    onChange={(e) => updateItem(idx, 'watchId', e.target.value)}
                    className="w-full border-b border-outline-variant/20 bg-transparent py-1.5 text-sm outline-none focus:border-primary text-on-background"
                  >
                    <option value="">-- Chọn đồng hồ --</option>
                    {watches.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-label-caps text-[8px] tracking-widest text-on-surface-variant/40 uppercase">Biến thể</label>
                  <select
                    value={item.watchVariantId}
                    onChange={(e) => updateItem(idx, 'watchVariantId', e.target.value)}
                    disabled={!item.watchId}
                    className="w-full border-b border-outline-variant/20 bg-transparent py-1.5 text-sm outline-none focus:border-primary text-on-background disabled:opacity-40"
                  >
                    <option value="">-- Chọn biến thể --</option>
                    {(variantsByWatch[item.watchId] || []).map((v) => (
                      <option key={v.id} value={v.id}>
                        {[v.dialColor?.name, v.strapColor?.name, v.caseSizeMm ? v.caseSizeMm + 'mm' : null].filter(Boolean).join(' / ') || 'Mặc định'} (Tồn: {v.stockQuantity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-label-caps text-[8px] tracking-widest text-on-surface-variant/40 uppercase">Số lượng</label>
                  <input
                    type="number" min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    className="w-full border-b border-outline-variant/20 bg-transparent py-1.5 text-sm outline-none focus:border-primary text-on-background"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-label-caps text-[8px] tracking-widest text-on-surface-variant/40 uppercase">Đơn giá (VND)</label>
                  <input
                    type="number" min="0"
                    value={item.unitCost}
                    onChange={(e) => updateItem(idx, 'unitCost', e.target.value)}
                    className="w-full border-b border-outline-variant/20 bg-transparent py-1.5 text-sm outline-none focus:border-primary text-on-background"
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                  className="p-1.5 text-error/40 hover:text-error disabled:opacity-20 transition-colors mb-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 uppercase mb-0.5">Tổng tiền</p>
            <p className="font-headline-sm text-xl text-primary">{fmt(calcTotal())}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all">HUỶ</button>
            <button type="submit" disabled={saving} className="px-8 py-2 bg-primary text-background font-label-caps text-xs tracking-widest hover:bg-primary/80 transition-all disabled:opacity-50">
              {saving ? 'ĐANG TẠO...' : 'TẠO PHIẾU'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────
export default function ManageImportReceipt() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [receipts, setReceipts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [viewReceipt, setViewReceipt] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [recs, sups] = await Promise.all([
        importReceiptService.getAll(),
        supplierService.getAll(),
      ])
      setReceipts(recs)
      setSuppliers(sups)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleConfirm() {
    if (!viewReceipt) return
    setConfirming(true)
    try {
      const updated = await importReceiptService.confirm(viewReceipt.id)
      setViewReceipt(updated)
      load()
    } catch (err) {
      alert(err?.message || 'Không thể xác nhận.')
    } finally {
      setConfirming(false)
    }
  }

  async function handleCancel() {
    if (!viewReceipt) return
    setCancelling(true)
    try {
      const updated = await importReceiptService.cancel(viewReceipt.id)
      setViewReceipt(updated)
      load()
    } catch (err) {
      alert(err?.message || 'Không thể huỷ.')
    } finally {
      setCancelling(false)
    }
  }

  const filtered = receipts.filter((r) => statusFilter === 'ALL' || r.status === statusFilter)

  const stats = {
    total: receipts.length,
    confirmed: receipts.filter((r) => r.status === 'CONFIRMED').length,
    draft: receipts.filter((r) => r.status === 'DRAFT').length,
    totalValue: receipts.filter((r) => r.status === 'CONFIRMED').reduce((s, r) => s + (r.totalAmount || 0), 0),
  }

  return (
    <main className="ml-72 mt-20 min-h-screen overflow-x-hidden" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase">
              INVENTORY MANAGEMENT
            </span>
            <h2 className="font-display-lg text-display-lg text-on-background">Nhập Kho</h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setCreateOpen(true)}
              className="px-8 py-3 border border-primary text-primary font-label-caps text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-500 active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Tạo phiếu nhập
            </button>
          )}
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Tổng phiếu', value: stats.total, icon: 'receipt_long' },
          { label: 'Đã xác nhận', value: stats.confirmed, icon: 'check_circle', accent: 'text-emerald-400' },
          { label: 'Đang nháp', value: stats.draft, icon: 'draft', accent: 'text-amber-400' },
          { label: 'Tổng giá trị nhập', value: fmt(stats.totalValue), icon: 'payments', accent: 'text-primary' },
        ].map(({ label, value, icon, accent }) => (
          <div key={label} className="border border-outline-variant/15 bg-surface-container-low/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`material-symbols-outlined text-xl ${accent || 'text-on-surface-variant/40'}`}>{icon}</span>
              <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/50 uppercase">{label}</p>
            </div>
            {loading ? (
              <div className="h-7 w-16 bg-surface-container-highest animate-pulse rounded" />
            ) : (
              <p className={`font-headline-md text-2xl ${accent || 'text-on-background'}`}>{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'DRAFT', 'CONFIRMED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 font-label-caps text-[9px] tracking-widest border transition-all ${
              statusFilter === s
                ? 'border-primary text-primary bg-primary/10'
                : 'border-outline-variant/20 text-on-surface-variant/50 hover:border-primary/40'
            }`}
          >
            {s === 'ALL' ? 'TẤT CẢ' : STATUS_LABEL[s]?.label?.toUpperCase() || s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-outline-variant/15 bg-surface-container-low/30">
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-outline-variant/10">
          {['Mã phiếu', 'Nhà cung cấp', 'Ngày nhập', 'Tổng tiền', 'Trạng thái', ''].map((h) => (
            <span key={h} className="font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/40 uppercase">{h}</span>
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
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/20 mb-2 block">receipt_long</span>
            <p className="font-body-md text-sm text-on-surface-variant/40">Chưa có phiếu nhập kho nào</p>
          </div>
        ) : (
          filtered.map((r, idx) => {
            const s = STATUS_LABEL[r.status] || STATUS_LABEL.DRAFT
            return (
              <div
                key={r.id}
                className={`grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-surface-container/50 transition-colors cursor-pointer ${
                  idx !== filtered.length - 1 ? 'border-b border-outline-variant/10' : ''
                }`}
                onClick={() => importReceiptService.getById(r.id).then(setViewReceipt)}
              >
                <p className="font-body-md text-sm text-on-background font-medium">{r.receiptCode}</p>
                <p className="text-sm text-on-surface-variant/80 truncate">{r.supplierName}</p>
                <p className="text-sm text-on-surface-variant/60">{r.importDate}</p>
                <p className="text-sm text-on-background">{fmt(r.totalAmount)}</p>
                <span className={`inline-block px-2.5 py-1 text-xs font-label-caps tracking-wider border ${s.color}`}>
                  {s.label}
                </span>
                <p className="text-xs text-on-surface-variant/40">{r.createdByName}</p>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <footer className="mt-24 pb-8 opacity-20">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Import Console · Admin</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2026 Horological</p>
        </div>
      </footer>

      <CreateModal
        open={createOpen}
        suppliers={suppliers}
        currentUserId={user?.id}
        onClose={() => setCreateOpen(false)}
        onSuccess={load}
      />

      <DetailModal
        receipt={viewReceipt}
        onClose={() => setViewReceipt(null)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirming={confirming}
        cancelling={cancelling}
      />
    </main>
  )
}
