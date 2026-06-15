import { useEffect, useMemo, useState } from 'react'
import useAuth from '../../hooks/useAuth.js'
import { reviewService } from '../../services/reviewService.js'
import { orderService } from '../../services/orderService.js'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function resolveImage(item) {
  return item?.imageUrl || item?.productSnapshot?.imageUrl || '/images/product-heritage.jpg'
}

function resolveWatchIdFromItem(item) {
  return item?.watchId ?? item?.productSnapshot?.watchId ?? ''
}

function StarDisplay({ value = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`material-symbols-outlined ${s <= value ? 'text-primary' : 'text-on-surface-variant/25'}`}>star</span>
      ))}
    </div>
  )
}

export default function ProductReviews({ watchId }) {
  const { isAuthenticated, user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // form
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [eligibleOrders, setEligibleOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    Promise.all([
      reviewService.getByWatch(watchId),
      isAuthenticated && user?.id ? orderService.getMyOrders(user.id) : Promise.resolve([]),
    ])
      .then(([reviewsData, ordersData]) => {
        if (!mounted) return
        setReviews(Array.isArray(reviewsData) ? reviewsData : [])

        if (isAuthenticated && Array.isArray(ordersData)) {
          const eligible = ordersData.filter((o) => o.orderStatus === 'DELIVERED' && (o.items || []).some((it) => String(resolveWatchIdFromItem(it)) === String(watchId)))
          setEligibleOrders(eligible)
          if (eligible.length > 0) setSelectedOrderId(String(eligible[0].id))
        }
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'Không thể tải đánh giá.')
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [watchId, isAuthenticated, user?.id])

  const handleSubmit = async () => {
    if (!isAuthenticated || !user?.id) {
      setError('Vui lòng đăng nhập để gửi đánh giá.')
      return
    }
    if (!selectedOrderId) {
      setError('Vui lòng chọn đơn hàng đã giao chứa sản phẩm này.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const created = await reviewService.createReview({
        userId: user.id,
        watchId: Number(watchId),
        orderId: Number(selectedOrderId),
        rating,
        comment: comment.trim(),
      })
      setReviews((p) => [created, ...p])
      setComment('')
    } catch (err) {
      setError(err?.message || 'Không thể gửi đánh giá.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="py-12 text-center">
      <span className="material-symbols-outlined animate-spin block mb-3 text-3xl text-primary/30">progress_activity</span>
      <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/40">ĐANG TẢI...</p>
    </div>
  )

  return (
    <section data-product-reviews className="mt-20">
      <div className="mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[18px] text-primary/70">reviews</span>
        <h2 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Đánh giá</h2>
        <div className="h-px flex-1 bg-outline-variant/10" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="border border-outline-variant/10 bg-surface-container-low p-6">
            <p className="mb-3 font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/70">GỬI ĐÁNH GIÁ</p>
            {!isAuthenticated ? (
              <p className="font-body-md text-sm">Vui lòng đăng nhập để gửi đánh giá.</p>
            ) : eligibleOrders.length === 0 ? (
              <p className="font-body-md text-sm">Bạn chưa có đơn hàng đã giao chứa sản phẩm này.</p>
            ) : (
              <>
                <label className="block mb-2 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">Đơn hàng</label>
                <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} className="w-full border-b border-outline-variant/25 bg-transparent py-2.5">
                  {eligibleOrders.map((o) => (
                    <option key={o.id} value={String(o.id)}>{o.orderCode || `Đơn #${o.id}`}</option>
                  ))}
                </select>

                <label className="block mt-4 mb-2 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">Số sao</label>
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} className={`material-symbols-outlined text-[22px] ${s <= rating ? 'text-primary' : 'text-on-surface-variant/25'}`}>star</button>
                  ))}
                </div>

                <label className="block mb-2 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">Nội dung</label>
                <textarea id="product-review-textarea" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border border-outline-variant/20 p-3 bg-transparent" placeholder="Chia sẻ cảm nhận của bạn..." />

                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                <div className="mt-4">
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="border border-primary px-5 py-2 text-sm text-primary">
                    {submitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          {reviews.length === 0 ? (
            <div className="border border-dashed border-outline-variant/15 py-12 text-center">
              <span className="material-symbols-outlined mb-3 block text-4xl text-on-surface-variant/15">sentiment_satisfied</span>
              <p className="font-body-md text-sm text-on-surface-variant/50">Chưa có đánh giá nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-outline-variant/10 p-4 bg-surface-container-low">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-body-md text-sm font-medium">{r.userFullName || 'Khách hàng'}</p>
                      <p className="font-label-caps text-[9px] text-on-surface-variant/50">{r.orderCode || '—'}</p>
                    </div>
                    <div className="text-right">
                      <StarDisplay value={r.rating} />
                      <p className="text-xs text-on-surface-variant/60 mt-1">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-on-surface-variant">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
