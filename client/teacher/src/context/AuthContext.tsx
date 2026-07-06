import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../models/User'
import type { LoginPayload } from '../models/Auth'
import { login as loginRequest, me as meRequest, logout as logoutRequest } from '../api/auth.api'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (payload: LoginPayload) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount — uses HTTP‑only cookie (credentials: 'include')
  useEffect(() => {
    meRequest()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback(async (payload: LoginPayload) => {
    const loggedInUser = await loginRequest(payload)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const signOut = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
