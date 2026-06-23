import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { couponService } from '../../services/couponService.js'
import { promotionService } from '../../services/promotionService.js'

function formatMoney(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(number)
}

function formatDiscount(promo) {
  if (!promo) return 'Ưu đãi đặc biệt'
  if (promo.discountType === 'PERCENT') {
    return `
    
    
    ${promo.discountValue}%${promo.maxDiscountAmount ? ` tối đa ${formatMoney(promo.maxDiscountAmount)}` : ''}`
  }
  return `Giảm ${formatMoney(promo.discountValue)}`
}

function formatMinOrder(promo) {
  const minOrder = Number(promo?.minOrderValue || 0)
  return minOrder > 0 ? `Cho đơn từ ${formatMoney(minOrder)}` : 'Áp dụng cho mọi đơn hàng'
}

function formatExpiry(coupon, promo) {
  const expiry = coupon?.expiresAt || promo?.endDate
  if (!expiry) return ''
  return `Hạn đến ${new Date(expiry).toLocaleDateString('vi-VN')}`
}

export default function PromotionSpotlightSection() {
  const [promotions, setPromotions] = useState([])
  const [coupons, setCoupons] = useState([])
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    let active = true

    async function loadDeals() {
      try {
        const [promotionList, couponList] = await Promise.all([
          promotionService.getAll({ isActive: true }),
          couponService.getFeatured(),
        ])
        if (!active) return
        setPromotions(Array.isArray(promotionList) ? promotionList : [])
        setCoupons(Array.isArray(couponList) ? couponList : [])
      } catch {
        if (!active) return
        setPromotions([])
        setCoupons([])
      }
    }

    loadDeals()
    return () => {
      active = false
    }
  }, [])

  const featuredDeals = useMemo(() => {
    const promotionById = new Map(promotions.map((promo) => [promo.id, promo]))
    return coupons
      .map((coupon) => ({ coupon, promo: promotionById.get(coupon.promotionId) }))
      .filter((deal) => deal.promo)
      .slice(0, 3)
  }, [coupons, promotions])

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      window.setTimeout(() => setCopiedCode(''), 1600)
    } catch {
      setCopiedCode('')
    }
  }

  if (featuredDeals.length === 0) return null

  const heroDeal = featuredDeals[0]
  const otherDeals = featuredDeals.slice(1)

  return (
    <section className="bg-surface px-8 py-16 md:px-[80px]">
      <div className="mx-auto max-w-7xl border border-primary/20 bg-surface-container-low">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden p-8 md:p-12">
            <div className="absolute right-0 top-0 h-full w-px bg-primary/20 lg:block" />
            <span className="mb-5 inline-flex items-center gap-2 font-label-caps text-[10px] uppercase tracking-[0.35em] text-primary">
              <span className="material-symbols-outlined text-[15px]">local_offer</span>
              Ưu đãi đang diễn ra
            </span>
            <h2 className="max-w-3xl font-headline-md text-headline-md text-on-surface">
              {heroDeal.promo.name}
            </h2>
            <p className="mt-4 max-w-2xl font-body-md text-base text-on-surface-variant/75">
              {formatDiscount(heroDeal.promo)}. {formatMinOrder(heroDeal.promo)}.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => copyCode(heroDeal.coupon.code)}
                className="flex w-full items-center justify-between border border-primary bg-primary/10 px-5 py-4 text-left transition-all hover:bg-primary hover:text-background sm:w-auto sm:min-w-[260px]"
              >
                <span>
                  <span className="block font-label-caps text-[9px] uppercase tracking-[0.25em] opacity-70">
                    Mã giảm giá
                  </span>
                  <span className="mt-1 block font-headline-sm text-lg tracking-[0.18em]">
                    {heroDeal.coupon.code}
                  </span>
                </span>
                <span className="material-symbols-outlined text-[20px]">
                  {copiedCode === heroDeal.coupon.code ? 'check' : 'content_copy'}
                </span>
              </button>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 border border-outline-variant/25 px-5 py-4 font-label-caps text-[10px] uppercase tracking-[0.22em] text-on-surface-variant transition-all hover:border-primary hover:text-primary"
              >
                Mua ngay
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <p className="mt-5 font-label-caps text-[9px] uppercase tracking-[0.22em] text-on-surface-variant/55">
              {copiedCode === heroDeal.coupon.code ? 'Đã sao chép mã' : formatExpiry(heroDeal.coupon, heroDeal.promo)}
            </p>
          </div>

          <div className="grid border-t border-primary/15 lg:border-t-0">
            {otherDeals.length > 0 ? otherDeals.map(({ coupon, promo }) => (
              <div key={coupon.id} className="border-b border-outline-variant/10 p-8 last:border-b-0">
                <p className="font-label-caps text-[9px] uppercase tracking-[0.3em] text-primary">{formatDiscount(promo)}</p>
                <h3 className="mt-3 font-headline-sm text-headline-sm text-on-surface">{promo.name}</h3>
                <p className="mt-2 font-body-md text-sm text-on-surface-variant/65">{formatMinOrder(promo)} · {formatExpiry(coupon, promo)}</p>
                <button
                  type="button"
                  onClick={() => copyCode(coupon.code)}
                  className="mt-5 inline-flex items-center gap-2 border border-outline-variant/25 px-4 py-2 font-label-caps text-[10px] uppercase tracking-[0.2em] text-on-surface-variant transition-all hover:border-primary hover:text-primary"
                >
                  {coupon.code}
                  <span className="material-symbols-outlined text-[15px]">{copiedCode === coupon.code ? 'check' : 'content_copy'}</span>
                </button>
              </div>
            )) : (
              <div className="flex min-h-[240px] items-center p-8">
                <p className="font-body-md text-sm text-on-surface-variant/65">
                  Sao chép mã, chọn sản phẩm yêu thích và áp dụng tại bước thanh toán.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
