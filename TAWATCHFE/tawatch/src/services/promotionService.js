import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const promotionService = {
  getAll(params = {}) {
    const query = new URLSearchParams()
    if (params.isActive !== undefined && params.isActive !== '') query.set('isActive', params.isActive)
    const suffix = query.toString() ? `?${query.toString()}` : ''
    return request(`/promotions${suffix}`).then(unwrap)
  },
  create(payload) {
    return request('/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  update(id, payload) {
    return request(`/promotions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  remove(id) {
    return request(`/promotions/${id}`, { method: 'DELETE' }).then(unwrap)
  },
}
