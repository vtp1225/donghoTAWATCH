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
  try {
    return typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
  } catch {
    return null
  }
}

function resolveImage(item) {
  return item.imageUrl || '/images/product-heritage.jpg'
}

// ─── status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xác nhận',   color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',   icon: 'schedule' },
  CONFIRMED:  { label: 'Đã xác nhận',    color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',      icon: 'verified' },
  PROCESSING: { label: 'Đang xử lý',     color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',icon: 'autorenew' },
  SHIPPING:   { label: 'Đang giao hàng', color: 'border-orange-500/40 bg-orange-500/10 text-orange-400',icon: 'local_shipping' },
  DELIVERED:  { label: 'Đã giao hàng',   color: 'border-primary/40 bg-primary/10 text-primary',         icon: 'check_circle' },
  CANCELLED:  { label: 'Đã huỷ',         color: 'border-red-500/40 bg-red-500/10 text-red-400',         icon: 'cancel' },
  REFUNDED:   { label: 'Đã hoàn tiền',   color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',icon: 'currency_exchange' },
}

const PAYMENT_STATUS_CONFIG = {
  UNPAID: { label: 'Chưa thanh toán', color: 'text-amber-400' },
  PAID:   { label: 'Đã thanh toán',   color: 'text-primary' },
  FAILED: { label: 'Thanh toán lỗi',  color: 'text-red-400' },
}

const PAYMENT_METHOD_LABEL = { COD: 'Thanh toán khi nhận hàng', VNPAY: 'Ví VNPAY', BANK_TRANSFER: 'Chuyển khoản ngân hàng' }
const DELIVERY_METHOD_LABEL = { EXTERNAL_SHIPPER: 'Giao hàng tận nơi', DIRECT_SHOP: 'Nhận tại cửa hàng' }

const FILTER_TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã huỷ' },
]

const CANCELLABLE = new Set(['PENDING', 'CONFIRMED'])

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'border-outline-variant/30 text-on-surface-variant', icon: 'info' }
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-label-caps text-[9px] tracking-[0.2em] ${cfg.color}`}>
      <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
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
        className="flex items-center gap-2 border border-red-500/30 px-4 py-2 font-label-caps text-[9px] tracking-[0.2em] text-red-400 transition-colors hover:bg-red-500/10"
      >
        <span className="material-symbols-outlined text-[14px]">cancel</span>
        HUỶ ĐƠN HÀNG
      </button>
    )
  }

  return (
    <div className="border border-red-500/20 bg-red-500/5 p-4">
      <p className="mb-3 font-label-caps text-[9px] tracking-[0.2em] text-red-400">XÁC NHẬN HUỶ ĐƠN</p>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Lý do huỷ (không bắt buộc)"
        className="mb-3 w-full border-b border-red-500/20 bg-transparent py-2 font-body-md text-xs text-on-surface outline-none placeholder:text-on-surface-variant/30 focus:border-red-400"
      />
      {error && <p className="mb-3 font-body-md text-xs text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="border border-red-500/40 px-4 py-2 font-label-caps text-[9px] tracking-[0.15em] text-red-400 transition-colors hover:bg-red-500/15 disabled:opacity-50"
        >
          {loading ? 'ĐANG HUỶ...' : 'XÁC NHẬN HUỶ'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setError('') }}
          className="border border-outline-variant/25 px-4 py-2 font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
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
  const address = parseAddress(order.shippingAddressSnapshot)
  const paymentCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus] ?? { label: order.paymentStatus, color: 'text-on-surface-variant' }

  return (
    <div className="border border-outline-variant/10 bg-surface-container-low transition-all duration-200">
      {/* Header row */}
      <button
        type="button"
        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-container"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-label-caps text-[11px] tracking-[0.2em] text-primary">{order.orderCode}</span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-body-md text-xs text-on-surface-variant">{formatDate(order.createdAt)}</span>
            <span className={`font-label-caps text-[9px] tracking-[0.15em] ${paymentCfg.color}`}>{paymentCfg.label}</span>
            <span className="font-body-md text-xs text-on-surface-variant">
              {order.items?.length ?? 0} sản phẩm
            </span>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-6">
          <span className="font-headline-sm text-headline-sm text-primary">{formatVnd(order.totalAmount)}</span>
          <span className={`material-symbols-outlined text-on-surface-variant/50 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-outline-variant/10 px-6 py-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

            {/* Items */}
            <div className="lg:col-span-7">
              <p className="mb-4 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">SẢN PHẨM</p>
              <div className="space-y-4">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-surface-container">
                      <img alt={item.watchName} src={resolveImage(item)} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body-md text-sm text-on-surface">{item.watchName}</p>
                      <p className="font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant/60">
                        {item.dialColor} / {item.strapColor} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-body-md text-sm text-primary">{formatVnd(item.totalPrice ?? item.unitPrice * item.quantity)}</p>
                      <p className="font-label-caps text-[9px] text-on-surface-variant/50">{formatVnd(item.unitPrice)} / cái</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 border-t border-outline-variant/10 pt-4">
                {order.discountAmount > 0 && (
                  <div className="flex justify-between font-body-md text-xs">
                    <span className="text-on-surface-variant">Giảm giá</span>
                    <span className="text-primary">- {formatVnd(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body-md text-xs">
                  <span className="text-on-surface-variant">Phí vận chuyển</span>
                  <span className="text-on-surface">{order.shippingFee > 0 ? formatVnd(order.shippingFee) : 'Miễn phí'}</span>
                </div>
                <div className="flex justify-between font-body-md text-sm font-semibold">
                  <span className="text-on-surface">Tổng cộng</span>
                  <span className="text-primary">{formatVnd(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Info panel */}
            <div className="space-y-6 lg:col-span-5">

              {/* Shipping address */}
              {address && (
                <div>
                  <p className="mb-2 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">ĐỊA CHỈ NHẬN HÀNG</p>
                  <p className="font-body-md text-sm text-on-surface">{address.recipientName}</p>
                  <p className="font-body-md text-xs text-on-surface-variant">{address.phone}</p>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    {address.addressDetail}, {address.ward}, {address.district}, {address.province}
                  </p>
                </div>
              )}

              {/* Guest info (if no address snapshot) */}
              {!address && order.guestName && (
                <div>
                  <p className="mb-2 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">THÔNG TIN NHẬN HÀNG</p>
                  <p className="font-body-md text-sm text-on-surface">{order.guestName}</p>
                  <p className="font-body-md text-xs text-on-surface-variant">{order.guestPhone}</p>
                  <p className="font-body-md text-xs text-on-surface-variant">{order.guestEmail}</p>
                </div>
              )}

              {/* Payment & delivery */}
              <div>
                <p className="mb-2 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">THANH TOÁN & VẬN CHUYỂN</p>
                <p className="font-body-md text-xs text-on-surface-variant">
                  {PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
                </p>
                <p className="font-body-md text-xs text-on-surface-variant">
                  {DELIVERY_METHOD_LABEL[order.deliveryMethod] ?? order.deliveryMethod}
                </p>
              </div>

              {/* Tracking code */}
              {order.trackingCode && (
                <div>
                  <p className="mb-2 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">MÃ VẬN ĐƠN</p>
                  <p className="font-body-md text-sm text-primary tracking-widest">{order.trackingCode}</p>
                </div>
              )}

              {/* Note */}
              {order.note && (
                <div>
                  <p className="mb-2 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">GHI CHÚ</p>
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
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, orderStatus: 'CANCELLED' } : o)
    )
  }

  const displayed = activeFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.orderStatus === activeFilter)

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

        <header className="mb-12 text-center">
          <p className="font-label-caps text-[10px] tracking-[0.3em] text-primary">MY ACCOUNT</p>
          <h1 className="mt-4 font-headline-md text-headline-md italic text-on-surface">Lịch sử đơn hàng</h1>
          <p className="mt-3 font-body-md text-sm text-on-surface-variant">
            Xin chào, <span className="text-primary">{user?.fullName || user?.username}</span>
          </p>
        </header>

        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-outline-variant/10 pb-6">
          {FILTER_TABS.map((tab) => {
            const count = tab.value === 'ALL' ? orders.length : orders.filter((o) => o.orderStatus === tab.value).length
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={`border px-4 py-2 font-label-caps text-[9px] tracking-[0.2em] transition-all duration-200 ${
                  activeFilter === tab.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant/20 text-on-surface-variant/60 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1.5 ${activeFilter === tab.value ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40">
            ĐANG TẢI...
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined mb-4 block text-4xl text-red-400/50">error</span>
            <p className="font-body-md text-sm text-red-400">{error}</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-24 text-center">
            <span className="material-symbols-outlined mb-6 block text-5xl text-on-surface-variant/20">inbox</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">
              {activeFilter === 'ALL' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng nào trong mục này'}
            </p>
            {activeFilter === 'ALL' && (
              <>
                <p className="mt-3 font-body-md text-sm text-on-surface-variant">Hãy khám phá bộ sưu tập của chúng tôi.</p>
                <Link
                  to="/products"
                  className="mt-8 inline-block border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
                >
                  KHÁM PHÁ SẢN PHẨM
                </Link>
              </>
            )}
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

      </main>
      <Footer />
    </div>
  )
}
