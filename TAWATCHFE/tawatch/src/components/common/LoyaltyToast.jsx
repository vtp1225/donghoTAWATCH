import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TIER_META } from '../../services/loyaltyService'

const TIER_BENEFITS = {
  BRONZE:  ['Giảm 2% mọi đơn hàng', 'Ưu tiên hỗ trợ khách hàng'],
  SILVER:  ['Giảm 5% mọi đơn hàng', 'Thông báo ưu đãi độc quyền'],
  GOLD:    ['Giảm 8% mọi đơn hàng', 'Hỗ trợ ưu tiên 24/7', 'Quà tặng nhân dịp đặc biệt'],
  DIAMOND: ['Giảm 12% mọi đơn hàng', 'Hỗ trợ VIP 24/7', 'Bảo hành ưu tiên', 'Mời tham dự sự kiện TAWatch'],
}

const AUTO_DISMISS_MS = 8000

export default function LoyaltyToast({ info, onClose }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!info) return
    // mount → trigger slide-in
    const t1 = setTimeout(() => setVisible(true), 30)
    // auto-dismiss
    const t2 = setTimeout(() => handleClose(), AUTO_DISMISS_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info])

  function handleClose() {
    setLeaving(true)
    setTimeout(() => {
      setLeaving(false)
      setVisible(false)
      onClose()
    }, 400)
  }

  if (!info) return null

  const meta = TIER_META[info.tier] ?? TIER_META.NONE
  const nextMeta = TIER_META[info.nextTier]
  const perks = TIER_BENEFITS[info.tier] ?? []

  return (
    <div
      className={`fixed bottom-6 right-6 z-[300] w-[360px] border bg-background shadow-2xl transition-all duration-500
        ${meta.border}
        ${visible && !leaving ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
    >
      {/* top accent */}
      <div className={`h-0.5 w-full ${info.tier === 'DIAMOND'
        ? 'bg-gradient-to-r from-cyan-400 via-primary to-cyan-400'
        : 'bg-gradient-to-r from-transparent via-primary to-transparent'}`}
      />

      {/* progress bar tự động dismiss */}
      <div className="h-0.5 w-full bg-outline-variant/10 overflow-hidden">
        <div
          className={`h-full ${meta.color.replace('text-', 'bg-')} opacity-40`}
          style={{
            width: visible ? '0%' : '100%',
            transition: visible ? `width ${AUTO_DISMISS_MS}ms linear` : 'none',
          }}
        />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center border ${meta.border} ${meta.bg}`}>
            <span
              className={`material-symbols-outlined text-[24px] ${meta.color}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {meta.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase mb-0.5">
              Chúc mừng!
            </p>
            <p className="font-headline-sm text-sm text-on-background leading-tight">
              Bạn đã lên hạng <span className={`font-bold ${meta.color}`}>{info.tierLabel}</span>
            </p>
            <p className="font-label-caps text-[9px] tracking-wider text-on-surface-variant/50 mt-0.5">
              Giảm {info.discountPercent}% tự động cho mọi đơn hàng
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 material-symbols-outlined text-[16px] text-on-surface-variant/30 hover:text-on-surface-variant transition-colors mt-0.5"
          >
            close
          </button>
        </div>

        {/* Perks */}
        {perks.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[12px] ${meta.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="font-body-md text-xs text-on-surface-variant">{perk}</span>
              </div>
            ))}
          </div>
        )}

        {/* Next tier & action */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/10">
          {info.tier !== 'DIAMOND' && nextMeta ? (
            <p className="font-label-caps text-[8px] tracking-wider text-on-surface-variant/40">
              Thêm <span className="text-on-surface-variant">{info.ordersToNextTier} đơn</span> → {info.nextTierLabel}
            </p>
          ) : (
            <p className="font-label-caps text-[8px] tracking-wider text-on-surface-variant/40">Hạng cao nhất</p>
          )}
          <Link
            to="/profile"
            onClick={handleClose}
            className={`flex-shrink-0 font-label-caps text-[9px] tracking-widest uppercase ${meta.color} hover:opacity-70 transition-opacity`}
          >
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </div>
  )
}
