import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cartService } from '../../services/cartService.js'

async function addToCart(variantId) {
  const cart = await cartService.getCurrentCart()
  await cartService.addItem(cart.id, variantId, 1)
  window.dispatchEvent(new Event('cart:updated'))
}

export default function ProductCard({ item, offsetClassName = '' }) {
  const [addState, setAddState] = useState('idle') // idle | loading | added | error

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

  const hasVariant = Boolean(item.variantId)

  return (
    <div className={`group product-card-hover relative ${offsetClassName}`}>
      {/* Clickable image area */}
      <Link to={`/product/${item.id}`} className="block">
        <div className="relative mb-6 flex aspect-square items-center justify-center overflow-hidden bg-surface-container p-8 cursor-pointer">
          <div className="border-overlay absolute inset-0 z-10 border border-primary/0 opacity-0 transition-all duration-700 group-hover:border-primary/40" />
          {item.image ? (
            <img
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              src={item.image}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">watch</span>
              <span className="font-label-caps text-[10px] tracking-widest">NO IMAGE FROM API</span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2 px-2">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/product/${item.id}`} className="hover:text-primary transition-colors duration-200">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
          </Link>
          <span className="font-headline-sm text-primary flex-shrink-0">{item.price}</span>
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
