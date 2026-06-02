import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const brandService = {
  getAll() {
    return request('/brands').then(unwrap)
  },
  async create(payload) {
    const res = await request('/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return unwrap(res)
  },
  async update(id, payload) {
    const res = await request(`/brands/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return unwrap(res)
  },
  async remove(id) {
    const res = await request(`/brands/${id}`, { method: 'DELETE' })
    return unwrap(res)
  },
}
