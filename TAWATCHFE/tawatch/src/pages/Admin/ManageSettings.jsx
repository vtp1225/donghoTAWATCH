import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { settingsService } from '../../services/settingsService'

const TABS = [
  { id: 'store',   label: 'Cửa hàng',     icon: 'storefront' },
  { id: 'system',  label: 'Hệ thống',      icon: 'settings' },
  { id: 'account', label: 'Tài khoản',     icon: 'manage_accounts' },
]

const SYSTEM_LINKS = [
  { icon: 'watch',         label: 'Kho hàng',       desc: 'Quản lý sản phẩm & biến thể',     to: '/admin/inventory' },
  { icon: 'shopping_cart', label: 'Đơn hàng',        desc: 'Xử lý & theo dõi đơn',            to: '/admin/orders' },
  { icon: 'local_offer',   label: 'Khuyến mãi',      desc: 'Coupon & chương trình ưu đãi',    to: '/admin/promotions' },
  { icon: 'group',         label: 'Khách hàng',      desc: 'Quản lý tài khoản người dùng',    to: '/admin/customers' },
  { icon: 'rate_review',   label: 'Đánh giá',        desc: 'Kiểm duyệt nhận xét sản phẩm',   to: '/admin/reviews' },
  { icon: 'category',      label: 'Danh mục',        desc: 'Cây danh mục sản phẩm',          to: '/admin/categories' },
]

function SectionHeader({ icon, children }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-[16px] text-primary/70">{icon}</span>
      <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">{children}</h3>
      <div className="h-px flex-1 bg-outline-variant/10" />
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-outline-variant/8 py-4 last:border-b-0">
      <span className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant/60 uppercase shrink-0 pt-0.5">{label}</span>
      <span className="font-body-md text-sm text-on-surface text-right">{value || '—'}</span>
    </div>
  )
}

function EditField({ label, name, type = 'text', value, onChange, placeholder, min }) {
  return (
    <div>
      <label className="mb-1.5 block font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary"
      />
    </div>
  )
}

function formatVnd(value) {
  if (value == null || value === '') return ''
  return new Intl.NumberFormat('vi-VN').format(value)
}

// ─── Store Tab ───────────────────────────────────────────────────────────────

