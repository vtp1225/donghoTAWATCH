import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { Headers } from '../../layouts/AuthLayout.jsx'
import AuthSocialButton from '../../components/auth/AuthSocialButton.jsx'
import { authService } from '../../services/authService.js'
import { cartService } from '../../services/cartService.js'

const googleIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const initialForm = {
  username: '',
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  birthday: '',
}

function validate(form) {
  const errors = {}
  if (!form.username.trim()) {
    errors.username = 'Vui lòng nhập tên đăng nhập.'
  } else if (form.username.trim().length < 3) {
    errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự.'
  } else if (!/^[a-zA-Z0-9._]+$/.test(form.username.trim())) {
    errors.username = 'Chỉ dùng chữ cái, số, dấu chấm hoặc gạch dưới.'
  }
  if (!form.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên.'
  }
  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập địa chỉ email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Địa chỉ email không hợp lệ.'
  }
  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu.'
  } else if (form.password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự.'
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp.'
  }
  if (form.phone && !/^(0|\+84)[0-9]{9}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ.'
  }
  if (form.birthday) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const birthDate = new Date(form.birthday)
    if (birthDate > today) {
      errors.birthday = 'Ngày sinh không hợp lệ (thuộc tương lai).'
    }
  }
  return errors
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1 font-body-md text-xs text-red-400">{message}</p>
}

