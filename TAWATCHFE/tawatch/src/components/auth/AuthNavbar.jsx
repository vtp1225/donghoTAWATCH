import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

const navItems = [
  { label: 'Collections', href: '/#collections' },
  { label: 'Heritage', href: '/#heritage' },
  { label: 'Store Locator', href: '/#footer' },
]

export default function AuthNavbar() {
  const [accountOpen, setAccountOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated, displayName, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant/20 bg-surface/90 px-gutter py-5 backdrop-blur-xl md:px-[80px]">
      <Link className="font-headline-md text-headline-sm uppercase tracking-[0.2em] text-primary" to="/">
        TAWatch
      </Link>

      <div className="hidden items-center gap-10 md:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            className="font-label-caps text-label-caps text-on-surface transition-all duration-700 ease-out hover:tracking-[0.2em] hover:text-primary"
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button
            className="text-primary transition-transform duration-500 hover:scale-110"
            type="button"
            aria-label={isAuthenticated ? `Account ${displayName}` : 'Account'}
            onClick={() => setAccountOpen((prev) => !prev)}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">person</span>
              {isAuthenticated && (
                <span className="hidden max-w-[140px] truncate font-label-caps text-[10px] tracking-[0.2em] md:inline-block">
                  {displayName}
                </span>
              )}
            </span>
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full mt-3 w-44 border border-outline-variant/20 bg-surface-container shadow-xl">
              {isAuthenticated ? (
                <>
                  <div className="border-b border-outline-variant/20 px-5 py-3">
                    <p className="truncate font-label-caps text-[10px] tracking-[0.25em] text-on-surface-variant">SIGNED IN AS</p>
                    <p className="truncate font-body-md text-sm text-on-surface">{displayName}</p>
                  </div>
                  <button
                    className="flex w-full items-center gap-3 px-5 py-3 text-left font-label-caps text-label-caps text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                    type="button"
                    onClick={handleLogout}
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="flex items-center gap-3 px-5 py-3 font-label-caps text-label-caps text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                    to="/login"
                    onClick={() => setAccountOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    Đăng nhập
                  </Link>
                  <div className="h-px bg-outline-variant/20" />
                  <Link
                    className="flex items-center gap-3 px-5 py-3 font-label-caps text-label-caps text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                    to="/register"
                    onClick={() => setAccountOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <button className="text-primary transition-transform duration-500 hover:scale-110" type="button" aria-label="Shopping bag">
          <span className="material-symbols-outlined">shopping_bag</span>
        </button>
      </div>
    </nav>
  )
}
