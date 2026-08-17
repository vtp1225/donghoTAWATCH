import './App.css'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.jsx'
import useAuth from './hooks/useAuth.js'
import { loyaltyService } from './services/loyaltyService.js'
import LoyaltyToast from './components/common/LoyaltyToast.jsx'

const TIER_ORDER = { NONE: 0, BRONZE: 1, SILVER: 2, GOLD: 3, DIAMOND: 4 }
const POLL_INTERVAL_MS = 15_000

function LoyaltyChecker() {
  const { isAuthenticated, user } = useAuth()
  const [tierUpInfo, setTierUpInfo] = useState(null)
  const timerRef = useRef(null)

  async function check() {
    if (!user?.id) return
    try {
      const info = await loyaltyService.getLoyaltyInfo(user.id)
      if (info.tier === 'NONE') return
      const key = `loyalty_tier_${user.id}`
      const prev = localStorage.getItem(key) ?? 'NONE'
      if ((TIER_ORDER[info.tier] ?? 0) > (TIER_ORDER[prev] ?? 0)) {
        setTierUpInfo(info)
      }
      localStorage.setItem(key, info.tier)
    } catch {
      // lỗi mạng hoặc chưa có tier — bỏ qua
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      clearInterval(timerRef.current)
      return
    }

    // check ngay khi login / mount
    check()

    // poll định kỳ
    timerRef.current = setInterval(check, POLL_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id])

  return (
    <LoyaltyToast
      info={tierUpInfo}
      onClose={() => setTierUpInfo(null)}
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <LoyaltyChecker />
    </BrowserRouter>
  )
}

export default App
