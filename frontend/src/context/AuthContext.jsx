import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in or arriving with OAuth token
  useEffect(() => {
    // Check if token arrived in URL query param from OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('token', urlToken)
      // Clean up URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData, token) => {
    if (token) localStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // Ignore logout API failure
    }
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}