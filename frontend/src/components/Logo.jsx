function Logo({ size = 40, showText = true, dark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="Centsible logo"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Centsible
          </span>
          <span className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
            Smart money. Daily.
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo