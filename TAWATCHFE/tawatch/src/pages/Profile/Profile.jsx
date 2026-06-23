import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import useAuth from '../../hooks/useAuth.js'
import { userService, addressService } from '../../services/userService.js'
import { authService } from '../../services/authService.js'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function toInputDate(iso) {
  if (!iso) return ''
  return iso.split('T')[0]
}

const ROLE_LABEL = { CUSTOMER: 'Khách hàng', ADMIN: 'Quản trị viên', STAFF: 'Nhân viên' }

// ─── SectionLabel ────────────────────────────────────────────────────────────

function SectionLabel({ icon, children }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="material-symbols-outlined text-[16px] text-primary/70">{icon}</span>
      <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/70 uppercase">{children}</h3>
      <div className="h-px flex-1 bg-outline-variant/10" />
    </div>
  )
}

// ─── Field display (read-only) ───────────────────────────────────────────────

function ReadField({ label, value }) {
  return (
    <div>
      <p className="mb-1.5 font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">{label}</p>
      <p className="font-body-md text-sm text-on-surface">{value || '—'}</p>
    </div>
  )
}

// ─── EditField ───────────────────────────────────────────────────────────────

function EditField({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="mb-1.5 block font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-b border-outline-variant/25 bg-transparent py-2.5 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary"
      />
    </div>
  )
}

// ─── AddressCard ─────────────────────────────────────────────────────────────

