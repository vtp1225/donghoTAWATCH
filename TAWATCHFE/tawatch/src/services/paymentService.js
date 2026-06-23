import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const paymentService = {
  initiateVnpay(orderId) {
    return request('/payments/vnpay/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    }).then(unwrap)
  },

  initiateBankTransfer(orderId) {
    return request('/payments/bank-transfer/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    }).then(unwrap)
  },

  callbackVnpay(payload) {
    return request('/payments/vnpay/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(unwrap)
  },
}
