import { Link } from 'react-router-dom'

const COLLECTIONS = [
  { label: 'Tất cả sản phẩm', to: '/products' },
  { label: 'Thương hiệu', to: '/brands' },
  { label: 'Sản phẩm nổi bật', to: '/products?featured=true' },
]

const SUPPORT = [
  { label: 'Chính sách đổi trả', to: '/chinh-sach-doi-tra' },
  { label: 'Liên hệ & Tư vấn', to: '/lien-he' },
  { label: 'Theo dõi đơn hàng', to: '/orders' },
  { label: 'Danh sách yêu thích', to: '/wishlist' },
]

const ACCOUNT = [
  { label: 'Đăng nhập', to: '/login' },
  { label: 'Tạo tài khoản', to: '/register' },
  { label: 'Thông tin cá nhân', to: '/profile' },
]

export default function Footer() {
  return (
    <footer id="footer" className="w-full border-t border-outline-variant/10 bg-surface-container-low py-section-gap-desktop">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter px-8 md:grid-cols-4 md:px-[80px]">

        {/* Brand */}
        <div className="col-span-1">
          <Link to="/" className="mb-6 inline-block font-headline-sm text-headline-sm text-primary hover:opacity-80 transition-opacity">
            TAWatch
          </Link>
          <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
            Khám phá bộ sưu tập đồng hồ cao cấp — nơi nghệ thuật cơ học gặp gỡ phong cách hiện đại.
          </p>
        </div>

        {/* Bộ sưu tập */}
        <div>
          <h4 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            Bộ sưu tập
          </h4>
          <ul className="space-y-4">
            {COLLECTIONS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h4 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            Hỗ trợ
          </h4>
          <ul className="space-y-4">
            {SUPPORT.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tài khoản */}
        <div>
          <h4 className="mb-6 font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
            Tài khoản
          </h4>
          <ul className="space-y-4">
            {ACCOUNT.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-outline-variant/10 px-8 pt-8 md:flex-row md:px-[80px]">
        <div className="font-body-md text-body-md text-on-surface-variant opacity-50">
          © {new Date().getFullYear()} TAWatch. All rights reserved.
        </div>
        <div className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary">
          Built for Eternity
        </div>
      </div>
    </footer>
  )
}
