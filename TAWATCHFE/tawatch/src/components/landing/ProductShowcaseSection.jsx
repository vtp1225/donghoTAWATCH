import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { productService } from '../../services/productService.js'
import { cartService } from '../../services/cartService.js'
import { wishlistService } from '../../services/wishlistService.js'

function getStoredUserId() {
  try {
    const stored = window.localStorage.getItem('auth_user')
    if (!stored) return null
    return JSON.parse(stored)?.id ?? null
  } catch {
    return null
  }
}

// ─── Mini card ────────────────────────────────────────────────────────────────

function ShowcaseCard({ item, wishlisted = false }) {
  const navigate = useNavigate()
  const [addState, setAddState] = useState('idle')
  const [heartState, setHeartState] = useState(wishlisted)
  const [wishlistToast, setWishlistToast] = useState('')

  const handleAdd = async () => {
    if (!item.variantId || addState !== 'idle') return
    setAddState('loading')
    try {
      const cart = await cartService.getCurrentCart()
      await cartService.addItem(cart.id, item.variantId, 1)
      window.dispatchEvent(new Event('cart:updated'))
      setAddState('added')
      setTimeout(() => setAddState('idle'), 2000)
    } catch {
      setAddState('error')
      setTimeout(() => setAddState('idle'), 2000)
    }
  }

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    const userId = getStoredUserId()
    if (!userId) {
      navigate('/login', { state: { from: `/product/${item.id}` } })
      return
    }
    if (!item.variantId) return
    const next = !heartState
    setHeartState(next)
    try {
      if (next) {
        await wishlistService.add(userId, item.variantId)
        setWishlistToast('added')
        setTimeout(() => setWishlistToast(''), 2000)
      } else {
        await wishlistService.remove(userId, item.variantId)
        setWishlistToast('removed')
        setTimeout(() => setWishlistToast(''), 2000)
      }
      window.dispatchEvent(new Event('wishlist:updated'))
    } catch {
      setHeartState(!next)
    }
  }

  return (
    <div className="group flex-shrink-0 w-[220px] md:w-auto">
      {/* Image */}
      <div className="relative mb-3 aspect-square overflow-hidden bg-surface-container">
        <Link to={`/product/${item.id}`} className="absolute inset-0 z-10">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/0 transition-colors duration-300 group-hover:bg-background/10" />
        </Link>

        {/* Discount badge */}
        {item.discountPercent && (
          <div className="absolute top-2 left-2 z-20 bg-error px-1.5 py-0.5 font-label-caps text-[9px] tracking-widest text-white">
            -{item.discountPercent}%
          </div>
        )}

        {/* Wishlist button */}
        {item.variantId && (
          <button
            type="button"
            onClick={handleToggleWishlist}
            title={heartState ? 'Xoá khỏi yêu thích' : 'Thêm vào yêu thích'}
            className="absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <span
              className={`material-symbols-outlined text-[16px] transition-colors duration-200 ${heartState ? 'text-red-400' : 'text-on-surface-variant/60 hover:text-red-400'}`}
              style={heartState ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              favorite
            </span>
          </button>
        )}
      </div>

      {/* Info */}
      <Link to={`/product/${item.id}`} className="block">
        {item.brandName && (
          <p className="font-label-caps text-[8px] tracking-[0.25em] text-primary/70 uppercase">
            {item.brandName}
          </p>
        )}
        <h3 className="mt-1 line-clamp-1 font-body-md text-sm font-medium text-on-surface group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>
        <div className="mt-0.5 flex items-baseline gap-2">
          <p className="font-headline-sm text-sm text-primary">
            {item.salePrice ?? item.price}
          </p>
          {item.salePrice && (
            <p className="font-label-caps text-[9px] text-on-surface-variant/40 line-through">
              {item.price}
            </p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!item.variantId || addState !== 'idle'}
        className={`mt-3 w-full border py-2 font-label-caps text-[8px] tracking-[0.2em] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
          addState === 'added'
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-outline-variant/20 text-on-surface-variant/50 hover:border-primary hover:text-primary'
        }`}
      >
        {addState === 'added'
          ? 'ĐÃ THÊM'
          : addState === 'loading'
          ? 'ĐANG THÊM...'
          : !item.variantId
          ? 'HẾT HÀNG'
          : 'THÊM VÀO GIỎ'}
      </button>
    </div>
  )
}

// ─── One showcase row ─────────────────────────────────────────────────────────

function ShowcaseRow({ badge, title, subtitle, linkTo, products, wishlistIds }) {
  if (!products || products.length === 0) return null
  return (
    <div className="py-14 border-t border-outline-variant/10 first:border-t-0">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          {badge && (
            <span className="mb-3 inline-flex items-center gap-2 font-label-caps text-[9px] tracking-[0.35em] text-primary uppercase">
              <span className="h-px w-6 bg-primary/60" />
              {badge}
            </span>
          )}
          <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
          {subtitle && (
            <p className="mt-2 font-body-md text-sm text-on-surface-variant/60">{subtitle}</p>
          )}
        </div>
        {linkTo && (
          <Link
            to={linkTo}
            className="flex flex-shrink-0 items-center gap-1.5 border border-outline-variant/20 px-4 py-2 font-label-caps text-[8px] tracking-[0.25em] text-on-surface-variant/60 transition-all duration-200 hover:border-primary/50 hover:text-primary"
          >
            XEM TẤT CẢ
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>
        )}
      </div>

      {/* Cards — horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide">
        {products.slice(0, 4).map((item) => (
          <ShowcaseCard
            key={item.id}
            item={item}
            wishlisted={item.variantId != null && wishlistIds.has(item.variantId)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

const SECTION_ORDER = ['nam', 'nữ', 'nu', 'smart', 'thể thao', 'the thao', 'luxury', 'classic', 'sport']

function rankCategory(name = '') {
  const lower = name.toLowerCase()
  const idx = SECTION_ORDER.findIndex((k) => lower.includes(k))
  return idx === -1 ? 999 : idx
}

export default function ProductShowcaseSection() {
  const [featured, setFeatured] = useState([])
  const [newest, setNewest] = useState([])
  const [categoryGroups, setCategoryGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState(new Set())

  useEffect(() => {
    const userId = getStoredUserId()
    if (!userId) return

    const loadWishlist = () => {
      const uid = getStoredUserId()
      if (!uid) { setWishlistIds(new Set()); return }
      wishlistService.getWishlist(uid)
        .then((items) => setWishlistIds(new Set(Array.isArray(items) ? items.map((i) => i.variantId) : [])))
        .catch(() => {})
    }

    loadWishlist()
    window.addEventListener('wishlist:updated', loadWishlist)
    window.addEventListener('auth:logout', () => setWishlistIds(new Set()))
    return () => window.removeEventListener('wishlist:updated', loadWishlist)
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([
      productService.getFeatured().catch(() => []),
      productService.getNewest(24).catch(() => []),
    ]).then(([feat, recent]) => {
      if (!active) return
      setFeatured(Array.isArray(feat) ? feat : [])
      setNewest((Array.isArray(recent) ? recent : []).slice(0, 4))

      // Group recent products by category
      const map = new Map()
      for (const p of (Array.isArray(recent) ? recent : [])) {
        const key = p.categoryId ?? 'other'
        if (!map.has(key)) map.set(key, { id: p.categoryId, name: p.categoryName || 'Khác', items: [] })
        map.get(key).items.push(p)
      }
      const groups = [...map.values()]
        .filter((g) => g.items.length >= 1)
        .sort((a, b) => rankCategory(a.name) - rankCategory(b.name))
        .slice(0, 3)
      setCategoryGroups(groups)
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-24 md:px-[80px]">
        <div className="py-20 text-center">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary/30">progress_activity</span>
        </div>
      </section>
    )
  }

  if (featured.length === 0 && newest.length === 0 && categoryGroups.length === 0) return null

  return (
    <section className="bg-background px-8 py-section-gap-desktop md:px-[80px]">
      <div className="mx-auto max-w-7xl">

        {/* Page title */}
        <div className="mb-14 text-center">
          <span className="font-label-caps text-[10px] tracking-[0.35em] text-primary">BỘ SƯU TẬP</span>
          <h2 className="mt-4 font-headline-md text-headline-md text-on-surface">
            Khám phá đồng hồ
          </h2>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        {/* Featured (only shown when admin has marked products) */}
        {featured.length > 0 && (
          <ShowcaseRow
            badge="NỔI BẬT"
            title="Được tuyển chọn"
            subtitle="Những mẫu đồng hồ được đội ngũ TAWatch tuyển chọn đặc biệt"
            linkTo="/products"
            products={featured}
            wishlistIds={wishlistIds}
          />
        )}

        {/* Newest */}
        <ShowcaseRow
          badge="MỚI NHẤT"
          title="Vừa ra mắt"
          subtitle="Những mẫu đồng hồ mới nhất vừa được thêm vào bộ sưu tập"
          linkTo="/products"
          products={newest}
          wishlistIds={wishlistIds}
        />

        {/* Category rows */}
        {categoryGroups.map((group) => (
          <ShowcaseRow
            key={group.id}
            badge={group.name.toUpperCase()}
            title={group.name}
            linkTo={group.id ? `/products?categoryId=${group.id}` : '/products'}
            products={group.items}
            wishlistIds={wishlistIds}
          />
        ))}

      </div>
    </section>
  )
}
