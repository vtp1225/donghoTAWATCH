import { useState, useEffect } from 'react'
import { ghnService } from '../../services/ghnService.js'

export default function GhnTrackingTimeline({ trackingCode }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!trackingCode) return

    ghnService.getTracking(trackingCode)
      .then(setData)
      .catch((e) => setError(e?.message || 'Không thể lấy thông tin vận chuyển'))
      .finally(() => setLoading(false))
  }, [trackingCode])

  if (!trackingCode) return null

  if (loading) {
    return (
      <div className="mt-4 flex items-center justify-center py-4">
        <span className="material-symbols-outlined animate-spin text-[18px] text-primary">progress_activity</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4 flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-3 py-2 text-red-400">
        <span className="material-symbols-outlined text-[14px]">error</span>
        <p className="font-body-md text-[11px]">{error}</p>
      </div>
    )
  }

  if (!data || !data.log || data.log.length === 0) {
    return <p className="mt-4 font-body-md text-[11px] text-on-surface-variant/50">Chưa có thông tin hành trình.</p>
  }

  return (
    <div className="mt-5 border-t border-outline-variant/10 pt-5">
      <p className="mb-4 font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60">HÀNH TRÌNH ĐƠN HÀNG</p>
      <div className="space-y-0">
        {data.log.map((log, i) => {
          const isLast = i === data.log.length - 1
          const isFirst = i === 0
          return (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${isFirst ? 'bg-primary' : 'border border-primary/50 bg-background'}`} />
                {!isLast && <div className="my-1 w-px flex-1 bg-primary/20" />}
              </div>
              <div className="pb-5">
                <p className={`font-body-md text-xs ${isFirst ? 'font-medium text-primary' : 'text-on-surface'}`}>
                  {log.status}
                </p>
                <p className="mt-0.5 font-body-md text-[10px] text-on-surface-variant/60">
                  {new Date(log.updated_date).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
