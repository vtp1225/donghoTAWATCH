import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const couponService = {
  validate(payload) {
    return request('/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
}