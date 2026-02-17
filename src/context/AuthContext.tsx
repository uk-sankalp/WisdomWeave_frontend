import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { UserResponse } from '../types'
import * as authApi from '../api/auth'
import * as usersApi from '../api/users'

type AuthContextValue = {
  user: UserResponse | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  )
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const u = await usersApi.me()
      setUser(u)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const { token: t } = await authApi.login({ email, password })
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    const u = await usersApi.me()
    setUser(u)
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await authApi.register({ username, email, password })
      try {
        const { token: t } = await authApi.login({ email, password })
        localStorage.setItem(TOKEN_KEY, t)
        setToken(t)
        const u = await usersApi.me()
        setUser(u)
      } catch {
        throw new Error('ACCOUNT_CREATED_PLEASE_LOGIN')
      }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
