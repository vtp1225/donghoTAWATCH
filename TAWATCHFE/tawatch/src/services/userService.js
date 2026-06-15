import { request } from './apiClient.js'

function unwrapApiResponse(response) {
	return response?.data ?? response
}

export const userService = {
	getAllUsers() {
		return request('/users').then(unwrapApiResponse)
	},

	getUserById(id) {
		return request(`/users/${id}`).then(unwrapApiResponse)
	},

	updateUser(id, payload) {
		return request(`/users/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	addUser(payload) {
		return request('/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	deleteUser(id) {
		return request(`/users/${id}`, {
			method: 'DELETE',
		}).then(unwrapApiResponse)
	},
}

export const addressService = {
	getAddresses(userId) {
		return request(`/users/${userId}/addresses`).then(unwrapApiResponse)
	},

	createAddress(userId, payload) {
		return request(`/users/${userId}/addresses`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	updateAddress(userId, addressId, payload) {
		return request(`/users/${userId}/addresses/${addressId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	deleteAddress(userId, addressId) {
		return request(`/users/${userId}/addresses/${addressId}`, {
			method: 'DELETE',
		}).then(unwrapApiResponse)
	},

	setDefault(userId, addressId) {
		return request(`/users/${userId}/addresses/${addressId}/default`, {
			method: 'PATCH',
		}).then(unwrapApiResponse)
	},
}
