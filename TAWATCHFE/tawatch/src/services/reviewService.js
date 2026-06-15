import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const reviewService = {
  getByWatch(watchId, isApproved) {
    const query = typeof isApproved === 'boolean' ? `?isApproved=${isApproved}` : ''
    return request(`/reviews/watch/${watchId}${query}`).then(unwrap)
  },

  getByUser(userId) {
    return request(`/reviews/user/${userId}`).then(unwrap)
  },

  createReview(payload) {
    return request('/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
}
