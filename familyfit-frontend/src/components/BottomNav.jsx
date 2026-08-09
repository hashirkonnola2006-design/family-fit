import { useNavigate, useLocation } from 'react-router-dom'
import { Home, UtensilsCrossed, ShoppingBag, Lightbulb, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/recipes', label: 'Recipes', icon: UtensilsCrossed },
  { path: '/grocery', label: 'Grocery', icon: ShoppingBag },
  { path: '/tips', label: 'Tips', icon: Lightbulb },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isDark } = useTheme()

  const activeColor = '#2E7D32'
  const inactiveColor = isDark ? '#94A3B8' : '#718096'
  const bgColor = isDark ? 'rgba(15, 23, 42, 0.96)' : '#FFFFFF'
  const borderColor = isDark ? '#1E293B' : '#F0EFE9'

  return (
    <div className="mobile-bottom-nav-container">
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          background: bgColor,
          borderTop: `1px solid ${borderColor}`,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingTop: 8,
          paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path
          const IconComponent = item.icon

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: 16,
                flex: 1,
                maxWidth: 80,
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? activeColor : inactiveColor,
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <IconComponent
                  size={22}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
              </div>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? activeColor : inactiveColor,
                  letterSpacing: '-0.1px',
                  lineHeight: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <style>{`
        /* Show on mobile view, hide on desktop */
        .mobile-bottom-nav-container {
          display: block;
        }

        @media (min-width: 768px) {
          .mobile-bottom-nav-container {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
