import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import { authService } from '../../services/authService.js'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email || ''
  const purpose = location.state?.purpose || 'VERIFY_EMAIL'
const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    timerRef.current = window.setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [cooldown])

  const handleDigitChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    setError('')
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...digits]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  const otpCode = digits.join('')
  const isFilled = otpCode.length === OTP_LENGTH

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFilled) return
    setLoading(true)
    setError('')

    try {
      const res = await authService.verifyOtp({ email, otpCode, purpose })

      if (purpose === 'RESET_PASSWORD' && res?.resetToken) {
        navigate('/reset-password', { replace: true, state: { resetToken: res.resetToken } })
        return
      }

      setSuccess('Xác thực thành công! Đang chuyển hướng...')
      window.setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { message: 'Tài khoản đã được xác thực. Vui lòng đăng nhập.' },
        })
      }, 1500)
    } catch (err) {
      const code = err?.data?.code ?? err?.status
      if (code === 6005) {
        setError('Đã nhập sai quá 5 lần. Vui lòng yêu cầu mã mới.')
      } else if (code === 6001) {
        setError('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại.')
      } else if (code === 6002) {
        setError('Mã OTP đã hết hạn. Vui lòng gửi lại.')
      } else {
        setError(err?.message || 'Mã OTP không chính xác. Vui lòng thử lại.')
      }
      setDigits(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    setError('')
    setSuccess('')
    setDigits(Array(OTP_LENGTH).fill(''))
    inputRefs.current[0]?.focus()

    try {
      const res = await authService.sendOtp({ email, purpose })
      setCooldown(RESEND_COOLDOWN)
      setSuccess('Đã gửi mã mới về email của bạn.')
    } catch (err) {
      if (err?.data?.code === 6006) {
        setError('Vui lòng đợi 1 phút trước khi gửi lại.')
        setCooldown(RESEND_COOLDOWN)
      } else {
        setError(err?.message || 'Không thể gửi lại. Vui lòng thử lại.')
      }
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
              Xác thực tài khoản
            </p>
            <h1 className="font-headline-md text-headline-md text-primary">Nhập mã OTP</h1>
            <div className="mt-3 h-px w-full origin-left bg-primary/40" />
          </header>

          <p className="mb-2 font-body-md text-sm text-on-surface-variant">
            Mã xác thực 6 chữ số đã được gửi đến
          </p>
          <p className="mb-8 font-label-caps text-[12px] tracking-[0.12em] text-primary">
            {email}
          </p>

          {/* Status messages */}
          {error && (
            <div className="mb-6 flex items-center gap-3 border border-red-500/25 bg-red-500/8 px-4 py-3">
              <span className="material-symbols-outlined text-[16px] text-red-400">error</span>
              <span className="font-body-md text-sm text-red-300">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-center gap-3 border border-primary/25 bg-primary/8 px-4 py-3">
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              <span className="font-body-md text-sm text-primary/90">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 6-digit boxes */}
            <div className="mb-8 flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={loading || !!success}
                  className={`h-14 w-12 border bg-transparent text-center font-headline-sm text-xl tracking-widest text-on-surface outline-none transition-all duration-200 focus:border-primary focus:bg-surface-container ${
                    digit ? 'border-primary/50' : 'border-outline-variant/25'
                  } disabled:opacity-50`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isFilled || loading || !!success}
              className="gold-border-button group relative mb-6 w-full overflow-hidden bg-transparent py-4 font-label-caps text-label-caps text-primary transition-all duration-700 ease-out hover:text-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    Đang xác thực...
                  </>
                ) : success ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Thành công
                  </>
                ) : (
                  'Xác nhận'
                )}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-700 ease-out group-hover:translate-x-0" />
            </button>
          </form>

          {/* Resend */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-body-md text-sm text-on-surface-variant/60">Chưa nhận được mã?</span>
            {cooldown > 0 ? (
              <span className="font-label-caps text-[11px] tracking-[0.12em] text-on-surface-variant/40">
                Gửi lại sau {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading || !!success}
                className="font-label-caps text-[11px] tracking-[0.12em] text-primary underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-40"
              >
                Gửi lại
              </button>
            )}
          </div>

          <p className="mt-8 text-center font-label-caps text-[11px] text-on-surface-variant/50">
            Quay lại{' '}
            <Link className="text-primary underline underline-offset-4 transition-colors hover:opacity-75" to="/login">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  )
}
