import { useState, useEffect, useCallback } from 'react'
import { watchService, variantService, variantImageService } from '../../services/watchService'

const FILTERS = [
  { label: 'TẤT CẢ', value: 'all' },
  { label: 'ĐANG HOẠT ĐỘNG', value: 'active' },
  { label: 'CÒN HÀNG', value: 'in_stock' },
  { label: 'SẮP HẾT', value: 'low_stock' },
  { label: 'HẾT HÀNG', value: 'out_of_stock' },
]

function stockInfo(totalStock) {
  if (totalStock === 0) return { label: 'HẾT HÀNG', dot: 'bg-error', text: 'text-error', key: 'out_of_stock' }
  if (totalStock < 5) return { label: 'SẮP HẾT', dot: 'bg-error', text: 'text-error', key: 'low_stock' }
  return { label: 'CÒN HÀNG', dot: 'bg-green-500', text: 'text-on-background', key: 'in_stock' }
}

function formatVND(price) {
  if (price == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price)
}

function statusInfo(isActive) {
  return isActive
    ? { label: 'HOẠT ĐỘNG', className: 'text-primary border-primary/20 bg-primary/10' }
    : { label: 'TẠM DỪNG', className: 'text-on-surface-variant/60 border-outline-variant/30 bg-secondary-container/30' }
}

