import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

export default function AdminTopBar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="fixed top-0 right-0 left-72 h-20 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-gutter">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full bg-transparent border-none border-b border-outline-variant/20 focus:ring-0 focus:border-primary pl-8 py-2 font-label-caps text-xs tracking-widest placeholder:text-on-surface-variant/40 transition-all"
            placeholder="Search Archives..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-label-caps text-xs tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          title="Về trang chủ shop"
        >
          <span className="material-symbols-outlined">storefront</span>
          Trang chủ shop
        </Link>
        <div className="font-label-caps text-label-caps tracking-widest text-primary">DASHBOARD</div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors" title="Notifications">
            notifications
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button onClick={handleLogout} className="flex items-center gap-2 font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">account_circle</button>
          )}
        </div>
      </div>
    </header>
  )
}
