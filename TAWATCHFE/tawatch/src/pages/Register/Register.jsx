import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import AuthFormField from '../../components/auth/AuthFormField.jsx'
import AuthSocialButton from '../../components/auth/AuthSocialButton.jsx'
import { authService } from '../../services/authService.js'

const initialForm = {
  username: '',
  fullName: '',
  email: '',
  password: '',
  phone: '',
  birthday: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const username = formData.username.trim()
    if (!username) {
      setErrorMessage('Vui lòng nhập username.')
      setIsSubmitting(false)
      return
    }

    // Step 1: register
    try {
      await authService.register({
        username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        birthday: formData.birthday || null,
      })
    } catch (error) {
      const msg = (error?.message || '').toLowerCase()
      if (msg.includes('username') || (msg.includes('duplicate') && msg.includes('username'))) {
        setErrorMessage('Username này đã được sử dụng. Vui lòng chọn username khác.')
      } else if (msg.includes('duplicate') && msg.includes('email')) {
        setErrorMessage('Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.')
      } else {
        setErrorMessage(error?.message || 'Không thể tạo tài khoản. Vui lòng thử lại.')
      }
      setIsSubmitting(false)
      return
    }

    // Step 2: send OTP (separate catch — register đã thành công)
    try {
      setSuccessMessage('Tạo tài khoản thành công. Đang gửi mã xác thực...')
      await authService.sendOtp({ email: formData.email, purpose: 'VERIFY_EMAIL' })
      navigate('/verify-otp', {
        replace: true,
        state: { email: formData.email, purpose: 'VERIFY_EMAIL' },
      })
    } catch {
      // Register thành công nhưng gửi OTP lỗi → vẫn cho qua trang verify
      navigate('/verify-otp', {
        replace: true,
        state: { email: formData.email, purpose: 'VERIFY_EMAIL' },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="absolute inset-0 z-0 hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-right bg-no-repeat" style={{ backgroundImage: "url('/images/hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col items-center px-gutter py-12 lg:flex-row lg:items-start lg:px-[80px] lg:py-20">
        <div className="w-full max-w-md border border-outline-variant/10 bg-surface-container-low/40 p-8 shadow-2xl backdrop-blur-md lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
          <header className="mb-12">
            <h1 className="mb-2 font-headline-md text-headline-md text-primary">Đăng ký tài khoản</h1>
            <div className="mb-4 h-px w-full origin-left bg-primary/40" />
            <p className="font-body-md text-on-surface-variant">Đăng ký tài khoản để sở hữu nhiều ưu đãi của chúng tôi</p>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {(successMessage || errorMessage) && (
              <div
                className={`border px-4 py-3 text-sm ${errorMessage ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-primary/30 bg-primary/10 text-primary'}`}
                role="status"
                aria-live="polite"
              >
                {errorMessage || successMessage}
              </div>
            )}

            <AuthFormField
              label="Username"
              name="username"
              type="text"
              placeholder="alexander.vance"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <AuthFormField
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="ALEXANDER VANCE"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <AuthFormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="PRECISION@TAWATCH.COM"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <AuthFormField
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <AuthFormField
              label="Phone"
              name="phone"
              type="tel"
              placeholder="0123456789"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
            />

            <AuthFormField
              label="Birthday"
              name="birthday"
              type="date"
              placeholder=""
              autoComplete="bday"
              value={formData.birthday}
              onChange={handleChange}
            />

            <div className="pt-4">
              <button
                className="gold-border-button group relative w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface"
                type="submit"
                disabled={isSubmitting}
              >
                <span className="relative z-10 tracking-widest">{isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}</span>
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-outline-variant/30" />
              <span className="font-label-caps text-[10px] text-on-surface-variant/50">OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-outline-variant/30" />
            </div>

            <AuthSocialButton
              icon={(
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
            >
              SIGN UP WITH GOOGLE
            </AuthSocialButton>

            <p className="pt-4 text-center font-label-caps text-[11px] text-on-surface-variant">
              Already a member?
              {' '}
              <Link className="ml-1 text-primary underline underline-offset-4 transition-colors hover:text-primary-container" to="/login">
                SIGN IN
              </Link>
            </p>
          </form>
        </div>
      </section>
    </AuthLayout>
  )
}
