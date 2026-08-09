import { request } from './apiClient'

export const adminLogService = {
  getAllLogs: async () => {
    const response = await request('/admin-logs', { method: 'GET' })
    return response.data
  }
}
