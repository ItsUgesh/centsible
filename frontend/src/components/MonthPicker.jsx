import { useState } from 'react'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export default function MonthPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse current YYYY-MM
  const parseDate = (val) => {
    if (!val) {
      const d = new Date()
      return { year: d.getFullYear(), month: d.getMonth() }
    }
    const [y, m] = val.split('-')
    return { year: parseInt(y, 10), month: parseInt(m, 10) - 1 }
  }

  const { year: selectedYear, month: selectedMonth } = parseDate(value)
  const [viewYear, setViewYear] = useState(selectedYear)

  const handleSelect = (monthIndex) => {
    const formatted = `${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`
    onChange(formatted)
    setIsOpen(false)
  }

  const handleThisMonth = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    setViewYear(y)
    onChange(`${y}-${String(m + 1).padStart(2, '0')}`)
    setIsOpen(false)
  }

  const displayLabel = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`
  const now = new Date()
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth()

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setViewYear(selectedYear)
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white transition shadow-sm"
      >
        <span className="font-medium">{displayLabel}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Dropdown Modal Card */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 z-30 animate-in fade-in zoom-in-95 duration-150">
            {/* Year Header Selector */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-50">
              <button
                type="button"
                onClick={() => setViewYear(viewYear - 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                title="Previous year"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="text-base font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {viewYear}
              </span>

              <button
                type="button"
                onClick={() => setViewYear(viewYear + 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                title="Next year"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Months 3x4 Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {MONTHS.map((monthName, idx) => {
                const isSelected = selectedYear === viewYear && selectedMonth === idx
                const isNow = now.getFullYear() === viewYear && now.getMonth() === idx

                return (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-sm'
                        : isNow
                        ? 'bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {monthName}
                    {isNow && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick action footer */}
            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleThisMonth}
                className={`font-semibold transition ${
                  isCurrentMonth ? 'text-gray-400 cursor-default' : 'text-emerald-500 hover:text-emerald-600'
                }`}
              >
                Current month
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
