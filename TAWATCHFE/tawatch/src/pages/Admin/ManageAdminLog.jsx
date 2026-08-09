import { useState, useEffect } from 'react'
import { adminLogService } from '../../services/adminLogService'

export default function ManageAdminLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminLogService.getAllLogs()
        setLogs(data)
      } catch (error) {
        console.error('Failed to fetch admin logs', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-on-surface-variant">Đang tải lịch sử hoạt động...</div>
  }

  const getActionText = (action) => {
    switch (action) {
      case 'CREATE': return 'Tạo mới'
      case 'UPDATE': return 'Cập nhật'
      case 'DELETE': return 'Xóa'
      default: return 'Thao tác'
    }
  }

  const getTableNameText = (table) => {
    const map = {
      orders: 'đơn hàng',
      brand: 'thương hiệu',
      categories: 'danh mục',
      colors: 'màu sắc',
      segments: 'phân khúc',
      shippers: 'shipper',
      suppliers: 'nhà cung cấp',
      promotions: 'khuyến mãi',
      coupons: 'mã giảm giá',
      watches: 'sản phẩm',
      watch_variants: 'phiên bản',
      watch_variant_images: 'ảnh sản phẩm',
      import_receipts: 'phiếu nhập',
      store_settings: 'cài đặt cửa hàng'
    }
    return map[table] || table
  }

  const getStatusLabel = (status) => {
    const map = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao',
      DELIVERED: 'Hoàn tất',
      CANCELLED: 'Đã hủy',
      REFUNDED: 'Hoàn tiền',
      RETURN_REQUESTED: 'Yêu cầu đổi/trả',
      RETURN_REJECTED: 'Từ chối đổi/trả',
      RETURNED: 'Đã hoàn trả'
    }
    return map[status] || status
  }

  const getHumanReadableMessage = (log) => {
    const actionText = getActionText(log.action)
    const tableText = getTableNameText(log.tableName)
    const val = log.newValue || {}
    
    const itemName = val.name || val.title || val.code || val.orderCode || (val.id ? `ID: ${val.id}` : '')
    
    if (log.tableName === 'orders' && val.status) {
      return `${actionText} trạng thái ${tableText} ${itemName} thành "${getStatusLabel(val.status)}"`
    }
    
    if (val.isActive !== undefined) {
      const statusText = val.isActive ? 'Hoạt động' : 'Tạm dừng'
      return `Cập nhật trạng thái ${tableText} "${itemName}" thành "${statusText}"`
    }
    
    if (val.isFeatured !== undefined) {
      const featuredText = val.isFeatured ? 'Nổi bật' : 'Bình thường'
      return `Cập nhật độ ưu tiên ${tableText} "${itemName}" thành "${featuredText}"`
    }
    
    if (itemName) {
      return `${actionText} ${tableText} "${itemName}"`
    }
    
    return `${actionText} dữ liệu ${tableText}`
  }

  return (
    <main className="ml-72 mt-20 p-6 space-y-6 min-h-screen">
      <h1 className="text-2xl font-display-sm font-semibold text-primary">Nhật ký hoạt động Admin</h1>
      
      <div className="bg-surface-container rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant font-medium">
                <th className="p-4 whitespace-nowrap">Thời gian</th>
                <th className="p-4 whitespace-nowrap">Admin</th>
                <th className="p-4 min-w-[300px]">Chi tiết thao tác</th>
                <th className="p-4 whitespace-nowrap">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                    Chưa có hoạt động nào được ghi lại.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{log.adminName}</div>
                      <div className="text-xs text-on-surface-variant">{log.adminEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                          log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                          log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getActionText(log.action)}
                        </span>
                        <span className="text-sm font-medium">
                          {getHumanReadableMessage(log)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
