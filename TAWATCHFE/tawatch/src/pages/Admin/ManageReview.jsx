import { useState, useEffect, useCallback } from 'react'
import { reviewService } from '../../services/reviewService'

const TABS = [
  { label: 'TẤT CẢ', value: 'all', isApproved: undefined },
  { label: 'CHỜ DUYỆT', value: 'pending', isApproved: false },
  { label: 'ĐÃ DUYỆT', value: 'approved', isApproved: true },
]

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i < rating ? 'text-primary' : 'text-on-surface-variant/20'}`}
          style={i < rating ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          star
        </span>
      ))}
    </div>
  )
}

function formatDate(instant) {
  if (!instant) return '—'
  return new Date(instant).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ManageReview() {
  const [activeTab, setActiveTab] = useState('all')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [approvingId, setApprovingId] = useState(null)
  const [expandedIds, setExpandedIds] = useState(new Set())

  const tab = TABS.find((t) => t.value === activeTab)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await reviewService.getAll(tab?.isApproved)
      setReviews(data)
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu.')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => { load() }, [load])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleApprove(review) {
    setApprovingId(review.id)
    try {
      const updated = await reviewService.approve(review.id)
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isApproved: true } : r)))
      showToast(`Đã duyệt đánh giá của "${review.userFullName}"`)
    } catch (err) {
      showToast('Không thể duyệt đánh giá. ' + (err?.message || ''), 'error')
    } finally {
      setApprovingId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await reviewService.deleteReview(deleteTarget.id)
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id))
      showToast(`Đã xoá đánh giá của "${deleteTarget.userFullName}"`)
      setDeleteTarget(null)
    } catch (err) {
      showToast('Không thể xoá đánh giá. ' + (err?.message || ''), 'error')
    } finally {
      setDeleting(false)
    }
  }

  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const pendingCount = reviews.filter((r) => !r.isApproved).length

  return (
    <main className="ml-72 mt-20 min-h-screen overflow-x-hidden" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <section className="mb-16 pt-8">
        <div className="flex justify-between items-end mb-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] block mb-4 uppercase"></span>
            <h2 className="font-display-lg text-display-lg text-on-background">Đánh Giá</h2>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-6 py-3 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-[0.2em] uppercase hover:border-primary hover:text-primary transition-all duration-500"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Làm mới
          </button>
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          { label: 'TỔNG ĐÁNH GIÁ', value: reviews.length, icon: 'rate_review' },
          { label: 'CHỜ DUYỆT', value: pendingCount, icon: 'pending', accent: pendingCount > 0 },
          { label: 'ĐÃ DUYỆT', value: reviews.filter((r) => r.isApproved).length, icon: 'verified' },
        ].map((stat) => (
          <div key={stat.label} className="border border-outline-variant/15 bg-surface-container-low p-6">
            <div className="flex items-start justify-between mb-4">
              <span className={`material-symbols-outlined ${stat.accent ? 'text-amber-500' : 'text-primary'}`}>{stat.icon}</span>
              <span className={`font-display-lg text-3xl ${stat.accent ? 'text-amber-500' : 'text-on-background'}`}>{loading ? '—' : stat.value}</span>
            </div>
            <p className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 mb-8 border-b border-outline-variant/10">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`relative pb-3 font-label-caps text-xs tracking-widest transition-colors ${
              activeTab === t.value ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'
            }`}
          >
            {t.label}
            {t.value === 'pending' && pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-background font-label-caps text-[9px]">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
            {activeTab === t.value && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
            )}
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
      {!loading && !error && reviews.length === 0 && (
        <div className="py-24 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 block mb-4">rate_review</span>
          <p className="font-label-caps text-xs text-on-surface-variant/40 tracking-widest">KHÔNG CÓ ĐÁNH GIÁ NÀO</p>
        </div>
      )}

      {/* Review cards */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => {
            const isExpanded = expandedIds.has(review.id)
            const isLong = review.comment?.length > 200
            return (
              <div
                key={review.id}
                className={`border transition-all duration-300 ${
                  review.isApproved
                    ? 'border-outline-variant/10 bg-surface-container-low'
                    : 'border-amber-500/20 bg-amber-500/5'
                }`}
              >
                <div className="p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                        <span className="font-headline-sm text-sm text-primary uppercase">
                          {review.userFullName?.[0] ?? '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-headline-sm text-sm text-on-background">{review.userFullName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Stars rating={review.rating} />
                          <span className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-widest">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {review.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/10 text-primary px-2 py-1 font-label-caps text-[10px] tracking-[0.15em]">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          ĐÃ DUYỆT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 px-2 py-1 font-label-caps text-[10px] tracking-[0.15em]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          CHỜ DUYỆT
                        </span>
                      )}

                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review)}
                          disabled={approvingId === review.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 text-primary font-label-caps text-[10px] tracking-widest hover:bg-primary/10 transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {approvingId === review.id ? 'ĐANG DUYỆT...' : 'DUYỆT'}
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget(review)}
                        className="material-symbols-outlined text-on-surface-variant/30 hover:text-error transition-colors"
                        title="Xoá đánh giá"
                      >
                        delete
                      </button>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="pl-13 ml-13">
                    <p className={`font-body-md text-sm text-on-surface-variant leading-relaxed ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}
                       style={{ marginLeft: '52px' }}>
                      {review.comment}
                    </p>
                    {isLong && (
                      <button
                        onClick={() => toggleExpand(review.id)}
                        className="font-label-caps text-[10px] text-primary tracking-widest hover:underline mt-1"
                        style={{ marginLeft: '52px' }}
                      >
                        {isExpanded ? 'THU GỌN' : 'XEM THÊM'}
                      </button>
                    )}
                  </div>

                  {/* Watch reference */}
                  <div className="mt-5 pt-4 border-t border-outline-variant/10" style={{ marginLeft: '52px' }}>
                    <div className="flex items-center gap-4 p-3 bg-surface-container border border-outline-variant/15 w-fit max-w-sm">
                      <div className="w-14 h-16 bg-surface-container-highest flex-shrink-0 overflow-hidden">
                        {review.watchMainImageUrl ? (
                          <img
                            src={review.watchMainImageUrl}
                            alt={review.watchName}
                            className="w-full h-full object-cover opacity-85"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-surface-variant/20 text-2xl">watch</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-[0.3em] mb-1">SẢN PHẨM</p>
                        <p className="font-headline-sm text-sm text-on-background leading-snug">{review.watchName}</p>
                        <p className="font-label-caps text-[10px] text-on-surface-variant/50 tracking-widest mt-1">
                          {review.orderCode ?? `#${review.orderId}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      {!loading && reviews.length > 0 && (
        <p className="mt-8 font-label-caps text-[10px] text-on-surface-variant/30 tracking-widest">
          HIỂN THỊ {reviews.length} ĐÁNH GIÁ
        </p>
      )}

      <footer className="mt-16 pb-8 opacity-20">
        <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
        <div className="flex justify-between items-center">
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">Security Level: Gold Tier</p>
          <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase">© 2024 Horological Heritage Archive</p>
        </div>
      </footer>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-surface-container-low border border-outline-variant/20 p-10 max-w-sm w-full mx-4">
            <p className="font-label-caps text-[10px] text-error tracking-widest mb-4 uppercase">Xác nhận xoá</p>
            <p className="font-headline-sm text-headline-sm text-on-background mb-2">
              Đánh giá của <span className="text-primary">{deleteTarget.userFullName}</span>
            </p>
            <p className="font-label-caps text-[10px] text-on-surface-variant/50 mb-3 tracking-widest">{deleteTarget.watchName}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60 italic mb-8 line-clamp-3">
              "{deleteTarget.comment}"
            </p>
            <p className="font-body-md text-sm text-on-surface-variant/40 mb-8">Hành động này không thể hoàn tác.</p>
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

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 font-label-caps text-xs tracking-widest shadow-lg transition-all duration-300 ${toast.type === 'error' ? 'bg-error text-white' : 'bg-primary text-background'}`}>
          {toast.message}
        </div>
      )}
    </main>
  )
}
