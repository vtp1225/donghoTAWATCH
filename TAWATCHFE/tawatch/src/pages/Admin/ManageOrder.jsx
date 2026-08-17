import { useEffect, useMemo, useState } from 'react'
import { orderService } from '../../services/orderService.js'
import OrderDetailModal from '../../components/admin/OrderDetailModal.jsx'

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'REFUNDED']
const STATUS_FILTERS = ['ALL', ...STATUS_FLOW, 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_REJECTED']

const STATUS_META = {
  PENDING: {
    label: 'Chờ xác nhận',
    chipClass: 'border-primary/30 bg-primary/10 text-primary',
    dotClass: 'bg-primary',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    chipClass: 'border-tertiary/30 bg-tertiary/10 text-tertiary',
    dotClass: 'bg-tertiary',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    chipClass: 'border-secondary/30 bg-secondary/10 text-secondary',
    dotClass: 'bg-secondary',
  },
  SHIPPING: {
    label: 'Đang giao',
    chipClass: 'border-surface-tint/40 bg-surface-tint/10 text-surface-tint',
    dotClass: 'bg-surface-tint',
  },
  DELIVERED: {
    label: 'Hoàn tất',
    chipClass: 'border-outline/30 bg-outline/10 text-outline',
    dotClass: 'bg-outline',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    chipClass: 'border-error/30 bg-error/10 text-error',
    dotClass: 'bg-error',
  },
  REFUNDED: {
    label: 'Hoàn tiền',
    chipClass: 'border-on-secondary-container/30 bg-on-secondary-container/10 text-on-secondary-container',
    dotClass: 'bg-on-secondary-container',
  },
  RETURN_REQUESTED: {
    label: 'Yêu cầu đổi/trả',
    chipClass: 'border-pink-500/40 bg-pink-500/10 text-pink-400',
    dotClass: 'bg-pink-400',
  },
  RETURN_REJECTED: {
    label: 'Từ chối đổi/trả',
    chipClass: 'border-gray-500/40 bg-gray-500/10 text-gray-400',
    dotClass: 'bg-gray-400',
  },
}

const PAYMENT_META = {
  UNPAID: { label: 'Chưa thanh toán', className: 'text-error' },
  PAID: { label: 'Đã thanh toán', className: 'text-primary' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'text-secondary' },
}



function formatCurrency(value) {
  const amount = Number(value) || 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function parseAddress(snapshot, fallbackAddress) {
  if (snapshot) {
    try {
      const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
      const parts = [
        parsed?.addressDetail,
        parsed?.ward,
        parsed?.district,
        parsed?.province,
      ].filter(Boolean)
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
function normalizeOrder(order) {
  const itemsCount = Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
    : Number(order?.itemsCount) || 0

  return {
    id: order?.id,
    orderCode: order?.orderCode || `ORD-${order?.id ?? 'N/A'}`,
    customerName: order?.customerName || order?.guestName || order?.fullName || getInSnapshot(order?.shippingAddressSnapshot, 'recipientName') || `Khách #${order?.id ?? 'N/A'}`,
    customerEmail: order?.guestEmail || order?.customerEmail || order?.email || getInSnapshot(order?.shippingAddressSnapshot, 'email') || null,
    customerPhone: order?.guestPhone || order?.customerPhone || order?.phone || getInSnapshot(order?.shippingAddressSnapshot, 'phone') || null,
    totalAmount: Number(order?.totalAmount) || 0,
    paymentStatus: order?.paymentStatus || 'UNPAID',
    orderStatus: order?.orderStatus || 'PENDING',
    deliveryMethod: order?.deliveryMethod || 'EXTERNAL_SHIPPER',
    trackingCode: order?.trackingCode || null,
    note: order?.note || null,
    returnReason: order?.returnReason || null,
    createdAt: order?.createdAt,
    updatedAt: order?.updatedAt,
    shippingAddress: parseAddress(order?.shippingAddressSnapshot, order?.shippingAddress),
    itemsCount,
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

export default function ManageOrder() {
  const [orders, setOrders] = useState([])
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [keyword, setKeyword] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchOrders() {
      setLoading(true)
      setError('')

      try {
        const data = await orderService.listAdminOrders()
        if (!isMounted) return

        const normalized = Array.isArray(data) ? data.map(normalizeOrder) : []
        setOrders(normalized)
      } catch (err) {
        if (!isMounted) return
        setError(err?.message || 'Không thể tải danh sách đơn hàng từ máy chủ.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchOrders()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = useMemo(() => {
    const search = keyword.trim().toLowerCase()
    return orders.filter((order) => {
      const matchStatus = activeFilter === 'ALL' || order.orderStatus === activeFilter
      if (!matchStatus) return false
      if (!search) return true

      return [
        order.orderCode,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        order.trackingCode,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    })
  }, [orders, activeFilter, keyword])

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce((sum, item) => sum + item.totalAmount, 0)
    return {
      totalOrders: orders.length,
      pending: orders.filter((item) => item.orderStatus === 'PENDING').length,
      shipping: orders.filter((item) => item.orderStatus === 'SHIPPING').length,
      totalRevenue,
    }
  }, [orders])

  async function handleAdvanceStatus(order) {
    const targetStatus = nextStatus(order.orderStatus)
    if (!targetStatus) return

    setUpdatingId(order.id)
    try {
      const updated = await orderService.updateOrderStatus(order.id, { newStatus: targetStatus })
      const normalized = normalizeOrder(updated)
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, ...normalized } : item)),
      )
      setSelectedOrder((current) =>
        current?.id === order.id ? { ...current, ...normalized } : current,
      )
    } catch (err) {
      alert(err?.message || 'Không thể cập nhật trạng thái đơn hàng.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleCancelOrder(order) {
    if (!canCancel(order.orderStatus)) return

    const reason = window.prompt('Nhập lý do huỷ đơn hàng:', '')
    if (reason === null) return

    setUpdatingId(order.id)
    try {
      const updated = await orderService.cancelOrder(order.id, { userId: null, reason: reason.trim() || null })
      const normalized = normalizeOrder(updated)
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, ...normalized } : item)),
      )
      setSelectedOrder((current) =>
        current?.id === order.id ? { ...current, ...normalized } : current,
      )
    } catch (err) {
      alert(err?.message || 'Không thể huỷ đơn hàng.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleResolveReturn(order, approve) {
    if (!isReturnRequested(order.orderStatus)) return

    const targetStatus = approve ? 'REFUNDED' : 'RETURN_REJECTED'
    if (!window.confirm(approve ? 'Xác nhận duyệt hoàn tiền cho đơn này?' : 'Xác nhận từ chối yêu cầu đổi/trả này?')) return

    setUpdatingId(order.id)
    try {
      const updated = await orderService.updateOrderStatus(order.id, { newStatus: targetStatus })
      const normalized = normalizeOrder(updated)
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, ...normalized } : item)),
      )
      setSelectedOrder((current) =>
        current?.id === order.id ? { ...current, ...normalized } : current,
      )
    } catch (err) {
      alert(err?.message || 'Không thể xử lý yêu cầu đổi/trả.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="ml-72 mt-20 p-gutter min-h-screen">
      <section className="pt-8 mb-10">
        <span className="font-label-caps text-label-caps text-primary tracking-[0.35em] block mb-4 uppercase">
          Logistics Archive
        </span>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-display-lg text-display-lg text-on-background mb-4 whitespace-nowrap">Quản Lý Đơn Hàng</h2>
            <p className="text-on-surface-variant/80 max-w-2xl">
              Theo dõi hành trình từng đơn hàng theo thời gian thực, cập nhật trạng thái xử lý và giữ toàn bộ lịch sử giao vận trong một bảng điều khiển duy nhất.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full lg:w-auto lg:min-w-[640px]">
            <article className="border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 uppercase">Tổng đơn</p>
              <p className="font-headline-sm text-2xl text-primary mt-2">{summary.totalOrders}</p>
            </article>
            <article className="border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 uppercase">Chờ xác nhận</p>
              <p className="font-headline-sm text-2xl text-primary mt-2">{summary.pending}</p>
            </article>
            <article className="border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 uppercase">Đang giao</p>
              <p className="font-headline-sm text-2xl text-primary mt-2">{summary.shipping}</p>
            </article>
            <article className="border border-outline-variant/20 bg-surface-container-low p-4">
              <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 uppercase">Doanh thu</p>
              <p className="font-headline-sm text-base text-primary mt-2">{formatCurrency(summary.totalRevenue)}</p>
            </article>
          </div>
        </div>
        <div className="h-px opacity-30 mt-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {error ? (
        <div className="mb-6 p-4 border border-error/30 bg-error/10 text-error font-label-caps text-xs tracking-wider uppercase">
          {error}
        </div>
      ) : null}

      <section className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:w-auto">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full xl:w-56 bg-surface-container-low border border-outline-variant/20 px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none cursor-pointer"
          >
            {STATUS_FILTERS.map((status) => {
              const label = status === 'ALL' ? 'Tất cả' : getStatusMeta(status).label
              return (
                <option key={status} value={status}>
                  {label}
                </option>
              )
            })}
          </select>
        </div>

        <div className="relative w-full xl:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70">search</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã đơn, khách hàng, email, vận đơn"
            className="w-full bg-surface-container-low border border-outline-variant/20 pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      {loading ? (
        <section className="border border-outline-variant/20 bg-surface-container-low p-10 text-center">
          <p className="font-label-caps text-xs tracking-[0.25em] text-on-surface-variant">ĐANG TẢI DANH SÁCH ĐƠN HÀNG...</p>
        </section>
      ) : (
        <section className="border border-outline-variant/10 bg-surface-container-lowest overflow-hidden">
          <div className="hidden md:grid grid-cols-12 py-4 px-6 bg-surface-container-low border-b border-outline-variant/10">
            <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase">Mã đơn</div>
            <div className="col-span-3 font-label-caps text-[10px] tracking-widest text-outline uppercase">Khách hàng</div>
            <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase">Trạng thái</div>
            <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase">Giá trị</div>
            <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase">Thanh toán</div>
            <div className="col-span-1 font-label-caps text-[10px] tracking-widest text-outline uppercase text-right">Chi tiết</div>
          </div>

          <div className="max-h-[680px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-headline-sm text-headline-sm text-on-background mb-3">Không tìm thấy đơn hàng phù hợp</p>
                <p className="text-on-surface-variant/70">Thử đổi bộ lọc hoặc từ khóa tìm kiếm để tiếp tục.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusMeta = getStatusMeta(order.orderStatus)
                const paymentMeta = getPaymentMeta(order.paymentStatus)

                return (
                  <article
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 p-5 md:px-6 md:py-5 border-b border-outline-variant/10 cursor-pointer transition-colors bg-background hover:bg-surface-container-low/60"
                  >
                    <div className="md:col-span-2">
                      <p className="font-headline-sm text-lg text-on-background">{order.orderCode}</p>
                      <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 mt-1 uppercase">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="md:col-span-3">
                      <p className="text-on-surface font-body-md text-sm">{order.customerName}</p>
                      <p className="text-on-surface-variant/70 text-xs mt-1">{order.customerEmail || order.customerPhone || 'Không có liên hệ'}</p>
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-label-caps tracking-widest border ${statusMeta.chipClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <p className="font-headline-sm text-base text-on-background">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-on-surface-variant/70 text-xs mt-1">{order.itemsCount} sản phẩm</p>
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      <span className={`text-xs ${paymentMeta.className}`}>{paymentMeta.label}</span>
                    </div>

                    <div className="md:col-span-1 md:text-right flex md:justify-end items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant/60 text-base">chevron_right</span>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </section>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAdvanceStatus={handleAdvanceStatus}
          onCancelOrder={handleCancelOrder}
          onResolveReturn={handleResolveReturn}
          updating={updatingId}
        />
      )}
    </main>
  )
}
