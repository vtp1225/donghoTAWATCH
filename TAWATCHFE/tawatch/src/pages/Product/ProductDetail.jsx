




import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import { watchService, variantService, variantImageService } from '../../services/watchService.js'
import { cartService } from '../../services/cartService.js'
import { wishlistService } from '../../services/wishlistService.js'
import ProductReviews from './ProductReviews.jsx'

function formatVnd(value) {
  if (value == null) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

// Each axis describes one dimension that can differ between variants
const VARIANT_AXES = [
  {
    key: 'dialColor',
    label: 'Màu mặt số',
    getValue: (v) => v.dialColorId != null ? String(v.dialColorId) : null,
    getDisplay: (v) => ({ label: v.dialColorName, hex: v.dialColorHex }),
  },
  {
    key: 'strapMaterial',
    label: 'Chất liệu dây',
    getValue: (v) => v.strapMaterial ?? null,
    getDisplay: (v) => ({ label: v.strapMaterial, hex: null }),
  },
  {
    key: 'strapColor',
    label: 'Màu dây',
    getValue: (v) => v.strapColorId != null ? String(v.strapColorId) : null,
    getDisplay: (v) => ({ label: v.strapColorName, hex: v.strapColorHex }),
  },
  {
    key: 'caseSizeMm',
    label: 'Kích thước vỏ',
    getValue: (v) => v.caseSizeMm != null ? String(v.caseSizeMm) : null,
    getDisplay: (v) => ({ label: v.caseSizeMm != null ? `${v.caseSizeMm}mm` : null, hex: null }),
  },
]

const SPEC_ITEMS = [
  { key: 'movementType', label: 'Bộ máy' },
  { key: 'glassMaterial', label: 'Kính' },
  { key: 'thicknessMm', label: 'Độ dày', unit: ' mm' },
  { key: 'waterResistanceAtm', label: 'Chống nước', unit: ' ATM' },
  { key: 'powerReserveHours', label: 'Trữ cót', unit: 'h' },
  { key: 'batteryType', label: 'Loại pin' },
  { key: 'features', label: 'Tính năng' },
]

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      <p className="mt-5 font-label-caps text-xs tracking-[0.4em] text-on-surface-variant/50">ĐANG TẢI...</p>
    </div>
  )
}

function ErrorScreen({ message }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <span className="material-symbols-outlined text-5xl text-error/60">error_outline</span>
      <p className="font-label-caps text-xs tracking-widest text-on-surface-variant/60">
        {message || 'Sản phẩm không tồn tại'}
      </p>
      <Link
        to="/products"
        className="border border-primary/40 px-8 py-3 font-label-caps text-xs tracking-[0.25em] uppercase text-primary transition-all duration-300 hover:bg-primary hover:text-background"
      >
        Xem sản phẩm khác
      </Link>
    </div>
  )
}

