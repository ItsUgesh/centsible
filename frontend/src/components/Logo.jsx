import { useId } from 'react'

function Logo({ size = 40, showText = true, dark = false }) {
  const uid = useId().replace(/:/g, '')
  const gradId = `lg-${uid}`
  const fontSize = Math.round(size * 0.45)

  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Filled gradient coin */}
        <circle cx="22" cy="22" r="21" fill={`url(#${gradId})`} />

        {/* Outer coin rim */}
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

        {/* Inner coin ring */}
        <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Main C — thick outer sweep */}
        <path
          d="M 29 10 C 22 6 10 8 8 18 C 6 27 13 36 23 37 C 27 38 31 36 33 31"
          stroke="white"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner arc — layered spiral depth */}
        <path
          d="M 27 13 C 22 10 14 11 12 19 C 10 26 15 34 23 35"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top cursive curl */}
        <path
          d="M 29 10 C 32 7 36 9 34 14"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bottom cursive curl */}
        <path
          d="M 33 31 C 36 35 35 38 31 36"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span
          className={`font-bold tracking-tight leading-none ${dark ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: `${fontSize}px` }}
        >
          Centsible
        </span>
      )}
    </div>
  )
}

export default Logo