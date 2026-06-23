
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import { paymentService } from '../../services/paymentService.js'
import { orderService } from '../../services/orderService.js'

function formatVnd(value) {
  if (value == null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

export default function VNPayReturn() {
  const [searchParams] = useSearchParams()
  // VNPay redirect về với vnp_TxnRef là transaction code của chúng ta
  const txCode = searchParams.get('vnp_TxnRef')
  const responseCode = searchParams.get('vnp_ResponseCode')

  const [status, setStatus] = useState('processing') // 'processing' | 'success' | 'failed'
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!txCode) {
      setStatus('failed')
      setError('Không tìm thấy thông tin giao dịch.')
      return
    }

    // Nếu VNPay trả về lỗi ngay (responseCode != 00) → không cần gọi backend
    if (responseCode && responseCode !== '00') {
      setError('Giao dịch bị từ chối bởi VNPay (mã: ' + responseCode + ').')
      setStatus('failed')
      return
    }

    const process = async () => {
      let callbackResult = null
      try {
        // Forward toàn bộ params VNPay về backend để verify checksum
        // Không được bổ sung param lạ — chỉ gửi đúng những gì VNPay trả về
        const vnpParams = Object.fromEntries(searchParams.entries())
        callbackResult = await paymentService.callbackVnpay(vnpParams)
      } catch (err) {
        // code 7002 = đã xử lý rồi → coi như thành công
        if (err?.data?.code !== 7002) {
          setError(err?.message || 'Thanh toán thất bại.')
          setStatus('failed')
          return
        }
      }

      try {
        // Lấy orderId từ response callback thay vì từ URL param
        const orderId = callbackResult?.orderId
        if (orderId) {
          const o = await orderService.getOrder(Number(orderId))
          setOrder(o)
        }
      } catch {
        // order fetch lỗi thì vẫn show success, không cần order details
      }

      setStatus('success')
    }

    process()
  }, [txCode, responseCode, searchParams])

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
        {status === 'processing' && <ProcessingState />}
        {status === 'success' && <SuccessState order={order} />}
        {status === 'failed' && <FailedState error={error} orderId={orderId} />}
      </main>
      <Footer />
    </div>
  )
}

function ProcessingState() {
  return (
    <div className="py-24 text-center">
      <div className="mb-8 flex justify-center">
        <span className="material-symbols-outlined animate-spin text-6xl text-primary">progress_activity</span>
      </div>
      <p className="font-label-caps text-[10px] tracking-[0.35em] text-primary uppercase">Đang xử lý</p>
      <h2 className="mt-4 font-headline-md text-headline-md text-on-surface">Đang xác nhận thanh toán VNPay</h2>
      <p className="mt-4 font-body-md text-sm text-on-surface-variant">Vui lòng đợi trong giây lát...</p>
    </div>
  )
}

function SuccessState({ order }) {
  return (
    <div className="py-16 text-center">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <span className="material-symbols-outlined text-7xl text-primary">check_circle</span>
        </div>
      </div>

      <p className="font-label-caps text-[10px] tracking-[0.35em] text-primary uppercase">Thanh toán thành công</p>
      <h2 className="mt-4 font-headline-md text-headline-md text-on-surface">Cảm ơn bạn đã tin tưởng TAWatch</h2>
      <p className="mt-3 font-body-md text-sm text-on-surface-variant">
        Giao dịch VNPay của bạn đã được xác nhận thành công.
      </p>

      {order && (
        <div className="mx-auto mt-10 max-w-md border border-outline-variant/10 bg-surface-container-low p-8 text-left">
          <p className="mb-4 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60 uppercase">Chi tiết đơn hàng</p>

          <div className="space-y-3">
            <div className="flex justify-between font-body-md text-sm">
              <span className="text-on-surface-variant">Mã đơn hàng</span>
              <span className="font-semibold text-primary">{order.orderCode}</span>
            </div>
            <div className="h-px bg-outline-variant/10" />
            <div className="flex justify-between font-body-md text-sm">
              <span className="text-on-surface-variant">Tổng tiền</span>
              <span className="text-on-surface">{formatVnd(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between font-body-md text-sm">
              <span className="text-on-surface-variant">Phương thức</span>
              <span className="text-on-surface">VNPay</span>
            </div>
            <div className="flex justify-between font-body-md text-sm">
              <span className="text-on-surface-variant">Trạng thái thanh toán</span>
              <span className="text-primary">ĐÃ THANH TOÁN</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        <Link
          to="/orders"
          className="w-full max-w-xs border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
        >
          XEM ĐƠN HÀNG CỦA TÔI
        </Link>
        <Link
          to="/products"
          className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  )
}

function FailedState({ error, orderId }) {
  return (
    <div className="py-16 text-center">
      <div className="mb-8 flex justify-center">
        <span className="material-symbols-outlined text-7xl text-red-400">cancel</span>
      </div>

      <p className="font-label-caps text-[10px] tracking-[0.35em] text-red-400 uppercase">Thanh toán thất bại</p>
      <h2 className="mt-4 font-headline-md text-headline-md text-on-surface">Giao dịch không thành công</h2>
      {error && (
        <p className="mt-3 font-body-md text-sm text-on-surface-variant">{error}</p>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        {orderId && (
          <Link
            to={`/orders`}
            className="w-full max-w-xs border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
          >
            XEM ĐƠN HÀNG
          </Link>
        )}
        <Link
          to="/checkout"
          className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Quay lại thanh toán
        </Link>
        <Link
          to="/"
          className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant/60 underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
