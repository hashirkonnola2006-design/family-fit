import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/recipes',
    label: 'Recipes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v7a3 3 0 0 0 6 0V2" />
        <path d="M9 9v13" />
        <path d="M18 2v20" />
        <path d="M15 2h6" />
      </svg>
    ),
  },
  {
    path: '/grocery',
    label: 'Grocery',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    path: '/tips',
    label: 'Tips',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isDark } = useTheme()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: isDark ? 'rgba(15, 23, 42, 0.97)' : 'white',
        borderTop: isDark ? '1px solid #1e293b' : 'none',
        borderRadius: '24px 24px 0 0',
        boxShadow: isDark ? '0 -4px 25px rgba(0,0,0,0.4)' : '0 -4px 25px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
        boxSizing: 'border-box',
        zIndex: 1000,
        backdropFilter: isDark ? 'blur(16px)' : 'none',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              border: 'none',
              background: active
                ? isDark ? 'rgba(16, 185, 129, 0.18)' : '#eef7d7'
                : 'transparent',
              color: active
                ? isDark ? '#34d399' : '#5e8404'
                : isDark ? '#64748b' : '#8e9e8f',
              padding: '6px 14px',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
              fontWeight: active ? 700 : 500,
              fontSize: 11,
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {active && (
              <span
                style={{
                  position: 'absolute',
                  bottom: -4,
                  width: 18,
                  height: 3,
                  borderRadius: 2,
                  background: isDark ? '#34d399' : '#5e8404',
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
