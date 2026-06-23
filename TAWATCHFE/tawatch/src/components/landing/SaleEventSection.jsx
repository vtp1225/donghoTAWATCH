import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { promotionService } from '../../services/promotionService.js'

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(endDate) {
  const [remaining, setRemaining] = useState(() => calcRemaining(endDate))

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining(endDate)), 1000)
    return () => clearInterval(id)
  }, [endDate])

  return remaining
}

function calcRemaining(endDate) {
  if (!endDate) return null
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return { d, h, m, s, diff }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDiscount(promo) {
  if (promo.discountType === 'PERCENT') {
    const cap = promo.maxDiscountAmount
      ? ` · tối đa ${formatVnd(promo.maxDiscountAmount)}`
      : ''
    return `Giảm ${promo.discountValue}%${cap}`
  }
  return `Giảm ${formatVnd(promo.discountValue)}`
}

function formatVnd(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

const PROMO_TYPE_LABEL = {
  ORDER:    'Toàn đơn hàng',
  PRODUCT:  'Sản phẩm cụ thể',
  CATEGORY: 'Danh mục',
  BRAND:    'Thương hiệu',
}

// ─── Countdown display ────────────────────────────────────────────────────────

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-headline-sm text-2xl tabular-nums text-on-surface">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-label-caps text-[8px] tracking-[0.2em] text-on-surface-variant/50 uppercase mt-0.5">
        {label}
      </span>
    </div>
  )
}

function Countdown({ endDate }) {
  const remaining = useCountdown(endDate)

  if (!remaining) return (
    <span className="font-label-caps text-[9px] tracking-widest text-error/70 uppercase">Đã kết thúc</span>
  )

  return (
    <div className="flex items-end gap-3">
      <CountdownUnit value={remaining.d} label="Ngày" />
      <span className="mb-3 text-on-surface-variant/30 font-light">:</span>
      <CountdownUnit value={remaining.h} label="Giờ" />
      <span className="mb-3 text-on-surface-variant/30 font-light">:</span>
      <CountdownUnit value={remaining.m} label="Phút" />
      <span className="mb-3 text-on-surface-variant/30 font-light">:</span>
      <CountdownUnit value={remaining.s} label="Giây" />
    </div>
  )
}

// ─── Single event card ────────────────────────────────────────────────────────

const CARD_ACCENTS = [
  'border-primary/25 bg-gradient-to-br from-primary/5 to-transparent',
  'border-outline-variant/20 bg-gradient-to-br from-surface-container to-transparent',
  'border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent',
]

function getPromoLink(promo) {
  if (promo.promoType === 'PRODUCT' && Array.isArray(promo.watchIds) && promo.watchIds.length > 0) {
    if (promo.watchIds.length === 1) return `/product/${promo.watchIds[0]}`
    return `/products?ids=${promo.watchIds.join(',')}`
  }
  return '/products'
}

function EventCard({ promo, index }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
  const minOrder = Number(promo.minOrderValue ?? 0)

  return (
    <article className={`relative border p-7 flex flex-col gap-6 ${accent}`}>
      {/* Top row */}
      <div>
        <span className="font-label-caps text-[9px] tracking-[0.35em] text-primary uppercase block mb-3">
          {PROMO_TYPE_LABEL[promo.promoType] ?? promo.promoType}
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight">
          {promo.name}
        </h3>
        <p className="mt-2 font-body-md text-sm text-on-surface-variant/70">
          {formatDiscount(promo)}
          {minOrder > 0 && ` · Đơn từ ${formatVnd(minOrder)}`}
        </p>
        {Array.isArray(promo.watchNames) && promo.watchNames.length > 0 && (
          <p className="mt-1.5 font-label-caps text-[9px] tracking-widest text-on-surface-variant/50">
            Áp dụng: {promo.watchNames.length <= 3
              ? promo.watchNames.join(' · ')
              : `${promo.watchNames.slice(0, 3).join(' · ')} +${promo.watchNames.length - 3}`}
          </p>
        )}
      </div>

      {/* Countdown */}
      <div>
        <p className="font-label-caps text-[8px] tracking-[0.25em] text-on-surface-variant/40 uppercase mb-3">
          Kết thúc sau
        </p>
        <Countdown endDate={promo.endDate} />
      </div>

      {/* CTA */}
      <Link
        to={getPromoLink(promo)}
        className="mt-auto inline-flex items-center gap-2 self-start border border-primary/40 px-5 py-2.5 font-label-caps text-[9px] tracking-[0.22em] text-primary uppercase transition-all hover:bg-primary hover:text-background"
      >
        Mua ngay
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </Link>
    </article>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function SaleEventSection() {
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    let active = true
    promotionService.getAll({ isActive: true })
      .then((list) => { if (active) setPromotions(Array.isArray(list) ? list : []) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const active = useMemo(() => {
    const now = Date.now()
    return promotions.filter((p) => {
      const started = !p.startDate || new Date(p.startDate).getTime() <= now
      const notEnded = !p.endDate || new Date(p.endDate).getTime() > now
      return started && notEnded
    })
  }, [promotions])

  if (active.length === 0) return null

  return (
    <section className="bg-surface-container-low px-8 py-16 md:px-[80px]">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-label-caps text-[10px] tracking-[0.35em] text-primary uppercase block mb-3">
              <span className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">local_offer</span>
                Sự kiện ưu đãi
              </span>
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Khuyến mãi đang diễn ra
            </h2>
            <p className="mt-2 font-body-md text-sm text-on-surface-variant/60">
              {active.length} chương trình ưu đãi đang chờ bạn khám phá
            </p>
          </div>
          <Link
            to="/products"
            className="self-start flex items-center gap-2 border border-outline-variant/25 px-5 py-2.5 font-label-caps text-[9px] tracking-[0.22em] text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            Xem tất cả sản phẩm
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        <div className="h-px mb-10 opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />

        {/* Cards grid */}
        <div className={`grid gap-5 ${active.length === 1 ? 'grid-cols-1 max-w-md' : active.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {active.map((promo, i) => (
            <EventCard key={promo.id} promo={promo} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
