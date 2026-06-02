import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const orderService = {
  createOrder(payload) {
    return request('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },

  getOrder(orderId) {
    return request(`/orders/${orderId}`).then(unwrap)
  },

  getMyOrders(userId) {
    return request(`/orders/my/${userId}`).then(unwrap)
  },

  listAdminOrders(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return request(`/orders${query}`).then(unwrap)
  },

  updateOrderStatus(orderId, payload) {
    return request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },

  updateTrackingCode(orderId, payload) {
    return request(`/orders/${orderId}/tracking`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },

  cancelOrder(orderId, payload) {
    return request(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
}