export default function InventoryTable({ refreshKey, onDelete, onEdit }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await watchService.getAllAdmin()
      const [variantsAll, mainImages] = await Promise.all([
        Promise.all(list.map((w) => variantService.getByWatch(w.id).catch(() => []))),
        Promise.all(list.map((w) => variantImageService.getMainImage(w.id).catch(() => null))),
      ])
      setWatches(
        list.map((w, i) => {
          const variants = variantsAll[i] ?? []
          const totalStock = variants.reduce((s, v) => s + (v.stockQuantity ?? 0), 0)
          const minPrice = variants.length ? Math.min(...variants.map((v) => v.price)) : null
          const primaryImage = mainImages[i]?.url ?? null
          return { ...w, variants, totalStock, minPrice, primaryImage }
        })
      )
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load, refreshKey])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleToggleStatus = async (watch) => {
    try {
      const newIsActive = !watch.isActive
      await watchService.toggleStatus(watch.id, newIsActive)
      setWatches((prev) =>
        prev.map((w) => (w.id === watch.id ? { ...w, isActive: newIsActive } : w))
      )
      showToast(newIsActive ? `Đã bật bán lại "${watch.name}"` : `Đã tạm dừng "${watch.name}"`)
    } catch (err) {
      const message = watch.isActive ? 'Không thể tạm dừng sản phẩm.' : 'Không thể bật bán lại sản phẩm.'
      showToast(message + ' ' + (err?.message || ''), 'error')
      console.error('Không thể thay đổi trạng thái:', err)
    } finally {
      setConfirmTarget(null)
    }
  }

  const filtered = watches.filter((w) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return w.isActive
    return stockInfo(w.totalStock).key === activeFilter
  })

  return (
    <section className="section-container relative">
      {/* Filter tabs */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-8">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`font-label-caps text-xs pb-2 tracking-widest transition-colors ${
                activeFilter === f.value
                  ? 'text-primary border-b border-primary'
                  : 'text-on-surface-variant/40 hover:text-on-surface-variant'
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
        <div className="py-24 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">
          ĐANG TẢI...
        </div>
      )}
      {!loading && error && (
        <div className="py-16 text-center font-label-caps text-xs text-error tracking-widest">{error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="w-full overflow-hidden border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  {['Tên / SKU', 'Thương hiệu', 'Danh mục', 'Tồn kho', 'Trạng thái', 'Giá từ', ''].map((h, i) => (
                    <th
                      key={i}
                      className={`px-8 py-5 font-label-caps text-[10px] tracking-widest text-on-surface-variant/75 uppercase ${i === 6 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">
                      KHÔNG CÓ SẢN PHẨM
                    </td>
                  </tr>
                )}
                {filtered.map((watch) => {
                  const stock = stockInfo(watch.totalStock)
                  const productStatus = statusInfo(watch.isActive ?? true)
                  return (
                    <tr
                      key={watch.id}
                      className="group hover:bg-surface-container-high transition-all duration-300"
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                      style={{ transition: 'transform 0.3s ease-out' }}
                    >
                      {/* Name + SKU */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-surface-container overflow-hidden flex-shrink-0">
                            {watch.primaryImage ? (
                              <img
                                className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                                src={watch.primaryImage}
                                alt={watch.name}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-surface-variant/20 text-2xl">watch</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-headline-sm text-lg text-on-background">{watch.name}</p>
                            <p className="font-label-caps text-[10px] text-on-surface-variant tracking-tighter">{watch.sku}</p>
                          </div>
                        </div>
                      </td>
                      {/* Brand */}
                      <td className="px-8 py-6">
                        <span className="font-label-caps text-xs text-on-surface-variant tracking-widest">{watch.brandName ?? '—'}</span>
                      </td>
                      {/* Category */}
                      <td className="px-8 py-6">
                        <span className="font-label-caps text-xs text-on-surface-variant tracking-widest">{watch.categoryName ?? '—'}</span>
                      </td>
                      {/* Stock */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
                          <span className={`font-label-caps text-[10px] tracking-widest ${stock.text}`}>{stock.label}</span>
                          <span className="font-label-caps text-[10px] text-on-surface-variant/40">({watch.totalStock})</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 border px-3 py-1 font-label-caps text-[10px] tracking-[0.18em] ${productStatus.className}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {productStatus.label}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-8 py-6">
                        <p className="font-body-md text-primary">{formatVND(watch.minPrice)}</p>
                      </td>
                      {/* Action */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => onEdit?.(watch)}
                            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                            title="Cập nhật"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => setConfirmTarget(watch)}
                            className={`material-symbols-outlined transition-colors ${
                              watch.isActive
                                ? 'text-on-surface-variant hover:text-error'
                                : 'text-on-surface-variant/40 hover:text-green-500'
                            }`}
                            title={watch.isActive ? 'Tạm dừng bán' : 'Bật bán lại'}
                          >
                            {watch.isActive ? 'pause_circle' : 'play_circle'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="mt-8 flex justify-between items-center px-4">
            <p className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-widest">
              HIỂN THỊ {filtered.length} / {watches.length} SẢN PHẨM
            </p>
          </div>
        </>
      )}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-8 w-full max-w-sm shadow-2xl">
            <div className="mb-1">
              <span className="font-label-caps text-[10px] text-primary tracking-[0.4em]">
                {confirmTarget.isActive ? 'TẠM DỪNG BÁN' : 'BẬT BÁN LẠI'}
              </span>
            </div>
            <p className="font-headline-sm text-base text-on-background mt-1 mb-2">
              {confirmTarget.isActive
                ? 'Bạn có chắc muốn tạm dừng sản phẩm này?'
                : 'Bạn có chắc muốn bật bán lại sản phẩm này?'}
            </p>
            <p className="font-body-md text-sm text-on-surface-variant/70 mb-6">
              <span className="text-on-background font-medium">"{confirmTarget.name}"</span>
              {confirmTarget.isActive
                ? ' sẽ bị ẩn khỏi cửa hàng và khách hàng không thể mua.'
                : ' sẽ hiển thị lại trên cửa hàng.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmTarget(null)}
                className="px-5 py-2.5 font-label-caps text-[10px] tracking-widest text-on-surface-variant border border-outline-variant/30 hover:border-outline-variant/60 transition-colors"
              >
                HUỶ
              </button>
              <button
                onClick={() => handleToggleStatus(confirmTarget)}
                className={`px-5 py-2.5 font-label-caps text-[10px] tracking-widest text-background transition-colors ${
                  confirmTarget.isActive ? 'bg-error hover:bg-error/80' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {confirmTarget.isActive ? 'TẠM DỪNG' : 'BẬT BÁN LẠI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 font-label-caps text-xs tracking-widest shadow-lg transition-all duration-300 ${
          toast.type === 'error' ? 'bg-error text-white' : 'bg-primary text-background'
        }`}>
          {toast.message}
        </div>
      )}
    </section>
  )
}
