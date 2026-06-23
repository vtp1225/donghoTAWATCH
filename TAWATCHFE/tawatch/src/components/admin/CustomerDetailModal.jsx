import { useState, useEffect } from 'react'
import { orderService } from '../../services/orderService'
import { addressService, userService } from '../../services/userService'

const ROLES = [
  { value: 'CUSTOMER', label: 'Khách hàng',  cls: 'text-primary border-primary/30 bg-primary/10' },
  { value: 'STAFF',    label: 'Nhân viên',    cls: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  { value: 'ADMIN',    label: 'Quản trị viên', cls: 'text-red-400 border-red-400/30 bg-red-400/10' },
]

const ORDER_STATUS_MAP = {
  PENDING:    { label: 'Chờ xác nhận', cls: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' },
  CONFIRMED:  { label: 'Đã xác nhận',  cls: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  PROCESSING: { label: 'Đang xử lý',   cls: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  SHIPPING:   { label: 'Đang giao',    cls: 'text-primary border-primary/30 bg-primary/10' },
  DELIVERED:  { label: 'Đã giao',      cls: 'text-green-400 border-green-400/30 bg-green-400/10' },
  COMPLETED:  { label: 'Hoàn thành',   cls: 'text-green-500 border-green-500/30 bg-green-500/10' },
  CANCELLED:  { label: 'Đã huỷ',       cls: 'text-error border-error/30 bg-error/10' },
  RETURNED:   { label: 'Hoàn hàng',    cls: 'text-on-surface-variant border-outline-variant/30 bg-outline-variant/10' },
}

function formatVND(v) {
  if (v == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v)
}

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function Initials({ name }) {
  const letters = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
      <span className="font-display-lg text-xl text-primary">{letters}</span>
    </div>
  )
}

function StatBox({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 p-4 border border-outline-variant/15 bg-surface-container">
      <p className="font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/50 uppercase">{label}</p>
      <p className="font-display-lg text-2xl text-on-background">{value}</p>
      {sub && <p className="font-label-caps text-[9px] text-on-surface-variant/40">{sub}</p>}
    </div>
  )
}

export default function CustomerDetailModal({ user, onClose, onUpdate, authUser }) {
  const [tab, setTab] = useState('info')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  // Role change state
  const [selectedRole, setSelectedRole] = useState(user?.role ?? 'CUSTOMER')
  const [roleConfirm, setRoleConfirm] = useState(false)
  const [savingRole, setSavingRole] = useState(false)
  const [roleError, setRoleError] = useState('')

  const isSelf = authUser?.id === user?.id
  const canChangeRole = authUser?.role === 'ADMIN' && !isSelf
  const roleChanged = selectedRole !== (user?.role ?? 'CUSTOMER')

  useEffect(() => {
    if (!user) return
    setSelectedRole(user.role ?? 'CUSTOMER')
    setRoleConfirm(false)
    setRoleError('')

    setLoadingOrders(true)
    orderService.getMyOrders(user.id)
      .then((list) => setOrders(Array.isArray(list) ? list : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))

    setLoadingAddresses(true)
    addressService.getAddresses(user.id)
      .then((list) => setAddresses(Array.isArray(list) ? list : []))
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false))
  }, [user])

  async function handleSaveRole() {
    setSavingRole(true)
    setRoleError('')
    try {
      const updated = await userService.updateRole(user.id, selectedRole)
      setRoleConfirm(false)
      onUpdate?.(updated)
    } catch (err) {
      setRoleError(err?.message || 'Không thể cập nhật quyền.')
    } finally {
      setSavingRole(false)
    }
  }

  if (!user) return null

  const completedOrders = orders.filter((o) => o.orderStatus === 'COMPLETED' || o.orderStatus === 'DELIVERED')
  const pendingOrders   = orders.filter((o) => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(o.orderStatus))
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED')
  const totalSpent      = completedOrders.reduce((s, o) => s + Number(o.totalAmount ?? 0), 0)

  const tabs = [
    { key: 'info',    label: 'Thông tin' },
    { key: 'orders',  label: `Đơn hàng (${loadingOrders ? '…' : orders.length})` },
    { key: 'address', label: `Địa chỉ (${loadingAddresses ? '…' : addresses.length})` },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-low border border-outline-variant/20 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-7 border-b border-outline-variant/10 flex items-start gap-5">
          <Initials name={user.fullName || user.name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-headline-sm text-lg text-on-background">{user.fullName || user.name || '—'}</h3>
              <span className={`px-2 py-0.5 font-label-caps text-[9px] tracking-widest border ${
                user.role === 'ADMIN'
                  ? 'text-red-400 border-red-400/30 bg-red-400/10'
                  : user.role === 'STAFF'
                  ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                  : 'text-primary border-primary/30 bg-primary/10'
              }`}>
                {user.role || 'CUSTOMER'}
              </span>
              {user.isVerified && (
                <span className="flex items-center gap-1 text-green-500 font-label-caps text-[9px]">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Đã xác thực
                </span>
              )}
            </div>
            <p className="font-body-md text-sm text-on-surface-variant truncate">{user.email || '—'}</p>
            <p className="font-label-caps text-[9px] text-on-surface-variant/40 tracking-widest mt-1">
              ID #{user.id} · Tham gia {formatDate(user.createdAt)}
            </p>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant/50 hover:text-on-surface-variant transition-colors flex-shrink-0">
            close
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-px bg-outline-variant/10 border-b border-outline-variant/10">
          <StatBox label="Tổng đơn" value={loadingOrders ? '…' : orders.length} />
          <StatBox label="Hoàn thành" value={loadingOrders ? '…' : completedOrders.length} />
          <StatBox label="Đang xử lý" value={loadingOrders ? '…' : pendingOrders.length} />
          <StatBox label="Tổng chi tiêu" value={loadingOrders ? '…' : formatVND(totalSpent)} sub="từ đơn hoàn thành" />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-7 border-b border-outline-variant/10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3.5 font-label-caps text-[10px] tracking-widest transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant/40 border-transparent hover:text-on-surface-variant'
              }`}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-7">

          {/* --- INFO --- */}
          {tab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { label: 'Họ và tên',      value: user.fullName || user.name },
                  { label: 'Tên đăng nhập',  value: user.username },
                  { label: 'Email',           value: user.email },
                  { label: 'Số điện thoại',  value: user.phone },
                  { label: 'Nhà cung cấp',   value: user.authProvider || 'LOCAL' },
                  { label: 'Xác thực email', value: user.isVerified ? 'Đã xác thực' : 'Chưa xác thực' },
                  { label: 'Ngày tham gia',  value: formatDate(user.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/50 mb-1 uppercase">{label}</p>
                    <p className="font-body-md text-sm text-on-background">{value || '—'}</p>
                  </div>
                ))}

                {cancelledOrders.length > 0 && (
                  <div className="col-span-2 p-3 border border-error/15 bg-error/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-base">warning</span>
                    <p className="font-label-caps text-[9px] tracking-widest text-error">
                      {cancelledOrders.length} đơn hàng đã bị huỷ
                    </p>
                  </div>
                )}
              </div>

              {/* Role section */}
              <div className="border-t border-outline-variant/10 pt-5">
                <p className="font-label-caps text-[9px] tracking-[0.35em] text-on-surface-variant/50 mb-4 uppercase">Phân quyền</p>

                {isSelf ? (
                  <p className="font-body-md text-xs text-on-surface-variant/40">Không thể thay đổi quyền của chính mình.</p>
                ) : !canChangeRole ? (
                  <div className="flex items-center gap-2">
                    {ROLES.find(r => r.value === user.role) && (
                      <span className={`px-2.5 py-1 font-label-caps text-[9px] tracking-widest border ${ROLES.find(r => r.value === user.role).cls}`}>
                        {ROLES.find(r => r.value === user.role).label}
                      </span>
                    )}
                    <p className="font-body-md text-xs text-on-surface-variant/40">Chỉ Admin mới có thể thay đổi quyền.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      {ROLES.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => { setSelectedRole(r.value); setRoleError('') }}
                          className={`px-4 py-2 border font-label-caps text-[10px] tracking-widest transition-all ${
                            selectedRole === r.value
                              ? r.cls + ' ring-1 ring-current/40'
                              : 'text-on-surface-variant/40 border-outline-variant/20 hover:border-outline-variant/50 hover:text-on-surface-variant'
                          }`}
                        >
                          {r.value === selectedRole && (
                            <span className="material-symbols-outlined text-xs align-middle mr-1">check</span>
                          )}
                          {r.label}
                        </button>
                      ))}
                    </div>

                    {roleError && (
                      <p className="font-label-caps text-[9px] text-error tracking-widest">{roleError}</p>
                    )}

                    {roleChanged && !roleConfirm && (
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => setRoleConfirm(true)}
                          className="px-5 py-2 bg-primary text-background font-label-caps text-[10px] tracking-widest hover:bg-primary/80 transition-colors"
                        >
                          LƯU THAY ĐỔI
                        </button>
                        <button
                          onClick={() => { setSelectedRole(user.role); setRoleError('') }}
                          className="font-label-caps text-[10px] text-on-surface-variant/40 hover:text-on-surface-variant tracking-widest"
                        >
                          Huỷ
                        </button>
                      </div>
                    )}

                    {roleConfirm && (
                      <div className="p-4 border border-outline-variant/20 bg-surface-container space-y-3">
                        <p className="font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">XÁC NHẬN THAY ĐỔI QUYỀN</p>
                        <p className="font-body-md text-sm text-on-background">
                          Đổi quyền của <span className="text-primary">{user.fullName || user.email}</span> từ{' '}
                          <span className="font-semibold">{user.role}</span> → <span className="font-semibold">{selectedRole}</span>?
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveRole}
                            disabled={savingRole}
                            className="px-5 py-2 bg-primary text-background font-label-caps text-[10px] tracking-widest hover:bg-primary/80 transition-colors disabled:opacity-50"
                          >
                            {savingRole ? 'ĐANG LƯU...' : 'XÁC NHẬN'}
                          </button>
                          <button
                            onClick={() => setRoleConfirm(false)}
                            className="px-5 py-2 border border-outline-variant/30 font-label-caps text-[10px] tracking-widest text-on-surface-variant hover:border-outline-variant/60 transition-colors"
                          >
                            HUỶ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- ORDERS --- */}
          {tab === 'orders' && (
            loadingOrders ? (
              <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI...</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/30 tracking-widest">CHƯA CÓ ĐƠN HÀNG</div>
            ) : (
              <div className="space-y-2">
                {[...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((o) => {
                  const status = ORDER_STATUS_MAP[o.orderStatus] ?? { label: o.orderStatus, cls: 'text-on-surface-variant border-outline-variant/30' }
                  return (
                    <div key={o.id} className="flex items-center gap-4 p-3.5 border border-outline-variant/10 hover:border-outline-variant/25 hover:bg-surface-container transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="font-label-caps text-xs text-on-background tracking-widest">{o.orderCode || `#${o.id}`}</p>
                        <p className="font-label-caps text-[9px] text-on-surface-variant/40 mt-0.5">{formatDate(o.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-body-md text-sm text-primary">{formatVND(o.totalAmount)}</p>
                        <p className="font-label-caps text-[9px] text-on-surface-variant/40">{o.items?.length ?? 0} sản phẩm</p>
                      </div>
                      <span className={`px-2.5 py-1 font-label-caps text-[9px] tracking-widest border flex-shrink-0 ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* --- ADDRESSES --- */}
          {tab === 'address' && (
            loadingAddresses ? (
              <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/40 tracking-widest">ĐANG TẢI...</div>
            ) : addresses.length === 0 ? (
              <div className="py-12 text-center font-label-caps text-xs text-on-surface-variant/30 tracking-widest">CHƯA CÓ ĐỊA CHỈ</div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 border border-outline-variant/10 hover:border-outline-variant/25 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-headline-sm text-sm text-on-background">{addr.recipientName || '—'}</p>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 font-label-caps text-[9px] tracking-widest text-primary border border-primary/30 bg-primary/10">
                              MẶC ĐỊNH
                            </span>
                          )}
                        </div>
                        <p className="font-body-md text-sm text-on-surface-variant">{addr.phone || '—'}</p>
                        <p className="font-body-md text-sm text-on-surface-variant/70 mt-1">
                          {[addr.streetAddress, addr.ward, addr.district, addr.city].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant/20 text-lg flex-shrink-0">location_on</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-outline-variant/10 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 border border-outline-variant/30 font-label-caps text-xs tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-all">
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  )
}
