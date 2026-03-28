import { createContext, useState, useEffect, useCallback } from 'react'
import { getMeApi, logoutApi } from '../api/authApi'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await getMeApi()
      setUser(data.data.user)
    } catch {
      setUser(null)
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) fetchMe()
    else setLoading(false)
  }, [fetchMe])

  const login = (token, userData) => {
    localStorage.setItem('accessToken', token)
    setUser(userData)
  }

  const logout = async () => {
    try { await logoutApi() } catch {}
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}
