import { useEffect, useMemo, useState } from 'react'

const AUTH_USER_KEY = 'auth_user'

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedUser = window.localStorage.getItem(AUTH_USER_KEY)
  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

function getDisplayName(user) {
  return user?.fullName || user?.username || user?.email || ''
}

export default function useAuth() {
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== AUTH_USER_KEY) {
        return
      }

      setUser(readStoredUser())
    }

    window.addEventListener('storage', handleStorageChange)

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const authState = useMemo(() => ({
    user,
    displayName: getDisplayName(user),
    isAuthenticated: Boolean(user),
    setUser(nextUser) {
      setUser(nextUser)
      if (typeof window !== 'undefined') {
        if (nextUser) {
          window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
        } else {
          window.localStorage.removeItem(AUTH_USER_KEY)
        }
      }
    },
    logout() {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth_access_token')
        window.localStorage.removeItem('auth_token_type')
        window.localStorage.removeItem(AUTH_USER_KEY)
      }

      setUser(null)
    },
  }), [user])

  return authState
}