function PasswordInput({ id, name, value, onChange, onBlur, placeholder, autoComplete, label, error, touched }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative flex flex-col">
      <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`w-full border-0 border-b bg-transparent px-0 py-2 font-body-md text-on-surface placeholder:text-white/30 focus:ring-0 transition-colors ${touched && error ? 'border-red-400' : 'border-white/30 focus:border-primary'}`}
          name={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
        />
        <button
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-primary"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          <span className="material-symbols-outlined text-[18px]">{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      </div>
      {touched && <FieldError message={error} />}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const gearRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gearRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      gearRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (touched[name]) {
        setFieldErrors((errs) => ({ ...errs, ...validate(next) }))
      }
      return next
    })
    setServerError('')
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors(validate(formData))
  }

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsSubmitting(true)
    setServerError('')
    try {
      const authResponse = await authService.googleLogin(tokenResponse.access_token)
      if (authResponse?.accessToken) localStorage.setItem('auth_access_token', authResponse.accessToken)
      if (authResponse?.tokenType) localStorage.setItem('auth_token_type', authResponse.tokenType)
      if (authResponse?.user) localStorage.setItem('auth_user', JSON.stringify(authResponse.user))

      const sessionId = localStorage.getItem('cart_session_id');
      if (sessionId && authResponse?.user?.id) {
        try {
          await cartService.mergeCart(sessionId, authResponse.user.id);
          window.dispatchEvent(new Event('cart:updated'));
        } catch (err) {
          console.error('Failed to merge cart', err);
        }
      }

      navigate('/', { replace: true })
    } catch (error) {
      setServerError(error.message || 'Đăng ký Google thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setServerError('Đăng ký Google bị huỷ hoặc thất bại.'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(initialForm).map((k) => [k, true]))
    setTouched(allTouched)
    const errors = validate(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)
    setServerError('')

    try {
      await authService.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || undefined,
        birthday: formData.birthday || null,
      })
    } catch (error) {
      const msg = (error?.message || '').toLowerCase()
      if (msg.includes('username')) {
        setServerError('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.')
      } else if (msg.includes('email')) {
        setServerError('Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.')
      } else {
        setServerError(error?.message || 'Không thể tạo tài khoản. Vui lòng thử lại.')
      }
      setIsSubmitting(false)
      return
    }

    try {
      await authService.sendOtp({ email: formData.email, purpose: 'VERIFY_EMAIL' })
    } catch {
      // register thành công, tiếp tục sang trang verify
    }

    navigate('/verify-otp', {
      replace: true,
      state: { email: formData.email, purpose: 'VERIFY_EMAIL' },
    })
  }

  const inputClass = (field) =>
    `w-full border-0 border-b bg-transparent px-0 py-2 font-body-md text-on-surface placeholder:text-white/30 focus:ring-0 transition-colors ${touched[field] && fieldErrors[field] ? 'border-red-400' : 'border-white/30 focus:border-primary'}`

  return (
    <div className="relative bg-background font-body-md text-on-surface min-h-screen">
      {/* Full Background Image */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          className="absolute inset-0 h-full w-full object-cover brightness-75 grayscale-[0.2]"
          src="images/product-skeleton.jpg"
          alt="Watch background"
        />
      </div>

      {/* Gear background */}
      <div className="gear-overlay fixed inset-0 z-0 flex items-center justify-center overflow-hidden opacity-20 pointer-events-none">
        <span ref={gearRef} className="material-symbols-outlined text-[600px] animate-[spin_60s_linear_infinite] text-primary/30">
          settings
        </span>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-[560px] overflow-hidden border border-white/20 bg-white/90 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          
          {/* Form Container */}
          <div className="flex flex-col justify-center p-10 md:p-12">
            <Headers />

            <div className="mb-8">
              <h2 className="mb-2 font-headline-md text-headline-md text-primary">Tạo tài khoản</h2>
              <p className="font-body-md text-sm text-on-surface-variant">Đăng ký để sở hữu nhiều ưu đãi độc quyền.</p>
            </div>

            {serverError && (
              <div
                className="mb-6 border border-red-500 bg-red-500/20 px-4 py-3 text-sm font-medium text-red-500"
                role="alert"
                aria-live="assertive"
              >
                {serverError}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <div className="relative flex flex-col">
                <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="username">
                  TÊN ĐĂNG NHẬP <span className="text-primary">*</span>
                </label>
                <input
                  id="username"
                  className={inputClass('username')}
                  name="username"
                  type="text"
                  placeholder="vd: alexander.vance"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.username && <FieldError message={fieldErrors.username} />}
              </div>

              {/* Full Name */}
              <div className="relative flex flex-col">
                <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="fullName">
                  HỌ VÀ TÊN <span className="text-primary">*</span>
                </label>
                <input
                  id="fullName"
                  className={inputClass('fullName')}
                  name="fullName"
                  type="text"
                  placeholder="vd:Nguyễn Văn A"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.fullName && <FieldError message={fieldErrors.fullName} />}
              </div>

              {/* Email */}
              <div className="relative flex flex-col">
                <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
                  ĐỊA CHỈ EMAIL <span className="text-primary">*</span>
                </label>
                <input
                  id="email"
                  className={inputClass('email')}
                  name="email"
                  type="email"
                  placeholder="vd: ten@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && <FieldError message={fieldErrors.email} />}
              </div>

              {/* Password */}
              <PasswordInput
                id="password"
                name="password"
                label={<>MẬT KHẨU <span className="text-primary">*</span></>}
                placeholder="Ít nhất 8 ký tự"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.password}
                touched={touched.password}
              />

              {/* Confirm Password */}
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label={<>XÁC NHẬN MẬT KHẨU <span className="text-primary">*</span></>}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={fieldErrors.confirmPassword}
                touched={touched.confirmPassword}
              />

              {/* Phone + Birthday row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="phone">
                    SỐ ĐIỆN THOẠI
                  </label>
                  <input
                    id="phone"
                    className={inputClass('phone')}
                    name="phone"
                    type="tel"
                    placeholder="vd: 0901234567"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.phone && <FieldError message={fieldErrors.phone} />}
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="birthday">
                    NGÀY SINH
                  </label>
                  <input
                    id="birthday"
                    className={inputClass('birthday')}
                    name="birthday"
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    autoComplete="bday"
                    value={formData.birthday}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.birthday && <FieldError message={fieldErrors.birthday} />}
                </div>
              </div>

              {/* Submit */}
              <div className="space-y-4 pt-2">
                <button
                  className="gold-border-button group relative w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 tracking-widest">
                    {isSubmitting ? 'ĐANG TẠO TÀI KHOẢN...' : 'TẠO TÀI KHOẢN'}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
                </button>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="font-label-caps text-[10px] text-on-surface-variant">HOẶC ĐĂNG KÝ VỚI</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <AuthSocialButton icon={googleIcon} onClick={() => googleLogin()}>
                  ĐĂNG KÝ VỚI GOOGLE
                </AuthSocialButton>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="font-body-md text-sm text-on-surface-variant">
                Đã có tài khoản?
                <Link
                  className="ml-1 font-semibold text-primary underline-offset-4 transition-all hover:text-primary-container hover:underline"
                  to="/login"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
