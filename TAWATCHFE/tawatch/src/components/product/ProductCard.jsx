import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartService } from '../../services/cartService.js'
import { wishlistService } from '../../services/wishlistService.js'

async function addToCart(variantId) {
  const cart = await cartService.getCurrentCart()
  await cartService.addItem(cart.id, variantId, 1)
  window.dispatchEvent(new Event('cart:updated'))
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

export default function ProductCard({ item, offsetClassName = '', wishlisted = false, onWishlistChange }) {
  const navigate = useNavigate()
  const [addState, setAddState] = useState('idle') // idle | loading | added | error
  const [heartState, setHeartState] = useState(wishlisted)
  const [wishlistToast, setWishlistToast] = useState('')

  const handleAddToCart = async () => {
    if (!item.variantId || addState === 'loading') return
    setAddState('loading')
    try {
      await addToCart(item.variantId)
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
      onWishlistChange?.(item.variantId, next)
    } catch {
      setHeartState(!next)
    }
  }

  const hasVariant = Boolean(item.variantId)

  return (
    <div className={`group product-card-hover relative ${offsetClassName}`}>
      {/* Wishlist toast — fixed top-right corner */}
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

      {/* Image area */}
      <div className="relative mb-6 aspect-square overflow-hidden bg-surface-container cursor-pointer">
        <Link to={`/product/${item.id}`} className="absolute inset-0 z-10">
          <div className="absolute inset-0 border border-primary/0 transition-all duration-700 group-hover:border-primary/40" />
          {item.image ? (
            <img
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              src={item.image}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">watch</span>
              <span className="font-label-caps text-[10px] tracking-widest">NO IMAGE FROM API</span>
            </div>
          )}
        </Link>

        {item.discountPercent && (
          <div className="absolute top-3 left-3 z-20 bg-error px-2 py-1 font-label-caps text-[10px] tracking-widest text-white">
            -{item.discountPercent}%
          </div>
        )}

        {/* Wishlist button — z-20 đặt ngoài Link để không bị lồng */}
        {hasVariant && (
          <button
            type="button"
            onClick={handleToggleWishlist}
            title={heartState ? 'Xoá khỏi yêu thích' : 'Thêm vào yêu thích'}
            className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <span
              className={`material-symbols-outlined text-[18px] transition-colors duration-200 ${heartState ? 'text-red-400' : 'text-on-surface-variant/60 hover:text-red-400'}`}
              style={heartState ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              favorite
            </span>
          </button>
        )}
      </div>

      <div className="space-y-2 px-2">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors duration-200">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
          </Link>
          <div className="flex-shrink-0 text-right">
            {item.salePrice ? (
              <>
                <span className="font-headline-sm text-primary block">{item.salePrice}</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant/40 line-through">{item.price}</span>
              </>
            ) : (
              <span className="font-headline-sm text-primary">{item.price}</span>
            )}
          </div>
        </div>
        <p className="line-clamp-2 font-body-md text-on-surface-variant">{item.description}</p>

        <div className="pt-4 flex items-center gap-3">
          {/* Add to cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!hasVariant || addState === 'loading'}
            className={`flex flex-1 items-center justify-center gap-2 border py-2.5 font-label-caps text-[10px] tracking-[0.18em] uppercase transition-all duration-300 disabled:cursor-not-allowed
              ${!hasVariant
                ? 'border-outline-variant/20 text-on-surface-variant/35 cursor-not-allowed'
                : addState === 'added'
                  ? 'border-primary/60 bg-primary/10 text-primary'
                  : addState === 'error'
                    ? 'border-red-500/50 text-red-400'
                    : 'border-outline-variant/30 text-on-surface/60 hover:border-primary/50 hover:bg-primary hover:text-background'
              }`}
          >
            {addState === 'loading' ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[15px]">progress_activity</span>
                Đang thêm...
              </>
            ) : addState === 'added' ? (
              <>
                <span className="material-symbols-outlined text-[15px]">check</span>
                Đã thêm
              </>
            ) : addState === 'error' ? (
              <>
                <span className="material-symbols-outlined text-[15px]">error</span>
                Lỗi – Thử lại
              </>
            ) : !hasVariant ? (
              <>
                <span className="material-symbols-outlined text-[15px]">remove_shopping_cart</span>
                Hết hàng
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                Thêm vào giỏ
              </>
            )}
          </button>

          {/* Detail link */}
          <Link
            to={`/product/${item.id}`}
            className="flex-shrink-0 border-b border-primary/40 pb-0.5 font-label-caps text-[10px] tracking-[0.14em] text-primary transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          >
            Chi tiết →
          </Link>
        </div>
      </div>
    </div>
  )
}
