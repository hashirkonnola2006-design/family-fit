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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2v6a2 2 0 0 0 4 0V2" />
        <path d="M9 8v14" />
        <path d="M17 2v20" />
        <path d="M14 2c2.5 0 3.5 1.8 3.5 4.5v3.5h-3.5" />
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
        background: isDark ? 'rgba(15, 23, 42, 0.98)' : '#ffffff',
        borderTop: isDark ? '1px solid #1e293b' : '1px solid #f3f4f6',
        borderRadius: '24px 24px 0 0',
        boxShadow: isDark ? '0 -4px 25px rgba(0,0,0,0.4)' : '0 -4px 24px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
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
                ? isDark ? 'rgba(16, 185, 129, 0.2)' : '#e4edd4'
                : 'transparent',
              color: active
                ? isDark ? '#34d399' : '#25451c'
                : isDark ? '#64748b' : '#718096',
              padding: active ? '8px 18px' : '6px 10px',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              fontWeight: active ? 800 : 500,
              fontSize: 11,
              position: 'relative',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {item.icon}
            <span style={{ fontSize: 11, letterSpacing: '-0.1px' }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
