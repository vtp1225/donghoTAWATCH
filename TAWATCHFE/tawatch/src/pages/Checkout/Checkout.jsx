import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import useAuth from '../../hooks/useAuth.js'
import { cartService } from '../../services/cartService.js'
import { couponService } from '../../services/couponService.js'
import { orderService } from '../../services/orderService.js'
import { paymentService } from '../../services/paymentService.js'
import { addressService } from '../../services/userService.js'
import { ghnService } from '../../services/ghnService.js'

function formatVnd(value) {
  if (value == null) return '0 đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

function resolveImage(item) {
  return item.imageUrl || '/images/product-heritage.jpg'
}

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng', sub: 'Cash On Delivery', icon: 'payments' },
  { value: 'VNPAY', label: 'Ví VNPAY', sub: 'Thanh toán qua ứng dụng VNPAY', icon: 'account_balance_wallet' },
  { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng', sub: 'Chuyển khoản sau khi đặt hàng', icon: 'account_balance' },
]

const DELIVERY_METHODS = [
  { value: 'EXTERNAL_SHIPPER', label: 'Giao hàng tận nơi', sub: 'Qua đơn vị vận chuyển (GHN, GHTK...)', icon: 'local_shipping' },
  { value: 'DIRECT_SHOP', label: 'Nhận tại cửa hàng', sub: 'Hoặc giao trực tiếp từ showroom', icon: 'storefront' },
]

function SectionLabel({ step, children }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="flex h-6 w-6 items-center justify-center border border-primary font-label-caps text-[10px] text-primary">{step}</span>
      <h2 className="font-label-caps text-[11px] tracking-[0.3em] text-on-surface-variant uppercase">{children}</h2>
      <div className="h-px flex-1 bg-outline-variant/15" />
    </div>
  )
}

