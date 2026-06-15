import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Headers } from '../../layouts/AuthLayout.jsx'
import AuthSocialButton from '../../components/auth/AuthSocialButton.jsx'
import { authService } from '../../services/authService.js'

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

      setSuccessMessage(`Welcome back, ${authResponse?.user?.fullName || authResponse?.user?.username || authResponse?.user?.email || formData.email}.`)
      const destination = authResponse?.user?.role === 'ADMIN'
        ? '/admin'
        : (location.state?.from?.pathname || '/')
      navigate(destination, { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background font-body-md text-on-surface">
      <div className="gear-overlay fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <span ref={gearRef} className="material-symbols-outlined text-[600px] animate-[spin_60s_linear_infinite]">
          settings
        </span>
      </div>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-gutter">
        <div className="grid w-full max-w-[1100px] grid-cols-1 overflow-hidden border border-white/5 bg-surface-container-low md:grid-cols-2">

          {/* Left: image panel */}
          <div className="relative hidden h-full min-h-[600px] md:block">
            <div className="absolute inset-0 z-10 bg-black/40" />
            <img
              className="absolute inset-0 h-full w-full object-cover brightness-75 grayscale-[0.2] transition-transform duration-[20s] hover:scale-110"
              src="images/product-skeleton.jpg"
              alt="Watch movement"
            />
            <div className="absolute bottom-12 left-12 right-12 z-20">
              <p className="mb-4 font-label-caps text-label-caps text-primary">Precision Mastery</p>
              <h2 className="font-headline-md text-headline-md text-white">The Art of Temporal Engineering.</h2>
              <div className="mt-6 h-px w-12 bg-primary" />
            </div>
          </div>

          {/* Right: form */}
          <div className="flex flex-col justify-center bg-surface-container-low p-10 md:p-16 lg:p-20">
            <Headers />

            <div className="mb-10">
              <h2 className="mb-2 font-headline-md text-headline-md text-primary">Welcome Back</h2>
              <p className="font-body-md text-sm text-on-surface-variant">Access your curated collection and history.</p>
            </div>

            {(successMessage || errorMessage) && (
              <div
                className={`mb-6 border px-4 py-3 text-sm ${errorMessage ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-primary/30 bg-primary/10 text-primary'}`}
                role="status"
                aria-live="polite"
              >
                {errorMessage || successMessage}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="focus-underline relative flex flex-col">
                <label className="mb-2 font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  className="border-0 border-b border-white/30 bg-transparent px-0 py-2 font-body-md text-on-surface placeholder:text-white/30 focus:ring-0"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
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
                <input
                  id="password"
                  className="border-0 border-b border-white/30 bg-transparent px-0 py-2 font-body-md text-on-surface placeholder:text-white/30 focus:ring-0"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
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

                <AuthSocialButton icon={googleIcon}>
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

      <div className="fixed bottom-0 left-1/2 z-20 h-32 w-px -translate-x-1/2 bg-primary/30" />
    </div>
  )
}
