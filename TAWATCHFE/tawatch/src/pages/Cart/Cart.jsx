import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer.jsx'
import Navbar from '../../components/layout/Navbar.jsx'
import useAuth from '../../hooks/useAuth.js'
import { cartService, getCartOwner } from '../../services/cartService.js'

function formatVnd(value) {
  if (value == null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

function resolveImage(item) {
  return item.imageUrl || '/images/product-heritage.jpg'
}

export default function Cart() {
  const { isAuthenticated, displayName } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingItemId, setSavingItemId] = useState(null)
  const [error, setError] = useState('')

  const owner = useMemo(() => getCartOwner(), [])

  const loadCart = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await cartService.getCurrentCart()
      setCart(data)
    } catch (err) {
      setError(err?.message || 'Không thể tải giỏ hàng.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleQuantityChange = async (item, quantity) => {
    if (!cart || quantity < 1) return
    setSavingItemId(item.id)
    setError('')
    try {
      const updated = await cartService.updateItem(cart.id, item.id, {
        watchVariantId: item.watchVariantId,
        quantity,
      })
      setCart(updated)
        window.dispatchEvent(new Event('cart:updated'))
    } catch (err) {
      setError(err?.message || 'Không thể cập nhật số lượng.')
    } finally {
      setSavingItemId(null)
    }
  }

  const handleRemoveItem = async (item) => {
    if (!cart) return
    setSavingItemId(item.id)
    setError('')
    try {
      const updated = await cartService.removeItem(cart.id, item.id)
      setCart(updated)
        window.dispatchEvent(new Event('cart:updated'))
    } catch (err) {
      setError(err?.message || 'Không thể xoá sản phẩm.')
    } finally {
      setSavingItemId(null)
    }
  }

  const handleClearCart = async () => {
    if (!cart) return
    setSavingItemId('clear')
    setError('')
    try {
      const updated = await cartService.clearCart(cart.id)
      setCart(updated)
        window.dispatchEvent(new Event('cart:updated'))
    } catch (err) {
      setError(err?.message || 'Không thể làm trống giỏ hàng.')
    } finally {
      setSavingItemId(null)
    }
  }

  const subtotal = cart?.totalAmount ?? 0
  const shipping = subtotal > 0 ? 0 : 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
        <header className="mb-16 text-center">
          <p className="font-label-caps text-[10px] tracking-[0.3em] text-primary">THE SELECTION</p>
          <h1 className="mt-4 font-headline-md text-headline-md italic text-on-surface">Your Cart</h1>
          <p className="mt-3 font-body-md text-on-surface-variant">
            {isAuthenticated ? `Xin chào ${displayName}, đây là giỏ hàng của bạn.` : 'Giỏ hàng của bạn đang dùng session lưu cục bộ.'}
          </p>
        </header>

        {loading ? (
          <div className="py-24 text-center font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40">ĐANG TẢI...</div>
        ) : error ? (
          <div className="py-8 text-center font-label-caps text-[10px] tracking-[0.3em] text-error">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <section className="lg:col-span-8">
              {!cart || cart.items.length === 0 ? (
                <div className="border border-outline-variant/10 bg-surface-container-low p-10 text-center">
                  <p className="font-headline-sm text-headline-sm text-on-surface">Giỏ hàng đang trống</p>
                  <p className="mt-3 font-body-md text-on-surface-variant">Hãy chọn một sản phẩm để thêm vào giỏ.</p>
                  <div className="mt-8">
                    <Link className="font-label-caps text-[10px] tracking-[0.2em] text-primary underline decoration-primary/40 underline-offset-4" to="/products">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {cart.items.map((item) => (
                    <div key={item.id} className="group flex flex-col gap-8 border-b border-outline-variant/10 pb-12 md:flex-row md:items-start">
                      <div className="aspect-square w-full overflow-hidden bg-surface-container md:w-48 md:flex-shrink-0">
                        <img alt={item.watchName} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={resolveImage(item)} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">{item.watchName}</h2>
                            <p className="mt-2 font-label-caps text-[10px] tracking-[0.25em] text-on-surface-variant">
                              {item.dialColor} / {item.strapColor}
                            </p>
                          </div>
                          <p className="font-body-md text-primary">{formatVnd(item.unitPrice)}</p>
                        </div>
                        <p className="mt-4 font-label-caps text-[10px] tracking-[0.25em] text-outline">
                          REF. {item.watchVariantId} | QTY {item.quantity}
                        </p>

                        <div className="mt-auto flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center border border-outline-variant/30 px-4 py-2">
                            <button className="px-2 text-on-surface-variant transition-colors hover:text-primary" type="button" onClick={() => handleQuantityChange(item, item.quantity - 1)} disabled={savingItemId === item.id || item.quantity <= 1}>
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="w-10 text-center font-body-md text-on-surface">{item.quantity}</span>
                            <button className="px-2 text-on-surface-variant transition-colors hover:text-primary" type="button" onClick={() => handleQuantityChange(item, item.quantity + 1)} disabled={savingItemId === item.id}>
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                          <button className="flex items-center gap-2 font-label-caps text-[10px] tracking-[0.25em] text-outline transition-colors hover:text-error" type="button" onClick={() => handleRemoveItem(item)} disabled={savingItemId === item.id}>
                            <span className="material-symbols-outlined text-sm">delete</span>
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="lg:col-span-4">
              <div className="sticky top-32 border border-outline-variant/10 bg-surface-container-low p-10">
                <h2 className="border-b border-outline-variant/20 pb-4 font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant">ORDER SUMMARY</h2>
                <div className="mb-8 mt-8 space-y-4">
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface">{formatVnd(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-primary">Complementary</span>
                  </div>
                  <div className="flex justify-between font-body-md">
                    <span className="text-on-surface-variant">Insurance</span>
                    <span className="text-primary">Included</span>
                  </div>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="mb-10 mt-8 flex items-end justify-between">
                  <span className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant">TOTAL</span>
                  <span className="font-headline-sm text-headline-sm text-primary">{formatVnd(total)}</span>
                </div>
                <Link className="mb-6 block w-full border border-primary px-6 py-4 text-center font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background" to="/checkout">
                  PROCEED TO CHECKOUT
                </Link>
                <button className="w-full border border-outline-variant/30 px-6 py-4 font-label-caps text-[10px] tracking-[0.25em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary" type="button" onClick={handleClearCart} disabled={savingItemId === 'clear' || !cart || cart.items.length === 0}>
                  CLEAR CART
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
