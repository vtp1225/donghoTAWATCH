import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import useAuth from '../../hooks/useAuth.js'
import { wishlistService } from '../../services/wishlistService.js'
import { cartService } from '../../services/cartService.js'

function formatVnd(value) {
  if (value == null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

function WishlistCard({ item, onRemove }) {
  const [removing, setRemoving] = useState(false)
  const [addState, setAddState] = useState('idle')

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove(item.variantId)
    } finally {
      setRemoving(false)
    }
  }

  const handleAddToCart = async () => {
    if (addState === 'loading') return
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

  return (
    <div className="group flex gap-5 border border-outline-variant/10 bg-surface-container-low p-5 transition-colors hover:border-outline-variant/20">
      {/* Image */}
      <Link to={`/product/${item.watchId}`} className="flex-shrink-0">
        <div className="h-28 w-28 overflow-hidden bg-surface-container">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.watchName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/20">watch</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <p className="font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/50 uppercase mb-1">
            {item.brandName}
          </p>
          <Link to={`/product/${item.watchId}`} className="hover:text-primary transition-colors">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.watchName}</h3>
          </Link>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {item.dialColor && (
              <span className="font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/60">
                Mặt: {item.dialColor}
              </span>
            )}
            {item.strapColor && (
              <span className="font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/60">
                Dây: {item.strapColor}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-headline-sm text-headline-sm text-primary">{formatVnd(item.price)}</span>

          {item.isActive ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addState === 'loading'}
              className={`flex items-center gap-2 border px-4 py-2 font-label-caps text-[9px] tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-50 ${
                addState === 'added'
                  ? 'border-primary/60 bg-primary/10 text-primary'
                  : addState === 'error'
                  ? 'border-red-500/40 text-red-400'
                  : 'border-outline-variant/25 text-on-surface-variant hover:border-primary hover:bg-primary hover:text-background'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {addState === 'added' ? 'check' : addState === 'error' ? 'error' : 'shopping_bag'}
              </span>
              {addState === 'added' ? 'Đã thêm' : addState === 'error' ? 'Lỗi' : 'Thêm vào giỏ'}
            </button>
          ) : (
            <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/40 uppercase">Hết hàng</span>
          )}

          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-1.5 font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/50 uppercase transition-colors hover:text-red-400 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            {removing ? 'Đang xoá...' : 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Wishlist() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    setLoading(true)
    wishlistService.getWishlist(user.id)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Không thể tải danh sách yêu thích.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, user?.id])

  const handleRemove = async (variantId) => {
    try {
      await wishlistService.remove(user.id, variantId)
      setItems((prev) => prev.filter((i) => i.variantId !== variantId))
      window.dispatchEvent(new Event('wishlist:updated'))
    } catch (err) {
      alert(err?.message || 'Không thể xoá sản phẩm.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
          <div className="py-24 text-center">
            <span className="material-symbols-outlined mb-6 block text-5xl text-on-surface-variant/20">favorite</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">Vui lòng đăng nhập</p>
            <p className="mt-3 font-body-md text-sm text-on-surface-variant">Bạn cần đăng nhập để xem danh sách yêu thích.</p>
            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: '/wishlist' } })}
              className="mt-8 inline-block border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">

        {/* Header */}
        <header className="mb-12 text-center">
          <p className="font-label-caps text-[10px] tracking-[0.3em] text-primary">MY ACCOUNT</p>
          <h1 className="mt-4 font-headline-md text-headline-md italic text-on-surface">Sản phẩm yêu thích</h1>
          <p className="mt-3 font-body-md text-sm text-on-surface-variant">
            {items.length > 0 ? `${items.length} sản phẩm đã lưu` : 'Chưa có sản phẩm nào'}
          </p>
        </header>

        {loading ? (
          <div className="py-32 text-center">
            <span className="material-symbols-outlined mb-4 block animate-spin text-4xl text-primary/30">progress_activity</span>
            <p className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40">ĐANG TẢI...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined mb-4 block text-4xl text-red-400/50">error</span>
            <p className="font-body-md text-sm text-red-400">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-28 text-center">
            <span className="material-symbols-outlined mb-6 block text-6xl text-on-surface-variant/15">favorite</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">Danh sách yêu thích trống</p>
            <p className="mt-3 font-body-md text-sm text-on-surface-variant">
              Nhấn vào biểu tượng <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">favorite</span></span> trên sản phẩm để lưu vào đây.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-block border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              KHÁM PHÁ SẢN PHẨM
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  )
}