function RadioCard({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border p-4 text-left transition-all duration-200 ${
        selected ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  )
}

// ---------- GHN Dropdown (dùng chung trong AddressPicker và GuestForm) ----------
function GhnLocationSelects({ onChange }) {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoadingProvinces(true)
    ghnService.getProvinces()
      .then((list) => {
        setProvinces(Array.isArray(list) && list.length > 0 ? list : [])
        if (!list || list.length === 0) setError('Không thể tải danh sách tỉnh thành. Kiểm tra kết nối backend.')
      })
      .catch(() => setError('Không thể tải danh sách tỉnh thành. Kiểm tra kết nối backend.'))
      .finally(() => setLoadingProvinces(false))
  }, [])

  const handleProvinceChange = async (e) => {
    const opt = e.target.options[e.target.selectedIndex]
    const provinceId = Number(opt.value)
    const provinceName = opt.text
    setDistricts([])
    setWards([])
    onChange({ province: provinceName, district: '', ward: '', ghnDistrictId: null, ghnWardCode: '' })
    setLoadingDistricts(true)
    const list = await ghnService.getDistricts(provinceId).catch(() => [])
    setDistricts(Array.isArray(list) ? list : [])
    setLoadingDistricts(false)
  }

  const handleDistrictChange = async (e) => {
    const opt = e.target.options[e.target.selectedIndex]
    const districtId = Number(opt.value)
    const districtName = opt.text
    setWards([])
    onChange({ district: districtName, ward: '', ghnDistrictId: districtId, ghnWardCode: '' })
    setLoadingWards(true)
    const list = await ghnService.getWards(districtId).catch(() => [])
    setWards(Array.isArray(list) ? list : [])
    setLoadingWards(false)
  }

  const handleWardChange = (e) => {
    const opt = e.target.options[e.target.selectedIndex]
    onChange({ ward: opt.text, ghnWardCode: opt.value })
  }

  const selectClass = "w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed"

  if (error) {
    return (
      <div className="col-span-2 rounded border border-red-400/30 bg-red-400/5 px-4 py-3">
        <p className="font-body-md text-xs text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Tỉnh / Thành phố</label>
        <select onChange={handleProvinceChange} defaultValue="" disabled={loadingProvinces} className={selectClass}>
          <option value="" disabled>{loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh / thành phố'}</option>
          {provinces.map((p) => (
            <option key={p.provinceId} value={p.provinceId}>{p.provinceName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Quận / Huyện</label>
        <select onChange={handleDistrictChange} defaultValue="" disabled={districts.length === 0 || loadingDistricts} className={selectClass}>
          <option value="" disabled>{loadingDistricts ? 'Đang tải...' : 'Chọn quận / huyện'}</option>
          {districts.map((d) => (
            <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Phường / Xã</label>
        <select onChange={handleWardChange} defaultValue="" disabled={wards.length === 0 || loadingWards} className={selectClass}>
          <option value="" disabled>{loadingWards ? 'Đang tải...' : 'Chọn phường / xã'}</option>
          {wards.map((w) => (
            <option key={w.wardCode} value={w.wardCode}>{w.wardName}</option>
          ))}
        </select>
      </div>
    </>
  )
}

// ---------- Address picker (logged-in) ----------
function AddressPicker({ userId, selectedId, onSelect }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [newAddr, setNewAddr] = useState({
    recipientName: '', phone: '', addressDetail: '',
    province: '', district: '', ward: '',
    ghnDistrictId: null, ghnWardCode: '', isDefault: false,
  })

  useEffect(() => {
    addressService.getAddresses(userId)
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setAddresses(list)
        const def = list.find((a) => a.isDefault) ?? list[0]
        if (def && !selectedId) onSelect(def)
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false))
  }, [onSelect, selectedId, userId])

  const handleSaveAddress = async () => {
    if (!newAddr.recipientName || !newAddr.phone || !newAddr.addressDetail || !newAddr.province || !newAddr.district || !newAddr.ward) {
      setFormError('Vui lòng điền đầy đủ thông tin địa chỉ.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const created = await addressService.createAddress(userId, newAddr)
      setAddresses((prev) => [...prev, created])
      onSelect(created)
      setShowForm(false)
      setNewAddr({ recipientName: '', phone: '', addressDetail: '', province: '', district: '', ward: '', ghnDistrictId: null, ghnWardCode: '', isDefault: false })
    } catch (err) {
      setFormError(err?.message || 'Không thể lưu địa chỉ.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-6 font-label-caps text-[10px] tracking-widest text-on-surface-variant/40">ĐANG TẢI ĐỊA CHỈ...</div>
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <RadioCard key={addr.id} selected={selectedId === addr.id} onClick={() => onSelect(addr)}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 transition-colors ${selectedId === addr.id ? 'border-primary bg-primary' : 'border-outline-variant/40'}`} />
            <div>
              <p className="font-body-md text-sm text-on-surface">
                <span className="font-semibold">{addr.recipientName}</span>
                <span className="mx-2 text-outline">|</span>
                <span className="text-on-surface-variant">{addr.phone}</span>
                {addr.isDefault && (
                  <span className="ml-2 border border-primary/40 px-1.5 py-0.5 font-label-caps text-[8px] tracking-widest text-primary">MẶC ĐỊNH</span>
                )}
              </p>
              <p className="mt-1 font-body-md text-xs text-on-surface-variant">
                {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
              </p>
            </div>
          </div>
        </RadioCard>
      ))}

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 border border-dashed border-outline-variant/30 px-4 py-3 font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          THÊM ĐỊA CHỈ MỚI
        </button>
      ) : (
        <div className="space-y-4 border border-outline-variant/20 p-6">
          <p className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant">ĐỊA CHỈ MỚI</p>
          {formError && <p className="font-body-md text-xs text-red-400">{formError}</p>}
          <div className="grid grid-cols-2 gap-4">
            {[
              { field: 'recipientName', label: 'Họ tên người nhận' },
              { field: 'phone', label: 'Số điện thoại' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">{label}</label>
                <input
                  type="text"
                  value={newAddr[field]}
                  onChange={(e) => setNewAddr((p) => ({ ...p, [field]: e.target.value }))}
                  className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
              </div>
            ))}
            <GhnLocationSelects
              onChange={(fields) => setNewAddr((p) => ({ ...p, ...fields }))}
            />
            <div className="col-span-2">
              <label className="mb-1 block font-label-caps text-[9px] tracking-[0.25em] text-on-surface-variant/60 uppercase">Địa chỉ chi tiết</label>
              <input
                type="text"
                value={newAddr.addressDetail}
                onChange={(e) => setNewAddr((p) => ({ ...p, addressDetail: e.target.value }))}
                placeholder="Số nhà, tên đường..."
                className="w-full border-b border-outline-variant/25 bg-transparent py-2 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isDefault"
              type="checkbox"
              checked={newAddr.isDefault}
              onChange={(e) => setNewAddr((p) => ({ ...p, isDefault: e.target.checked }))}
              className="accent-primary"
            />
            <label htmlFor="isDefault" className="font-body-md text-xs text-on-surface-variant">Đặt làm địa chỉ mặc định</label>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveAddress}
              className="border border-primary px-6 py-2.5 font-label-caps text-[10px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
            >
              {saving ? 'ĐANG LƯU...' : 'LƯU ĐỊA CHỈ'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError('') }}
              className="border border-outline-variant/30 px-6 py-2.5 font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              HỦY
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- Guest form ----------
function GuestForm({ data, onChange }) {
  const textFields = [
    { name: 'guestName', label: 'Họ tên', type: 'text', placeholder: 'Nguyen Van A' },
    { name: 'guestEmail', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'guestPhone', label: 'Số điện thoại', type: 'tel', placeholder: '0901234567' },
  ]

  return (
    <div className="space-y-6">
      {textFields.map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60 uppercase">
            {label} <span className="text-primary">*</span>
          </label>
          <input
            type={type}
            value={data[name]}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className="w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 focus:border-primary"
          />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-4">
        <GhnLocationSelects
          onChange={(fields) => {
            Object.entries(fields).forEach(([k, v]) => onChange(
              k === 'province' ? 'guestProvince' : k === 'district' ? 'guestDistrict' : k === 'ward' ? 'guestWard' : k, v
            ))
          }}
        />
      </div>
      <div>
        <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60 uppercase">
          Địa chỉ chi tiết <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={data.guestAddressDetail}
          onChange={(e) => onChange('guestAddressDetail', e.target.value)}
          placeholder="Số nhà, tên đường..."
          className="w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 focus:border-primary"
        />
      </div>
    </div>
  )
}

// ---------- Success state ----------
function OrderSuccess({ order, onContinue }) {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <div className="mb-8 flex justify-center">
        <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
      </div>
      <p className="mb-3 font-label-caps text-[10px] tracking-[0.35em] text-primary uppercase">Đặt hàng thành công</p>
      <h2 className="mb-4 font-headline-md text-headline-md text-on-surface">Cảm ơn bạn đã tin tưởng TAWatch</h2>
      <div className="my-8 border border-outline-variant/15 bg-surface-container-low p-8">
        <p className="mb-2 font-label-caps text-[9px] tracking-[0.3em] text-on-surface-variant/60">MÃ ĐƠN HÀNG</p>
        <p className="font-headline-sm text-headline-sm text-primary">{order.orderCode}</p>
        <div className="my-6 h-px bg-outline-variant/15" />
        <div className="flex justify-between font-body-md text-sm">
          <span className="text-on-surface-variant">Tổng tiền</span>
          <span className="text-primary">{formatVnd(order.totalAmount)}</span>
        </div>
        <div className="mt-2 flex justify-between font-body-md text-sm">
          <span className="text-on-surface-variant">Thanh toán</span>
          <span className="text-on-surface">{order.paymentMethod}</span>
        </div>
        <div className="mt-2 flex justify-between font-body-md text-sm">
          <span className="text-on-surface-variant">Trạng thái</span>
          <span className="text-on-surface">{order.orderStatus}</span>
        </div>
      </div>
      <p className="mb-8 font-body-md text-sm text-on-surface-variant">
        Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
      </p>
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onContinue}
          className="w-full border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
        >
          TIẾP TỤC MUA SẮM
        </button>
        <Link
          to="/cart"
          className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Xem lại giỏ hàng
        </Link>
        <Link
          to="/orders"
          className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant/60 underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  )
}

// ---------- Main Checkout ----------
export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(true)

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [guest, setGuest] = useState({ guestName: '', guestEmail: '', guestPhone: '', guestAddressDetail: '', guestProvince: '', guestDistrict: '', guestWard: '', ghnDistrictId: null, ghnWardCode: '' })
  const [shippingFee, setShippingFee] = useState(0)
  const [shippingFeeLoading, setShippingFeeLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [deliveryMethod, setDeliveryMethod] = useState('EXTERNAL_SHIPPER')
  const [note, setNote] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successOrder, setSuccessOrder] = useState(null)

  useEffect(() => {
    cartService.getCurrentCart()
      .then(setCart)
      .catch(() => setCart(null))
      .finally(() => setCartLoading(false))
  }, [])

  const handleGuestChange = (name, value) => {
    setGuest((prev) => ({ ...prev, [name]: value }))
  }

  const handleCouponCodeChange = (value) => {
    setCouponCode(value)
    setCouponError('')

    if (appliedCoupon?.code?.toLowerCase() !== value.trim().toLowerCase()) {
      setAppliedCoupon(null)
    }
  }

  // Tính phí ship khi địa chỉ hoặc phương thức vận chuyển thay đổi
  useEffect(() => {
    if (deliveryMethod !== 'EXTERNAL_SHIPPER') { setShippingFee(0); return }

    const districtId = isAuthenticated ? selectedAddress?.ghnDistrictId : guest.ghnDistrictId
    const wardCode = isAuthenticated ? selectedAddress?.ghnWardCode : guest.ghnWardCode

    if (!districtId || !wardCode) { setShippingFee(0); return }

    setShippingFeeLoading(true)
    ghnService.calculateFee({ toDistrictId: districtId, toWardCode: wardCode, weight: 500 })
      .then((fee) => setShippingFee(fee ?? 0))
      .catch(() => setShippingFee(0))
      .finally(() => setShippingFeeLoading(false))
  }, [selectedAddress, guest.ghnDistrictId, guest.ghnWardCode, deliveryMethod, isAuthenticated])

  const selectedItemIds = location.state?.selectedItemIds
  const allCartItems = cart?.items ?? []
  const items = selectedItemIds
    ? allCartItems.filter((i) => selectedItemIds.includes(i.id))
    : allCartItems
  const subtotal = items.reduce((sum, i) => sum + (i.subtotal ?? i.unitPrice * i.quantity), 0)
  const discountAmount = appliedCoupon?.discountAmount ?? 0
  const totalAmount = Math.max(subtotal + shippingFee - discountAmount, 0)

  const applyCoupon = async () => {
    const code = couponCode.trim()

    if (!code) {
      setCouponError('Vui lòng nhập mã giảm giá.')
      return null
    }

    if (subtotal <= 0) {
      setCouponError('Không thể áp dụng mã giảm giá cho đơn hàng rỗng.')
      return null
    }

    setCouponLoading(true)
    setCouponError('')

    try {
      const result = await couponService.validate({ code, subtotal })
      setAppliedCoupon(result)
      setCouponCode(result.code ?? code)
      return result
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err?.message || 'Không thể áp dụng mã giảm giá.')
      return null
    } finally {
      setCouponLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    let coupon = appliedCoupon
    if (couponCode.trim() && (!coupon || coupon.code?.toLowerCase() !== couponCode.trim().toLowerCase())) {
      coupon = await applyCoupon()
      if (!coupon) return
    }

    if (items.length === 0) {
      setSubmitError('Giỏ hàng đang trống.')
      return
    }

    if (isAuthenticated && !selectedAddress) {
      setSubmitError('Vui lòng chọn địa chỉ giao hàng.')
      return
    }

    if (!isAuthenticated) {
      const { guestName, guestEmail, guestPhone, guestAddressDetail } = guest
      if (!guestName || !guestEmail || !guestPhone || !guestAddressDetail) {
        setSubmitError('Vui lòng điền đầy đủ thông tin nhận hàng.')
        return
      }
    }

    setSubmitting(true)
    try {
      const orderItems = items.map((i) => ({ watchVariantId: i.watchVariantId, quantity: i.quantity }))
      const couponId = coupon?.couponId ?? null
      const ghnDistrictId = isAuthenticated ? selectedAddress?.ghnDistrictId : guest.ghnDistrictId
      const ghnWardCode = isAuthenticated ? selectedAddress?.ghnWardCode : guest.ghnWardCode

      const payload = isAuthenticated
        ? { userId: user.id, addressId: selectedAddress.id, paymentMethod, deliveryMethod, couponCode: coupon?.code ?? null, note: note || null, shippingFee, ghnDistrictId, ghnWardCode, items: orderItems }
        : { userId: null, guestName: guest.guestName, guestEmail: guest.guestEmail, guestPhone: guest.guestPhone, guestAddressDetail: `${guest.guestAddressDetail}, ${guest.guestWard}, ${guest.guestDistrict}, ${guest.guestProvince}`, paymentMethod, deliveryMethod, couponCode: coupon?.code ?? null, note: note || null, shippingFee, ghnDistrictId, ghnWardCode, items: orderItems }

      const order = await orderService.createOrder(payload)

      // Remove only the ordered items from cart (not clear all)
      if (cart?.id) {
        await Promise.all(items.map((i) => cartService.removeItem(cart.id, i.id).catch(() => {})))
      }

      // If VNPAY selected, initiate payment and redirect to paymentUrl
      if (paymentMethod === 'VNPAY') {
        try {
          const init = await paymentService.initiateVnpay(order.id || order.orderId || order.transactionId)
          const paymentUrl = init?.paymentUrl || init?.data?.paymentUrl
          if (paymentUrl) {
            window.location.href = paymentUrl
            return
          }
          setSubmitError('Không nhận được đường dẫn thanh toán VNPay. Vui lòng thử lại.')
          return
        } catch (err) {
          setSubmitError(err?.message || 'Không thể khởi tạo thanh toán VNPay.')
          return
        }
      }

      window.dispatchEvent(new Event('cart:updated'))
      setSuccessOrder(order)
    } catch (err) {
      const code = err?.data?.code
      if (code === 5004) setSubmitError('Một hoặc nhiều sản phẩm đã hết hàng. Vui lòng kiểm tra lại giỏ hàng.')
      else if (code === 5003) setSubmitError('Đơn hàng phải có ít nhất 1 sản phẩm.')
      else setSubmitError(err?.message || 'Không thể đặt hàng. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40">
          ĐANG TẢI...
        </div>
        <Footer />
      </div>
    )
  }

  if (successOrder) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
          <OrderSuccess order={successOrder} onContinue={() => navigate('/products')} />
        </main>
        <Footer />
      </div>
    )
  }

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
          <div className="py-24 text-center">
            <span className="material-symbols-outlined mb-6 block text-5xl text-on-surface-variant/20">shopping_bag</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">Chưa có sản phẩm nào được chọn</p>
            <p className="mt-3 font-body-md text-on-surface-variant">Vui lòng quay lại giỏ hàng và chọn sản phẩm để thanh toán.</p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <Link className="border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background" to="/cart">
                QUAY LẠI GIỎ HÀNG
              </Link>
              <Link className="font-label-caps text-[10px] tracking-[0.2em] text-on-surface-variant underline underline-offset-4 transition-opacity hover:opacity-70" to="/products">
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">

        <header className="mb-16 text-center">
          <p className="font-label-caps text-[10px] tracking-[0.3em] text-primary">SECURE CHECKOUT</p>
          <h1 className="mt-4 font-headline-md text-headline-md italic text-on-surface">Đặt hàng</h1>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

            {/* Left: Shipping + Payment */}
            <div className="space-y-14 lg:col-span-7">

              {/* Shipping */}
              <section>
                <SectionLabel step="01">Thông tin giao hàng</SectionLabel>
                {isAuthenticated ? (
                  <AddressPicker
                    userId={user.id}
                    selectedId={selectedAddress?.id}
                    onSelect={setSelectedAddress}
                  />
                ) : (
                  <>
                    <p className="mb-6 font-body-md text-xs text-on-surface-variant/70">
                      Bạn chưa đăng nhập.{' '}
                      <Link className="text-primary underline underline-offset-4 transition-opacity hover:opacity-70" to="/login">
                        Đăng nhập
                      </Link>{' '}
                      để sử dụng địa chỉ đã lưu.
                    </p>
                    <GuestForm data={guest} onChange={handleGuestChange} />
                  </>
                )}
              </section>

              {/* Delivery method */}
              <section>
                <SectionLabel step="02">Phương thức vận chuyển</SectionLabel>
                <div className="space-y-3">
                  {DELIVERY_METHODS.map((m) => (
                    <RadioCard key={m.value} selected={deliveryMethod === m.value} onClick={() => setDeliveryMethod(m.value)}>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center border transition-colors ${deliveryMethod === m.value ? 'border-primary text-primary' : 'border-outline-variant/25 text-on-surface-variant/50'}`}>
                          <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-sm font-medium text-on-surface">{m.label}</p>
                          <p className="font-body-md text-xs text-on-surface-variant/70">{m.sub}</p>
                        </div>
                        <div className={`h-4 w-4 flex-shrink-0 rounded-full border-2 transition-colors ${deliveryMethod === m.value ? 'border-primary bg-primary' : 'border-outline-variant/40'}`} />
                      </div>
                    </RadioCard>
                  ))}
                </div>
              </section>

              <section>
                <SectionLabel step="03">Mã giảm giá</SectionLabel>
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => handleCouponCodeChange(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 border border-outline-variant/20 bg-transparent px-4 py-3 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="border border-primary px-6 py-3 font-label-caps text-[10px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
                    >
                      {couponLoading ? 'ĐANG ÁP DỤNG...' : 'ÁP DỤNG'}
                    </button>
                  </div>
                  {couponError && <p className="font-body-md text-xs text-red-400">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="border border-primary/20 bg-primary/5 px-4 py-3 font-body-md text-xs text-on-surface-variant">
                      <p className="font-label-caps text-[9px] tracking-[0.2em] text-primary">ĐÃ ÁP DỤNG</p>
                      <p className="mt-1 text-on-surface">{appliedCoupon.promotionName || appliedCoupon.code}</p>
                      <p className="mt-1 text-primary">Giảm {formatVnd(appliedCoupon.discountAmount)}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Payment method */}
              <section>
                <SectionLabel step="04">Phương thức thanh toán</SectionLabel>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <RadioCard key={m.value} selected={paymentMethod === m.value} onClick={() => setPaymentMethod(m.value)}>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center border transition-colors ${paymentMethod === m.value ? 'border-primary text-primary' : 'border-outline-variant/25 text-on-surface-variant/50'}`}>
                          <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-sm font-medium text-on-surface">{m.label}</p>
                          <p className="font-body-md text-xs text-on-surface-variant/70">{m.sub}</p>
                        </div>
                        <div className={`h-4 w-4 flex-shrink-0 rounded-full border-2 transition-colors ${paymentMethod === m.value ? 'border-primary bg-primary' : 'border-outline-variant/40'}`} />
                      </div>
                    </RadioCard>
                  ))}
                </div>
              </section>

              {/* Note */}
              <section>
                <SectionLabel step="05">Ghi chú</SectionLabel>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Yêu cầu đặc biệt, hướng dẫn giao hàng..."
                  className="w-full resize-none border border-outline-variant/20 bg-transparent px-4 py-3 font-body-md text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 focus:border-primary"
                />
              </section>
            </div>

            {/* Right: Order summary */}
            <aside className="lg:col-span-5">
              <div className="sticky top-32 border border-outline-variant/10 bg-surface-container-low p-8">
                <div className="mb-6 border-b border-outline-variant/15 pb-4">
                  <h2 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant">ORDER SUMMARY</h2>
                  {selectedItemIds && allCartItems.length > items.length && (
                    <p className="mt-1.5 font-body-md text-[11px] text-on-surface-variant/60">
                      {items.length} / {allCartItems.length} sản phẩm được chọn
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="mb-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-surface-container">
                        <img alt={item.watchName} className="h-full w-full object-cover" src={resolveImage(item)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body-md text-sm text-on-surface">{item.watchName}</p>
                        <p className="font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant/60">
                          {item.dialColor} / {item.strapColor} × {item.quantity}
                        </p>
                      </div>
                      <p className="flex-shrink-0 font-body-md text-sm text-primary">{formatVnd(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-outline-variant/15" />

                {/* Totals */}
                <div className="my-6 space-y-3">
                  <div className="flex justify-between font-body-md text-sm">
                    <span className="text-on-surface-variant">Tạm tính</span>
                    <span className="text-on-surface">{formatVnd(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-body-md text-sm">
                      <span className="text-on-surface-variant">Giảm giá</span>
                      <span className="text-primary">− {formatVnd(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body-md text-sm">
                    <span className="text-on-surface-variant">Phí vận chuyển</span>
                    <span className={shippingFeeLoading ? 'text-on-surface-variant/40' : shippingFee > 0 ? 'text-on-surface' : 'text-primary'}>
                      {shippingFeeLoading ? 'Đang tính...' : shippingFee > 0 ? formatVnd(shippingFee) : deliveryMethod === 'EXTERNAL_SHIPPER' ? 'Chọn địa chỉ để tính' : 'Miễn phí'}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="mb-8 mt-6 flex items-end justify-between">
                  <span className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant">TỔNG CỘNG</span>
                  <span className="font-headline-sm text-headline-sm text-primary">{formatVnd(totalAmount)}</span>
                </div>

                {submitError && (
                  <div className="mb-4 flex items-start gap-3 border border-red-500/25 bg-red-500/8 px-4 py-3">
                    <span className="material-symbols-outlined mt-0.5 text-[14px] text-red-400">error</span>
                    <p className="font-body-md text-xs text-red-300">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="gold-border-button group relative w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        ĐẶT HÀNG
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
                </button>

                <p className="mt-4 text-center font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant/40">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của TAWatch
                </p>
              </div>
            </aside>

          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
