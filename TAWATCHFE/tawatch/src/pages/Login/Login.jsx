import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

const initialForm = { email: '', password: '' }

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    email: location.state?.email || '',
  }))
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '')
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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')
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

      const destination = (authResponse?.user?.role === 'ADMIN' || authResponse?.user?.role === 'STAFF')
        ? '/admin'
        : (location.state?.from?.pathname || '/')
      navigate(destination, { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setErrorMessage('Đăng nhập Google bị huỷ hoặc thất bại.'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const authResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      if (authResponse?.accessToken) {
        localStorage.setItem('auth_access_token', authResponse.accessToken)
      }

      if (authResponse?.tokenType) {
        localStorage.setItem('auth_token_type', authResponse.tokenType)
      }
      if (authResponse?.user) {
        localStorage.setItem('auth_user', JSON.stringify(authResponse.user))
      }

      const sessionId = localStorage.getItem('cart_session_id');
      if (sessionId && authResponse?.user?.id) {
        try {
          await cartService.mergeCart(sessionId, authResponse.user.id);
          window.dispatchEvent(new Event('cart:updated'));
        } catch (err) {
          console.error('Failed to merge cart', err);
        }
      }

      setSuccessMessage(`Welcome back, ${authResponse?.user?.fullName || authResponse?.user?.username || authResponse?.user?.email || formData.email}.`)
      const destination = (authResponse?.user?.role === 'ADMIN' || authResponse?.user?.role === 'STAFF')
        ? '/admin'
        : (location.state?.from?.pathname || '/')
      navigate(destination, { replace: true })
    } catch (error) {
      setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu')
    } finally {
      setIsSubmitting(false)
    }
  }

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

      <div className="gear-overlay fixed inset-0 z-0 flex items-center justify-center overflow-hidden opacity-20 pointer-events-none">
        <span ref={gearRef} className="material-symbols-outlined text-[600px] animate-[spin_60s_linear_infinite] text-primary/30">
          settings
        </span>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] overflow-hidden border border-white/0 bg-white/80 shadow-[0_24px_50px_rgba(0,0,0,0.2)]">
          {/* Form Container */}
          <div className="flex flex-col justify-center p-10 md:p-12">
            <Headers />

            <div className="mb-10">
              <h2 className="mb-2 font-headline-md text-headline-md text-primary">Welcome Back</h2>
              <p className="font-body-md text-sm text-on-surface-variant">Access your curated collection and history.</p>
            </div>

            {(successMessage || errorMessage) && (
              <div
                className={`mb-6 border px-4 py-3 text-sm font-medium ${errorMessage ? 'border-red-500 bg-red-500/20 text-red-500' : 'border-primary/30 bg-primary/10 text-primary'}`}
                role="status"
                aria-live="polite"
              >
                {errorMessage || successMessage}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="focus-underline relative flex flex-col">
                <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
                  EMAIL OR USERNAME
                </label>
                <input
                  id="email"
                  className="border-0 border-b border-white/30 bg-transparent px-0 py-2 font-body-md text-on-surface placeholder:text-white/30 focus:ring-0"
                  name="email"
                  type="text"
                  placeholder="name@example.com or username"
                  autoComplete="username"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="focus-underline relative flex flex-col">
                <div className="mb-2 flex items-end justify-between">
                  <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">
                    PASSWORD
                  </label>
                  <Link className="font-label-caps text-[10px] uppercase text-primary transition-colors hover:text-primary-container" to="/forgot-password">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    className="w-full border-0 border-b border-white/30 bg-transparent px-0 py-2 pr-8 font-body-md text-on-surface placeholder:text-white/30 focus:border-primary focus:ring-0 transition-colors"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-primary"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  className="gold-border-button group relative w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 tracking-widest">{isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}</span>
                  <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="font-label-caps text-[10px] text-on-surface-variant">OR CONTINUE WITH</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <AuthSocialButton icon={googleIcon} onClick={() => googleLogin()}>
                  SIGN IN WITH GOOGLE
                </AuthSocialButton>
              </div>
            </form>

            <div className="mt-12 text-center">
              <p className="font-body-md text-sm text-on-surface-variant">
                New to TAWatch?
                <Link
                  className="ml-1 font-semibold text-primary underline-offset-4 transition-all hover:text-primary-container hover:underline"
                  to="/register"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
