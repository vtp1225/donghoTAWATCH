import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const TABS = [
  { id: 'store',   label: 'Cửa hàng',     icon: 'storefront' },
  { id: 'system',  label: 'Hệ thống',      icon: 'settings' },
  { id: 'account', label: 'Tài khoản',     icon: 'manage_accounts' },
]

const STORE_INFO = [
  { label: 'Tên cửa hàng',       value: 'TAWatch' },
  { label: 'Địa chỉ',            value: '123 Nguyễn Huệ, Quận 1, TP.HCM' },
  { label: 'Điện thoại',         value: '028 3822 xxxx' },
  { label: 'Email hỗ trợ',       value: 'support@tawatch.vn' },
  { label: 'Website',            value: 'tawatch.vn' },
  { label: 'Múi giờ',            value: 'Asia/Ho_Chi_Minh (GMT+7)' },
  { label: 'Tiền tệ',            value: 'VND — Việt Nam Đồng' },
]

const SYSTEM_LINKS = [
  { icon: 'watch',         label: 'Kho hàng',       desc: 'Quản lý sản phẩm & biến thể',     to: '/admin/inventory' },
  { icon: 'shopping_cart', label: 'Đơn hàng',        desc: 'Xử lý & theo dõi đơn',            to: '/admin/orders' },
  { icon: 'local_offer',   label: 'Khuyến mãi',      desc: 'Coupon & chương trình ưu đãi',    to: '/admin/promotions' },
  { icon: 'group',         label: 'Khách hàng',      desc: 'Quản lý tài khoản người dùng',    to: '/admin/customers' },
  { icon: 'rate_review',   label: 'Đánh giá',        desc: 'Kiểm duyệt nhận xét sản phẩm',   to: '/admin/reviews' },
  { icon: 'category',      label: 'Danh mục',        desc: 'Cây danh mục sản phẩm',          to: '/admin/categories' },
]

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-outline-variant/8 py-4 last:border-b-0">
      <span className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant/60 uppercase shrink-0 pt-0.5">{label}</span>
      <span className="font-body-md text-sm text-on-surface text-right">{value}</span>
    </div>
  )
}

function StoreTab() {
  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/70">store</span>
          <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Thông tin cửa hàng</h3>
          <div className="h-px flex-1 bg-outline-variant/10" />
        </div>
        <div>
          {STORE_INFO.map(({ label, value }) => (
            <InfoRow key={label} label={label} value={value} />
          ))}
        </div>
        <p className="mt-6 font-body-md text-xs text-on-surface-variant/40">
          Để thay đổi thông tin cửa hàng, vui lòng liên hệ quản trị viên hệ thống.
        </p>
      </div>

      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/70">local_shipping</span>
          <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Cấu hình giao vận</h3>
          <div className="h-px flex-1 bg-outline-variant/10" />
        </div>
        <div>
          <InfoRow label="Phí vận chuyển mặc định" value="30.000 đ / đơn" />
          <InfoRow label="Miễn phí vận chuyển khi" value="Đơn hàng từ 2.000.000 đ" />
          <InfoRow label="Đơn vị vận chuyển" value="GHN · GHTK · Giao hàng nhanh" />
          <InfoRow label="Nhận tại cửa hàng" value="Được hỗ trợ" />
        </div>
      </div>
    </div>
  )
}

function SystemTab() {
  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/70">hub</span>
          <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Truy cập nhanh</h3>
          <div className="h-px flex-1 bg-outline-variant/10" />
        </div>
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
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/70">info</span>
          <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Thông tin hệ thống</h3>
          <div className="h-px flex-1 bg-outline-variant/10" />
        </div>
        <div>
          <InfoRow label="Phiên bản" value="TAWatch Admin v1.0" />
          <InfoRow label="Backend" value="Spring Boot 3 · Java 21" />
          <InfoRow label="Frontend" value="React 18 · Vite · Tailwind CSS" />
          <InfoRow label="Cơ sở dữ liệu" value="MySQL 8" />
          <InfoRow label="Thanh toán" value="VNPay · COD · Chuyển khoản" />
          <InfoRow label="Lưu trữ ảnh" value="Cloudinary CDN" />
        </div>
      </div>
    </div>
  )
}

function AccountTab({ user }) {
  const ROLE_LABEL = { ADMIN: 'Quản trị viên', STAFF: 'Nhân viên', CUSTOMER: 'Khách hàng' }

  return (
    <div className="space-y-8">
      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/70">person</span>
          <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Thông tin tài khoản hiện tại</h3>
          <div className="h-px flex-1 bg-outline-variant/10" />
        </div>

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

        <div>
          <InfoRow label="Tên đăng nhập" value={user?.username || '—'} />
          <InfoRow label="Email" value={user?.email || '—'} />
          <InfoRow label="Họ và tên" value={user?.fullName || '—'} />
          <InfoRow label="Vai trò" value={ROLE_LABEL[user?.role] ?? user?.role ?? '—'} />
          <InfoRow label="Trạng thái" value={user?.isActive ? 'Đang hoạt động' : 'Bị khoá'} />
        </div>
      </div>

      <div className="border border-outline-variant/10 bg-surface-container-low p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/70">lock</span>
          <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">Bảo mật</h3>
          <div className="h-px flex-1 bg-outline-variant/10" />
        </div>
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
            Xem thông tin cửa hàng, cấu hình hệ thống và quản lý tài khoản quản trị viên.
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
