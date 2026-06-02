import { useEffect, useState } from 'react'
import { cartService } from '../services/cartService.js'

function getCartItemCount(cart) {
  return cart?.items?.reduce((total, item) => total + (item.quantity ?? 0), 0) ?? 0
}

export default function useCart() {
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadCartCount = async () => {
      try {
        const cart = await cartService.getCurrentCart()
        if (active) {
          setCartCount(getCartItemCount(cart))
        }
      } catch {
        if (active) {
          setCartCount(0)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    const handleCartUpdated = () => {
      loadCartCount()
    }

    window.addEventListener('cart:updated', handleCartUpdated)
    window.addEventListener('storage', handleCartUpdated)
    loadCartCount()

    return () => {
      active = false
      window.removeEventListener('cart:updated', handleCartUpdated)
      window.removeEventListener('storage', handleCartUpdated)
    }
  }, [])

  return {
    cartCount,
    loading,
    refreshCartCount: async () => {
      try {
        const cart = await cartService.getCurrentCart()
        setCartCount(getCartItemCount(cart))
      } catch {
        setCartCount(0)
      }
    },
  }
}
