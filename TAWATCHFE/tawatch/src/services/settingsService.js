import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const settingsService = {
  getSettings() {
    return request('/settings').then(unwrap)
  },

  updateSettings(data) {
    return request('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(unwrap)
  },
}
