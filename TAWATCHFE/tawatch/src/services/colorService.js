import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const colorService = {
  getAll(isActive) {
    const query = isActive !== undefined ? `?isActive=${isActive}` : ''
    return request(`/colors${query}`).then(unwrap)
  },
  getById(id) {
    return request(`/colors/${id}`).then(unwrap)
  },
  async create(payload) {
    const res = await request('/colors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return unwrap(res)
  },
  async update(id, payload) {
    const res = await request(`/colors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return unwrap(res)
  },
  async remove(id) {
    const res = await request(`/colors/${id}`, { method: 'DELETE' })
    return unwrap(res)
  },
}
