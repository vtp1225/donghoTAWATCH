import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import { authService } from '../../services/authService.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authService.sendOtp({ email, purpose: 'RESET_PASSWORD' })
      navigate('/verify-otp', {
        replace: true,
        state: { email, purpose: 'RESET_PASSWORD' },
      })
    } catch (err) {
      setError(err?.message || 'Không thể gửi mã. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="absolute inset-0 z-0 hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-right bg-no-repeat" style={{ backgroundImage: "url('/images/hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col items-center justify-center px-gutter py-12 lg:items-start lg:px-[80px]">
        <div className="w-full max-w-md border border-outline-variant/10 bg-surface-container-low/40 p-8 shadow-2xl backdrop-blur-md lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">

          <header className="mb-10">
            <p className="mb-2 font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/60 uppercase">
              Khôi phục tài khoản
            </p>
            <h1 className="font-headline-md text-headline-md text-primary">Quên mật khẩu</h1>
            <div className="mt-3 h-px w-full origin-left bg-primary/40" />
          </header>

          <p className="mb-8 font-body-md text-sm text-on-surface-variant">
            Nhập email đã đăng ký. Chúng tôi sẽ gửi mã OTP để xác thực danh tính.
          </p>

          {error && (
            <div className="mb-6 flex items-center gap-3 border border-red-500/25 bg-red-500/8 px-4 py-3">
              <span className="material-symbols-outlined text-[16px] text-red-400">error</span>
              <span className="font-body-md text-sm text-red-300">{error}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="group relative">
              <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60">
                Email <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full border-b border-outline-variant/25 bg-transparent py-3 font-body-md text-sm text-on-surface outline-none transition-colors duration-200 placeholder:text-on-surface-variant/30 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-border-button group relative w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface disabled:opacity-40"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    Đang gửi...
                  </>
                ) : (
                  'Gửi mã OTP'
                )}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
            </button>
          </form>

          <p className="mt-8 text-center font-label-caps text-[11px] text-on-surface-variant/50">
            Nhớ mật khẩu?{' '}
            <Link className="text-primary underline underline-offset-4 transition-opacity hover:opacity-75" to="/login">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  )
}
