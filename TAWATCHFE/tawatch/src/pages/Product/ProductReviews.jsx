import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth.js'
import { reviewService } from '../../services/reviewService.js'
import { orderService } from '../../services/orderService.js'
import { containsProfanity, filterMessage } from '../../utils/profanityFilter.js'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function resolveWatchIdFromItem(item) {
  return item?.watchId ?? item?.productSnapshot?.watchId ?? ''
}

function StarDisplay({ value = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`material-symbols-outlined text-[18px] ${s <= value ? 'text-primary' : 'text-on-surface-variant/25'}`}>star</span>
      ))}
    </div>
  )
}

function ReviewCard({ r, pending = false }) {
  return (
    <div className={`border p-4 ${pending ? 'border-outline-variant/30 bg-surface-container-low/60 opacity-70' : 'border-outline-variant/10 bg-surface-container-low'}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-body-md text-sm font-medium">{r.userFullName || 'Khách hàng'}</p>
          {pending && (
            <span className="inline-flex items-center gap-1 mt-0.5 font-label-caps text-[8px] tracking-widest text-on-surface-variant/50 border border-outline-variant/20 px-2 py-0.5">
              ĐANG CHỜ DUYỆT
            </span>
          )}
        </div>
        <div className="text-right">
          <StarDisplay value={r.rating} />
          <p className="text-xs text-on-surface-variant/60 mt-1">{formatDate(r.createdAt)}</p>
        </div>
      </div>
      {r.comment && <p className="text-sm text-on-surface-variant">{r.comment}</p>}
    </div>
  )
}

export default function ProductReviews({ watchId }) {
  const { isAuthenticated, user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [myPendingReview, setMyPendingReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

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

    const tasks = [
      reviewService.getByWatch(watchId),
      isAuthenticated && user?.id ? orderService.getMyOrders(user.id) : Promise.resolve([]),
      isAuthenticated && user?.id ? reviewService.getByUser(user.id) : Promise.resolve([]),
    ]

    Promise.all(tasks)
      .then(([reviewsData, ordersData, myReviewsData]) => {
        if (!mounted) return
        const approved = Array.isArray(reviewsData) ? reviewsData : []
        setReviews(approved)

        if (isAuthenticated && user?.id) {
          // Find my pending review for this watch
          const myPending = (Array.isArray(myReviewsData) ? myReviewsData : [])
            .find((r) => String(r.watchId) === String(watchId) && r.isApproved === false)
          setMyPendingReview(myPending ?? null)

          // Find eligible orders (delivered, contains this watch, not yet reviewed)
          const reviewedOrderIds = new Set([
            ...approved.filter((r) => r.userId === user.id).map((r) => r.orderId),
            ...(myPending ? [myPending.orderId] : []),
          ])
          if (Array.isArray(ordersData)) {
            const eligible = ordersData.filter(
              (o) =>
                o.orderStatus === 'DELIVERED' &&
                (o.items || []).some((it) => String(resolveWatchIdFromItem(it)) === String(watchId)) &&
                !reviewedOrderIds.has(o.id)
            )
            setEligibleOrders(eligible)
            if (eligible.length > 0) setSelectedOrderId(String(eligible[0].id))
          }
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
    if (containsProfanity(comment)) {
      setError(filterMessage())
      return
    }
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      const created = await reviewService.createReview({
        userId: user.id,
        watchId: Number(watchId),
        orderId: Number(selectedOrderId),
        rating,
        comment: comment.trim(),
      })
      setMyPendingReview(created)
      setEligibleOrders((prev) => prev.filter((o) => String(o.id) !== selectedOrderId))
      setComment('')
      setRating(5)
      setSuccessMsg('Đánh giá của bạn đang chờ admin duyệt. Cảm ơn bạn!')
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

  const allDisplayed = myPendingReview
    ? [{ ...myPendingReview, _pending: true }, ...reviews]
    : reviews

  return (
    <section id="reviews" data-product-reviews className="mt-20">
      <div className="mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[18px] text-primary/70">reviews</span>
        <h2 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Đánh giá</h2>
        <div className="h-px flex-1 bg-outline-variant/10" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-5">
          <div className="border border-outline-variant/10 bg-surface-container-low p-6">
            <p className="mb-3 font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/70">GỬI ĐÁNH GIÁ</p>

            {!isAuthenticated ? (
              <p className="font-body-md text-sm text-on-surface-variant/70">Vui lòng đăng nhập để gửi đánh giá.</p>
            ) : myPendingReview && eligibleOrders.length === 0 ? (
              <div className="flex items-start gap-3 py-3">
                <span className="material-symbols-outlined text-primary/60 text-lg mt-0.5">check_circle</span>
                <p className="font-body-md text-sm text-on-surface-variant/70">Bạn đã gửi đánh giá cho sản phẩm này. Đang chờ admin duyệt.</p>
              </div>
            ) : eligibleOrders.length === 0 ? (
              <p className="font-body-md text-sm text-on-surface-variant/70">Bạn chưa có đơn hàng đã giao chứa sản phẩm này.</p>
            ) : (
              <>
                {successMsg && (
                  <div className="mb-4 flex items-start gap-2 border border-primary/20 bg-primary/5 px-4 py-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                    <p className="font-body-md text-sm text-primary">{successMsg}</p>
                  </div>
                )}

                <label className="block mb-2 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">Đơn hàng</label>
                <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} className="w-full border-b border-outline-variant/25 bg-transparent py-2.5 text-sm">
                  {eligibleOrders.map((o) => (
                    <option key={o.id} value={String(o.id)}>{o.orderCode || `Đơn #${o.id}`}</option>
                  ))}
                </select>

                <label className="block mt-4 mb-2 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">Số sao</label>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)} className={`material-symbols-outlined text-[22px] transition-colors ${s <= rating ? 'text-primary' : 'text-on-surface-variant/25 hover:text-primary/50'}`}>star</button>
                  ))}
                </div>

                <label className="block mb-2 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">Nội dung</label>
                <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border border-outline-variant/20 p-3 bg-transparent text-sm resize-none focus:outline-none focus:border-primary/40" placeholder="Chia sẻ cảm nhận của bạn..." />

                {error && <p className="mt-3 text-sm text-error">{error}</p>}

                <div className="mt-4">
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="border border-primary px-5 py-2 font-label-caps text-xs tracking-widest text-primary hover:bg-primary hover:text-background transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-7">
          {allDisplayed.length === 0 ? (
            <div className="border border-dashed border-outline-variant/15 py-12 text-center">
              <span className="material-symbols-outlined mb-3 block text-4xl text-on-surface-variant/15">sentiment_satisfied</span>
              <p className="font-body-md text-sm text-on-surface-variant/50">Chưa có đánh giá nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allDisplayed.map((r) => (
                <ReviewCard key={r.id} r={r} pending={r._pending === true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
