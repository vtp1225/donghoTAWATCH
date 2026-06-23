import { useEffect, useState } from 'react'
import { wishlistService } from '../services/wishlistService.js'

function getStoredUserId() {
	try {
		const stored = window.localStorage.getItem('auth_user')
		if (!stored) return null
		return JSON.parse(stored)?.id ?? null
	} catch {
		return null
	}
}

export default function useWishlist() {
	const [wishlistIds, setWishlistIds] = useState(new Set())
	const [count, setCount] = useState(0)

	useEffect(() => {
		let active = true

		async function load() {
			const userId = getStoredUserId()
			if (!userId) {
				setWishlistIds(new Set())
				setCount(0)
				return
			}
			try {
				const items = await wishlistService.getWishlist(userId)
				if (!active) return
				const ids = new Set(Array.isArray(items) ? items.map((i) => i.variantId) : [])
				setWishlistIds(ids)
				setCount(ids.size)
			} catch {
				if (active) {
					setWishlistIds(new Set())
					setCount(0)
				}
			}
		}

		load()

		const handler = () => load()
		window.addEventListener('wishlist:updated', handler)
		window.addEventListener('auth:logout', handler)

		return () => {
			active = false
			window.removeEventListener('wishlist:updated', handler)
			window.removeEventListener('auth:logout', handler)
		}
	}, [])

	return { wishlistIds, count }
}
