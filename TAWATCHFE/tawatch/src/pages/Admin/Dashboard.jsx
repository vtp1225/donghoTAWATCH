import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import { orderService } from '../../services/orderService.js'
import { userService } from '../../services/userService.js'
import { watchService } from '../../services/watchService.js'

const MONTH_SHORT = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12']

const STATUS_META = {
  PENDING:    { label: 'Chờ xác nhận', color: '#F59E0B' },
  CONFIRMED:  { label: 'Đã xác nhận',  color: '#06B6D4' },
  PROCESSING: { label: 'Đang xử lý',   color: '#F97316' },
  SHIPPING:   { label: 'Đang giao',    color: '#3B82F6' },
  DELIVERED:  { label: 'Hoàn tất',     color: '#22C55E' },
  CANCELLED:  { label: 'Đã huỷ',       color: '#EF4444' },
  REFUNDED:   { label: 'Hoàn tiền',    color: '#A855F7' },
}

const QUICK_LINKS = [
  { icon: 'watch',         label: 'Kho hàng',    to: '/admin/inventory',  desc: 'Sản phẩm & biến thể' },
  { icon: 'shopping_cart', label: 'Đơn hàng',    to: '/admin/orders',     desc: 'Xử lý & theo dõi' },
  { icon: 'group',         label: 'Khách hàng',  to: '/admin/customers',  desc: 'Quản lý tài khoản' },
  { icon: 'local_offer',   label: 'Khuyến mãi',  to: '/admin/promotions', desc: 'Coupon & ưu đãi' },
  { icon: 'rate_review',   label: 'Đánh giá',    to: '/admin/reviews',    desc: 'Kiểm duyệt review' },
  { icon: 'storefront',    label: 'Thương hiệu', to: '/admin/brands',     desc: 'Danh sách thương hiệu' },
]

function formatVnd(value) {
  if (!value) return '0 ₫'
  if (value >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(1).replace('.0', '') + ' tỷ ₫'
  if (value >= 1_000_000)
    return (value / 1_000_000).toFixed(1).replace('.0', '') + ' tr ₫'
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
}

function formatDateTime(val) {
  if (!val) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(val))
}

function getStatus(o) {
  return o.orderStatus || o.status || 'PENDING'
}

function Skeleton({ className, style }) {
  return <div className={`animate-pulse rounded-sm bg-surface-container ${className}`} style={style} />
}

function SectionLabel({ children }) {
  return (
    <p className="font-label-caps text-xs tracking-[0.25em] uppercase text-on-surface-variant/60">
      {children}
    </p>
  )
}

/* ── Custom tooltip cho Bar chart ── */
function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-outline-variant/20 bg-background px-4 py-3 shadow-lg">
      <p className="mb-1 font-label-caps text-xs tracking-wider text-on-surface-variant/60">{label}</p>
      <p className="font-label-caps text-sm font-bold text-primary">{formatVnd(payload[0].value)}</p>
      {payload[0].payload.orders > 0 && (
        <p className="mt-0.5 font-label-caps text-xs tracking-wider text-on-surface-variant/50">
          {payload[0].payload.orders} đơn
        </p>
      )}
    </div>
  )
}

/* ── Custom tooltip cho Pie chart ── */
function StatusTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="border border-outline-variant/20 bg-background px-4 py-3 shadow-lg">
      <p className="font-label-caps text-xs tracking-wider text-on-surface-variant/60">{d.name}</p>
      <p className="mt-1 font-label-caps text-sm font-bold" style={{ color: d.payload.color }}>
        {d.value} đơn
      </p>
    </div>
  )
}

