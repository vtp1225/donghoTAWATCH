import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

function authHeaders() {
  const token = localStorage.getItem('auth_access_token')
  const type = localStorage.getItem('auth_token_type') || 'Bearer'
  return token ? { Authorization: `${type} ${token}` } : {}
}

export const watchService = {
  getAll() {
    return request('/watches').then(unwrap)
  },
  getPaged(page = 0, size = 10) {
    return request(`/watches/paged?page=${page}&size=${size}`).then(unwrap)
  },
  getAllAdmin() {
    return request('/watches/admin').then(unwrap)
  },
  getAdminPaged({ page = 0, size = 20, search, brandId, categoryId, segmentId, isActive } = {}) {
    const params = new URLSearchParams({ page, size })
    if (search) params.set('search', search)
    if (brandId != null) params.set('brandId', brandId)
    if (categoryId != null) params.set('categoryId', categoryId)
    if (segmentId != null) params.set('segmentId', segmentId)
    if (isActive != null) params.set('isActive', isActive)
    return request(`/watches/admin/paged?${params}`).then(unwrap)
  },
  getById(id) {
    return request(`/watches/${id}`).then(unwrap)
  },
  create(payload) {
    return request('/watches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  update(id, payload) {
    return request(`/watches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  toggleStatus(id, isActive) {
    return request(`/watches/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ isActive }),
    }).then(unwrap)
  },
  delete(id) {
    return request(`/watches/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(unwrap)
  },
  getByIds(ids = []) {
    return request(`/watches/by-ids?ids=${ids.join(',')}`).then(unwrap)
  },
  search(filters = {}) {
    return request('/watches/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    }).then(unwrap)
  },
  getFeatured() {
    return request('/watches/featured').then(unwrap)
  },
  getNewest(limit = 8) {
    return request(`/watches/newest?limit=${limit}`).then(unwrap)
  },
  getByCategory(categoryId, limit = 8) {
    return request(`/watches/by-category/${categoryId}?limit=${limit}`).then(unwrap)
  },
  toggleFeatured(id, isFeatured) {
    return request(`/watches/${id}/featured`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ isFeatured }),
    }).then(unwrap)
  },
}

export const variantService = {
  getByWatch(watchId) {
    return request(`/watch-variants?watchId=${watchId}`).then(unwrap)
  },
  create(payload) {
    return request('/watch-variants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  update(id, payload) {
    return request(`/watch-variants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  delete(id) {
    return request(`/watch-variants/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(unwrap)
  },
}

export const variantImageService = {
  getByVariant(variantId) {
    return request(`/watch-variant-images?variantId=${variantId}`).then(unwrap)
  },
  getMainImage(watchId) {
    return request(`/watch-variant-images/main?watchId=${watchId}`).then(unwrap)
  },
  upload(formData) {
    return request('/watch-variant-images/upload', {
      method: 'POST',
      body: formData,
    }).then(unwrap)
  },
  create(payload) {
    return request('/watch-variant-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  update(id, payload) {
    return request(`/watch-variant-images/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  createBatch(payload) {
    return request('/watch-variant-images/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  deleteById(id) {
    return request(`/watch-variant-images/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(unwrap)
  },
  deleteByVariant(variantId) {
    return request(`/watch-variant-images/variant/${variantId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(unwrap)
  },
}
