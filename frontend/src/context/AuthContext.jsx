import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('freshfeast_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persistSession = (data) => {
    const userData = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    }
    localStorage.setItem('freshfeast_token', data.token)
    localStorage.setItem('freshfeast_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authApi.login(credentials)
      persistSession(data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authApi.register(payload)
      persistSession(data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('freshfeast_token')
    localStorage.removeItem('freshfeast_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