function AddressCard({ address, userId, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settingDefault, setSettingDefault] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    recipientName: address.recipientName,
    phone: address.phone,
    addressDetail: address.addressDetail,
    province: address.province,
    district: address.district,
    ward: address.ward,
    isDefault: address.isDefault,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await addressService.updateAddress(userId, address.id, form)
      onUpdated(updated)
      setEditing(false)
    } catch (err) {
      setError(err?.message || 'Không thể cập nhật địa chỉ.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await addressService.deleteAddress(userId, address.id)
      onDeleted(address.id)
    } catch (err) {
      setError(err?.message || 'Không thể xoá địa chỉ.')
      setSaving(false)
    }
  }

  const handleSetDefault = async () => {
    setSettingDefault(true)
    try {
      await addressService.setDefault(userId, address.id)
      onUpdated({ ...address, isDefault: true })
    } catch (err) {
      setError(err?.message || 'Không thể đặt mặc định.')
    } finally {
      setSettingDefault(false)
    }
  }

  const ADDR_FIELDS = [
    { name: 'recipientName', label: 'Họ tên người nhận', required: true },
    { name: 'phone', label: 'Số điện thoại', required: true },
    { name: 'province', label: 'Tỉnh / Thành phố', required: true },
    { name: 'district', label: 'Quận / Huyện', required: true },
    { name: 'ward', label: 'Phường / Xã', required: true },
    { name: 'addressDetail', label: 'Địa chỉ chi tiết', required: true },
  ]

  return (
    <div className={`border p-5 transition-all duration-200 ${address.isDefault ? 'border-primary/30 bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low'}`}>
      {!editing ? (
        <>
          {/* View mode */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-body-md text-sm font-medium text-on-surface">{address.recipientName}</p>
                {address.isDefault && (
                  <span className="border border-primary/40 px-1.5 py-0.5 font-label-caps text-[8px] tracking-widest text-primary">MẶC ĐỊNH</span>
                )}
              </div>
              <p className="mt-0.5 font-body-md text-xs text-on-surface-variant">{address.phone}</p>
              <p className="mt-1 font-body-md text-xs text-on-surface-variant/70">
                {address.addressDetail}, {address.ward}, {address.district}, {address.province}
              </p>
            </div>
          </div>

          {error && <p className="mb-3 font-body-md text-xs text-red-400">{error}</p>}

          {!deleting ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[13px]">edit</span>
                CHỈNH SỬA
              </button>
              {!address.isDefault && (
                <>
                  <span className="h-3 w-px bg-outline-variant/20" />
                  <button
                    type="button"
                    onClick={handleSetDefault}
                    disabled={settingDefault}
                    className="flex items-center gap-1.5 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[13px]">star</span>
                    ĐẶT MẶC ĐỊNH
                  </button>
                  <span className="h-3 w-px bg-outline-variant/20" />
                  <button
                    type="button"
                    onClick={() => setDeleting(true)}
                    className="flex items-center gap-1.5 font-label-caps text-[9px] tracking-[0.2em] text-red-400/70 transition-colors hover:text-red-400"
                  >
                    <span className="material-symbols-outlined text-[13px]">delete</span>
                    XOÁ
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="border border-red-500/20 bg-red-500/5 p-4">
              <p className="mb-3 font-label-caps text-[9px] tracking-[0.2em] text-red-400">Xác nhận xoá địa chỉ này?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="border border-red-500/40 px-4 py-1.5 font-label-caps text-[9px] tracking-[0.15em] text-red-400 transition-colors hover:bg-red-500/15 disabled:opacity-50"
                >
                  {saving ? 'ĐANG XOÁ...' : 'XÁC NHẬN'}
                </button>
                <button
                  type="button"
                  onClick={() => { setDeleting(false); setError('') }}
                  className="border border-outline-variant/25 px-4 py-1.5 font-label-caps text-[9px] tracking-[0.15em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  HUỶ
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Edit mode */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {ADDR_FIELDS.map(({ name, label, required }) => (
              <div key={name} className={name === 'addressDetail' ? 'md:col-span-2' : ''}>
                <label className="mb-1.5 block font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">
                  {label} {required && <span className="text-primary">*</span>}
                </label>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border-b border-outline-variant/25 bg-transparent py-2.5 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
              </div>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-3">
            <input
              id={`default-${address.id}`}
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="accent-primary"
            />
            <label htmlFor={`default-${address.id}`} className="font-body-md text-xs text-on-surface-variant">
              Đặt làm địa chỉ mặc định
            </label>
          </div>
          {error && <p className="mb-3 font-body-md text-xs text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="border border-primary px-5 py-2 font-label-caps text-[9px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
            >
              {saving ? 'ĐANG LƯU...' : 'LƯU'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setError('') }}
              className="border border-outline-variant/25 px-5 py-2 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              HUỶ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── AddressTab ───────────────────────────────────────────────────────────────

function AddressTab({ userId }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [newAddr, setNewAddr] = useState({
    recipientName: '', phone: '', addressDetail: '',
    province: '', district: '', ward: '', isDefault: false,
  })

  useEffect(() => {
    addressService.getAddresses(userId)
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Không thể tải địa chỉ.'))
      .finally(() => setLoading(false))
  }, [userId])

  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddr((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleCreate = async () => {
    const { recipientName, phone, addressDetail, province, district, ward } = newAddr
    if (!recipientName || !phone || !addressDetail || !province || !district || !ward) {
      setFormError('Vui lòng điền đầy đủ thông tin.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const created = await addressService.createAddress(userId, newAddr)
      setAddresses((prev) => {
        const next = newAddr.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev
        return [...next, created]
      })
      setShowForm(false)
      setNewAddr({ recipientName: '', phone: '', addressDetail: '', province: '', district: '', ward: '', isDefault: false })
    } catch (err) {
      setFormError(err?.message || 'Không thể thêm địa chỉ.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdated = (updated) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (updated.isDefault) return a.id === updated.id ? updated : { ...a, isDefault: false }
        return a.id === updated.id ? updated : a
      })
    )
  }

  const handleDeleted = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const NEW_ADDR_FIELDS = [
    { name: 'recipientName', label: 'Họ tên người nhận', required: true },
    { name: 'phone', label: 'Số điện thoại', required: true },
    { name: 'province', label: 'Tỉnh / Thành phố', required: true },
    { name: 'district', label: 'Quận / Huyện', required: true },
    { name: 'ward', label: 'Phường / Xã', required: true },
    { name: 'addressDetail', label: 'Địa chỉ chi tiết', required: true },
  ]

  if (loading) return (
    <div className="py-16 text-center">
      <span className="material-symbols-outlined animate-spin block mb-3 text-3xl text-primary/30">progress_activity</span>
      <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/40">ĐANG TẢI...</p>
    </div>
  )

  if (error) return <p className="py-8 text-center font-body-md text-sm text-red-400">{error}</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-body-md text-sm text-on-surface-variant">
          {addresses.length === 0 ? 'Chưa có địa chỉ nào.' : `${addresses.length} địa chỉ đã lưu`}
        </p>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 border border-primary px-4 py-2 font-label-caps text-[9px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            THÊM ĐỊA CHỈ
          </button>
        )}
      </div>

      {/* Add new address form */}
      {showForm && (
        <div className="mb-6 border border-outline-variant/15 bg-surface-container-low p-6">
          <p className="mb-5 font-label-caps text-[10px] tracking-[0.25em] text-on-surface-variant/70">ĐỊA CHỈ MỚI</p>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {NEW_ADDR_FIELDS.map(({ name, label, required }) => (
              <div key={name} className={name === 'addressDetail' ? 'md:col-span-2' : ''}>
                <label className="mb-1.5 block font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50 uppercase">
                  {label} {required && <span className="text-primary">*</span>}
                </label>
                <input
                  type="text"
                  name={name}
                  value={newAddr[name]}
                  onChange={handleNewChange}
                  className="w-full border-b border-outline-variant/25 bg-transparent py-2.5 font-body-md text-sm text-on-surface outline-none transition-colors focus:border-primary"
                />
              </div>
            ))}
          </div>
          <div className="mb-5 flex items-center gap-3">
            <input id="new-default" type="checkbox" name="isDefault" checked={newAddr.isDefault} onChange={handleNewChange} className="accent-primary" />
            <label htmlFor="new-default" className="font-body-md text-xs text-on-surface-variant">Đặt làm địa chỉ mặc định</label>
          </div>
          {formError && <p className="mb-4 font-body-md text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="border border-primary px-6 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
            >
              {saving ? 'ĐANG LƯU...' : 'LƯU ĐỊA CHỈ'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError('') }}
              className="border border-outline-variant/25 px-6 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            >
              HUỶ
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-outline-variant/15">
          <span className="material-symbols-outlined mb-3 block text-4xl text-on-surface-variant/15">location_off</span>
          <p className="font-body-md text-sm text-on-surface-variant/50">Chưa có địa chỉ nào được lưu</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              userId={userId}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── InfoTab ──────────────────────────────────────────────────────────────────

function InfoTab({ user, onUserUpdated }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    birthday: toInputDate(user?.birthday),
  })

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      setError('Họ tên không được để trống.')
      return
    }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const updated = await userService.updateUser(user.id, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        birthday: form.birthday || null,
      })
      onUserUpdated(updated)
      setEditing(false)
      setSuccess('Cập nhật thông tin thành công.')
    } catch (err) {
      setError(err?.message || 'Không thể cập nhật thông tin.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      birthday: toInputDate(user?.birthday),
    })
    setEditing(false)
    setError('')
  }

  return (
    <div className="space-y-10">
      {/* Personal info */}
      <div>
        <SectionLabel icon="person">Thông tin cá nhân</SectionLabel>

        {success && (
          <div className="mb-6 flex items-center gap-3 border border-primary/25 bg-primary/8 px-4 py-3">
            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
            <p className="font-body-md text-sm text-primary">{success}</p>
          </div>
        )}

        {!editing ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ReadField label="Họ và tên" value={user?.fullName} />
              <ReadField label="Số điện thoại" value={user?.phone} />
              <ReadField label="Ngày sinh" value={user?.birthday ? formatDate(user.birthday) : null} />
              <ReadField label="Vai trò" value={ROLE_LABEL[user?.role] ?? user?.role} />
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 border border-primary px-5 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                CHỈNH SỬA
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <EditField label="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} required />
              <EditField label="Số điện thoại" name="phone" type="tel" value={form.phone} onChange={handleChange} />
              <EditField label="Ngày sinh" name="birthday" type="date" value={form.birthday} onChange={handleChange} />
            </div>
            {error && (
              <div className="mt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-red-400">error</span>
                <p className="font-body-md text-xs text-red-400">{error}</p>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 border border-primary px-6 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                    ĐANG LƯU...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">save</span>
                    LƯU THAY ĐỔI
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-outline-variant/25 px-6 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                HUỶ
              </button>
            </div>
          </>
        )}
      </div>

      {/* Account info (read-only) */}
      <div>
        <SectionLabel icon="manage_accounts">Thông tin tài khoản</SectionLabel>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ReadField label="Tên đăng nhập" value={user?.username} />
          <ReadField label="Email" value={user?.email} />
          <ReadField label="Trạng thái xác thực" value={user?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'} />
          <ReadField label="Ngày tham gia" value={user?.createdAt ? formatDate(user.createdAt) : null} />
        </div>
        <p className="mt-4 font-body-md text-xs text-on-surface-variant/40">
          Để thay đổi email hoặc mật khẩu, vui lòng liên hệ hỗ trợ.
        </p>
      </div>
    </div>
  )
}

// ─── SecurityTab ─────────────────────────────────────────────────────────────

function ChangePasswordPanel({ user, onClose }) {
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSendOtp = async () => {
    if (cooldown > 0 || sending) return
    setSending(true)
    setError('')
    try {
      await authService.sendOtp({ email: user.email, purpose: 'RESET_PASSWORD' })
      setSent(true)
      setCooldown(60)
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: user.email, purpose: 'RESET_PASSWORD' } })
      }, 1200)
    } catch (err) {
      if (err?.data?.code === 6006) {
        setError('Vui lòng đợi 1 phút trước khi gửi lại mã.')
        setCooldown(60)
      } else {
        setError(err?.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border border-primary/20 bg-surface-container p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-primary/10">
            <span className="material-symbols-outlined text-[18px] text-primary">key</span>
          </div>
          <div>
            <p className="font-body-md text-sm font-medium text-on-surface">Thay đổi mật khẩu qua email</p>
            <p className="mt-0.5 font-body-md text-xs text-on-surface-variant/70">
              Mã OTP sẽ được gửi đến <span className="text-primary">{user?.email}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 text-on-surface-variant/40 transition-colors hover:text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Steps */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { step: '01', label: 'Nhận mã OTP', icon: 'mail',       active: !sent },
          { step: '02', label: 'Xác thực mã', icon: 'pin',        active: false },
          { step: '03', label: 'Mật khẩu mới', icon: 'lock_reset', active: false },
        ].map(({ step, label, icon, active }) => (
          <div key={step} className={`border p-3 text-center transition-colors ${sent && step === '01' ? 'border-primary/30 bg-primary/5' : active ? 'border-primary/40' : 'border-outline-variant/10'}`}>
            <span className={`material-symbols-outlined text-[18px] ${sent && step === '01' ? 'text-primary' : active ? 'text-primary/60' : 'text-on-surface-variant/25'}`}>{icon}</span>
            <p className={`mt-1 font-label-caps text-[8px] tracking-[0.2em] ${active || (sent && step === '01') ? 'text-primary/70' : 'text-on-surface-variant/30'}`}>{step}</p>
            <p className={`font-body-md text-[11px] ${active || (sent && step === '01') ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>{label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3 border border-red-500/25 bg-red-500/8 px-4 py-3">
          <span className="material-symbols-outlined text-[15px] text-red-400">error</span>
          <p className="font-body-md text-sm text-red-300">{error}</p>
        </div>
      )}

      {sent ? (
        <div className="flex items-center gap-3 border border-primary/25 bg-primary/8 px-4 py-3">
          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
          <p className="font-body-md text-sm text-primary">Mã OTP đã được gửi. Đang chuyển hướng...</p>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sending || cooldown > 0}
            className="flex items-center gap-2 border border-primary px-5 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                ĐANG GỬI...
              </>
            ) : cooldown > 0 ? (
              <>
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                GỬI LẠI SAU {cooldown}S
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[14px]">send</span>
                GỬI MÃ XÁC THỰC
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-outline-variant/25 px-5 py-2.5 font-label-caps text-[9px] tracking-[0.2em] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            HUỶ
          </button>
        </div>
      )}
    </div>
  )
}

function SecurityTab({ user }) {
  const [changingPassword, setChangingPassword] = useState(false)

  const securityItems = [
    {
      id: 'change-password',
      icon: 'lock_reset',
      label: 'Đổi mật khẩu',
      description: 'Thay đổi mật khẩu đăng nhập của bạn',
      action: () => setChangingPassword(true),
    },
  ]

  const statusItems = [
    { icon: 'verified_user',  label: 'Trạng thái tài khoản', value: user?.isActive  ? 'Đang hoạt động' : 'Bị khoá',          ok: user?.isActive },
    { icon: 'mark_email_read', label: 'Xác thực email',       value: user?.isVerified ? 'Đã xác thực'   : 'Chưa xác thực',    ok: user?.isVerified },
  ]

  return (
    <div className="space-y-10">
      {/* Lựa chọn bảo mật */}
      <div>
        <SectionLabel icon="lock">Bảo mật</SectionLabel>
        <div className="space-y-3">
          {securityItems.map((item) => (
            <div key={item.id}>
              {/* Option row */}
              <button
                type="button"
                onClick={item.action}
                disabled={changingPassword}
                className={`group flex w-full items-center justify-between border px-5 py-4 text-left transition-all duration-200 ${
                  changingPassword
                    ? 'border-primary/20 bg-primary/5 cursor-default'
                    : 'border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center transition-colors ${changingPassword ? 'bg-primary/10' : 'bg-surface-container-high group-hover:bg-primary/10'}`}>
                    <span className={`material-symbols-outlined text-[18px] transition-colors ${changingPassword ? 'text-primary' : 'text-on-surface-variant/50 group-hover:text-primary'}`}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-body-md text-sm font-medium text-on-surface">{item.label}</p>
                    <p className="font-body-md text-xs text-on-surface-variant/60">{item.description}</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-[18px] transition-all duration-200 ${changingPassword ? 'rotate-90 text-primary' : 'text-on-surface-variant/30 group-hover:text-primary'}`}>
                  chevron_right
                </span>
              </button>

              {/* Expandable panel */}
              {changingPassword && (
                <ChangePasswordPanel user={user} onClose={() => setChangingPassword(false)} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trạng thái bảo mật */}
      <div>
        <SectionLabel icon="security">Trạng thái tài khoản</SectionLabel>
        <div className="space-y-3">
          {statusItems.map(({ icon, label, value, ok }) => (
            <div key={label} className="flex items-center justify-between border border-outline-variant/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant/50">{icon}</span>
                <p className="font-body-md text-sm text-on-surface-variant">{label}</p>
              </div>
              <span className={`flex items-center gap-1.5 font-label-caps text-[9px] tracking-[0.15em] ${ok ? 'text-primary' : 'text-amber-400'}`}>
                <span className="material-symbols-outlined text-[12px]">{ok ? 'check_circle' : 'warning'}</span>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Profile page ────────────────────────────────────────────────────────

const TABS = [
  { id: 'info',     label: 'Thông tin cá nhân', icon: 'person' },
  { id: 'address',  label: 'Địa chỉ giao hàng',  icon: 'location_on' },
  { id: 'security', label: 'Bảo mật',             icon: 'lock' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { isAuthenticated, user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState('info')

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-8 pb-section-gap-desktop pt-32 md:px-[80px]">
          <div className="py-24 text-center">
            <span className="material-symbols-outlined mb-6 block text-5xl text-on-surface-variant/20">person_off</span>
            <p className="font-headline-sm text-headline-sm text-on-surface">Vui lòng đăng nhập</p>
            <p className="mt-3 font-body-md text-sm text-on-surface-variant">Bạn cần đăng nhập để xem thông tin cá nhân.</p>
            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: '/profile' } })}
              className="mt-8 inline-block border border-primary px-8 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
            >
              ĐĂNG NHẬP
            </button>
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

        {/* Header */}
        <header className="mb-12 text-center">
          <p className="font-label-caps text-[10px] tracking-[0.3em] text-primary">MY ACCOUNT</p>
          <h1 className="mt-4 font-headline-md text-headline-md italic text-on-surface">Hồ sơ cá nhân</h1>
          <p className="mt-3 font-body-md text-sm text-on-surface-variant">
            Quản lý thông tin tài khoản của bạn
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            {/* Avatar + name */}
            <div className="mb-6 border border-outline-variant/10 bg-surface-container-low p-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border border-primary/30 bg-primary/8">
                <span className="material-symbols-outlined text-[36px] text-primary/60">person</span>
              </div>
              <p className="font-body-md text-sm font-medium text-on-surface">{user?.fullName || user?.username}</p>
              <p className="mt-0.5 font-body-md text-xs text-on-surface-variant/60">{user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 border border-primary/30 bg-primary/8 px-3 py-1">
                <span className="material-symbols-outlined text-[12px] text-primary">stars</span>
                <span className="font-label-caps text-[9px] tracking-[0.2em] text-primary">
                  {user?.loyaltyPoints ?? 0} điểm
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div className="border border-outline-variant/10 bg-surface-container-low">
              <div className="border-b border-outline-variant/10 px-4 py-3">
                <p className="font-label-caps text-[8px] tracking-[0.3em] text-on-surface-variant/50">ĐIỀU HƯỚNG</p>
              </div>
              <nav className="p-2">
                {[
                  { to: '/orders', icon: 'receipt_long', label: 'Đơn hàng của tôi' },
                  { to: '/wishlist', icon: 'favorite', label: 'Sản phẩm yêu thích' },
                  { to: '/cart', icon: 'shopping_bag', label: 'Giỏ hàng' },
                ].map(({ to, icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 rounded px-3 py-2.5 font-body-md text-sm text-on-surface-variant transition-all duration-150 hover:bg-surface-container-high hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">{icon}</span>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-9">
            {/* Tabs */}
            <div className="mb-8 flex gap-0 border-b border-outline-variant/10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-6 py-4 font-label-caps text-[9px] tracking-[0.2em] transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant/60 hover:border-outline-variant/30 hover:text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="border border-outline-variant/10 bg-surface-container-low p-8">
              {activeTab === 'info' && (
                <InfoTab user={user} onUserUpdated={handleUserUpdated} />
              )}
              {activeTab === 'address' && (
                <AddressTab userId={user.id} />
              )}
              {activeTab === 'security' && (
                <SecurityTab user={user} />
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
