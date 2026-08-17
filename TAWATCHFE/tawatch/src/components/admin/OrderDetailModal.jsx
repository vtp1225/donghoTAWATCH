import { useEffect, useState } from 'react'
import { orderService } from '../../services/orderService.js'
import GhnTrackingTimeline from '../common/GhnTrackingTimeline.jsx'

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'REFUNDED']

const STATUS_META = {
  PENDING:         { label: 'Chờ xác nhận', chipClass: 'border-primary/30 bg-primary/10 text-primary', dotClass: 'bg-primary' },
  CONFIRMED:       { label: 'Đã xác nhận',  chipClass: 'border-tertiary/30 bg-tertiary/10 text-tertiary', dotClass: 'bg-tertiary' },
  PROCESSING:      { label: 'Đang xử lý',   chipClass: 'border-secondary/30 bg-secondary/10 text-secondary', dotClass: 'bg-secondary' },
  SHIPPING:        { label: 'Đang giao',    chipClass: 'border-surface-tint/40 bg-surface-tint/10 text-surface-tint', dotClass: 'bg-surface-tint' },
  DELIVERED:       { label: 'Hoàn tất',     chipClass: 'border-outline/30 bg-outline/10 text-outline', dotClass: 'bg-outline' },
  CANCELLED:       { label: 'Đã huỷ',       chipClass: 'border-error/30 bg-error/10 text-error', dotClass: 'bg-error' },
  REFUNDED:        { label: 'Hoàn tiền',    chipClass: 'border-on-secondary-container/30 bg-on-secondary-container/10 text-on-secondary-container', dotClass: 'bg-on-secondary-container' },
  RETURN_REQUESTED:{ label: 'Yêu cầu đổi/trả', chipClass: 'border-pink-500/40 bg-pink-500/10 text-pink-400', dotClass: 'bg-pink-400' },
  RETURN_REJECTED: { label: 'Từ chối đổi/trả', chipClass: 'border-gray-500/40 bg-gray-500/10 text-gray-400', dotClass: 'bg-gray-400' },
}

const PAYMENT_META = {
  UNPAID:    { label: 'Chưa thanh toán', className: 'text-error' },
  PAID:      { label: 'Đã thanh toán',   className: 'text-primary' },
  REFUNDED:  { label: 'Đã hoàn tiền',    className: 'text-secondary' },
}

const DELIVERY_LABELS = {
  EXTERNAL_SHIPPER: 'Đơn vị vận chuyển',
  DIRECT_SHOP: 'Nhận tại cửa hàng',
}

function formatCurrency(value) {
  const amount = Number(value) || 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date)
}

function parseAddress(snapshot, fallbackAddress) {
  if (snapshot) {
    try {
      const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
      const parts = [parsed?.addressDetail, parsed?.ward, parsed?.district, parsed?.province].filter(Boolean)
      if (parts.length) return parts.join(', ')
    } catch {
      if (typeof snapshot === 'string') return snapshot
    }
  }
  return fallbackAddress || 'Không có thông tin địa chỉ'
}

function getInSnapshot(snapshot, key) {
  if (!snapshot) return null
  try {
    const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
    return parsed?.[key]
  } catch {
    return null
  }
}

function getStatusMeta(status) {
  return STATUS_META[status] || {
    label: status || 'Không xác định',
    chipClass: 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant',
    dotClass: 'bg-outline-variant',
  }
}

function getPaymentMeta(paymentStatus) {
  return PAYMENT_META[paymentStatus] || { label: paymentStatus || 'N/A', className: 'text-on-surface-variant' }
}

function nextStatus(currentStatus) {
  if (currentStatus === 'PENDING') return 'CONFIRMED'
  if (currentStatus === 'CONFIRMED') return 'PROCESSING'
  if (currentStatus === 'PROCESSING') return 'SHIPPING'
  if (currentStatus === 'SHIPPING') return 'DELIVERED'
  return null
}

function canCancel(currentStatus) {
  return currentStatus === 'PENDING' || currentStatus === 'CONFIRMED'
}

function isReturnRequested(currentStatus) {
  return currentStatus === 'RETURN_REQUESTED'
}

function getActionLabel(next) {
  if (next === 'CONFIRMED') return 'Xác nhận đơn'
  if (next === 'PROCESSING') return 'Bắt đầu xử lý'
  if (next === 'SHIPPING') return 'Chuyển giao vận'
  if (next === 'DELIVERED') return 'Đánh dấu hoàn tất'
  return 'Đã hoàn tất'
}

function InfoRow({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-outline-variant/10 last:border-0">
      <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 uppercase">{label}</span>
      <span className="text-sm text-on-background text-right break-words">{children}</span>
    </div>
  )
}