function StoreTab() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    storeName: '',
    address: '',
    phone: '',
    supportEmail: '',
    website: '',
    defaultShippingFee: '',
    freeShippingThreshold: '',
  })

  useEffect(() => {
    settingsService.getSettings()
      .then((data) => {
        setSettings(data)
        setForm({
          storeName: data.storeName || '',
          address: data.address || '',
          phone: data.phone || '',
          supportEmail: data.supportEmail || '',
          website: data.website || '',
          defaultShippingFee: data.defaultShippingFee ?? '',
          freeShippingThreshold: data.freeShippingThreshold ?? '',
        })
      })
      .catch(() => setError('Không thể tải cài đặt.'))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')

    if (form.defaultShippingFee !== '' && Number(form.defaultShippingFee) < 0) {
      setError('Phí vận chuyển không được âm.')
      return
    }
    if (form.freeShippingThreshold !== '' && Number(form.freeShippingThreshold) < 0) {
      setError('Hạn mức miễn phí vận chuyển không được âm.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        defaultShippingFee: form.defaultShippingFee !== '' ? Number(form.defaultShippingFee) : null,
        freeShippingThreshold: form.freeShippingThreshold !== '' ? Number(form.freeShippingThreshold) : null,
      }
      const updated = await settingsService.updateSettings(payload)
      setSettings(updated)
      setEditing(false)
      setToast('Lưu cài đặt thành công')
      setTimeout(() => setToast(null), 3000)
    } catch {
      setError('Không thể lưu cài đặt. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setForm({
      storeName: settings?.storeName || '',
      address: settings?.address || '',
      phone: settings?.phone || '',
      supportEmail: settings?.supportEmail || '',
      website: settings?.website || '',
      defaultShippingFee: settings?.defaultShippingFee ?? '',
      freeShippingThreshold: settings?.freeShippingThreshold ?? '',
    })
    setError('')
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="flex gap-1">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 border border-primary/30 bg-primary/8 px-5 py-3">
          <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
          <p className="font-label-caps text-[10px] tracking-widest text-primary">{toast}</p>
        </div>
      )}

      {/* Store Info */}
      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader icon="store">Thông tin cửa hàng</SectionHeader>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 border border-primary/40 px-4 py-2 font-label-caps text-[9px] tracking-[0.2em] text-primary hover:bg-primary hover:text-background transition-all"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              CHỈNH SỬA
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave}>
            {error && (
              <p className="mb-5 font-body-md text-xs text-error">{error}</p>
            )}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-8">
              <EditField label="Tên cửa hàng" name="storeName" value={form.storeName} onChange={handleChange} placeholder="TAWatch" />
              <EditField label="Điện thoại" name="phone" value={form.phone} onChange={handleChange} placeholder="028 3822 1234" />
              <EditField label="Email hỗ trợ" name="supportEmail" type="email" value={form.supportEmail} onChange={handleChange} placeholder="support@tawatch.vn" />
              <EditField label="Website" name="website" value={form.website} onChange={handleChange} placeholder="tawatch.vn" />
              <div className="md:col-span-2">
                <EditField label="Địa chỉ" name="address" value={form.address} onChange={handleChange} placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM" />
              </div>
            </div>

            <div className="border-t border-outline-variant/10 pt-6 mb-6">
              <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/50 uppercase mb-5">Cấu hình giao vận</p>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <EditField label="Phí vận chuyển mặc định (đ)" name="defaultShippingFee" type="number" min="0" value={form.defaultShippingFee} onChange={handleChange} placeholder="30000" />
                <EditField label="Miễn phí vận chuyển từ (đ)" name="freeShippingThreshold" type="number" min="0" value={form.freeShippingThreshold} onChange={handleChange} placeholder="2000000" />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant font-label-caps text-xs tracking-widest hover:border-primary hover:text-primary transition-all"
              >
                HUỶ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-background font-label-caps text-xs tracking-widest hover:bg-primary/80 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3 h-3 border border-background/40 border-t-background rounded-full animate-spin" />
                    ĐANG LƯU...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    LƯU
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            <InfoRow label="Tên cửa hàng" value={settings?.storeName} />
            <InfoRow label="Địa chỉ" value={settings?.address} />
            <InfoRow label="Điện thoại" value={settings?.phone} />
            <InfoRow label="Email hỗ trợ" value={settings?.supportEmail} />
            <InfoRow label="Website" value={settings?.website} />
            <InfoRow label="Múi giờ" value="Asia/Ho_Chi_Minh (GMT+7)" />
            <InfoRow label="Tiền tệ" value="VND — Việt Nam Đồng" />
          </>
        )}
      </div>

      {/* Shipping Config */}
      {!editing && (
        <div className="border border-outline-variant/10 bg-surface-container-low p-8">
          <SectionHeader icon="local_shipping">Cấu hình giao vận</SectionHeader>
          <InfoRow
            label="Phí vận chuyển mặc định"
            value={settings?.defaultShippingFee != null ? `${formatVnd(settings.defaultShippingFee)} đ` : '—'}
          />
          <InfoRow
            label="Miễn phí vận chuyển khi"
            value={settings?.freeShippingThreshold != null ? `Đơn hàng từ ${formatVnd(settings.freeShippingThreshold)} đ` : '—'}
          />
          <InfoRow label="Đơn vị vận chuyển" value="GHN · GHTK · Giao hàng nhanh" />
          <InfoRow label="Nhận tại cửa hàng" value="Được hỗ trợ" />
        </div>
      )}
    </div>
  )
}

// ─── System Tab ──────────────────────────────────────────────────────────────

