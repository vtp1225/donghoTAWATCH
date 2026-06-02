import { useEffect, useMemo, useState } from 'react'
import { orderService } from '../../services/orderService.js'

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'REFUNDED']
const STATUS_FILTERS = ['ALL', ...STATUS_FLOW, 'CANCELLED']

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
}

const PAYMENT_META = {
  UNPAID: { label: 'Chưa thanh toán', className: 'text-error' },
  PAID: { label: 'Đã thanh toán', className: 'text-primary' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'text-secondary' },
}

const DELIVERY_LABELS = {
  EXTERNAL_SHIPPER: 'Đơn vị vận chuyển',
  DIRECT_SHOP: 'Nhận tại cửa hàng',
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
  if (fallbackAddress) return fallbackAddress
  if (!snapshot) return 'Không có thông tin địa chỉ'

  try {
    const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
    const parts = [
      parsed?.addressDetail,
      parsed?.ward,
      parsed?.district,
      parsed?.province,
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : 'Không có thông tin địa chỉ'
  } catch {
    return typeof snapshot === 'string' ? snapshot : 'Không có thông tin địa chỉ'
  }
}

function normalizeOrder(order) {
  const customerName = order?.customerName || order?.guestName || order?.fullName || `Khách #${order?.id ?? 'N/A'}`
  const itemsCount = Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
    : Number(order?.itemsCount) || 0

  return {
    id: order?.id,
    orderCode: order?.orderCode || `ORD-${order?.id ?? 'N/A'}`,
    customerName,
    customerEmail: order?.guestEmail || order?.customerEmail || order?.email || '',
    customerPhone: order?.guestPhone || order?.customerPhone || order?.phone || '',
    totalAmount: Number(order?.totalAmount) || 0,
    paymentStatus: order?.paymentStatus || 'UNPAID',
    orderStatus: order?.orderStatus || 'PENDING',
    deliveryMethod: order?.deliveryMethod || 'EXTERNAL_SHIPPER',
    trackingCode: order?.trackingCode || null,
    note: order?.note || null,
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

function getActionLabel(next) {
  if (next === 'CONFIRMED') return 'Xác nhận đơn'
  if (next === 'PROCESSING') return 'Bắt đầu xử lý'
  if (next === 'SHIPPING') return 'Chuyển giao vận'
  if (next === 'DELIVERED') return 'Đánh dấu hoàn tất'
  return 'Đã hoàn tất'
}

export default function ManageOrder() {
  const [orders, setOrders] = useState([])
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [keyword, setKeyword] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
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

  const selectedOrder = useMemo(() => {
    const candidate = filteredOrders.find((order) => order.id === selectedOrderId)
    return candidate || filteredOrders[0] || null
  }, [filteredOrders, selectedOrderId])

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
      await orderService.updateOrderStatus(order.id, { newStatus: targetStatus })
      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item.id === order.id
            ? {
                ...item,
                orderStatus: targetStatus,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      )
    } catch (err) {
      alert(err?.message || 'Không thể cập nhật trạng thái đơn hàng.')
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
            <h2 className="font-display-lg text-display-lg text-on-background mb-4">Quản Lý Đơn Hàng</h2>
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
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => {
            const active = activeFilter === status
            const label = status === 'ALL' ? 'Tất cả' : getStatusMeta(status).label

            return (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-4 py-2 border font-label-caps text-[10px] tracking-[0.18em] uppercase transition-all duration-300 ${
                  active
                    ? 'border-primary bg-primary text-background'
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/60 hover:text-primary'
                }`}
              >
                {label}
              </button>
            )
          })}
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
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 border border-outline-variant/10 bg-surface-container-lowest overflow-hidden">
            <div className="hidden md:grid grid-cols-12 py-4 px-6 bg-surface-container-low border-b border-outline-variant/10">
              <div className="col-span-3 font-label-caps text-[10px] tracking-widest text-outline uppercase">Mã đơn</div>
              <div className="col-span-3 font-label-caps text-[10px] tracking-widest text-outline uppercase">Khách hàng</div>
              <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase">Trạng thái</div>
              <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase">Giá trị</div>
              <div className="col-span-2 font-label-caps text-[10px] tracking-widest text-outline uppercase text-right">Hành động</div>
            </div>

            <div className="max-h-[640px] overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="font-headline-sm text-headline-sm text-on-background mb-3">Không tìm thấy đơn hàng phù hợp</p>
                  <p className="text-on-surface-variant/70">Thử đổi bộ lọc hoặc từ khóa tìm kiếm để tiếp tục.</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusMeta = getStatusMeta(order.orderStatus)
                  const paymentMeta = getPaymentMeta(order.paymentStatus)
                  const isSelected = selectedOrder?.id === order.id
                  const next = nextStatus(order.orderStatus)

                  return (
                    <article
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 p-5 md:px-6 md:py-6 border-b border-outline-variant/10 cursor-pointer transition-colors ${
                        isSelected ? 'bg-surface-container-low' : 'bg-background hover:bg-surface-container-low/60'
                      }`}
                    >
                      <div className="md:col-span-3">
                        <p className="font-headline-sm text-xl text-on-background">{order.orderCode}</p>
                        <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/70 mt-1 uppercase">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>

                      <div className="md:col-span-3">
                        <p className="text-on-surface font-body-md">{order.customerName}</p>
                        <p className="text-on-surface-variant/70 text-xs mt-1">{order.customerEmail || order.customerPhone || 'Không có liên hệ'}</p>
                        <p className={`text-xs mt-1 ${paymentMeta.className}`}>{paymentMeta.label}</p>
                      </div>

                      <div className="md:col-span-2">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-label-caps tracking-widest border ${statusMeta.chipClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="md:col-span-2">
                        <p className="font-headline-sm text-lg text-on-background">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-on-surface-variant/70 text-xs mt-1">{order.itemsCount} sản phẩm</p>
                      </div>

                      <div className="md:col-span-2 md:text-right flex md:justify-end items-center gap-3">
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleAdvanceStatus(order)
                          }}
                          disabled={!next || updatingId === order.id}
                          className="px-3 py-2 border border-primary/40 text-primary font-label-caps text-[10px] tracking-widest uppercase hover:bg-primary hover:text-background disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          {updatingId === order.id ? 'Đang cập nhật' : getActionLabel(next)}
                        </button>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </div>

          <aside className="xl:col-span-4 border border-outline-variant/10 bg-surface-container-low p-6">
            <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary uppercase mb-4">Chi tiết đơn hàng</p>

            {selectedOrder ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-background">{selectedOrder.orderCode}</h3>
                  <p className="text-on-surface-variant/70 text-sm mt-1">Cập nhật lần cuối: {formatDateTime(selectedOrder.updatedAt)}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant/70">Khách hàng</span>
                    <span className="text-on-background text-right">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant/70">Liên hệ</span>
                    <span className="text-on-background text-right">
                      {selectedOrder.customerPhone || selectedOrder.customerEmail || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant/70">Thanh toán</span>
                    <span className={getPaymentMeta(selectedOrder.paymentStatus).className}>
                      {getPaymentMeta(selectedOrder.paymentStatus).label}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant/70">Giao nhận</span>
                    <span className="text-on-background text-right">
                      {DELIVERY_LABELS[selectedOrder.deliveryMethod] || selectedOrder.deliveryMethod}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-on-surface-variant/70">Mã vận đơn</span>
                    <span className="text-on-background text-right">{selectedOrder.trackingCode || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <div>
                  <p className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface-variant/70 mb-2">Địa chỉ giao hàng</p>
                  <p className="text-on-background text-sm leading-relaxed">{selectedOrder.shippingAddress}</p>
                </div>

                {selectedOrder.note ? (
                  <div className="border border-outline-variant/20 bg-background/60 p-4">
                    <p className="font-label-caps text-[10px] tracking-widest text-primary uppercase mb-2">Ghi chú</p>
                    <p className="text-sm text-on-surface-variant">{selectedOrder.note}</p>
                  </div>
                ) : null}

                <div className="border-t border-outline-variant/20 pt-5">
                  <p className="font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/70 mb-3">Tiến trình đơn hàng</p>
                  <div className="space-y-3">
                    {STATUS_FLOW.map((status) => {
                      const currentIndex = STATUS_FLOW.indexOf(selectedOrder.orderStatus)
                      const statusIndex = STATUS_FLOW.indexOf(status)
                      const isDone = currentIndex >= statusIndex
                      const meta = getStatusMeta(status)

                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${isDone ? meta.dotClass : 'bg-outline-variant/40'}`} />
                          <span className={`text-sm ${isDone ? 'text-on-background' : 'text-on-surface-variant/50'}`}>{meta.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-on-surface-variant/70">Chọn một đơn hàng ở bảng bên trái để xem chi tiết.</div>
            )}
          </aside>
        </section>
      )}
    </main>
  )
}
