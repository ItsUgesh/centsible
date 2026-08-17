import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'
import Logo from '../components/Logo'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading') // loading | success | expired | invalid
  const [resendEmail, setResendEmail] = useState('')
  const [resendMsg, setResendMsg] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) { setStatus('invalid'); return }
    api.post('/auth/verify-email', { token })
      .then((res) => {
        // Both fresh verify and already-verified show success
        setStatus('success')
      })
      .catch((err) => {
        const code = err.response?.data?.code
        setStatus(code === 'EXPIRED' ? 'expired' : 'invalid')
      })
  }, [token])

  const handleResend = async (e) => {
    e.preventDefault()
    setResending(true)
    try {
      await api.post('/auth/resend-verification', { email: resendEmail })
      setResendMsg('Verification email sent! Check your inbox.')
    } catch (err) {
      setResendMsg(err.response?.data?.error || 'Something went wrong')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size={40} />
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Verifying your email...</p>
          </>
        )}

        {/* Success — fresh verify OR already verified by spam filter */}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              You're verified!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your email is confirmed and your account is active. You can now log in.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all"
            >
              Go to login →
            </Link>
          </>
        )}

        {/* Expired — link was valid but timed out */}
        {status === 'expired' && (
          <>
            <div className="text-5xl mb-4">⏱️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Link expired
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your verification link has expired. Enter your email below to get a new one.
            </p>
            {!resendMsg ? (
              <form onSubmit={handleResend} className="flex flex-col gap-3 text-left">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  disabled={resending}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl disabled:opacity-60"
                >
                  {resending ? 'Sending...' : 'Resend verification email'}
                </button>
              </form>
            ) : (
              <p className="text-emerald-500 text-sm font-medium">{resendMsg}</p>
            )}
            <Link to="/login" className="block mt-4 text-sm text-gray-400 hover:text-gray-600">
              Back to login
            </Link>
          </>
        )}

        {/* Invalid — token not found */}
        {status === 'invalid' && (
          <>
            <div className="text-5xl mb-4">🔗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Link not recognised
            </h1>
            <p className="text-gray-500 text-sm mb-2">
              This link may have already been used, or your email was already verified.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Try logging in — if it works, you're all set!
            </p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all"
            >
              Try logging in →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
