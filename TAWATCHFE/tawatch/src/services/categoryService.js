import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const categoryService = {
  getAll() {
    return request('/categories').then(unwrap)
  },
  getTree() {
    return request('/categories/tree').then(unwrap)
  },
  getBySlug(slug) {
    return request(`/categories/slug/${encodeURIComponent(slug)}`).then(unwrap)
  },
  create(payload) {
    return request('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  update(id, payload) {
    return request(`/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  remove(id) {
    return request(`/categories/${id}`, {
      method: 'DELETE',
    }).then(unwrap)
  },
}
