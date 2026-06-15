import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import { authService } from '../../services/authService.js'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'Ít nhất 8 ký tự', ok: password.length >= 8 },
    { label: 'Có chữ hoa', ok: /[A-Z]/.test(password) },
    { label: 'Có chữ số', ok: /\d/.test(password) },
  ]
  const score = checks.filter((c) => c.ok).length

  const bar = score === 0 ? null : score === 1
    ? { w: 'w-1/3', color: 'bg-red-400', label: 'Yếu' }
    : score === 2
    ? { w: 'w-2/3', color: 'bg-amber-400', label: 'Trung bình' }
    : { w: 'w-full', color: 'bg-primary', label: 'Mạnh' }

  if (!password) return null

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="h-1 flex-1 overflow-hidden bg-outline-variant/15">
          <div className={`h-full transition-all duration-500 ${bar?.w ?? 'w-0'} ${bar?.color ?? ''}`} />
        </div>
        {bar && <span className={`ml-3 font-label-caps text-[9px] tracking-[0.2em] ${bar.color.replace('bg-', 'text-')}`}>{bar.label}</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={`flex items-center gap-1 font-body-md text-[11px] ${c.ok ? 'text-primary' : 'text-on-surface-variant/40'}`}>
            <span className="material-symbols-outlined text-[11px]">{c.ok ? 'check_circle' : 'radio_button_unchecked'}</span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const stateToken = location.state?.resetToken || ''
  const [resetToken, setResetToken] = useState(stateToken)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const qToken = params.get('token')
    if (!resetToken && qToken) setResetToken(qToken)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.')
      return
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    if (!resetToken) {
      setError('Token đặt lại mật khẩu không hợp lệ. Vui lòng thực hiện lại quy trình.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({ resetToken, newPassword: password })
      setDone(true)
    } catch (err) {
      const code = err?.data?.code
      if (code === 6007) {
        setError('Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.')
      } else {
        setError(err?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.')
      }
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

          {!done ? (
            <>
              <header className="mb-10">
                <p className="mb-2 font-label-caps text-[10px] tracking-[0.35em] text-on-surface-variant/60 uppercase">
                  Đặt lại mật khẩu
                </p>
                <h1 className="font-headline-md text-headline-md text-primary">Mật khẩu mới</h1>
                <div className="mt-3 h-px w-full origin-left bg-primary/40" />
              </header>

              <p className="mb-8 font-body-md text-sm text-on-surface-variant">
                Chọn mật khẩu mới bảo mật cho tài khoản của bạn.
              </p>

              {error && (
                <div className="mb-6 flex items-start gap-3 border border-red-500/25 bg-red-500/8 px-4 py-3">
                  <span className="material-symbols-outlined mt-0.5 text-[15px] text-red-400">error</span>
                  <span className="font-body-md text-sm text-red-300">{error}</span>
                </div>
              )}

              <form className="space-y-7" onSubmit={handleSubmit}>
                {/* New password */}
                <div>
                  <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60">
                    Mật khẩu mới <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      required
                      placeholder="••••••••"
                      className="w-full border-b border-outline-variant/25 bg-transparent py-3 pr-10 font-body-md text-sm text-on-surface outline-none transition-colors duration-200 placeholder:text-on-surface-variant/30 focus:border-primary"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors hover:text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[18px]">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                {/* Confirm password */}
                <div>
                  <label className="mb-2 block font-label-caps text-[9px] tracking-[0.3em] uppercase text-on-surface-variant/60">
                    Xác nhận mật khẩu <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError('') }}
                      required
                      placeholder="••••••••"
                      className={`w-full border-b bg-transparent py-3 pr-10 font-body-md text-sm text-on-surface outline-none transition-colors duration-200 placeholder:text-on-surface-variant/30 focus:border-primary ${
                        confirm && confirm !== password
                          ? 'border-red-400/50'
                          : confirm && confirm === password
                          ? 'border-primary/50'
                          : 'border-outline-variant/25'
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40 transition-colors hover:text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[18px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="mt-2 flex items-center gap-1 font-body-md text-[11px] text-red-400">
                      <span className="material-symbols-outlined text-[11px]">error</span>
                      Mật khẩu không khớp
                    </p>
                  )}
                  {confirm && confirm === password && (
                    <p className="mt-2 flex items-center gap-1 font-body-md text-[11px] text-primary">
                      <span className="material-symbols-outlined text-[11px]">check_circle</span>
                      Mật khẩu khớp
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="gold-border-button group relative w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                        Đặt lại mật khẩu
                      </>
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
            </>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center border border-primary/30 bg-primary/10">
                  <span className="material-symbols-outlined text-[40px] text-primary">check_circle</span>
                </div>
              </div>
              <p className="mb-2 font-label-caps text-[10px] tracking-[0.35em] text-primary uppercase">Hoàn tất</p>
              <h2 className="mb-4 font-headline-md text-headline-md text-on-surface">Mật khẩu đã được cập nhật</h2>
              <p className="mb-10 font-body-md text-sm text-on-surface-variant">
                Mật khẩu của bạn đã được thay đổi thành công. Vui lòng đăng nhập lại.
              </p>
              <Link
                to="/login"
                className="inline-block border border-primary px-10 py-4 font-label-caps text-[10px] tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-background"
              >
                ĐĂNG NHẬP NGAY
              </Link>
            </div>
          )}
        </div>
      </section>
    </AuthLayout>
  )
}
