import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Logo from '../components/Logo'

const stats = [
  { icon: '💰', label: 'Average saved per month', value: '€1,240' },
  { icon: '📊', label: 'Spending categories tracked', value: '8 categories' },
  { icon: '🎯', label: 'Users under budget', value: '73% of users' },
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google`
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex-col p-14 justify-between">

        {/* Logo at top */}
        <Logo size={48} />

        {/* Headline in center */}
        <div>
          <h2 className="text-[2.75rem] font-bold text-gray-900 leading-tight mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Take control of<br />your finances.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Track every cent. Understand your habits.<br />
            Build a better financial future.
          </p>
        </div>

        {/* Stat cards at bottom */}
        <div className="flex flex-col gap-3">
          {stats.map((s) => (
            <div key={s.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-white">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{s.label}</p>
                <p className="text-base font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-8 bg-white">

        {/* Mobile logo — centered */}
        <div className="lg:hidden mb-8 flex justify-center">
          <Logo size={44} />
        </div>

        <div className="w-full max-w-[420px]">
          <h1 className="text-[2rem] font-bold text-gray-900 mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-gray-400 mb-8 text-[15px]">Sign in to your account to continue</p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 mb-5"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.9C9.8 39.8 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.7l6.2 5.2C41 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-sm text-gray-400 whitespace-nowrap">or continue with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-[15px]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-[15px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1 text-[15px]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-500 font-semibold hover:text-emerald-600 transition-colors">
              Sign up
            </Link>
          </p>
          </div>
        </div>
      </div>
    
  )
}