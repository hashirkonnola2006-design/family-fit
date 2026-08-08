import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'

const LeafIcon = ({ size = 28, color = "#2E7D32" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill={color} />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/recipes', label: 'Recipes' },
  { path: '/grocery', label: 'Grocery' },
  { path: '/tips', label: 'Tips' },
  { path: '/profile', label: 'Profile' },
]

export default function Header() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const rawName = user?.familyName || family?.name || user?.name || 'Hashir'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Hashir'
  const initial = displayName ? displayName[0].toUpperCase() : 'H'

  return (
    <header
      style={{
        background: isDark ? '#141C2E' : '#FFFFFF',
        borderBottom: `1px solid ${isDark ? '#24324A' : '#EAECE5'}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0 24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <LeafIcon size={28} color="#2E7D32" />
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: isDark ? '#FFFFFF' : '#2E7D32',
              letterSpacing: '-0.4px',
              fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            Family<span style={{ color: '#81C784' }}>Fit</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path))
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? (isDark ? '#81C784' : '#2E7D32') : isDark ? '#94A3B8' : '#4A5568',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '8px 0',
                  transition: 'color 0.15s ease',
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: 2.5,
                      background: '#2E7D32',
                      borderRadius: 2,
                    }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Notification Bell */}
          <button
            onClick={() => alert('No new notifications')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: isDark ? '#1E293B' : '#F6F7F2',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              color: isDark ? '#F8FAFC' : '#212121',
            }}
          >
            <BellIcon />
            <span
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#FF8A00',
              }}
            />
          </button>

          {/* Profile Pill */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '4px 10px 4px 4px',
              borderRadius: 24,
              background: isDark ? '#1E293B' : '#F6F7F2',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#2E7D32',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121', lineHeight: 1.1 }}>
                {displayName} Family
              </span>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                Family Admin
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#64748B' }}>▾</span>
          </div>
        </div>
      </div>
    </header>
  )
}
