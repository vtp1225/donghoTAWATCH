import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const importReceiptService = {
  getAll() {
    return request('/import-receipts').then(unwrap)
  },
  getById(id) {
    return request(`/import-receipts/${id}`).then(unwrap)
  },
  async create(payload) {
    const res = await request('/import-receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return unwrap(res)
  },
  async confirm(id) {
    const res = await request(`/import-receipts/${id}/confirm`, { method: 'PATCH' })
    return unwrap(res)
  },
  async cancel(id) {
    const res = await request(`/import-receipts/${id}/cancel`, { method: 'PATCH' })
    return unwrap(res)
  },
  async remove(id) {
    const res = await request(`/import-receipts/${id}`, { method: 'DELETE' })
    return unwrap(res)
  },
}
