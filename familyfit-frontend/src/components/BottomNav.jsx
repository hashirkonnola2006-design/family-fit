import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, ShoppingCart, Sparkles, Settings } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/recipes',   label: 'Recipes',   icon: Utensils },
  { path: '/grocery',   label: 'Grocery',   icon: ShoppingCart },
  { path: '/tips',      label: 'Wellness',  icon: Sparkles },
  { path: '/profile',   label: 'Settings',  icon: Settings },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isDark } = useTheme() || {}

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t transition-colors"
      style={{
        background: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderColor: isDark ? '#1E293B' : '#E5EBE5',
        boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(0,0,0,0.05)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
        paddingTop: 6,
      }}
    >
      <nav className="flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === '/dashboard' && (pathname === '/' || pathname === '/home'))
          const IconComponent = item.icon

          const activeColor = isDark ? '#86EFAC' : '#2E5F3E'
          const activeBg = isDark ? 'rgba(46, 95, 62, 0.35)' : '#EAF3EB'
          const inactiveColor = isDark ? '#94A3B8' : '#5A6E60'

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              style={{
                color: isActive ? activeColor : inactiveColor,
              }}
              className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl cursor-pointer transition-all duration-200 select-none group"
            >
              {/* Icon Container with Pill highlight when active */}
              <div
                style={{
                  background: isActive ? activeBg : 'transparent',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
                className="flex items-center justify-center px-3.5 py-1 rounded-full transition-all duration-200"
              >
                <IconComponent
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{
                    color: isActive ? activeColor : inactiveColor,
                  }}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? 800 : 600,
                }}
                className="text-[10.5px] tracking-tight leading-tight transition-colors"
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
