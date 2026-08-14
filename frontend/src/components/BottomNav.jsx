import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/transactions', icon: '💳', label: 'Transactions' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
              isActive ? 'text-emerald-500' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
