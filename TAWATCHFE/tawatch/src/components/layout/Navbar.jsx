import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import useCart from '../../hooks/useCart.js'
import useCategoryTree from '../../hooks/useCategoryTree.js'
import { brandService } from '../../services/brandService.js'

function buildCategoryLink(categoryId) {
  return `/products?categoryId=${categoryId}`
}

function buildMenuRoot(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return null
  return { id: 'dong-ho-root', name: 'Đồng Hồ', slug: 'dong-ho', children: categories }
}

function CategoryColumn({ category }) {
  const children = Array.isArray(category?.children) ? category.children : []
  return (
    <div className="min-w-0">
      <Link
        className="group/col mb-3 flex items-center gap-2 font-label-caps text-[10px] tracking-[0.22em] uppercase text-primary transition-colors duration-200 hover:text-on-surface"
        to={buildCategoryLink(category.id)}
      >
        <span className="h-1 w-1 flex-shrink-0 bg-primary transition-transform duration-300 group-hover/col:scale-[2]" />
        {category.name}
      </Link>
      {children.length > 0 && (
        <div className="space-y-2 border-l border-outline-variant/15 pl-3">
          {children.map((child) => (
            <Link
              key={child.id}
              className="block font-body-md text-[12px] tracking-[0.04em] text-on-surface/50 transition-all duration-200 hover:translate-x-0.5 hover:text-on-surface/85"
              to={buildCategoryLink(child.id)}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MegaMenu({ category, isDongHo = false }) {
  const children = Array.isArray(category?.children) ? category.children : []
  return (
    <div className="invisible fixed left-0 right-0 top-20 z-50 w-full -translate-y-2 bg-surface-container opacity-0 shadow-[0_24px_64px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      {/* Gold top accent line */}
      <div className="h-px bg-gradient-to-r from-primary/60 via-primary/25 to-transparent" />

      <div className="mx-auto max-w-7xl px-8 py-7 md:px-[80px]">
        {/* Header row */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-0.5 font-label-caps text-[9px] tracking-[0.35em] text-on-surface-variant/60 uppercase">
              Bộ sưu tập
            </p>
            <p className="font-label-caps text-sm tracking-[0.18em] uppercase text-on-surface">
              {category.name}
            </p>
          </div>
          <Link
            className="flex items-center gap-1.5 border border-outline-variant/25 px-4 py-2 font-label-caps text-[10px] tracking-[0.2em] uppercase text-on-surface/55 transition-all duration-200 hover:border-primary/40 hover:text-primary"
            to={isDongHo ? '/products' : buildCategoryLink(category.id)}
          >
            Xem tất cả
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>
        </div>

        {/* Gold gradient divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-primary/35 via-primary/10 to-transparent" />

        {/* Category columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-2 md:grid-cols-4 lg:grid-cols-6">
          {children.length > 0 ? (
            children.map((child) => <CategoryColumn key={child.id} category={child} />)
          ) : (
            <p className="font-body-md text-xs text-on-surface-variant/50">Chưa có danh mục con.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const NAV_LINK_CLASS =
  'relative flex items-center gap-0.5 pb-1 font-label-caps text-[10px] tracking-[0.22em] uppercase text-on-surface/65 transition-colors duration-200 hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-[width] after:duration-300 after:content-[\'\'] hover:after:w-full'

function BrandsDropdown() {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    brandService.getAll().then((d) => setBrands(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  return (
    <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 -translate-y-2 bg-surface-container opacity-0 shadow-[0_12px_48px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="h-px bg-gradient-to-r from-primary/60 via-primary/25 to-transparent" />
      <div className="border border-t-0 border-outline-variant/15 p-3">
        <Link
          className="mb-2 flex items-center justify-between px-2 py-1.5 font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60 transition-colors hover:text-primary"
          to="/brands"
        >
          Tất cả thương hiệu
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </Link>
        <div className="h-px bg-outline-variant/10 mb-2" />
        <ul className="grid grid-cols-2 gap-0.5">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link
                className="flex items-center gap-2 rounded px-2 py-1.5 font-body-md text-[11px] text-on-surface/65 transition-all duration-150 hover:bg-surface-container-high hover:text-primary"
                to={`/products?brandId=${brand.id}`}
              >
                <span className="h-1 w-1 flex-shrink-0 bg-outline-variant/40" />
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated, displayName, logout } = useAuth()
  const { cartCount } = useCart()
  const { categories } = useCategoryTree()
  const dongHoCategory = buildMenuRoot(categories)

  const preferNames = ['smart', 'men', 'women', 'sport']
  const roots = Array.isArray(categories) ? categories : []
  const uniqueRoots = preferNames
    .map((n) => roots.find((c) => c && typeof c.name === 'string' && c.name.toLowerCase().includes(n)))
    .filter(Boolean)
    .reduce((acc, cur) => {
      if (!acc.find((x) => x.id === cur.id)) acc.push(cur)
      return acc
    }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <nav
      className={`fixed top-0 z-50 flex h-20 w-full items-center justify-between px-8 backdrop-blur-xl transition-all duration-300 md:px-[80px] ${
        isScrolled
          ? 'bg-surface/96 shadow-[0_1px_0_rgba(233,193,118,0.14),0_8px_40px_rgba(0,0,0,0.45)]'
          : 'bg-surface/82 shadow-[0_1px_0_rgba(233,193,118,0.07)]'
      }`}
    >
      {/* Logo */}
      <Link
        className="font-headline-md text-headline-md tracking-[0.25em] uppercase text-primary transition-opacity duration-200 hover:opacity-75"
        to="/"
      >
        TAWatch
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-9 md:flex">
        {dongHoCategory && (
          <>
            <div className="group relative">
              <Link className={NAV_LINK_CLASS} to="/products">
                {dongHoCategory.name}
                <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:rotate-180">
                  expand_more
                </span>
              </Link>
              <MegaMenu category={dongHoCategory} isDongHo />
            </div>

            {uniqueRoots.length > 0 && (
              <span className="h-3 w-px bg-outline-variant/20" />
            )}

            {uniqueRoots.map((root, idx) => (
              <div key={root.id} className="flex items-center gap-9">
                <div className="group relative">
                  <Link className={NAV_LINK_CLASS} to={buildCategoryLink(root.id)}>
                    {root.name}
                    <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:rotate-180">
                      expand_more
                    </span>
                  </Link>
                  <MegaMenu category={root} />
                </div>
                {idx < uniqueRoots.length - 1 && (
                  <span className="h-3 w-px bg-outline-variant/20" />
                )}
              </div>
            ))}

            <span className="h-3 w-px bg-outline-variant/20" />

            {/* Thương Hiệu */}
            <div className="group relative">
              <Link className={NAV_LINK_CLASS} to="/brands">
                Thương Hiệu
                <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:rotate-180">
                  expand_more
                </span>
              </Link>
              <BrandsDropdown />
            </div>

            {/* Liên Hệ */}
            <Link className={NAV_LINK_CLASS} to="/lien-he">
              Liên Hệ
            </Link>
          </>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        {/* Account */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-on-surface/65 transition-colors duration-200 hover:text-primary"
            type="button"
            aria-label={isAuthenticated ? `Tài khoản ${displayName}` : 'Tài khoản'}
            onClick={() => setAccountOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[22px]">person</span>
            {isAuthenticated && (
              <span className="hidden max-w-[120px] truncate font-label-caps text-[10px] tracking-[0.18em] text-primary md:inline-block">
                {displayName}
              </span>
            )}
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full mt-4 w-48 overflow-hidden bg-surface-container shadow-[0_12px_48px_rgba(0,0,0,0.55)] animate-fade-in">
              {/* Gold top accent */}
              <div className="h-px bg-gradient-to-r from-primary/60 to-primary/15" />
              <div className="border border-t-0 border-outline-variant/15">
                {isAuthenticated ? (
                  <>
                    <div className="border-b border-outline-variant/10 px-5 py-4">
                      <p className="mb-1 font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60">
                        Đang đăng nhập
                      </p>
                      <p className="truncate font-body-md text-sm text-on-surface">{displayName}</p>
                    </div>
                    <button
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left font-label-caps text-[10px] tracking-[0.15em] uppercase text-on-surface/65 transition-all duration-200 hover:bg-surface-container-high hover:pl-6 hover:text-primary"
                      type="button"
                      onClick={handleLogout}
                    >
                      <span className="material-symbols-outlined text-[17px]">logout</span>
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="flex items-center gap-3 px-5 py-3.5 font-label-caps text-[10px] tracking-[0.15em] uppercase text-on-surface/65 transition-all duration-200 hover:bg-surface-container-high hover:pl-6 hover:text-primary"
                      to="/login"
                      onClick={() => setAccountOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[17px]">login</span>
                      Đăng nhập
                    </Link>
                    <div className="mx-5 h-px bg-outline-variant/10" />
                    <Link
                      className="flex items-center gap-3 px-5 py-3.5 font-label-caps text-[10px] tracking-[0.15em] uppercase text-on-surface/65 transition-all duration-200 hover:bg-surface-container-high hover:pl-6 hover:text-primary"
                      to="/register"
                      onClick={() => setAccountOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[17px]">person_add</span>
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link
          className="relative text-on-surface/65 transition-colors duration-200 hover:text-primary"
          to="/cart"
          aria-label="Giỏ hàng"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 font-label-caps text-[9px] font-semibold leading-none text-background">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>

        {/* Mobile menu */}
        <button
          className="text-on-surface/65 transition-colors duration-200 hover:text-primary md:hidden"
          type="button"
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
      </div>
    </nav>
  )
}