function getStoredUserId() {
  try {
    const stored = window.localStorage.getItem('auth_user')
    if (!stored) return null
    return JSON.parse(stored)?.id ?? null
  } catch {
    return null
  }
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [watch, setWatch] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [images, setImages] = useState([])
  const [activeImage, setActiveImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addState, setAddState] = useState('idle') // idle | loading | added | error
  const [selectedParams, setSelectedParams] = useState({})
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [wishlistToast, setWishlistToast] = useState('')

  const loadImages = useCallback((variant) => {
    if (!variant) { setImages([]); setActiveImage(null); return }
    variantImageService
      .getByVariant(variant.id)
      .then((imgs) => {
        const sorted = Array.isArray(imgs) ? imgs : []
        setImages(sorted)
        setActiveImage((sorted.find((img) => img.isPrimary) ?? sorted[0])?.url ?? null)
      })
      .catch(() => { setImages([]); setActiveImage(null) })
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')

    Promise.all([
      watchService.getById(Number(id)),
      variantService.getByWatch(Number(id)),
    ])
      .then(([watchData, variantList]) => {
        setWatch(watchData)
        const list = Array.isArray(variantList) ? variantList : []
        setVariants(list)
        const first = list[0] ?? null
        setSelectedVariant(first)
        loadImages(first)
        if (first) {
          const initParams = {}
          VARIANT_AXES.forEach(axis => {
            const val = axis.getValue(first)
            if (val != null) initParams[axis.key] = val
          })
          setSelectedParams(initParams)
        }
      })
      .catch((err) => setError(err.message || 'Không thể tải sản phẩm.'))
      .finally(() => setLoading(false))
  }, [id, loadImages])

  useEffect(() => {
    const userId = getStoredUserId()
    if (!userId || !selectedVariant) { setWishlisted(false); return }
    wishlistService.check(userId, selectedVariant.id)
      .then((res) => setWishlisted(res === true || res?.wishlisted === true))
      .catch(() => setWishlisted(false))
  }, [selectedVariant])

  const handleToggleWishlist = useCallback(async () => {
    const userId = getStoredUserId()
    if (!userId) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    if (!selectedVariant || wishlistLoading) return
    setWishlistLoading(true)
    const next = !wishlisted
    setWishlisted(next)
    try {
      if (next) {
        await wishlistService.add(userId, selectedVariant.id)
        setWishlistToast('added')
        setTimeout(() => setWishlistToast(''), 2000)
      } else {
        await wishlistService.remove(userId, selectedVariant.id)
        setWishlistToast('removed')
        setTimeout(() => setWishlistToast(''), 2000)
      }
      window.dispatchEvent(new Event('wishlist:updated'))
    } catch {
      setWishlisted(!next)
    } finally {
      setWishlistLoading(false)
    }
  }, [selectedVariant, wishlisted, wishlistLoading, navigate, id])

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant || addState === 'loading') return
    setAddState('loading')
    try {
      const cart = await cartService.getCurrentCart()
      await cartService.addItem(cart.id, selectedVariant.id, 1)
      window.dispatchEvent(new Event('cart:updated'))
      setAddState('added')
      setTimeout(() => setAddState('idle'), 2500)
    } catch {
      setAddState('error')
      setTimeout(() => setAddState('idle'), 2500)
    }
  }, [selectedVariant, addState])

  // Axes that actually differ across variants (≥ 2 distinct values)
  const activeAxes = useMemo(() => {
    if (!variants.length) return []
    return VARIANT_AXES.filter(axis => {
      const vals = new Set(variants.map(v => axis.getValue(v)).filter(v => v != null))
      return vals.size >= 2
    })
  }, [variants])

  // Unique options per axis (value → display)
  const optionsByAxis = useMemo(() => {
    return Object.fromEntries(
      activeAxes.map(axis => {
        const seen = new Map()
        variants.forEach(v => {
          const val = axis.getValue(v)
          if (val != null && !seen.has(val)) seen.set(val, axis.getDisplay(v))
        })
        return [axis.key, [...seen.entries()].map(([val, display]) => ({ val, ...display }))]
      })
    )
  }, [activeAxes, variants])

  const isAvailable = useCallback((axisKey, optionValue) => {
    return variants.some(v =>
      activeAxes.every(axis => {
        if (axis.key === axisKey) return axis.getValue(v) === optionValue
        const sel = selectedParams[axis.key]
        return sel == null || axis.getValue(v) === sel
      })
    )
  }, [variants, activeAxes, selectedParams])

  const handleSelectParam = useCallback((axisKey, optionValue) => {
    const newParams = { ...selectedParams, [axisKey]: optionValue }

    // Find exact variant matching all selected params
    let match = variants.find(v =>
      activeAxes.every(axis => {
        const sel = newParams[axis.key]
        return sel == null || axis.getValue(v) === sel
      })
    )

    if (!match) {
      // No exact match — pick best candidate that matches the clicked axis,
      // then maximizes overlap with other selected params
      const clickedAxis = activeAxes.find(a => a.key === axisKey)
      const candidates = clickedAxis
        ? variants.filter(v => clickedAxis.getValue(v) === optionValue)
        : variants

      match = candidates.reduce((best, v) => {
        const score = activeAxes.filter(axis => {
          const sel = newParams[axis.key]
          return sel != null && axis.getValue(v) === sel
        }).length
        const bestScore = best
          ? activeAxes.filter(axis => {
              const sel = newParams[axis.key]
              return sel != null && axis.getValue(best) === sel
            }).length
          : -1
        return score > bestScore ? v : best
      }, null) ?? variants[0]

      // Sync selectedParams to reflect actual variant chosen
      const synced = {}
      activeAxes.forEach(axis => {
        const val = axis.getValue(match)
        if (val != null) synced[axis.key] = val
      })
      setSelectedParams(synced)
    } else {
      setSelectedParams(newParams)
    }

    setSelectedVariant(match)
    loadImages(match)
  }, [variants, activeAxes, selectedParams, loadImages])

  if (loading) return <><Navbar /><LoadingScreen /></>
  if (error || !watch) return <><Navbar /><ErrorScreen message={error} /></>

  const hasStock = (selectedVariant?.stockQuantity ?? 0) > 0
  const specs = SPEC_ITEMS.filter(({ key }) => watch[key] != null && watch[key] !== '')

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="mx-auto max-w-7xl px-8 pb-28 pt-32 md:px-[80px]">

        {/* Breadcrumb */}
        <nav className="mb-12 flex items-center gap-2.5 font-label-caps text-xs tracking-widest text-on-surface-variant/50">
          <Link to="/" className="transition-colors hover:text-primary">Trang chủ</Link>
          <span className="text-outline-variant/40">/</span>
          <Link to="/products" className="transition-colors hover:text-primary">Sản phẩm</Link>
          <span className="text-outline-variant/40">/</span>
          <span className="text-on-surface-variant/75">{watch.name}</span>
        </nav>

        {/* ── Main section ── */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">

          {/* Left — Image gallery */}
          <div className="lg:col-span-7">
            {/* Main image */}
            <div className="group relative mb-4 aspect-square overflow-hidden bg-surface-container">
              <div className="pointer-events-none absolute inset-0 z-10 border border-primary/0 transition-all duration-700 group-hover:border-primary/20" />

              {activeImage ? (
                <img
                  key={activeImage}
                  src={activeImage}
                  alt={watch.name}
                  loading="eager"
                  className="h-full w-full object-cover transition-all duration-[2000ms] group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-on-surface-variant/20">
                  <span className="material-symbols-outlined text-7xl">watch</span>
                  <span className="font-label-caps text-xs tracking-[0.3em]">NO IMAGE</span>
                </div>
              )}

              {/* Brand badge */}
              <div className="absolute left-5 top-5 bg-background/80 px-3.5 py-2 backdrop-blur-sm">
                <span className="font-label-caps text-[10px] tracking-[0.35em] uppercase text-primary">
                  {watch.brandName}
                </span>
              </div>

              {/* Movement badge */}
              {watch.movementType && (
                <div className="absolute bottom-5 right-5 border border-outline-variant/20 bg-background/80 px-3.5 py-2 backdrop-blur-sm">
                  <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/65">
                    {watch.movementType}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img) => {
                  const active = activeImage === img.url
                  return (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.url)}
                      className={`relative h-24 w-24 flex-shrink-0 overflow-hidden border transition-all duration-200 ${
                        active
                          ? 'border-primary'
                          : 'border-outline-variant/20 opacity-50 hover:opacity-85 hover:border-outline-variant/50'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.altText || watch.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      {active && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right — Product info */}
          <div className="flex flex-col gap-8 lg:col-span-5 lg:pt-1">

            {/* Identity */}
            <div>
              <p className="mb-3 font-label-caps text-[11px] tracking-[0.35em] uppercase text-primary">
                {[watch.brandName, watch.categoryName, watch.segmentName].filter(Boolean).join(' · ')}
              </p>
              <h1 className="font-headline-md text-4xl leading-tight tracking-tight text-on-background">
                {watch.name}
              </h1>
              <p className="mt-2 font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/50">
                SKU: {watch.sku}
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-primary/25 via-outline-variant/15 to-transparent" />

            {/* Price + stock */}
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-1.5 font-label-caps text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/55">
                  Giá bán
                </p>
                <p className="font-headline-md text-3xl text-primary">
                  {formatVnd(selectedVariant?.price)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-2 font-label-caps text-xs tracking-widest uppercase ${
                    hasStock ? 'text-green-500' : 'text-error/80'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${hasStock ? 'bg-green-500' : 'bg-error'}`} />
                  {hasStock ? `Còn ${selectedVariant?.stockQuantity} chiếc` : 'Hết hàng'}
                </span>
              </div>
            </div>

            <div className="h-px bg-outline-variant/15" />

            {/* Variant selector — one row per differing parameter */}
            {variants.length > 0 && activeAxes.length > 0 && (
              <div className="flex flex-col gap-5">
                {activeAxes.map(axis => {
                  const options = optionsByAxis[axis.key] ?? []
                  const currentVal = selectedParams[axis.key]
                  const currentLabel = options.find(o => o.val === currentVal)?.label
                  return (
                    <div key={axis.key}>
                      <p className="mb-3 font-label-caps text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/55">
                        {axis.label}
                        {currentLabel && (
                          <span className="ml-2 font-body-md normal-case tracking-normal text-on-surface-variant/70">
                            — {currentLabel}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {options.map(({ val, label, hex }) => {
                          const active = currentVal === val
                          const available = isAvailable(axis.key, val)
                          return (
                            <button
                              key={val}
                              onClick={() => available && handleSelectParam(axis.key, val)}
                              title={!available ? 'Không có sẵn với lựa chọn hiện tại' : undefined}
                              className={`relative flex items-center gap-2 border px-4 py-2.5 font-label-caps text-[11px] tracking-[0.15em] uppercase transition-all duration-200
                                ${active
                                  ? 'border-primary bg-primary/8 text-primary'
                                  : available
                                    ? 'border-outline-variant/25 text-on-surface-variant/65 hover:border-outline-variant/50 hover:text-on-surface/80'
                                    : 'cursor-not-allowed border-outline-variant/10 text-on-surface-variant/25 line-through'
                                }`}
                            >
                              {hex && (
                                <span
                                  className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-outline-variant/30"
                                  style={{ background: hex }}
                                />
                              )}
                              {label}
                              {active && (
                                <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {variants.length > 0 && activeAxes.length === 0 && (
              <p className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/55">
                1 biến thể duy nhất
              </p>
            )}

            <div className="h-px bg-outline-variant/15" />

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!hasStock || !selectedVariant || addState === 'loading'}
                className={`flex items-center justify-center gap-3 py-4 font-label-caps text-xs tracking-[0.25em] uppercase transition-all duration-500 active:scale-[0.985] disabled:cursor-not-allowed ${
                  !hasStock || !selectedVariant
                    ? 'border border-outline-variant/20 text-on-surface-variant/30'
                    : addState === 'added'
                    ? 'border border-primary/50 bg-primary/10 text-primary'
                    : addState === 'error'
                    ? 'border border-error/40 text-error/80'
                    : 'bg-primary text-background hover:bg-primary/85'
                }`}
              >
                {addState === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg leading-none">progress_activity</span>
                    Đang xử lý...
                  </>
                ) : addState === 'added' ? (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">check_circle</span>
                    Đã thêm vào giỏ
                  </>
                ) : addState === 'error' ? (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">error</span>
                    Có lỗi — Thử lại
                  </>
                ) : !hasStock || !selectedVariant ? (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">remove_shopping_cart</span>
                    Hết hàng
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg leading-none">shopping_bag</span>
                    Thêm vào giỏ hàng
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <Link
                  to="/cart"
                  className="flex flex-1 items-center justify-center gap-2 border border-outline-variant/20 py-4 font-label-caps text-xs tracking-[0.2em] uppercase text-on-surface-variant/55 transition-all duration-300 hover:border-primary/35 hover:text-primary/80"
                >
                  <span className="material-symbols-outlined text-lg leading-none">shopping_cart</span>
                  Xem giỏ hàng
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    title={wishlisted ? 'Xoá khỏi yêu thích' : 'Thêm vào yêu thích'}
                    className={`flex items-center justify-center gap-2 border px-5 py-4 font-label-caps text-xs tracking-[0.2em] uppercase transition-all duration-300 disabled:cursor-not-allowed ${
                      wishlisted
                        ? 'border-red-400/50 bg-red-400/8 text-red-400'
                        : 'border-outline-variant/20 text-on-surface-variant/55 hover:border-red-400/40 hover:text-red-400'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-lg leading-none"
                      style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      favorite
                    </span>
                  </button>
                  {wishlistToast && (
                    <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 bg-background border border-outline-variant/30 px-4 py-3 shadow-lg animate-fade-in pointer-events-none">
                      <span
                        className={`material-symbols-outlined text-[16px] ${wishlistToast === 'added' ? 'text-red-400' : 'text-on-surface-variant/60'}`}
                        style={wishlistToast === 'added' ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >favorite</span>
                      <span className="font-label-caps text-[10px] tracking-[0.2em] whitespace-nowrap text-on-surface">
                        {wishlistToast === 'added' ? 'Đã thêm vào yêu thích' : 'Đã xoá khỏi yêu thích'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('product-review-textarea')
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    el.focus()
                  } else {
                    const section = document.querySelector('[data-product-reviews]')
                    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }}
                className="mt-2 flex items-center justify-center gap-2 border border-outline-variant/20 py-3 font-label-caps text-xs tracking-[0.2em] uppercase text-on-surface-variant/55 transition-all duration-300 hover:border-primary/35 hover:text-primary/80"
              >
                <span className="material-symbols-outlined text-lg leading-none">rate_review</span>
                Viết đánh giá
              </button>
            </div>

            {/* Description */}
            {watch.description && (
              <>
                <div className="h-px bg-outline-variant/15" />
                <p className="font-body-md text-base leading-relaxed text-on-surface-variant/70">
                  {watch.description}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Technical specs ── */}
        {specs.length > 0 && (
          <section className="mt-28">
            {/* Section heading */}
            <div className="mb-12 flex items-center gap-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/20 to-outline-variant/20" />
              <div className="flex flex-col items-center gap-1.5">
                <span className="font-label-caps text-[10px] tracking-[0.5em] uppercase text-primary/80">
                  Đặc tính
                </span>
                <span className="font-label-caps text-sm tracking-[0.15em] uppercase text-on-surface/75">
                  Thông số kỹ thuật
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-outline-variant/20 to-outline-variant/20" />
            </div>

            <div className="grid grid-cols-2 gap-px bg-outline-variant/10 sm:grid-cols-3 lg:grid-cols-4">
              {specs.map(({ key, label, unit }) => (
                <div key={key} className="bg-background p-8 transition-colors duration-200 hover:bg-surface-container/40">
                  <p className="mb-3 font-label-caps text-[10px] tracking-[0.35em] uppercase text-on-surface-variant/50">
                    {label}
                  </p>
                  <p className="font-body-md text-base text-on-surface/90">
                    {watch[key]}{unit ?? ''}
                  </p>
                </div>
              ))}

              <div className="bg-surface-container/15 p-8">
                <p className="mb-3 font-label-caps text-[10px] tracking-[0.35em] uppercase text-on-surface-variant/50">
                  Thương hiệu
                </p>
                <p className="font-body-md text-base text-primary/85">{watch.brandName}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Back link ── */}
        <div className="mt-20 flex justify-center">
          <Link
            to="/products"
            className="flex items-center gap-2 font-label-caps text-xs tracking-[0.3em] uppercase text-on-surface-variant/45 transition-all duration-300 hover:text-primary"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Tiếp tục xem sản phẩm
          </Link>
        </div>
        
        {/* Reviews section */}
        <ProductReviews watchId={watch.id} />
      </main>

      <Footer />
    </div>
  )
}