function SectionCard({ title, icon, children, action }) {
  return (
    <div className="border border-outline-variant/15 bg-surface-container-low p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="material-symbols-outlined text-base text-primary/70">{icon}</span>}
          <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary uppercase">{title}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function OrderDetailModal({ order, onClose, onAdvanceStatus, onCancelOrder, onResolveReturn, updating }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!order?.id) return
    let isMounted = true
    setLoading(true)
    setError('')
    orderService.getOrder(order.id)
      .then((data) => {
        if (!isMounted) return
        setDetail(data || null)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err?.message || 'Không thể tải chi tiết đơn hàng.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [order?.id])

  // Khi prop order cập nhật (sau khi action thành công), merge các field thay đổi vào detail
  // để modal hiển thị trạng thái mới ngay lập tức mà không cần refetch toàn bộ.
  useEffect(() => {
    if (!detail || !order) return
    if (
      order.orderStatus !== detail.orderStatus ||
      order.paymentStatus !== detail.paymentStatus ||
      order.updatedAt !== detail.updatedAt
    ) {
      setDetail((current) => current ? {
        ...current,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        updatedAt: order.updatedAt,
        trackingCode: order.trackingCode ?? current.trackingCode,
        note: order.note ?? current.note,
        returnReason: order.returnReason ?? current.returnReason,
      } : current)
    }
  }, [order?.orderStatus, order?.paymentStatus, order?.updatedAt, order?.trackingCode, order?.note, order?.returnReason])

  if (!order) return null

  // Khi chưa có detail, dùng dữ liệu gọn từ list để hiển thị header tạm
  const snapshot = detail || order
  const customerName = snapshot?.customerName || snapshot?.guestName || snapshot?.user?.fullName
    || getInSnapshot(snapshot?.shippingAddressSnapshot, 'recipientName')
    || `Khách #${snapshot?.id ?? 'N/A'}`
  const customerEmail = snapshot?.guestEmail || snapshot?.customerEmail || snapshot?.user?.email
    || getInSnapshot(snapshot?.shippingAddressSnapshot, 'email') || null
  const customerPhone = snapshot?.guestPhone || snapshot?.customerPhone || snapshot?.user?.phone
    || getInSnapshot(snapshot?.shippingAddressSnapshot, 'phone') || null
  const shippingAddress = parseAddress(snapshot?.shippingAddressSnapshot, snapshot?.shippingAddress)
  const items = Array.isArray(snapshot?.items) ? snapshot.items : []
  const itemsCount = items.reduce((s, it) => s + (Number(it?.quantity) || 0), 0)
  const statusMeta = getStatusMeta(snapshot?.orderStatus)
  const paymentMeta = getPaymentMeta(snapshot?.paymentStatus)
  const next = nextStatus(snapshot?.orderStatus)
  const isUpdating = updating === snapshot?.id

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest border border-outline-variant/20 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-outline-variant/15">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center justify-center w-12 h-12 border border-primary/30 bg-primary/10 flex-shrink-0">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-headline-sm text-xl text-on-background truncate">{snapshot?.orderCode || `ORD-${snapshot?.id}`}</h3>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-label-caps tracking-widest border ${statusMeta.chipClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                  {statusMeta.label}
                </span>
              </div>
              <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 mt-1 uppercase">
                Tạo lúc {formatDateTime(snapshot?.createdAt)} · Cập nhật {formatDateTime(snapshot?.updatedAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="material-symbols-outlined text-on-surface-variant/60 hover:text-on-surface-variant transition-colors flex-shrink-0"
          >
            close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 text-center">
              <p className="font-label-caps text-xs tracking-[0.25em] text-on-surface-variant">ĐANG TẢI CHI TIẾT...</p>
            </div>
          ) : error ? (
            <div className="p-6 border border-error/30 bg-error/10 text-error font-label-caps text-xs tracking-wider uppercase">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Cột trái */}
              <div className="space-y-5">
                <SectionCard title="Khách hàng" icon="person">
                  <InfoRow label="Tên">{customerName}</InfoRow>
                  <InfoRow label="Email">{customerEmail || '—'}</InfoRow>
                  <InfoRow label="Số điện thoại">{customerPhone || '—'}</InfoRow>
                </SectionCard>

                <SectionCard title="Giao nhận" icon="local_shipping">
                  <InfoRow label="Phương thức">
                    {DELIVERY_LABELS[snapshot?.deliveryMethod] || snapshot?.deliveryMethod || '—'}
                  </InfoRow>
                  <InfoRow label="Mã vận đơn">{snapshot?.trackingCode || 'Chưa cập nhật'}</InfoRow>
                  <InfoRow label="Địa chỉ">
                    <span className="block max-w-xs leading-relaxed text-left">{shippingAddress}</span>
                  </InfoRow>
                </SectionCard>

                <SectionCard title="Thanh toán" icon="payments">
                  <InfoRow label="Trạng thái">
                    <span className={paymentMeta.className}>{paymentMeta.label}</span>
                  </InfoRow>
                  <InfoRow label="Phương thức">{snapshot?.paymentMethod || '—'}</InfoRow>
                </SectionCard>

                {snapshot?.note ? (
                  <SectionCard title="Ghi chú" icon="sticky_note_2">
                    <p className="text-sm text-on-surface-variant leading-relaxed">{snapshot.note}</p>
                  </SectionCard>
                ) : null}

                {snapshot?.returnReason ? (
                  <SectionCard title="Lý do đổi/trả" icon="undo">
                    <p className="text-sm text-on-surface-variant leading-relaxed">{snapshot.returnReason}</p>
                  </SectionCard>
                ) : null}

                {snapshot?.trackingCode ? (
                  <SectionCard title="Hành trình vận chuyển" icon="timeline">
                    <GhnTrackingTimeline trackingCode={snapshot.trackingCode} />
                  </SectionCard>
                ) : null}
              </div>

              {/* Cột phải */}
              <div className="space-y-5">
                <SectionCard title="Tiến trình đơn hàng" icon="checklist">
                  <div className="space-y-3">
                    {STATUS_FLOW.map((status) => {
                      const currentIndex = STATUS_FLOW.indexOf(snapshot?.orderStatus)
                      const statusIndex = STATUS_FLOW.indexOf(status)
                      const isDone = currentIndex >= statusIndex
                      const meta = getStatusMeta(status)
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${isDone ? meta.dotClass : 'bg-outline-variant/40'}`} />
                          <span className={`text-sm ${isDone ? 'text-on-background' : 'text-on-surface-variant/50'}`}>{meta.label}</span>
                          {snapshot?.orderStatus === status && (
                            <span className="ml-auto font-label-caps text-[9px] tracking-widest text-primary uppercase">Hiện tại</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </SectionCard>

                <SectionCard title={`Dòng sản phẩm (${items.length})`} icon="inventory_2">
                  {items.length === 0 ? (
                    <p className="text-sm text-on-surface-variant/60">Không có thông tin sản phẩm.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id ?? item.watchVariantId} className="flex items-center gap-3 pb-3 border-b border-outline-variant/10 last:border-0 last:pb-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.watchName} className="w-12 h-12 object-cover border border-outline-variant/20 flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-surface-container flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-sm text-on-surface-variant/40">watch</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-on-background truncate">{item.watchName}</p>
                            {(item.dialColor || item.strapColor) && (
                              <p className="text-xs text-on-surface-variant/60 mt-0.5">
                                {[item.dialColor && `Mặt ${item.dialColor}`, item.strapColor && `Dây ${item.strapColor}`].filter(Boolean).join(' · ')}
                              </p>
                            )}
                            <p className="text-xs text-on-surface-variant/60 mt-0.5">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                          </div>
                          <span className="text-sm text-on-background font-semibold flex-shrink-0">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Tổng kết" icon="request_quote">
                  <InfoRow label="Tạm tính">{formatCurrency(snapshot?.subtotal ?? snapshot?.totalAmount)}</InfoRow>
                  {Number(snapshot?.discountAmount) > 0 && (
                    <InfoRow label="Giảm giá">
                      <span className="text-secondary">- {formatCurrency(snapshot.discountAmount)}</span>
                    </InfoRow>
                  )}
                  {Number(snapshot?.shippingFee) > 0 && (
                    <InfoRow label="Phí vận chuyển">{formatCurrency(snapshot.shippingFee)}</InfoRow>
                  )}
                  <div className="flex justify-between items-center gap-4 pt-3 mt-2 border-t-2 border-outline-variant/20">
                    <span className="font-label-caps text-[10px] tracking-widest text-primary uppercase">Tổng cộng</span>
                    <span className="font-headline-sm text-lg text-primary">{formatCurrency(snapshot?.totalAmount)}</span>
                  </div>
                </SectionCard>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!loading && !error && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-outline-variant/15 bg-surface-container-low">
            {isReturnRequested(snapshot?.orderStatus) ? (
              <>
                <button
                  onClick={() => onResolveReturn?.(snapshot, false)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 border border-gray-400/40 text-gray-400 font-label-caps text-[10px] tracking-widest uppercase hover:bg-gray-400 hover:text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Từ chối đổi/trả
                </button>
                <button
                  onClick={() => onResolveReturn?.(snapshot, true)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 border border-primary/40 text-primary font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary hover:text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Duyệt hoàn tiền
                </button>
              </>
            ) : (
              <>
                {canCancel(snapshot?.orderStatus) && (
                  <button
                    onClick={() => onCancelOrder?.(snapshot)}
                    disabled={isUpdating}
                    className="px-5 py-2.5 border border-error/40 text-error font-label-caps text-[10px] tracking-widest uppercase hover:bg-error hover:text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isUpdating ? 'Đang xử lý...' : 'Huỷ đơn hàng'}
                  </button>
                )}
                {next && (
                  <button
                    onClick={() => onAdvanceStatus?.(snapshot)}
                    disabled={isUpdating}
                    className="px-5 py-2.5 border border-primary/40 text-primary font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary hover:text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isUpdating ? 'Đang cập nhật' : getActionLabel(next)}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
