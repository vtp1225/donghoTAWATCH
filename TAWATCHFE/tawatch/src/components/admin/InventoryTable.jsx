import { useState, useEffect, useCallback } from 'react'
import { watchService, variantService } from '../../services/watchService'

const FILTERS = [
  { label: 'TẤT CẢ', value: 'all' },
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

export default function InventoryTable({ refreshKey, onDelete, onEdit }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await watchService.getAll()
      const variantsAll = await Promise.all(list.map((w) => variantService.getByWatch(w.id).catch(() => [])))
      setWatches(
        list.map((w, i) => {
          const variants = variantsAll[i] ?? []
          const totalStock = variants.reduce((s, v) => s + (v.stockQuantity ?? 0), 0)
          const minPrice = variants.length ? Math.min(...variants.map((v) => v.price)) : null
          const primaryImage = variants.find((v) => v.imageUrl)?.imageUrl ?? null
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

  const filtered = watches.filter((w) => {
    if (activeFilter === 'all') return true
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
                  {['Tên / SKU', 'Thương hiệu', 'Danh mục', 'Tồn kho', 'Giá từ', ''].map((h, i) => (
                    <th
                      key={i}
                      className={`px-8 py-5 font-label-caps text-[10px] tracking-widest text-on-surface-variant/75 uppercase ${i === 5 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">
                      KHÔNG CÓ SẢN PHẨM
                    </td>
                  </tr>
                )}
                {filtered.map((watch) => {
                  const stock = stockInfo(watch.totalStock)
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
                            onClick={() => onDelete?.(watch)}
                            className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                            title="Xoá"
                          >
                            delete
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
    </section>
  )
}
