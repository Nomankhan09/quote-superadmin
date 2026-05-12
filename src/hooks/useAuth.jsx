import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sa_token') || '')
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa_admin') || 'null') } catch { return null }
  })

  const login = (t, a) => {
    localStorage.setItem('sa_token', t)
    localStorage.setItem('sa_admin', JSON.stringify(a))
    setToken(t); setAdmin(a)
  }

  const logout = () => {
    localStorage.removeItem('sa_token')
    localStorage.removeItem('sa_admin')
    setToken(''); setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