export default function Dashboard() {
  const [orders, setOrders]   = useState([])
  const [users, setUsers]     = useState([])
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    Promise.all([
      orderService.listAdminOrders(),
      userService.getAllUsers(),
      watchService.getAllAdmin(),
    ])
      .then(([orderList, userList, watchList]) => {
        setOrders(Array.isArray(orderList) ? orderList : [])
        setUsers(Array.isArray(userList) ? userList : [])
        setWatches(Array.isArray(watchList) ? watchList : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = useMemo(() =>
    orders.filter(o => getStatus(o) === 'DELIVERED')
      .reduce((s, o) => s + Number(o.totalAmount || 0), 0),
    [orders])

  const customerCount = useMemo(() =>
    users.filter(u => u.role !== 'ADMIN').length, [users])

  const activeWatchCount = useMemo(() =>
    watches.filter(w => w.isActive !== false).length, [watches])

  const pendingCount = useMemo(() =>
    orders.filter(o => getStatus(o) === 'PENDING').length, [orders])

  const statusCounts = useMemo(() => {
    const c = {}
    orders.forEach(o => { const s = getStatus(o); c[s] = (c[s] || 0) + 1 })
    return c
  }, [orders])

  const recentOrders = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6),
    [orders])

  /* ── Bar chart data: doanh thu 6 tháng gần nhất ── */
  const monthlyData = useMemo(() => {
    const now = new Date()
    const slots = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        label: MONTH_SHORT[d.getMonth()],
        revenue: 0,
        orders: 0,
      }
    })
    orders.filter(o => getStatus(o) === 'DELIVERED').forEach(o => {
      const d = new Date(o.createdAt)
      const slot = slots.find(s => s.year === d.getFullYear() && s.month === d.getMonth())
      if (slot) { slot.revenue += Number(o.totalAmount || 0); slot.orders++ }
    })
    return slots
  }, [orders])

  /* ── Pie chart data: phân bổ trạng thái ── */
  const pieData = useMemo(() =>
    Object.entries(statusCounts)
      .filter(([, v]) => v > 0)
      .map(([key, value]) => ({
        name: STATUS_META[key]?.label ?? key,
        value,
        color: STATUS_META[key]?.color ?? '#888',
      })),
    [statusCounts])

  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())

  return (
    <main className="ml-72 mt-20 min-h-screen" style={{ padding: '36px 44px' }}>

      {/* ── Page header ── */}
      <section className="mb-10 flex items-end justify-between">
        <div>
          <span className="mb-3 block font-label-caps text-xs tracking-[0.4em] uppercase text-primary/80">
            Admin Portal
          </span>
          <h2 className="font-display-lg text-5xl tracking-tight text-on-background">
            Tổng Quan
          </h2>
          <p className="mt-2 font-label-caps text-sm capitalize tracking-wider text-on-surface-variant/50">
            {today}
          </p>
        </div>

        {pendingCount > 0 && (
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 border border-primary/40 bg-primary/5 px-6 py-3.5 font-label-caps text-sm tracking-wider text-primary transition-all hover:bg-primary/10"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            {pendingCount} đơn chờ xác nhận
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        )}
      </section>

      {/* ── KPI cards ── */}
      <section className="mb-8 grid grid-cols-4 gap-4">
        {[
          {
            label: 'Doanh thu (đã giao)',
            value: loading ? null : formatVnd(totalRevenue),
            icon: 'payments',
            accent: 'text-primary',
            sub: loading ? null : `Từ ${orders.filter(o => getStatus(o) === 'DELIVERED').length} đơn hoàn tất`,
          },
          {
            label: 'Tổng đơn hàng',
            value: loading ? null : orders.length.toString(),
            icon: 'shopping_bag',
            accent: 'text-on-background',
            sub: loading ? null : `${statusCounts['PENDING'] || 0} chờ · ${statusCounts['SHIPPING'] || 0} đang giao`,
          },
          {
            label: 'Khách hàng',
            value: loading ? null : customerCount.toString(),
            icon: 'group',
            accent: 'text-on-background',
            sub: loading ? null : `${users.length} tài khoản tổng cộng`,
          },
          {
            label: 'Sản phẩm active',
            value: loading ? null : activeWatchCount.toString(),
            icon: 'watch',
            accent: 'text-on-background',
            sub: loading ? null : `Trong ${watches.length} sản phẩm`,
          },
        ].map(({ label, value, icon, accent, sub }) => (
          <div
            key={label}
            className="border border-outline-variant/10 bg-surface-container-lowest p-7 transition-colors hover:border-primary/25"
          >
            <div className="mb-5 flex items-start justify-between">
              <SectionLabel>{label}</SectionLabel>
              <span className="material-symbols-outlined text-2xl text-on-surface-variant/25">{icon}</span>
            </div>
            {value == null ? (
              <Skeleton className="mb-4 h-10 w-3/4" />
            ) : (
              <p className={`mb-4 font-headline-md text-4xl leading-none ${accent}`}>{value}</p>
            )}
            {sub == null ? (
              <Skeleton className="h-4 w-1/2" />
            ) : (
              <p className="font-label-caps text-xs tracking-wider text-on-surface-variant/45">{sub}</p>
            )}
          </div>
        ))}
      </section>

      {/* ── Charts ── */}
      <section className="mb-8 grid grid-cols-12 gap-4">

        {/* Bar chart — doanh thu 6 tháng */}
        <div className="col-span-8 border border-outline-variant/10 bg-surface-container-lowest p-7">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <SectionLabel>Doanh thu theo tháng</SectionLabel>
              <p className="mt-1.5 font-label-caps text-xs tracking-wide text-on-surface-variant/40">
                Chỉ tính đơn đã giao — 6 tháng gần nhất
              </p>
            </div>
            <span className="font-label-caps text-sm tracking-wider text-primary/70">
              {loading ? '—' : formatVnd(totalRevenue)} tổng
            </span>
          </div>

          {loading ? (
            <div className="flex h-52 items-end gap-4 pt-4">
              {[55, 30, 75, 45, 80, 60].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-3">
                  <Skeleton className="w-full" style={{ height: `${h * 0.8}px` }} />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={monthlyData} barCategoryGap="30%" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9E9E9E', fontFamily: 'inherit' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={72}
                  tickFormatter={v => formatVnd(v)}
                  tick={{ fontSize: 11, fill: '#757575', fontFamily: 'inherit' }}
                />
                <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="revenue" radius={[3, 3, 0, 0]}>
                  {monthlyData.map((m, i) => {
                    const isCurrent = m.month === new Date().getMonth() && m.year === new Date().getFullYear()
                    return <Cell key={i} fill={isCurrent ? '#D4A843' : '#8B6E2A'} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — phân bổ trạng thái đơn hàng */}
        <div className="col-span-4 border border-outline-variant/10 bg-surface-container-lowest p-7">
          <SectionLabel>Phân bổ trạng thái</SectionLabel>

          {loading ? (
            <div className="mt-6 flex flex-col items-center gap-4">
              <Skeleton className="h-36 w-36 rounded-full" />
              <div className="w-full space-y-2">
                {[1,2,3].map(i => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-52 flex-col items-center justify-center gap-2 text-on-surface-variant/30">
              <span className="material-symbols-outlined text-4xl">pie_chart</span>
              <p className="font-label-caps text-sm tracking-wider">Chưa có đơn hàng</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={76}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip content={<StatusTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-3 flex flex-col gap-2">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: color }} />
                      <span className="font-label-caps text-xs tracking-wide text-on-surface-variant/70">{name}</span>
                    </div>
                    <span className="font-label-caps text-sm font-bold text-on-surface/80">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Recent orders ── */}
      <section className="mb-8 border border-outline-variant/10 bg-surface-container-lowest">
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-7 py-5">
          <SectionLabel>Đơn hàng gần đây</SectionLabel>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 font-label-caps text-xs tracking-wider text-primary/70 transition-colors hover:text-primary"
          >
            Xem tất cả
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-outline-variant/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6 px-7 py-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-on-surface-variant/30">
            <span className="material-symbols-outlined text-5xl">inbox</span>
            <p className="font-label-caps text-sm tracking-[0.2em] uppercase">Chưa có đơn hàng</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                {['Mã đơn', 'Khách hàng', 'Thời gian', 'Giá trị', 'Trạng thái'].map(h => (
                  <th key={h} className="px-7 py-4 text-left font-label-caps text-xs tracking-[0.2em] uppercase text-on-surface-variant/45">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/8">
              {recentOrders.map(order => {
                const status = getStatus(order)
                const meta = STATUS_META[status] ?? STATUS_META.PENDING
                const name = order.customerName || order.guestName || `Khách #${order.id}`
                const code = order.orderCode || `ORD-${order.id}`
                return (
                  <tr key={order.id} className="transition-colors hover:bg-surface-container/40">
                    <td className="px-7 py-4">
                      <span className="font-label-caps text-sm tracking-wider text-primary/80">{code}</span>
                    </td>
                    <td className="px-7 py-4">
                      <span className="font-body-md text-sm text-on-surface/85">{name}</span>
                    </td>
                    <td className="px-7 py-4">
                      <span className="font-label-caps text-xs tracking-wide text-on-surface-variant/55">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-7 py-4">
                      <span className="font-label-caps text-sm tracking-wider text-on-surface/85">
                        {formatVnd(Number(order.totalAmount || 0))}
                      </span>
                    </td>
                    <td className="px-7 py-4">
                      <span className="inline-flex items-center gap-2 font-label-caps text-xs tracking-wider" style={{ color: meta.color }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* ── Quick links ── */}
      <section>
        <SectionLabel>Truy cập nhanh</SectionLabel>
        <div className="mt-4 grid grid-cols-6 gap-3">
          {QUICK_LINKS.map(({ icon, label, to, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-4 border border-outline-variant/10 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-surface-container/60"
            >
              <span className="material-symbols-outlined text-2xl text-on-surface-variant/35 transition-colors group-hover:text-primary">
                {icon}
              </span>
              <div>
                <p className="font-label-caps text-sm tracking-wider text-on-surface/80 transition-colors group-hover:text-primary">
                  {label}
                </p>
                <p className="mt-1 font-label-caps text-xs tracking-wide text-on-surface-variant/45">
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {error && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 border border-error/30 bg-surface-container px-5 py-3.5">
          <span className="material-symbols-outlined text-base text-error">error</span>
          <span className="font-label-caps text-sm tracking-wider text-error/80">
            Không thể tải một số dữ liệu
          </span>
        </div>
      )}
    </main>
  )
}
