import { useEffect, useMemo, useState } from 'react'
import { couponService } from '../../services/couponService.js'
import { promotionService } from '../../services/promotionService.js'
import { watchService } from '../../services/watchService.js'

const PROMO_TYPES = [
  { value: 'ORDER', label: 'Toàn đơn' },
  { value: 'PRODUCT', label: 'Sản phẩm' },
  { value: 'CATEGORY', label: 'Danh mục' },
  { value: 'BRAND', label: 'Thương hiệu' },
]

const DISCOUNT_TYPES = [
  { value: 'PERCENT', label: 'Phần trăm' },
  { value: 'FIXED_AMOUNT', label: 'Số tiền cố định' },
]

function nowInput() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function nextWeekInput() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function toInputDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function toIso(value) {
  return value ? new Date(value).toISOString() : null
}

function formatMoney(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(number)
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('vi-VN') : 'Không giới hạn'
}

function formatDiscount(promo) {
  if (!promo) return '-'
  return promo.discountType === 'PERCENT'
    ? `${promo.discountValue}%${promo.maxDiscountAmount ? `, tối đa ${formatMoney(promo.maxDiscountAmount)}` : ''}`
    : formatMoney(promo.discountValue)
}

const emptyPromotion = {
  name: '',
  promoType: 'ORDER',
  discountType: 'PERCENT',
  discountValue: '',
  minOrderValue: 0,
  maxDiscountAmount: '',
  maxUses: '',
  startDate: nowInput(),
  endDate: nextWeekInput(),
  isActive: true,
  watchIds: [],
}

const emptyCoupon = {
  promotionId: '',
  code: '',
  userId: '',
  expiresAt: '',
}

