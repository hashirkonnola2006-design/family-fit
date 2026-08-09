import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'

const LeafIcon = ({ size = 24, color = "#3D4A2E" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill={color} />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const BellIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/recipes', label: 'Recipes' },
  { path: '/grocery', label: 'Grocery' },
  { path: '/tips', label: 'Tips' },
  { path: '/tips', label: 'About Us' },
]

export default function Header() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isHomePage = pathname === '/'

  const rawName = user?.familyName || family?.name || user?.name || 'Healthy'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Healthy'
  const initial = displayName ? displayName[0].toUpperCase() : 'H'

  return (
    <header
      style={{
        background: isHomePage ? '#3D4A2E' : isDark ? '#141C2E' : '#FFFFFF',
        borderBottom: isHomePage ? 'none' : `1px solid ${isDark ? '#24324A' : '#EAECE5'}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '12px 32px',
        boxShadow: isHomePage ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          {isHomePage ? (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <LeafIcon size={20} color="#3D4A2E" />
            </div>
          ) : (
            <LeafIcon size={28} color="#2E7D32" />
          )}

          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: isHomePage ? '#FFFFFF' : isDark ? '#FFFFFF' : '#2E7D32',
              letterSpacing: '-0.4px',
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            }}
          >
            {isHomePage ? 'FamilyFit' : <>Family<span style={{ color: '#81C784' }}>Fit</span></>}
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_LINKS.map((link, idx) => {
            const isActive = (pathname === '/' && link.path === '/' && idx === 0) || (link.path !== '/' && pathname.startsWith(link.path))
            return (
              <button
                key={idx}
                onClick={() => navigate(link.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isHomePage
                    ? '#FFFFFF'
                    : isActive
                    ? (isDark ? '#81C784' : '#2E7D32')
                    : isDark ? '#94A3B8' : '#4A5568',
                  fontWeight: isHomePage ? (isActive ? 700 : 500) : (isActive ? 700 : 600),
                  fontSize: 14,
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '6px 0',
                  opacity: isHomePage ? (isActive ? 1 : 0.88) : 1,
                  transition: 'opacity 0.15s ease, color 0.15s ease',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {link.label}
                {!isHomePage && isActive && (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Notification Bell */}
          <button
            onClick={() => alert('No new notifications')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: isHomePage ? '#FFFFFF' : isDark ? '#1E293B' : '#F6F7F2',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              color: isHomePage ? '#3D4A2E' : isDark ? '#F8FAFC' : '#212121',
              boxShadow: isHomePage ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <BellIcon color={isHomePage ? '#3D4A2E' : 'currentColor'} />
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

          {/* Profile Pill Badge */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '4px 14px 4px 6px',
              borderRadius: 30,
              background: isHomePage ? '#FFFFFF' : isDark ? '#1E293B' : '#F6F7F2',
              boxShadow: isHomePage ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isHomePage ? '#E8F3E5' : '#2E7D32',
                color: isHomePage ? '#3D4A2E' : 'white',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isHomePage ? <LeafIcon size={16} color="#3D4A2E" /> : initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', lineHeight: 1.1 }}>
                {displayName} Family
              </span>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                Family Admin
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#64748B', marginLeft: 2 }}>▾</span>
          </div>
        </div>
      </div>
    </header>
  )
}
