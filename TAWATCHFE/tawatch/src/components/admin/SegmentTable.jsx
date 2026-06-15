import { useState, useEffect, useCallback } from 'react'
import { segmentService } from '../../services/segmentService'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

function getWatchCount(segment) {
  return segment.watchCount ?? segment.totalWatches ?? segment.itemsCount ?? segment.productsCount ?? 0
}

function getDeliveryMethodLabel(deliveryMethod) {
  if (deliveryMethod === 'DIRECT_SHOP') return 'Nhận tại cửa hàng'
  if (deliveryMethod === 'EXTERNAL_SHIPPER') return 'Giao hàng tận nơi'
  return 'Chưa thiết lập'
}

export default function SegmentTable({ onDelete, onEdit, onDataChange }) {
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await segmentService.getAll()
      setSegments(list)
      onDataChange?.(list)
    } catch (loadError) {
      setError(loadError.message || 'Không thể tải danh sách phân khúc.')
    } finally {
      setLoading(false)
    }
  }, [onDataChange])

  useEffect(() => {
    let active = true

    async function fetchSegments() {
      try {
        const list = await segmentService.getAll()
        if (!active) return
        setSegments(list)
        setError('')
        onDataChange?.(list)
      } catch (loadError) {
        if (!active) return
        setError(loadError.message || 'Không thể tải danh sách phân khúc.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchSegments()

    return () => {
      active = false
    }
  }, [onDataChange])

  return (
    <section className="section-container relative">
      <div className="mb-8 border-b border-outline-variant/10 flex justify-between items-center pb-4">
        <h3 className="font-label-caps text-label-caps text-primary tracking-[0.2em]">SEGMENTATION MATRIX</h3>
        <button onClick={load} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Làm mới">refresh</button>
      </div>

      {loading && (
        <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI PHÂN KHÚC...</div>
      )}

      {!loading && error && (
        <div className="py-8 text-center font-label-caps text-xs text-error tracking-widest">{error}</div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {segments.length === 0 && (
            <div className="border border-outline-variant/10 p-10 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">CHƯA CÓ PHÂN KHÚC NÀO</div>
          )}

          {segments.map((segment) => {
            const isActive = segment.isActive ?? true

            return (
              <div key={segment.id} className="group border border-outline-variant/10 hover:border-primary/40 transition-all duration-500 bg-surface-container-lowest p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-surface-container-high border border-outline-variant/20 flex-shrink-0 flex items-center justify-center">
                  <span className="font-headline-sm text-primary text-xl tracking-wider">{initials(segment.name)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">{segment.name}</h4>
                    <span className={`px-2 py-0.5 font-label-caps text-[10px] border ${isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary-container/30 text-on-surface-variant border-outline-variant/30'}`}>
                      {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="font-body-md text-on-surface-variant/80 line-clamp-1">{segment.description || 'Phân khúc định vị các dòng sản phẩm theo tệp khách hàng và giá trị.'}</p>
                  <p className="mt-2 font-label-caps text-[10px] tracking-[0.18em] text-on-surface-variant/60 uppercase">
                    Phương thức giao hàng: <span className="text-primary">{getDeliveryMethodLabel(segment.deliveryMethod)}</span>
                  </p>
                </div>

                <div className="flex flex-col items-center min-w-20">
                  <span className="font-label-caps text-[10px] text-on-surface-variant">ITEMS</span>
                  <span className="font-headline-sm text-primary">{getWatchCount(segment)}</span>
                </div>

                <div className="flex gap-4 border-l border-outline-variant/20 pl-6">
                  <button onClick={() => onEdit?.(segment)} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => onDelete?.(segment)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
