import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const shipperService = {
  getAll() {
    return request('/shippers').then(unwrap)
  },
  async create(payload) {
    const res = await request('/shippers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return unwrap(res)
  },
  async update(id, payload) {
    const res = await request(`/shippers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return unwrap(res)
  },
  async remove(id) {
    const res = await request(`/shippers/${id}`, { method: 'DELETE' })
    return unwrap(res)
  },
}
