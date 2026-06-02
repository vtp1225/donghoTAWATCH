import { request } from './apiClient.js'

function unwrapApiResponse(response) {
	return response?.data ?? response
}

export const authService = {
	login(payload) {
		return request('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	register(payload) {
		return request('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	sendOtp(payload) {
		return request('/otp/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	verifyOtp(payload) {
		return request('/otp/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	forgotPassword(payload) {
		return request('/auth/forgot-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	resetPassword(payload) {
		return request('/auth/reset-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},
}
