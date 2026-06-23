import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const ghnService = {
  getProvinces() {
    return request('/ghn/provinces').then(unwrap)
  },

  getDistricts(provinceId) {
    return request(`/ghn/districts?provinceId=${provinceId}`).then(unwrap)
  },

  getWards(districtId) {
    return request(`/ghn/wards?districtId=${districtId}`).then(unwrap)
  },

  async calculateFee({ toDistrictId, toWardCode, weight = 500, insuranceValue = 0 }) {
    const res = await request('/ghn/fee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toDistrictId, toWardCode, weight, insuranceValue }),
    })
    return unwrap(res)?.total ?? 0
  },
}
