import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const couponService = {
  getAll(params = {}) {
    const query = new URLSearchParams()
    if (params.promotionId) query.set('promotionId', params.promotionId)
    if (params.isUsed !== undefined && params.isUsed !== '') query.set('isUsed', params.isUsed)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return request(`/coupons${suffix}`).then(unwrap)
  },
  getFeatured() {
    return request('/coupons/featured').then(unwrap)
  },
  create(payload) {
    return request('/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  remove(id) {
    return request(`/coupons/${id}`, { method: 'DELETE' }).then(unwrap)
  },
  validate(payload) {
    return request('/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
}
