import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import useAuth from '../../hooks/useAuth.js'
import { orderService } from '../../services/orderService.js'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatVnd(value) {
  if (value == null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function parseAddress(snapshot) {
  if (!snapshot) return null
  try { return typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot }
  catch { return null }
}

function resolveImage(item) {
  return item.imageUrl || '/images/product-heritage.jpg'
}

// ─── configs ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xác nhận',   color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',    dot: 'bg-amber-400',    icon: 'schedule' },
  CONFIRMED:  { label: 'Đã xác nhận',    color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',       dot: 'bg-blue-400',     icon: 'verified' },
  PROCESSING: { label: 'Đang xử lý',     color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400', dot: 'bg-indigo-400',   icon: 'autorenew' },
  SHIPPING:   { label: 'Đang giao hàng', color: 'border-orange-500/40 bg-orange-500/10 text-orange-400', dot: 'bg-orange-400',   icon: 'local_shipping' },
  DELIVERED:  { label: 'Đã giao hàng',   color: 'border-primary/40 bg-primary/10 text-primary',          dot: 'bg-primary',      icon: 'check_circle' },
  CANCELLED:  { label: 'Đã huỷ',         color: 'border-red-500/40 bg-red-500/10 text-red-400',          dot: 'bg-red-400',      icon: 'cancel' },
  REFUNDED:   { label: 'Đã hoàn tiền',   color: 'border-purple-500/40 bg-purple-500/10 text-purple-400', dot: 'bg-purple-400',   icon: 'currency_exchange' },
}

const PAYMENT_STATUS_CONFIG = {
  UNPAID: { label: 'Chưa thanh toán', color: 'text-amber-400',         icon: 'schedule' },
  PAID:   { label: 'Đã thanh toán',   color: 'text-primary',           icon: 'check_circle' },
  FAILED: { label: 'Thanh toán lỗi',  color: 'text-red-400',           icon: 'error' },
}

const PAYMENT_METHOD_LABEL  = { COD: 'Thanh toán khi nhận hàng', VNPAY: 'Ví VNPAY', BANK_TRANSFER: 'Chuyển khoản ngân hàng' }
const DELIVERY_METHOD_LABEL = { EXTERNAL_SHIPPER: 'Giao hàng tận nơi', DIRECT_SHOP: 'Nhận tại cửa hàng' }
const PAYMENT_METHOD_ICON   = { COD: 'payments', VNPAY: 'account_balance_wallet', BANK_TRANSFER: 'account_balance' }
const DELIVERY_METHOD_ICON  = { EXTERNAL_SHIPPER: 'local_shipping', DIRECT_SHOP: 'storefront' }

const FILTER_TABS = [
  { value: 'ALL',       label: 'Tất cả' },
  { value: 'PENDING',   label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING',  label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã huỷ' },
]

const CANCELLABLE = new Set(['PENDING', 'CONFIRMED'])

// ─── Order progress steps ────────────────────────────────────────────────────

const PROGRESS_STEPS = [
  { status: 'PENDING',    label: 'Chờ xác nhận', icon: 'schedule' },
  { status: 'CONFIRMED',  label: 'Xác nhận',     icon: 'verified' },
  { status: 'PROCESSING', label: 'Xử lý',        icon: 'autorenew' },
  { status: 'SHIPPING',   label: 'Đang giao',    icon: 'local_shipping' },
  { status: 'DELIVERED',  label: 'Đã giao',      icon: 'check_circle' },
]

const STEP_INDEX = { PENDING: 0, CONFIRMED: 1, PROCESSING: 2, SHIPPING: 3, DELIVERED: 4 }

function OrderProgressBar({ status }) {
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    const cfg = STATUS_CONFIG[status]
    return (
      <div className={`flex items-center gap-3 border px-4 py-3 ${cfg.color}`}>
        <span className="material-symbols-outlined text-[18px]">{cfg.icon}</span>
        <p className="font-label-caps text-[10px] tracking-[0.2em]">{cfg.label}</p>
      </div>
    )
  }

  const currentStep = STEP_INDEX[status] ?? 0

  return (
    <div className="relative pt-2">
      {/* Line */}
      <div className="absolute left-0 right-0 top-[18px] h-px bg-outline-variant/15">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${currentStep === 0 ? 0 : (currentStep / (PROGRESS_STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between">
        {PROGRESS_STEPS.map((step, idx) => {
          const done    = idx < currentStep
          const current = idx === currentStep
          return (
            <div key={step.status} className="flex flex-col items-center gap-2" style={{ width: `${100 / PROGRESS_STEPS.length}%` }}>
              <div
                className={`relative z-10 flex h-9 w-9 items-center justify-center border transition-all duration-300 ${
                  current
                    ? 'border-primary bg-primary text-background shadow-[0_0_12px_rgba(var(--color-primary)/0.4)]'
                    : done
                    ? 'border-primary/60 bg-primary/15 text-primary'
                    : 'border-outline-variant/20 bg-background text-on-surface-variant/30'
                }`}
              >
                <span className={`material-symbols-outlined text-[14px] ${current ? 'animate-pulse' : ''}`}>
                  {done ? 'check' : step.icon}
                </span>
              </div>
              <p
                className={`text-center font-label-caps text-[8px] tracking-[0.15em] leading-tight ${
                  current ? 'text-primary' : done ? 'text-primary/60' : 'text-on-surface-variant/30'
                }`}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'border-outline-variant/30 text-on-surface-variant', icon: 'info' }
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-label-caps text-[9px] tracking-[0.2em] ${cfg.color}`}>
      <span className="material-symbols-outlined text-[11px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

// ─── CancelPanel ─────────────────────────────────────────────────────────────

function CancelPanel({ orderId, userId, onCancelled }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    setLoading(true)
    setError('')
    try {
      await orderService.cancelOrder(orderId, { userId, reason: reason || 'Không có lý do' })
      onCancelled()
    } catch (err) {
      setError(err?.message || 'Không thể huỷ đơn hàng.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border border-red-500/30 px-4 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-red-400 transition-colors hover:bg-red-500/10"
      >
        <span className="material-symbols-outlined text-[14px]">cancel</span>
        HUỶ ĐƠN HÀNG
      </button>
    )
  }

  return (
    <div className="border border-red-500/20 bg-red-500/5 p-5">
      <p className="mb-3 font-label-caps text-[9px] tracking-[0.25em] text-red-400">XÁC NHẬN HUỶ ĐƠN HÀNG</p>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Lý do huỷ (không bắt buộc)"
        className="mb-4 w-full border-b border-red-500/20 bg-transparent py-2 font-body-md text-xs text-on-surface outline-none placeholder:text-on-surface-variant/30 focus:border-red-400"
      />
      {error && <p className="mb-3 font-body-md text-xs text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="border border-red-500/40 px-5 py-2 font-label-caps text-[9px] tracking-[0.15em] text-red-400 transition-colors hover:bg-red-500/15 disabled:opacity-50"
        >
          {loading ? 'ĐANG HUỶ...' : 'XÁC NHẬN'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError('') }}
          className="border border-outline-variant/25 px-5 py-2 font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          GIỮ ĐƠN
        </button>
      </div>
    </div>
  )
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order, userId, onCancelled }) {
  const [expanded, setExpanded] = useState(false)
  const address     = parseAddress(order.shippingAddressSnapshot)
  const paymentCfg  = PAYMENT_STATUS_CONFIG[order.paymentStatus] ?? { label: order.paymentStatus, color: 'text-on-surface-variant', icon: 'info' }
  const previewImgs = (order.items ?? []).slice(0, 3)

  return (
    <div className={`border transition-all duration-300 ${expanded ? 'border-primary/20 bg-surface-container' : 'border-outline-variant/10 bg-surface-container-low hover:border-outline-variant/20'}`}>

      {/* ── Collapsed header ── */}
      <button
        type="button"
        className="w-full px-6 py-5 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center">

          {/* Product thumbnails */}
          {previewImgs.length > 0 && (
            <div className="flex flex-shrink-0 items-center">
              <div className="flex">
                {previewImgs.map((item, idx) => (
                  <div
                    key={item.id}
                    className="h-14 w-14 overflow-hidden border border-outline-variant/10 bg-surface-container"
                    style={{ marginLeft: idx === 0 ? 0 : '-12px', zIndex: previewImgs.length - idx }}
                  >
                    <img alt={item.watchName} src={resolveImage(item)} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              {(order.items?.length ?? 0) > 3 && (
                <div className="ml-1 flex h-14 w-10 items-center justify-center bg-surface-container border border-outline-variant/10">
                  <span className="font-label-caps text-[10px] text-on-surface-variant/60">+{order.items.length - 3}</span>
                </div>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-label-caps text-[11px] tracking-[0.2em] text-primary">{order.orderCode}</span>
              <StatusBadge status={order.orderStatus} />
              <span className={`inline-flex items-center gap-1 font-label-caps text-[9px] tracking-[0.15em] ${paymentCfg.color}`}>
                <span className="material-symbols-outlined text-[11px]">{paymentCfg.icon}</span>
                {paymentCfg.label}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-body-md text-xs text-on-surface-variant/70">{formatDate(order.createdAt)}</span>
              <span className="font-body-md text-xs text-on-surface-variant/50">{order.items?.length ?? 0} sản phẩm</span>
            </div>
          </div>

          {/* Total + expand */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <div className="text-right">
              <p className="font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant/50">TỔNG TIỀN</p>
              <p className="mt-0.5 font-headline-sm text-headline-sm text-primary">{formatVnd(order.totalAmount)}</p>
            </div>
            <div className={`flex h-8 w-8 items-center justify-center border transition-all duration-300 ${expanded ? 'border-primary text-primary' : 'border-outline-variant/20 text-on-surface-variant/40'}`}>
              <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className="border-t border-outline-variant/10 px-6 pb-8 pt-6">

          {/* Progress bar */}
          <div className="mb-10">
            <p className="mb-5 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/50">TIẾN TRÌNH ĐƠN HÀNG</p>
            <OrderProgressBar status={order.orderStatus} />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

            {/* Items list */}
            <div className="lg:col-span-7">
              <p className="mb-5 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/50">SẢN PHẨM</p>
              <div className="space-y-4">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border border-outline-variant/8 bg-surface-container-low p-3">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-surface-container">
                      <img alt={item.watchName} src={resolveImage(item)} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body-md text-sm font-medium text-on-surface">{item.watchName}</p>
                      <p className="mt-1 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant/60">
                        {item.dialColor} / {item.strapColor}
                      </p>
                      <p className="mt-1 font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/40">
                        SL: {item.quantity} × {formatVnd(item.unitPrice)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-body-md text-sm text-primary">{formatVnd(item.totalPrice ?? item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="mt-6 space-y-2.5 border-t border-outline-variant/10 pt-5">
                {order.discountAmount > 0 && (
                  <div className="flex justify-between font-body-md text-xs">
                    <span className="text-on-surface-variant">Giảm giá</span>
                    <span className="text-primary">− {formatVnd(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body-md text-xs">
                  <span className="text-on-surface-variant">Phí vận chuyển</span>
                  <span className={order.shippingFee > 0 ? 'text-on-surface' : 'text-primary'}>
                    {order.shippingFee > 0 ? formatVnd(order.shippingFee) : 'Miễn phí'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant/10 pt-2.5 font-body-md text-sm">
                  <span className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant">TỔNG CỘNG</span>
                  <span className="font-headline-sm text-headline-sm text-primary">{formatVnd(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Info panel */}
            <div className="space-y-6 lg:col-span-5">

              {/* Shipping address */}
              {address && (
                <div className="border border-outline-variant/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                    <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60">ĐỊA CHỈ NHẬN HÀNG</p>
                  </div>
                  <p className="font-body-md text-sm font-medium text-on-surface">{address.recipientName}</p>
                  <p className="mt-1 font-body-md text-xs text-on-surface-variant">{address.phone}</p>
                  <p className="mt-0.5 font-body-md text-xs text-on-surface-variant">
                    {address.addressDetail}, {address.ward}, {address.district}, {address.province}
                  </p>
                </div>
              )}

              {!address && order.guestName && (
                <div className="border border-outline-variant/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">person</span>
                    <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60">THÔNG TIN NHẬN HÀNG</p>
                  </div>
                  <p className="font-body-md text-sm font-medium text-on-surface">{order.guestName}</p>
                  <p className="mt-1 font-body-md text-xs text-on-surface-variant">{order.guestPhone}</p>
                  <p className="mt-0.5 font-body-md text-xs text-on-surface-variant">{order.guestEmail}</p>
                </div>
              )}

              {/* Payment & delivery */}
              <div className="border border-outline-variant/10 p-5">
                <p className="mb-4 font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60">THANH TOÁN & VẬN CHUYỂN</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50">
                      {PAYMENT_METHOD_ICON[order.paymentMethod] ?? 'payments'}
                    </span>
                    <div>
                      <p className="font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/50">PHƯƠNG THỨC THANH TOÁN</p>
                      <p className="font-body-md text-xs text-on-surface">{PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50">
                      {DELIVERY_METHOD_ICON[order.deliveryMethod] ?? 'local_shipping'}
                    </span>
                    <div>
                      <p className="font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/50">PHƯƠNG THỨC VẬN CHUYỂN</p>
                      <p className="font-body-md text-xs text-on-surface">{DELIVERY_METHOD_LABEL[order.deliveryMethod] ?? order.deliveryMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking code */}
              {order.trackingCode && (
                <div className="border border-outline-variant/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">pin</span>
                    <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60">MÃ VẬN ĐƠN</p>
                  </div>
                  <p className="font-label-caps text-[13px] tracking-[0.3em] text-primary">{order.trackingCode}</p>
                </div>
              )}

              {/* Note */}
              {order.note && (
                <div className="border border-outline-variant/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50">sticky_note_2</span>
                    <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60">GHI CHÚ</p>
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant">{order.note}</p>
                </div>
              )}

              {/* Cancel */}
              {CANCELLABLE.has(order.orderStatus) && (
                <CancelPanel orderId={order.id} userId={userId} onCancelled={onCancelled} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ orders }) {
  const total     = orders.length
  const delivered = orders.filter((o) => o.orderStatus === 'DELIVERED').length
  const pending   = orders.filter((o) => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(o.orderStatus)).length
  const totalSpent = orders.filter((o) => o.orderStatus === 'DELIVERED').reduce((s, o) => s + (o.totalAmount ?? 0), 0)

  const stats = [
    { label: 'Tổng đơn hàng', value: total,            icon: 'receipt_long' },
    { label: 'Đơn đang xử lý', value: pending,          icon: 'pending_actions' },
    { label: 'Đã giao thành công', value: delivered,    icon: 'check_circle' },
    { label: 'Tổng chi tiêu',   value: null, vnd: totalSpent, icon: 'savings' },
  ]

  return (
    <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="border border-outline-variant/10 bg-surface-container-low p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary/60">{s.icon}</span>
            <p className="font-label-caps text-[8px] tracking-[0.2em] text-on-surface-variant/50">{s.label.toUpperCase()}</p>
          </div>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            {s.vnd != null ? formatVnd(s.vnd) : s.value}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OrderHistory() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    setLoading(true)
    orderService.getMyOrders(user.id)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Không thể tải đơn hàng.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, user?.id])

  const handleCancelled = (orderId) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, orderStatus: 'CANCELLED' } : o))
  }

  const displayed = activeFilter === 'ALL' ? orders : orders.filter((o) => o.orderStatus === activeFilter)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
          <div className="py-24 text-center">
            <span className="material-symbols-outlined mb-6 block text-5xl text-on-surface-variant/20">receipt_long</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">Vui lòng đăng nhập</p>
            <p className="mt-3 font-body-md text-sm text-on-surface-variant">Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: '/orders' } })}
              className="mt-8 inline-block border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">

        {/* Header */}
        <header className="mb-12 text-center">
          <p className="font-label-caps text-[10px] tracking-[0.3em] text-primary">MY ACCOUNT</p>
          <h1 className="mt-4 font-headline-md text-headline-md italic text-on-surface">Đơn hàng của tôi</h1>
          <p className="mt-3 font-body-md text-sm text-on-surface-variant">
            Xin chào, <span className="text-primary">{user?.fullName || user?.username}</span>
          </p>
        </header>

        {loading ? (
          <div className="py-32 text-center">
            <span className="material-symbols-outlined mb-4 block animate-spin text-4xl text-primary/30">progress_activity</span>
            <p className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40">ĐANG TẢI...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined mb-4 block text-4xl text-red-400/50">error</span>
            <p className="font-body-md text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => { setError(''); setLoading(true); orderService.getMyOrders(user.id).then((d) => setOrders(Array.isArray(d) ? d : [])).catch((e) => setError(e?.message)).finally(() => setLoading(false)) }}
              className="mt-6 border border-primary px-6 py-2.5 font-label-caps text-[10px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              THỬ LẠI
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-28 text-center">
            <span className="material-symbols-outlined mb-6 block text-6xl text-on-surface-variant/15">shopping_bag</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">Chưa có đơn hàng nào</p>
            <p className="mt-3 font-body-md text-sm text-on-surface-variant">Hãy khám phá bộ sưu tập đồng hồ của chúng tôi.</p>
            <Link
              to="/products"
              className="mt-8 inline-block border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              KHÁM PHÁ SẢN PHẨM
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <StatsBar orders={orders} />

            {/* Filter tabs */}
            <div className="mb-8 flex flex-wrap gap-2 border-b border-outline-variant/10 pb-6">
              {FILTER_TABS.map((tab) => {
                const count = tab.value === 'ALL' ? orders.length : orders.filter((o) => o.orderStatus === tab.value).length
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveFilter(tab.value)}
                    className={`flex items-center gap-2 border px-4 py-2 font-label-caps text-[9px] tracking-[0.2em] transition-all duration-200 ${
                      activeFilter === tab.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-outline-variant/20 text-on-surface-variant/60 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={`flex h-4 min-w-[16px] items-center justify-center px-1 font-label-caps text-[8px] ${
                        activeFilter === tab.value ? 'bg-primary text-background' : 'bg-outline-variant/15 text-on-surface-variant/50'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Orders list */}
            {displayed.length === 0 ? (
              <div className="py-20 text-center">
                <span className="material-symbols-outlined mb-4 block text-5xl text-on-surface-variant/15">inbox</span>
                <p className="font-headline-sm text-headline-sm text-on-surface">Không có đơn hàng nào trong mục này</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayed.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userId={user.id}
                    onCancelled={() => handleCancelled(order.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>
      <Footer />
    </div>
  )
}
