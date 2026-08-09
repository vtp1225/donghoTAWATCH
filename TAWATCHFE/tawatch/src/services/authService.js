import { request } from './apiClient.js'

/**
 * Trích xuất dữ liệu từ phản hồi của API
 * @param {Object} response - Phản hồi từ API
 * @returns {any} Dữ liệu được trích xuất
 */
function unwrapApiResponse(response) {
	return response?.data ?? response
}

/**
 * Dịch vụ xử lý các thao tác liên quan đến xác thực người dùng
 */
export const authService = {
	/**
	 * Đăng nhập người dùng bằng email và mật khẩu
	 * @param {Object} payload - Thông tin đăng nhập {email, password}
	 * @returns {Promise<any>} Kết quả trả về sau khi đăng nhập
	 */
	login(payload) {
		return request('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	/**
	 * Đăng ký tài khoản người dùng mới
	 * @param {Object} payload - Thông tin đăng ký
	 * @returns {Promise<any>} Kết quả trả về sau khi đăng ký
	 */
	register(payload) {
		return request('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	/**
	 * Gửi mã OTP đến email hoặc số điện thoại
	 * @param {Object} payload - Thông tin yêu cầu gửi OTP
	 * @returns {Promise<any>} Kết quả trả về sau khi yêu cầu gửi OTP
	 */
	sendOtp(payload) {
		return request('/otp/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	/**
	 * Xác thực mã OTP người dùng nhập vào
	 * @param {Object} payload - Thông tin mã OTP cần xác thực
	 * @returns {Promise<any>} Kết quả trả về sau khi xác thực OTP
	 */
	verifyOtp(payload) {
		return request('/otp/verify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},

	/**
	 * Đăng nhập người dùng bằng tài khoản Google
	 * @param {string} accessToken - Token truy cập nhận từ Google
	 * @returns {Promise<any>} Kết quả trả về sau khi đăng nhập bằng Google
	 */
	googleLogin(accessToken) {
		return request('/auth/google', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ accessToken }),
		}).then(unwrapApiResponse)
	},

	/**
	 * Đặt lại mật khẩu người dùng
	 * @param {Object} payload - Thông tin đặt lại mật khẩu mới
	 * @returns {Promise<any>} Kết quả trả về sau khi đặt lại mật khẩu
	 */
	resetPassword(payload) {
		return request('/auth/reset-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(unwrapApiResponse)
	},
}
