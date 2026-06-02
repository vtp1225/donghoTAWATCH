import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Headers } from '../../layouts/AuthLayout.jsx'
import { authService } from '../../services/authService.js'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const stateToken = location.state?.resetToken || ''
  const [resetToken, setResetToken] = useState(stateToken)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // If token not in state, try query param
    const params = new URLSearchParams(window.location.search)
    const qToken = params.get('token')
    if (!resetToken && qToken) setResetToken(qToken)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({ resetToken, newPassword: password })
      navigate('/login', { state: { message: 'Password reset successful. Please sign in.' } })
    } catch (err) {
      setError(err?.message || 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background font-body-md text-on-surface">
      <main className="min-h-screen flex items-center justify-center px-gutter">
        <div className="w-full max-w-md space-y-8 border border-white/5 bg-surface-container-low p-8">
          <Headers />

          <h2 className="font-headline-sm text-headline-sm">Reset Password</h2>
          <p className="text-on-surface-variant">Choose a new strong password for your account.</p>

          {error && <div className="mt-4 rounded border border-red-400/30 bg-red-400/10 p-3 text-red-200">{error}</div>}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-label-caps text-label-caps text-on-surface-variant">New Password</label>
              <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div>
              <label className="block mb-2 font-label-caps text-label-caps text-on-surface-variant">Confirm Password</label>
              <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>

            <div>
              <button className="w-full bg-primary py-3 font-label-caps text-label-caps" type="submit" disabled={loading}>
                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
