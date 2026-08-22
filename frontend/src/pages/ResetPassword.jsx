import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Logo from '../components/Logo'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await api.post('/auth/reset-password', { token, password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size={42} />
        </div>

        {!token ? (
          <div>
            <div className="text-5xl mb-4">❌</div>
            <h1
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Invalid Link
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              No reset token was found in the link. Please request a new password reset link.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-sm text-sm"
            >
              Request new link →
            </Link>
          </div>
        ) : success ? (
          <div>
            <div className="text-5xl mb-4">🎉</div>
            <h1
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Password Reset!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-sm text-sm"
            >
              Go to login →
            </Link>
          </div>
        ) : (
          <div className="text-left">
            <h1
              className="text-2xl font-bold text-gray-900 mb-2 text-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Set new password 🔑
            </h1>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Please enter your new password below.
            </p>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-sm shadow-sm"
              >
                {loading ? 'Resetting password...' : 'Reset password'}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="text-xs text-gray-400 hover:text-gray-600 transition">
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
