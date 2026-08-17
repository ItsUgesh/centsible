import { useLocation, Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function CheckEmail() {
  const { state } = useLocation()
  const email = state?.email || 'your email'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size={40} />
        </div>

        <div className="text-5xl mb-4">📬</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Check your inbox
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          We sent a verification link to <span className="font-semibold text-gray-800">{email}</span>.
          Click the link in the email to activate your account.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-6">
          <p className="text-xs text-amber-700 font-medium mb-1">⏱ Link expires in 24 hours</p>
          <p className="text-xs text-amber-600">Check your spam folder if you don't see it.</p>
        </div>

        <Link
          to="/login"
          className="text-sm text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  )
}
