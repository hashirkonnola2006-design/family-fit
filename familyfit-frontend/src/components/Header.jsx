import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { Leaf, Bell, Menu, X, ShieldCheck } from 'lucide-react'

const NAV_LINKS = [
  { path: '/dashboard', label: 'Home' },
  { path: '/recipes',   label: 'Recipes' },
  { path: '/grocery',   label: 'Grocery' },
  { path: '/tips',      label: 'Tips' },
  { path: '/profile',   label: 'Profile' },
]

export default function Header() {
  const { user } = useAuth()
  const { family } = useFamily()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/dashboard' || pathname === '/home' || pathname === '/'

  // Clean, consistent, luxurious white/cream background across all pages
  const headerBg = scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(250, 250, 247, 0.94)'
  const textColor = '#1A2E16'
  const mutedTextColor = '#556552'

  const rawName = user?.familyName || family?.name || user?.name || 'Healthy'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Healthy'
  const initial = displayName ? displayName[0].toUpperCase() : 'H'

  return (
    <>
      <header
        className="ff-header-root"
        style={{
          background: headerBg,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E5EBE1',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: scrolled ? '12px 40px' : '16px 40px',
          boxShadow: scrolled 
            ? '0 8px 24px rgba(47,107,31,0.06)' 
            : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        <div className="ff-header-inner">
          {/* ── Brand Logo ── */}
          <Link to="/dashboard" className="ff-header-brand">
            <div className="ff-brand-badge-icon" style={{
              background: '#E2F0DE'
            }}>
              <Leaf size={20} style={{ color: '#2E7D32' }} />
            </div>
            <span className="ff-brand-text" style={{ color: textColor }}>
              Family<span style={{ color: '#2E7D32' }}>Fit</span>
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="ff-header-nav">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.path
              return (
                <button
                  key={link.path}
                  className={`ff-nav-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: isActive ? '#2E7D32' : mutedTextColor,
                    background: isActive ? '#EAF4E7' : 'transparent',
                    borderBottom: isActive ? '2.5px solid #6BBF4E' : '2.5px solid transparent',
                    borderRadius: isActive ? '9999px 9999px 4px 4px' : '9999px',
                    fontWeight: isActive ? 800 : 600,
                  }}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* ── Right Actions: Notifications, Avatar ── */}
          <div className="ff-header-right">
            {/* Notification Bell */}
            <button
              className="ff-header-btn-circle"
              onClick={() => alert('All family health alerts are up to date! 🌿')}
              aria-label="Notifications"
              title="Family Notifications"
              style={{
                background: '#EDF4E8',
                color: '#2E7D32',
                border: '1px solid #D5E4D1',
              }}
            >
              <Bell size={17} />
              <span className="ff-bell-pulse-dot" />
            </button>

            {/* Family Profile Avatar Button */}
            <div
              className="ff-header-avatar-btn"
              onClick={() => navigate('/profile')}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                border: isDark ? '1px solid #2D3748' : '1px solid #DFE8DC',
              }}
            >
              <div 
                className="ff-avatar-circle"
                style={{
                  background: 'linear-gradient(135deg, #2E7D32 0%, #1E5C22 100%)',
                  color: '#FFFFFF'
                }}
              >
                {initial}
              </div>
              <div className="ff-avatar-meta">
                <span className="ff-avatar-name" style={{ color: textColor }}>
                  {displayName}
                </span>
                <span className="ff-avatar-tag" style={{ color: mutedTextColor }}>
                  Family
                </span>
              </div>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ff-mobile-menu-trigger"
              aria-label="Toggle menu"
              style={{
                background: '#EDF4E8',
                color: textColor,
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileOpen && (
          <div className="ff-mobile-drawer" style={{
            background: '#FFFFFF',
            borderTop: '1px solid #E5EBE1',
          }}>
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.path
              return (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setMobileOpen(false) }}
                  className={`ff-mobile-drawer-link ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? '#2E7D32' : '#1A2E16',
                    background: isActive ? '#EDF6EA' : 'transparent',
                  }}
                >
                  {link.label}
                </button>
              )
            })}
          </div>
        )}
      </header>

      <style>{`
        .ff-header-root {
          width: 100%;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          box-sizing: border-box;
        }

        .ff-header-inner {
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .ff-header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .ff-header-brand:hover {
          transform: scale(1.03);
        }

        .ff-brand-badge-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ff-brand-text {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .ff-header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 860px) {
          .ff-header-nav {
            display: none;
          }
        }

        .ff-nav-pill-btn {
          border: none;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 14.5px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ff-nav-pill-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .ff-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .ff-header-btn-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .ff-header-btn-circle:hover {
          transform: scale(1.08);
        }

        .ff-bell-pulse-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #F97316;
          border: 1.5px solid white;
        }

        .ff-header-avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 5px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ff-header-avatar-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .ff-avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
        }

        .ff-avatar-meta {
          display: flex;
          flex-direction: column;
        }

        .ff-avatar-name {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.15;
        }

        .ff-avatar-tag {
          font-size: 10.5px;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .ff-avatar-meta {
            display: none;
          }
          .ff-header-avatar-btn {
            padding: 3px;
          }
        }

        .ff-mobile-menu-trigger {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 860px) {
          .ff-mobile-menu-trigger {
            display: flex;
          }
        }

        .ff-mobile-drawer {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 20px;
          margin-top: 12px;
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.1);
        }

        .ff-mobile-drawer-link {
          border: none;
          text-align: left;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s;
        }
      `}</style>
    </>
  )
}