function SystemTab() {
  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <SectionHeader icon="hub">Truy cập nhanh</SectionHeader>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {SYSTEM_LINKS.map(({ icon, label, desc, to }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 border border-outline-variant/10 p-5 transition-all hover:border-primary/30 hover:bg-surface-container"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-container-high transition-colors group-hover:bg-primary/10">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant/60 transition-colors group-hover:text-primary">{icon}</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-md text-sm font-medium text-on-surface group-hover:text-primary">{label}</p>
                <p className="font-body-md text-xs text-on-surface-variant/60">{desc}</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/25 transition-colors group-hover:text-primary">arrow_forward</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <SectionHeader icon="info">Thông tin hệ thống</SectionHeader>
        <InfoRow label="Phiên bản" value="TAWatch Admin v1.0" />
        <InfoRow label="Backend" value="Spring Boot 3 · Java 21" />
        <InfoRow label="Frontend" value="React 18 · Vite · Tailwind CSS" />
        <InfoRow label="Cơ sở dữ liệu" value="MySQL 8" />
        <InfoRow label="Thanh toán" value="VNPay · COD · Chuyển khoản" />
        <InfoRow label="Lưu trữ ảnh" value="Cloudinary CDN" />
      </div>
    </div>
  )
}

// ─── Account Tab ─────────────────────────────────────────────────────────────

function AccountTab({ user }) {
  const ROLE_LABEL = { ADMIN: 'Quản trị viên', CUSTOMER: 'Khách hàng' }

  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <SectionHeader icon="person">Thông tin tài khoản hiện tại</SectionHeader>

        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center border border-primary/30 bg-primary/8">
            <span className="material-symbols-outlined text-[28px] text-primary/60">admin_panel_settings</span>
          </div>
          <div>
            <p className="font-body-md text-base font-medium text-on-surface">{user?.fullName || user?.username}</p>
            <p className="font-body-md text-sm text-on-surface-variant/60">{user?.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 border border-primary/30 bg-primary/8 px-2.5 py-1 font-label-caps text-[9px] tracking-[0.2em] text-primary">
              <span className="material-symbols-outlined text-[12px]">verified_user</span>
              {ROLE_LABEL[user?.role] ?? user?.role}
            </span>
          </div>
        </div>

        <InfoRow label="Tên đăng nhập" value={user?.username} />
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Họ và tên" value={user?.fullName} />
        <InfoRow label="Vai trò" value={ROLE_LABEL[user?.role] ?? user?.role} />
        <InfoRow label="Trạng thái" value={user?.isActive ? 'Đang hoạt động' : 'Bị khoá'} />
      </div>

      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <SectionHeader icon="lock">Bảo mật</SectionHeader>
        <p className="mb-6 font-body-md text-sm text-on-surface-variant/70">
          Để thay đổi mật khẩu hoặc thông tin cá nhân, vào trang hồ sơ tài khoản.
        </p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 border border-primary px-6 py-3 font-label-caps text-[10px] tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-background"
        >
          <span className="material-symbols-outlined text-[15px]">manage_accounts</span>
          Đến trang hồ sơ
        </Link>
      </div>
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function ManageSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('store')

  return (
    <main className="ml-72 mt-20 min-h-screen p-gutter">
      <section className="pt-8 mb-10">
        <span className="font-label-caps text-label-caps text-primary tracking-[0.35em] block mb-4 uppercase">
          System Configuration
        </span>
        <div className="max-w-3xl">
          <h2 className="font-display-lg text-display-lg text-on-background mb-4">Cài đặt hệ thống</h2>
          <p className="text-on-surface-variant/80">
            Xem và chỉnh sửa thông tin cửa hàng, cấu hình giao vận, và quản lý tài khoản quản trị viên.
          </p>
        </div>
        <div className="h-px opacity-30 mt-8" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      <div className="mb-8 flex gap-0 border-b border-outline-variant/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 font-label-caps text-[9px] tracking-[0.2em] transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant/60 hover:border-outline-variant/30 hover:text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {activeTab === 'store'   && <StoreTab />}
        {activeTab === 'system'  && <SystemTab />}
        {activeTab === 'account' && <AccountTab user={user} />}
      </div>
    </main>
  )
}
