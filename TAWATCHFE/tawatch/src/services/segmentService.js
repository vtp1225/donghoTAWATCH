import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const segmentService = {
  getAll() {
    return request('/segments').then(unwrap)
  },
  getById(id) {
    return request(`/segments/${id}`).then(unwrap)
  },
  create(payload) {
    return request('/segments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  update(id, payload) {
    return request(`/segments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  remove(id) {
    return request(`/segments/${id}`, {
      method: 'DELETE',
    }).then(unwrap)
  },
}
