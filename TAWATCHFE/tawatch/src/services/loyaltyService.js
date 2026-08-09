import { request } from './apiClient.js'

function unwrap(res) {
  return res?.data ?? res
}

export const TIER_META = {
  NONE:    { label: 'Chưa có hạng', color: 'text-on-surface-variant/50', border: 'border-outline-variant/20', bg: 'bg-outline-variant/5',  icon: 'person', discount: 0 },
  BRONZE:  { label: 'Đồng',         color: 'text-amber-600',              border: 'border-amber-600/30',      bg: 'bg-amber-600/8',         icon: 'military_tech', discount: 2 },
  SILVER:  { label: 'Bạc',          color: 'text-slate-300',              border: 'border-slate-300/40',      bg: 'bg-slate-300/8',         icon: 'military_tech', discount: 5 },
  GOLD:    { label: 'Vàng',         color: 'text-primary',                border: 'border-primary/40',        bg: 'bg-primary/8',           icon: 'military_tech', discount: 8 },
  DIAMOND: { label: 'Kim Cương',    color: 'text-cyan-300',               border: 'border-cyan-300/40',       bg: 'bg-cyan-300/8',          icon: 'diamond',       discount: 12 },
}

export const loyaltyService = {
  getLoyaltyInfo(userId) {
    return request(`/users/${userId}/loyalty`).then(unwrap)
  },
}