export default function ManagePromotion() {
  const [promotions, setPromotions] = useState([])
  const [coupons, setCoupons] = useState([])
  const [watches, setWatches] = useState([])
  const [promotionForm, setPromotionForm] = useState(emptyPromotion)
  const [couponForm, setCouponForm] = useState(emptyCoupon)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingPromotion, setSavingPromotion] = useState(false)
  const [savingCoupon, setSavingCoupon] = useState(false)
  const [error, setError] = useState('')

  const activePromotions = useMemo(
    () => promotions.filter((promo) => promo.isActive),
    [promotions],
  )

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [promotionList, couponList] = await Promise.all([
        promotionService.getAll(),
        couponService.getAll(),
      ])
      setPromotions(Array.isArray(promotionList) ? promotionList : [])
      setCoupons(Array.isArray(couponList) ? couponList : [])
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu khuyến mãi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    watchService.getAll().then((list) => setWatches(Array.isArray(list) ? list : [])).catch(() => {})
  }, [])

  function changePromotion(field, value) {
    setPromotionForm((prev) => ({ ...prev, [field]: value }))
  }

  function changeCoupon(field, value) {
    setCouponForm((prev) => ({ ...prev, [field]: value }))
  }

  function startEdit(promo) {
    setEditingPromotion(promo)
    setPromotionForm({
      name: promo.name || '',
      promoType: promo.promoType || 'ORDER',
      discountType: promo.discountType || 'PERCENT',
      discountValue: promo.discountValue ?? '',
      minOrderValue: promo.minOrderValue ?? 0,
      maxDiscountAmount: promo.maxDiscountAmount ?? '',
      maxUses: promo.maxUses ?? '',
      startDate: toInputDateTime(promo.startDate),
      endDate: toInputDateTime(promo.endDate),
      isActive: Boolean(promo.isActive),
      watchIds: Array.isArray(promo.watchIds) ? promo.watchIds : [],
    })
  }

  function resetPromotionForm() {
    setEditingPromotion(null)
    setPromotionForm({ ...emptyPromotion, startDate: nowInput(), endDate: nextWeekInput() })
  }

  async function savePromotion(event) {
    event.preventDefault()
    setSavingPromotion(true)
    setError('')
    try {
      const payload = {
        name: promotionForm.name.trim(),
        promoType: promotionForm.promoType,
        discountType: promotionForm.discountType,
        discountValue: Number(promotionForm.discountValue),
        minOrderValue: Number(promotionForm.minOrderValue || 0),
        maxDiscountAmount: promotionForm.maxDiscountAmount === '' ? null : Number(promotionForm.maxDiscountAmount),
        maxUses: promotionForm.maxUses === '' ? null : Number(promotionForm.maxUses),
        startDate: toIso(promotionForm.startDate),
        endDate: toIso(promotionForm.endDate),
        isActive: promotionForm.isActive,
        watchIds: promotionForm.promoType === 'PRODUCT' ? promotionForm.watchIds : [],
      }

      if (editingPromotion) {
        await promotionService.update(editingPromotion.id, payload)
      } else {
        await promotionService.create(payload)
      }

      resetPromotionForm()
      await loadData()
    } catch (err) {
      setError(err.message || 'Không thể lưu chương trình khuyến mãi.')
    } finally {
      setSavingPromotion(false)
    }
  }

  async function saveCoupon(event) {
    event.preventDefault()
    setSavingCoupon(true)
    setError('')
    try {
      await couponService.create({
        promotionId: Number(couponForm.promotionId),
        code: couponForm.code.trim(),
        userId: couponForm.userId ? Number(couponForm.userId) : null,
        expiresAt: couponForm.expiresAt ? toIso(couponForm.expiresAt) : null,
      })
      setCouponForm(emptyCoupon)
      await loadData()
    } catch (err) {
      setError(err.message || 'Không thể tạo mã giảm giá.')
    } finally {
      setSavingCoupon(false)
    }
  }

  async function removePromotion(promo) {
    if (!window.confirm(`Xoá chương trình "${promo.name}"?`)) return
    try {
      await promotionService.remove(promo.id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Không thể xoá chương trình khuyến mãi.')
    }
  }

  async function removeCoupon(coupon) {
    if (!window.confirm(`Xoá mã "${coupon.code}"?`)) return
    try {
      await couponService.remove(coupon.id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Không thể xoá mã giảm giá.')
    }
  }

  return (
    <main className="ml-72 mt-20 min-h-screen p-gutter">
      <section className="mb-16 pt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="mb-4 block font-label-caps text-label-caps uppercase tracking-[0.4em] text-primary">
              PROMOTION MANAGEMENT
            </span>
            <h2 className="font-display-lg text-display-lg text-on-background">Quản lý Khuyến Mãi</h2>
            <p className="mt-2 font-body-md text-on-surface-variant/70 italic">
              Tạo chương trình giảm giá, phát mã coupon và hiển thị mã nổi bật trên trang chủ.
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 border border-outline-variant/30 px-6 py-3 font-label-caps text-xs uppercase tracking-[0.2em] text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Làm mới
          </button>
        </div>
        <div className="h-px opacity-30" style={{ background: 'linear-gradient(to right, transparent, #e9c176, transparent)' }} />
      </section>

      {error && (
        <div className="mb-8 border border-error/30 bg-error/10 px-5 py-4 font-body-md text-sm text-error">
          {error}
        </div>
      )}

      <section className="mb-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={savePromotion} className="border border-outline-variant/10 bg-surface-container-low p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary">
                {editingPromotion ? 'Cập nhật promotion' : 'Tạo promotion'}
              </p>
              <h3 className="mt-2 font-headline-sm text-headline-sm text-on-background">Chương trình khuyến mãi</h3>
            </div>
            {editingPromotion && (
              <button type="button" onClick={resetPromotionForm} className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary">
                Huỷ sửa
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Tên chương trình</span>
              <input required value={promotionForm.name} onChange={(e) => changePromotion('name', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Phạm vi</span>
              <select value={promotionForm.promoType} onChange={(e) => { changePromotion('promoType', e.target.value); if (e.target.value !== 'PRODUCT') changePromotion('watchIds', []) }} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary">
                {PROMO_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
            {promotionForm.promoType === 'PRODUCT' && (
              <div className="md:col-span-2">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">
                  Sản phẩm áp dụng
                  {promotionForm.watchIds.length > 0 && (
                    <span className="ml-2 text-primary">({promotionForm.watchIds.length} đã chọn)</span>
                  )}
                </span>
                <div className="border border-outline-variant/20 max-h-48 overflow-y-auto sidebar-scroll">
                  <label className="flex items-center gap-3 px-4 py-2.5 border-b border-outline-variant/10 hover:bg-surface-container cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={promotionForm.watchIds.length === 0}
                      onChange={() => changePromotion('watchIds', [])}
                    />
                    <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">TẤT CẢ SẢN PHẨM</span>
                  </label>
                  {watches.map((w) => (
                    <label key={w.id} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={promotionForm.watchIds.includes(w.id)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...promotionForm.watchIds, w.id]
                            : promotionForm.watchIds.filter((id) => id !== w.id)
                          changePromotion('watchIds', next)
                        }}
                      />
                      <span className="font-body-md text-sm text-on-background">{w.name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 font-label-caps text-[9px] text-on-surface-variant/40 tracking-widest">
                  Bỏ chọn tất cả = áp dụng cho toàn bộ sản phẩm
                </p>
              </div>
            )}
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Kiểu giảm</span>
              <select value={promotionForm.discountType} onChange={(e) => changePromotion('discountType', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary">
                {DISCOUNT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Giá trị giảm</span>
              <input required min="0" step="0.01" type="number" value={promotionForm.discountValue} onChange={(e) => changePromotion('discountValue', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Đơn tối thiểu</span>
              <input min="0" step="1000" type="number" value={promotionForm.minOrderValue} onChange={(e) => changePromotion('minOrderValue', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Giảm tối đa</span>
              <input min="0" step="1000" type="number" value={promotionForm.maxDiscountAmount} onChange={(e) => changePromotion('maxDiscountAmount', e.target.value)} placeholder="Không giới hạn" className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Số lượt tối đa</span>
              <input min="1" type="number" value={promotionForm.maxUses} onChange={(e) => changePromotion('maxUses', e.target.value)} placeholder="Không giới hạn" className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Bắt đầu</span>
              <input required type="datetime-local" value={promotionForm.startDate} onChange={(e) => changePromotion('startDate', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Kết thúc</span>
              <input required type="datetime-local" value={promotionForm.endDate} onChange={(e) => changePromotion('endDate', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex items-center gap-3 pt-6">
              <input checked={promotionForm.isActive} onChange={(e) => changePromotion('isActive', e.target.checked)} type="checkbox" className="h-4 w-4 accent-primary" />
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Đang hoạt động</span>
            </label>
          </div>

          <button disabled={savingPromotion} className="mt-8 flex items-center gap-2 border border-primary px-8 py-3 font-label-caps text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-background disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">{editingPromotion ? 'save' : 'add'}</span>
            {savingPromotion ? 'Đang lưu...' : editingPromotion ? 'Lưu thay đổi' : 'Tạo promotion'}
          </button>
        </form>

        <form onSubmit={saveCoupon} className="border border-outline-variant/10 bg-surface-container-low p-8">
          <p className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-primary">Coupon code</p>
          <h3 className="mt-2 font-headline-sm text-headline-sm text-on-background">Tạo mã giảm giá</h3>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant/65">Mã không gán user sẽ được phép hiện nổi bật ngoài trang chủ nếu promotion còn hiệu lực.</p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Promotion</span>
              <select required value={couponForm.promotionId} onChange={(e) => changeCoupon('promotionId', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary">
                <option value="">Chọn chương trình</option>
                {activePromotions.map((promo) => <option key={promo.id} value={promo.id}>{promo.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Mã coupon</span>
              <input required value={couponForm.code} onChange={(e) => changeCoupon('code', e.target.value.toUpperCase())} placeholder="VD: TAWATCH10" className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm uppercase outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">User ID riêng</span>
              <input type="number" min="1" value={couponForm.userId} onChange={(e) => changeCoupon('userId', e.target.value)} placeholder="Bỏ trống để hiện public" className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Hạn mã</span>
              <input type="datetime-local" value={couponForm.expiresAt} onChange={(e) => changeCoupon('expiresAt', e.target.value)} className="mt-2 w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm outline-none focus:border-primary" />
            </label>
          </div>

          <button disabled={savingCoupon} className="mt-8 flex items-center gap-2 border border-primary px-8 py-3 font-label-caps text-xs uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-background disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">confirmation_number</span>
            {savingCoupon ? 'Đang tạo...' : 'Tạo coupon'}
          </button>
        </form>
      </section>

      <section className="mb-10 border border-outline-variant/10 bg-surface-container-low">
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-5">
          <h3 className="font-headline-sm text-headline-sm text-on-background">Danh sách promotion</h3>
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">{promotions.length} chương trình</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container">
                {['Tên', 'Giảm', 'Đơn tối thiểu', 'Thời gian', 'Trạng thái', 'Hành động'].map((h) => (
                  <th key={h} className="px-6 py-4 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/75">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading && <tr><td colSpan="6" className="px-6 py-10 text-center font-label-caps text-xs tracking-widest text-on-surface-variant/50">ĐANG TẢI...</td></tr>}
              {!loading && promotions.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center font-label-caps text-xs tracking-widest text-on-surface-variant/50">CHƯA CÓ PROMOTION</td></tr>}
              {promotions.map((promo) => (
                <tr key={promo.id} className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-5">
                    <p className="font-headline-sm text-sm text-on-background">{promo.name}</p>
                    <p className="mt-1 font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant/50">
                      {promo.promoType}
                      {promo.watchNames?.length > 0 && (
                        <span className="ml-2 text-primary normal-case">
                          · {promo.watchNames.length <= 2
                              ? promo.watchNames.join(', ')
                              : `${promo.watchNames.slice(0, 2).join(', ')} +${promo.watchNames.length - 2}`}
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-5 font-body-md text-sm text-primary">{formatDiscount(promo)}</td>
                  <td className="px-6 py-5 font-body-md text-sm text-on-surface-variant">{formatMoney(promo.minOrderValue)}</td>
                  <td className="px-6 py-5 font-body-md text-xs text-on-surface-variant/75">{formatDate(promo.startDate)} → {formatDate(promo.endDate)}</td>
                  <td className="px-6 py-5">
                    <span className={`font-label-caps text-xs uppercase tracking-widest ${promo.isActive ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                      {promo.isActive ? 'Hoạt động' : 'Tạm tắt'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => startEdit(promo)} className="material-symbols-outlined text-on-surface-variant hover:text-primary" title="Sửa">edit</button>
                      <button onClick={() => removePromotion(promo)} className="material-symbols-outlined text-on-surface-variant hover:text-error" title="Xoá">delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border border-outline-variant/10 bg-surface-container-low">
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-5">
          <h3 className="font-headline-sm text-headline-sm text-on-background">Danh sách coupon</h3>
          <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">{coupons.length} mã</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container">
                {['Mã', 'Promotion', 'User', 'Hạn mã', 'Trạng thái', 'Hành động'].map((h) => (
                  <th key={h} className="px-6 py-4 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/75">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {!loading && coupons.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center font-label-caps text-xs tracking-widest text-on-surface-variant/50">CHƯA CÓ COUPON</td></tr>}
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-5 font-label-caps text-xs uppercase tracking-[0.2em] text-primary">{coupon.code}</td>
                  <td className="px-6 py-5 font-body-md text-sm text-on-background">{coupon.promotionName}</td>
                  <td className="px-6 py-5 font-body-md text-sm text-on-surface-variant">{coupon.userId || 'Public'}</td>
                  <td className="px-6 py-5 font-body-md text-xs text-on-surface-variant/75">{formatDate(coupon.expiresAt)}</td>
                  <td className="px-6 py-5">
                    <span className={`font-label-caps text-xs uppercase tracking-widest ${coupon.isUsed ? 'text-on-surface-variant/50' : 'text-primary'}`}>
                      {coupon.isUsed ? 'Đã dùng' : 'Có thể dùng'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => removeCoupon(coupon)} className="material-symbols-outlined text-on-surface-variant hover:text-error" title="Xoá">delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
