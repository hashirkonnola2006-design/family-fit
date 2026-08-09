import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { path: '/',         label: 'Home' },
  { path: '/recipes',  label: 'Recipes' },
  { path: '/grocery',  label: 'Grocery' },
  { path: '/tips',     label: 'Tips' },
  { path: '/profile',  label: 'Profile' },
]

const LeafIcon = ({ size = 26, color = '#2E7D32' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill={color} />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export default function Header() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'
  const isRecipes = pathname === '/recipes'
  const isGrocery = pathname === '/grocery'

  const bg = isHome
    ? scrolled ? 'rgba(52,67,37,0.97)' : 'rgba(52,67,37,0.85)'
    : isGrocery && !isDark
    ? '#F4511E'
    : isRecipes && !isDark
    ? '#f1e9df'
    : isDark ? '#0F172A' : '#FFFFFF'

  const textColor = isHome || (isGrocery && !isDark) ? '#FFFFFF' : isDark ? '#F1F5F9' : '#1E293B'
  const accentColor = isGrocery && !isDark ? '#FFFFFF' : '#6BBF4E'

  const rawName = user?.familyName || family?.name || user?.name || 'Healthy'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Healthy'
  const initial = displayName ? displayName[0].toUpperCase() : 'H'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .ff-nav-link {
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.2px;
          cursor: pointer;
          padding: 6px 4px;
          border: none;
          background: transparent;
          transition: color 0.22s;
          text-decoration: none;
        }
        .ff-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2.5px;
          border-radius: 2px;
          background: #6BBF4E;
          transition: width 0.28s cubic-bezier(.4,0,.2,1);
        }
        .ff-nav-link:hover::after,
        .ff-nav-link.active::after {
          width: 100%;
        }
        .ff-nav-link.active {
          color: #6BBF4E !important;
        }
        .ff-nav-link:hover {
          color: #6BBF4E !important;
        }
        .ff-header {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .ff-logo {
          transition: transform 0.2s ease;
        }
        .ff-logo:hover {
          transform: scale(1.04);
        }
        .ff-bell {
          transition: transform 0.18s ease;
        }
        .ff-bell:hover {
          transform: scale(1.12) rotate(-10deg);
        }
        .ff-avatar {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ff-avatar:hover {
          transform: scale(1.06);
          box-shadow: 0 4px 18px rgba(107,191,78,0.25);
        }
        .ff-mobile-menu {
          display: none;
        }
        @media (max-width: 768px) {
          .ff-desktop-nav { display: none !important; }
          .ff-mobile-menu { display: flex !important; }
        }
      `}</style>

      <header
        className="ff-header"
        style={{
          background: bg,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: scrolled ? '14px 60px' : '18px 60px',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.12)' : 'none',
          transition: 'padding 0.25s ease, background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: 1320,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}>

          {/* ── Logo ── */}
          <div
            className="ff-logo"
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: isHome ? 'rgba(255,255,255,0.15)' : '#EBF5E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LeafIcon size={22} color={isHome ? '#FFFFFF' : '#2E7D32'} />
            </div>
            <span style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: textColor,
              letterSpacing: '-0.5px',
            }}>
              Family<span style={{ color: accentColor }}>Fit</span>
            </span>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="ff-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.path
              return (
                <button
                  key={link.path}
                  className={`ff-nav-link${isActive ? ' active' : ''}`}
                  style={{
                    color: isActive
                      ? (isGrocery && !isDark ? '#FFFFFF' : accentColor)
                      : textColor,
                    fontWeight: isActive ? 800 : 600,
                  }}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* ── Right: Bell + Avatar ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            {/* Bell */}
            <button
              className="ff-bell"
              onClick={() => alert('No new notifications')}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: (isGrocery && !isDark)
                  ? '#FFFFFF'
                  : isHome ? 'rgba(255,255,255,0.12)' : isDark ? '#1E293B' : '#F1F5F9',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: (isGrocery && !isDark) ? '#F4511E' : textColor, position: 'relative',
                boxShadow: (isGrocery && !isDark) ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{
                position: 'absolute', top: 9, right: 9,
                width: 8, height: 8, borderRadius: '50%',
                background: '#FF8A00', border: '1.5px solid white',
              }} />
            </button>

            {/* Avatar pill */}
            <div
              className="ff-avatar"
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '5px 16px 5px 5px', borderRadius: 40,
                background: (isGrocery && !isDark)
                  ? '#FFFFFF'
                  : isHome ? 'rgba(255,255,255,0.15)' : isDark ? '#1E293B' : '#F1F5F9',
                border: isHome ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                boxShadow: (isGrocery && !isDark) ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: (isGrocery && !isDark) ? '#E8F0E3' : accentColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: (isGrocery && !isDark) ? '#2E7D32' : '#fff', fontWeight: 800, fontSize: 15,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {initial}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: (isGrocery && !isDark) ? '#1E293B' : textColor, lineHeight: 1.2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {displayName}
                </span>
                <span style={{ fontSize: 11, color: (isGrocery && !isDark) ? '#64748B' : isHome ? 'rgba(255,255,255,0.6)' : '#94A3B8', fontWeight: 500 }}>
                  Family
                </span>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              className="ff-mobile-menu"
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: 'none',
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(255,255,255,0.12)',
                border: 'none', cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
                color: textColor,
              }}
            >
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            padding: '12px 24px 20px',
            display: 'flex', flexDirection: 'column', gap: 4,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: 12,
          }}>
            {NAV_LINKS.map(link => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '12px 8px',
                  fontSize: 18, fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: pathname === link.path ? accentColor : textColor,
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
