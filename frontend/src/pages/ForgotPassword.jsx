import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Logo from '../components/Logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (Desktop Branding) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex-col justify-between p-14">
        <Logo size={48} />

        <div className="my-auto py-12">
          <h2
            className="text-[2.75rem] font-bold text-gray-900 leading-tight mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Recover your account,<br />stay on track.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Don't worry — it happens to the best of us. Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>

        <p className="text-xs text-gray-400">© 2026 Centsible. All rights reserved.</p>
      </div>

      {/* ── Right panel (Form Content) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size={38} />
          </div>

          {!submitted ? (
            <>
              <h1
                className="text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Forgot password? 🔒
              </h1>
              <p className="text-gray-500 text-[15px] mb-8">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-[15px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-[15px] shadow-sm"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                </button>
              </form>

              <div className="text-center mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition"
                >
                  <span>←</span> Back to login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <h1
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Check your inbox
              </h1>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
                If an account exists for <span className="font-semibold text-gray-800">{email}</span>, we've sent a password reset link.
              </p>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left mb-6">
                <p className="text-xs text-amber-800 font-semibold mb-1">⏱ Link expires in 1 hour</p>
                <p className="text-xs text-amber-700">Be sure to check your spam or junk folder if you don't see it in a few minutes.</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 font-medium transition"
                >
                  Didn't get the email? Try again
                </button>
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition shadow-sm text-sm"
                >
                  Back to login →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
