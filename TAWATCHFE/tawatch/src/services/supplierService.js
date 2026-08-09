import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const supplierService = {
  getAll() {
    return request('/suppliers').then(unwrap)
  },
  async create(payload) {
    const res = await request('/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return unwrap(res)
  },
  async update(id, payload) {
    const res = await request(`/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return unwrap(res)
  },
  async remove(id) {
    const res = await request(`/suppliers/${id}`, { method: 'DELETE' })
    return unwrap(res)
  },
}
