import { request } from './apiClient.js'

function unwrap(response) {
	return response?.data ?? response
}

function getStoredSessionId() {
	if (typeof window === 'undefined') {
		return 'guest-session'
	}

	const storageKey = 'cart_session_id'
	const existing = window.localStorage.getItem(storageKey)
	if (existing) {
		return existing
	}

	const nextSessionId = `guest-${crypto.randomUUID?.() ?? Date.now().toString(36)}`
	window.localStorage.setItem(storageKey, nextSessionId)
	return nextSessionId
}

function getStoredUserId() {
	if (typeof window === 'undefined') {
		return null
	}

	try {
		const storedUser = window.localStorage.getItem('auth_user')
		if (!storedUser) return null
		const user = JSON.parse(storedUser)
		return user?.id ?? null
	} catch {
		return null
	}
}

export function getCartOwner() {
	const userId = getStoredUserId()
	if (userId) {
		return { type: 'user', id: userId }
	}

	return { type: 'session', id: getStoredSessionId() }
}

export const cartService = {
	async getCurrentCart() {
		const owner = getCartOwner()
		const path = owner.type === 'user' ? `/cart/user/${owner.id}` : `/cart/session/${owner.id}`
		return request(path).then(unwrap)
	},
	async addItem(cartId, watchVariantId, quantity = 1) {
		return request(`/cart/${cartId}/items`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ watchVariantId, quantity }),
		}).then(unwrap)
	},
	async updateItem(cartId, itemId, payload) {
		return request(`/cart/${cartId}/items/${itemId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrap)
	},
	async removeItem(cartId, itemId) {
		return request(`/cart/${cartId}/items/${itemId}`, {
			method: 'DELETE',
		}).then(unwrap)
	},
	async clearCart(cartId) {
		return request(`/cart/${cartId}/items`, {
			method: 'DELETE',
		}).then(unwrap)
	},
}