import { useState, useEffect, useCallback, useRef } from 'react'
import { watchService } from '../../services/watchService'
import { brandService } from '../../services/brandService'
import { categoryService } from '../../services/categoryService'
import { segmentService } from '../../services/segmentService'
import { cached } from '../../services/cache'

const PAGE_SIZE = 20

const STATUS_TABS = [
  { label: 'TẤT CẢ', value: 'all', isActive: null },
  { label: 'ĐANG HOẠT ĐỘNG', value: 'active', isActive: true },
  { label: 'TẠM DỪNG', value: 'inactive', isActive: false },
]

function stockInfo(totalStock) {
  if (totalStock === 0) return { label: 'HẾT HÀNG', dot: 'bg-error', text: 'text-error' }
  if (totalStock < 5) return { label: 'SẮP HẾT', dot: 'bg-amber-400', text: 'text-amber-500' }
  return { label: 'CÒN HÀNG', dot: 'bg-green-500', text: 'text-on-background' }
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

export default function InventoryTable({ refreshKey, onEdit, onStatsLoad }) {
  const [activeTab, setActiveTab] = useState('all')
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSegment, setFilterSegment] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Lookup lists
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [segments, setSegments] = useState([])

  const debounceRef = useRef(null)

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(0)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [searchQuery])

  // Load lookup lists once — cached for 5 minutes so navigating back doesn't refetch
  useEffect(() => {
    Promise.all([
      cached('brands',     () => brandService.getAll().catch(() => [])),
      cached('categories', () => categoryService.getAll().catch(() => [])),
      cached('segments',   () => segmentService.getAll().catch(() => [])),
    ]).then(([b, c, s]) => {
      setBrands(b)
      setCategories(c)
      setSegments(s)
    })
  }, [])

  // Load watches (server-side)
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const tab = STATUS_TABS.find((t) => t.value === activeTab)
      const data = await watchService.getAdminPaged({
        page: currentPage,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        brandId: filterBrand ? Number(filterBrand) : undefined,
        categoryId: filterCategory ? Number(filterCategory) : undefined,
        segmentId: filterSegment ? Number(filterSegment) : undefined,
        isActive: tab?.isActive,
      })
      const mapped = data.content.map((w) => ({
        ...w,
        totalStock: w.totalStock ?? 0,
        minPrice: w.minPrice ?? null,
        primaryImage: w.mainImageUrl ?? null,
      }))
      setWatches(mapped)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      // Expose summary to parent so it can show stats without extra API calls
      onStatsLoad?.({
        total: data.totalElements,
        outOfStock: mapped.filter(w => w.totalStock === 0).length,
        lowStock:   mapped.filter(w => w.totalStock > 0 && w.totalStock < 5).length,
        isFiltered: !!(debouncedSearch || filterBrand || filterCategory || filterSegment),
      })
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch, filterBrand, filterCategory, filterSegment, activeTab, refreshKey, onStatsLoad])

  useEffect(() => { load() }, [load])

  function clearFilters() {
    setSearchQuery('')
    setFilterBrand('')
    setFilterCategory('')
    setFilterSegment('')
    setActiveTab('all')
    setCurrentPage(0)
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    setCurrentPage(0)
  }

  function handleFilterChange(setter) {
    return (e) => { setter(e.target.value); setCurrentPage(0) }
  }

  const hasActiveFilters = searchQuery || filterBrand || filterCategory || filterSegment || activeTab !== 'all'

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleToggleFeatured = async (watch) => {
    const newFeatured = !watch.isFeatured
    try {
      await watchService.toggleFeatured(watch.id, newFeatured)
      setWatches((prev) =>
        prev.map((w) => (w.id === watch.id ? { ...w, isFeatured: newFeatured } : w))
      )
      showToast(newFeatured ? `Đã đánh dấu nổi bật "${watch.name}"` : `Đã bỏ nổi bật "${watch.name}"`)
    } catch (err) {
      showToast('Không thể thay đổi trạng thái nổi bật. ' + (err?.message || ''), 'error')
    }
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
      showToast((watch.isActive ? 'Không thể tạm dừng.' : 'Không thể bật lại.') + ' ' + (err?.message || ''), 'error')
    } finally {
      setConfirmTarget(null)
    }
  }

  return (
    <section className="section-container relative">
      {/* Search + filter bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg pointer-events-none">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/20 text-on-background font-body-md text-sm placeholder-on-surface-variant/40 focus:outline-none focus:border-primary/60 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface-variant text-base">close</button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 border font-label-caps text-xs tracking-widest transition-all ${
            showFilters ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          BỘ LỌC
          {(filterBrand || filterCategory || filterSegment) && <span className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 font-label-caps text-[10px] tracking-widest text-on-surface-variant/50 hover:text-error transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list_off</span>
            XOÁ LỌC
          </button>
        )}
        <button onClick={load} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors ml-auto" title="Làm mới">refresh</button>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="mb-6 p-5 border border-outline-variant/15 bg-surface-container-low">
          <p className="font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/50 mb-4 uppercase">Lọc nâng cao</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 mb-1.5">THƯƠNG HIỆU</label>
              <select value={filterBrand} onChange={handleFilterChange(setFilterBrand)} className="w-full px-3 py-2 bg-surface-container border border-outline-variant/20 text-on-background font-body-md text-sm focus:outline-none focus:border-primary/60 transition-colors">
                <option value="">Tất cả</option>
                {brands.map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 mb-1.5">DANH MỤC</label>
              <select value={filterCategory} onChange={handleFilterChange(setFilterCategory)} className="w-full px-3 py-2 bg-surface-container border border-outline-variant/20 text-on-background font-body-md text-sm focus:outline-none focus:border-primary/60 transition-colors">
                <option value="">Tất cả</option>
                {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 mb-1.5">PHÂN KHÚC</label>
              <select value={filterSegment} onChange={handleFilterChange(setFilterSegment)} className="w-full px-3 py-2 bg-surface-container border border-outline-variant/20 text-on-background font-body-md text-sm focus:outline-none focus:border-primary/60 transition-colors">
                <option value="">Tất cả</option>
                {segments.map((s) => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Status tabs */}
      <div className="mb-8 flex items-center gap-8">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className={`font-label-caps text-xs pb-2 tracking-widest transition-colors ${
              activeTab === t.value ? 'text-primary border-b border-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'
            }`}
          >
            {t.label}
          </button>
        ))}
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
        <>
          <div className="w-full overflow-x-auto border border-outline-variant/10">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  {['Tên / SKU', 'Thương hiệu', 'Danh mục', 'Tồn kho', 'Trạng thái', 'Giá từ', ''].map((h, i) => (
                    <th key={i} className={`px-4 py-4 font-label-caps text-[10px] tracking-widest text-on-surface-variant/75 uppercase ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {watches.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">KHÔNG CÓ SẢN PHẨM</td>
                  </tr>
                )}
                {watches.map((watch) => {
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
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-surface-container overflow-hidden flex-shrink-0">
                            {watch.primaryImage ? (
                              <img className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" src={watch.primaryImage} alt={watch.name} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-surface-variant/20 text-xl">watch</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-headline-sm text-base text-on-background truncate max-w-[180px]">{watch.name}</p>
                            <p className="font-label-caps text-[10px] text-on-surface-variant tracking-tighter">{watch.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className="font-label-caps text-xs text-on-surface-variant tracking-widest">{watch.brandName ?? '—'}</span></td>
                      <td className="px-4 py-4"><span className="font-label-caps text-xs text-on-surface-variant tracking-widest">{watch.categoryName ?? '—'}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${stock.dot}`} />
                          <span className={`font-label-caps text-[10px] tracking-widest ${stock.text}`}>{stock.label}</span>
                          <span className="font-label-caps text-[10px] text-on-surface-variant/40">({watch.totalStock})</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 border px-2 py-1 font-label-caps text-[10px] tracking-[0.15em] ${productStatus.className}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0" />
                          {productStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-4"><p className="font-body-md text-sm text-primary whitespace-nowrap">{formatVND(watch.minPrice)}</p></td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleToggleFeatured(watch)}
                            title={watch.isFeatured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                            className={`transition-colors ${watch.isFeatured ? 'text-primary' : 'text-on-surface-variant/30 hover:text-primary/60'}`}
                            style={watch.isFeatured ? { fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" } : {}}
                          >
                            <span className="material-symbols-outlined">star</span>
                          </button>
                          <button onClick={() => onEdit?.(watch)} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Cập nhật">edit</button>
                          <button
                            onClick={() => setConfirmTarget(watch)}
                            className={`material-symbols-outlined transition-colors ${watch.isActive ? 'text-on-surface-variant hover:text-error' : 'text-on-surface-variant/40 hover:text-green-500'}`}
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

          {/* Footer: count + pagination */}
          <div className="mt-6 flex items-center justify-between px-2">
            <p className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-widest">
              HIỂN THỊ {watches.length} / {totalElements} SẢN PHẨM
              {hasActiveFilters && <span className="text-primary ml-2">— ĐÃ LỌC</span>}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 0}
                  className="flex h-8 w-8 items-center justify-center border border-outline-variant/20 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                  const isActive = i === currentPage
                  const isNearby = Math.abs(i - currentPage) <= 2
                  if (!isNearby && i !== 0 && i !== totalPages - 1) {
                    if (i === currentPage - 3 || i === currentPage + 3) return <span key={i} className="px-1 font-label-caps text-[10px] text-on-surface-variant/40">…</span>
                    return null
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`flex h-8 w-8 items-center justify-center font-label-caps text-[10px] tracking-widest transition-colors ${
                        isActive ? 'bg-primary text-background' : 'border border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="flex h-8 w-8 items-center justify-center border border-outline-variant/20 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirm toggle status */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-8 w-full max-w-sm shadow-2xl">
            <span className="font-label-caps text-[10px] text-primary tracking-[0.4em]">
              {confirmTarget.isActive ? 'TẠM DỪNG BÁN' : 'BẬT BÁN LẠI'}
            </span>
            <p className="font-headline-sm text-base text-on-background mt-1 mb-2">
              {confirmTarget.isActive ? 'Bạn có chắc muốn tạm dừng sản phẩm này?' : 'Bạn có chắc muốn bật bán lại sản phẩm này?'}
            </p>
            <p className="font-body-md text-sm text-on-surface-variant/70 mb-6">
              <span className="text-on-background font-medium">"{confirmTarget.name}"</span>
              {confirmTarget.isActive ? ' sẽ bị ẩn khỏi cửa hàng.' : ' sẽ hiển thị lại trên cửa hàng.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmTarget(null)} className="px-5 py-2.5 font-label-caps text-[10px] tracking-widest text-on-surface-variant border border-outline-variant/30 hover:border-outline-variant/60 transition-colors">HUỶ</button>
              <button
                onClick={() => handleToggleStatus(confirmTarget)}
                className={`px-5 py-2.5 font-label-caps text-[10px] tracking-widest text-background transition-colors ${confirmTarget.isActive ? 'bg-error hover:bg-error/80' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {confirmTarget.isActive ? 'TẠM DỪNG' : 'BẬT BÁN LẠI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 font-label-caps text-xs tracking-widest shadow-lg transition-all duration-300 ${toast.type === 'error' ? 'bg-error text-white' : 'bg-primary text-background'}`}>
          {toast.message}
        </div>
      )}
    </section>
  )
}
