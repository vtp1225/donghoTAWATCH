import { request } from './apiClient.js'

function unwrap(response) {
	return response?.data ?? response
}

export const wishlistService = {
	async getWishlist(userId) {
		return request(`/wishlist/user/${userId}`).then(unwrap)
	},

	async add(userId, variantId) {
		return request(`/wishlist/user/${userId}/variants/${variantId}`, {
			method: 'POST',
		}).then(unwrap)
	},

	async remove(userId, variantId) {
		return request(`/wishlist/user/${userId}/variants/${variantId}`, {
			method: 'DELETE',
		})
	},

	async check(userId, variantId) {
		return request(`/wishlist/user/${userId}/check/${variantId}`).then(unwrap)
	},
}
