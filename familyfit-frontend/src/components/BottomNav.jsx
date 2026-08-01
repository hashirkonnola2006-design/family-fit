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
    path: '/plans',
    label: 'Plans',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
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
    path: '/progress',
    label: 'Progress',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="8" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
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
