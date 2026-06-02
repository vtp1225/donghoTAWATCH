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
  delete(id) {
    return request(`/watches/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
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
  create(payload) {
    return request('/watch-variant-images', {
      method: 'POST',
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
  deleteByVariant(variantId) {
    return request(`/watch-variant-images/variant/${variantId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(unwrap)
  },
}

export const watchImageService = {
  getByWatch(watchId) {
    return request(`/watch-images?watchId=${watchId}`).then(unwrap)
  },
  create(payload) {
    return request('/watch-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  createBatch(payload) {
    return request('/watch-images/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
  deleteByWatch(watchId) {
    return request(`/watch-images/watch/${watchId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(unwrap)
  },
}
