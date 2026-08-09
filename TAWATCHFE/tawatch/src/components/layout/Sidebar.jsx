import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { icon: 'dashboard',      label: 'Tổng quan',     to: '/admin' },
  { icon: 'watch',          label: 'Kho hàng',      to: '/admin/inventory' },
  { icon: 'sell',           label: 'Phân khúc',     to: '/admin/segments',        adminOnly: true },
  { icon: 'category',       label: 'Danh mục',      to: '/admin/categories',      adminOnly: true },
  { icon: 'storefront',     label: 'Thương hiệu',   to: '/admin/brands',          adminOnly: true },
  { icon: 'shopping_cart',  label: 'Đơn hàng',      to: '/admin/orders' },
  { icon: 'local_offer',    label: 'Khuyến mãi',    to: '/admin/promotions',      adminOnly: true },
  { icon: 'group',          label: 'Tài khoản',     to: '/admin/customers' },
  { icon: 'palette',        label: 'Màu sắc',       to: '/admin/colors',          adminOnly: true },
  { icon: 'rate_review',    label: 'Đánh giá',      to: '/admin/reviews' },
  { icon: 'local_shipping', label: 'Nhà cung cấp',  to: '/admin/suppliers',       adminOnly: true },
  { icon: 'receipt_long',   label: 'Nhập kho',      to: '/admin/import-receipts', adminOnly: true },
  { icon: 'settings',       label: 'Cài đặt',       to: '/admin/settings',        adminOnly: true },
  { icon: 'history',        label: 'Nhật ký',       to: '/admin/logs',            adminOnly: true },
]

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <aside className="h-screen fixed left-0 top-0 w-72 border-r border-outline-variant/20 flex flex-col py-8 bg-background z-50">
      <div className="px-gutter mb-12">
        <h1 className="font-headline-sm text-headline-sm tracking-[0.2em] uppercase text-primary">TAWATCH</h1>
        <p className="font-label-caps text-label-caps tracking-[0.3em] text-on-surface-variant/60">
          ADMIN PAGE
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto sidebar-scroll">
        {visibleItems.map(({ icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `group flex items-center px-gutter py-3 font-label-caps tracking-widest transition-all duration-500 ease-in-out active:scale-95 ${
                  isActive
                    ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-low'
                    : 'text-on-surface-variant/70 hover:text-primary hover:tracking-[0.25em]'
              }`
            }
          >
            <span className="material-symbols-outlined mr-4">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-gutter pt-8 border-t border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_circle
            </span>
          </div>
          <div>
            <p className="font-label-caps text-xs text-on-background truncate max-w-[150px]">
              {user?.fullName || user?.username || 'STAFF'}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
              {isAdmin ? 'QUẢN TRỊ VIÊN' : 'NHÂN VIÊN (STAFF)'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
