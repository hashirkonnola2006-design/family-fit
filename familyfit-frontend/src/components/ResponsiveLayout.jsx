import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'

// ── DESIGN SYSTEM ICONS ──
const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill="#1E4D18" />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#2F6B1F" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#CFE8A9" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const RecipesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 2v6a2 2 0 0 0 4 0V2" />
    <path d="M9 8v14" />
    <path d="M17 2v20" />
    <path d="M14 2c2.5 0 3.5 1.8 3.5 4.5v3.5h-3.5" />
  </svg>
)

const GroceryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const TipsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
  </svg>
)

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/recipes', label: 'Recipes', icon: <RecipesIcon /> },
  { path: '/grocery', label: 'Grocery', icon: <GroceryIcon /> },
  { path: '/tips', label: 'Tips', icon: <TipsIcon /> },
  { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
]

export default function ResponsiveLayout({ children }) {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Clean Family Name
  const rawName = user?.familyName || family?.name || user?.name || 'Hashir'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Hashir'
  const initial = displayName ? displayName[0].toUpperCase() : 'H'

  return (
    <div className="layout-root">
      {/* ── DESKTOP PERSISTENT LEFT SIDEBAR ── */}
      <aside className="desktop-sidebar" style={{ display: 'none' }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <LeafIcon />
            <span style={{ fontSize: 24, fontWeight: 800, color: isDark ? '#F8FAFC' : '#1E4D18', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Family<span style={{ color: '#F97316' }}>Fit</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: 18,
                    border: 'none',
                    background: active ? '#CFE8A9' : 'transparent',
                    color: active ? '#1E4D18' : isDark ? '#94A3B8' : '#5B6472',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Kerala Backwaters Illustration (Desktop Only) */}
        <svg className="desktop-only-illustration" viewBox="0 0 240 160" fill="none" style={{ display: 'none', position: 'absolute', bottom: 90, left: 0, width: '100%', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }}>
          {/* Water waves */}
          <path d="M0 140 Q 60 135, 120 140 T 240 140" stroke="#2F6B1F" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 148 Q 60 145, 120 148 T 240 148" stroke="#2F6B1F" strokeWidth="1" strokeLinecap="round" />
          {/* Boat */}
          <path d="M140 138 L170 138 L178 132 L132 132 Z" fill="#2F6B1F" />
          <path d="M155 132 L155 115 L140 125 Z" fill="#2F6B1F" />
          {/* Palm tree 1 */}
          <path d="M30 140 Q 40 100, 25 60" stroke="#2F6B1F" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M25 60 Q 5 65, 0 80" stroke="#2F6B1F" strokeWidth="2.5" fill="none" />
          <path d="M25 60 Q 10 50, 5 35" stroke="#2F6B1F" strokeWidth="2.5" fill="none" />
          <path d="M25 60 Q 30 40, 45 35" stroke="#2F6B1F" strokeWidth="2.5" fill="none" />
          <path d="M25 60 Q 45 55, 55 70" stroke="#2F6B1F" strokeWidth="2.5" fill="none" />
          <path d="M25 60 Q 35 70, 40 85" stroke="#2F6B1F" strokeWidth="2.5" fill="none" />
          {/* Palm tree 2 */}
          <path d="M60 140 Q 55 105, 50 75" stroke="#2F6B1F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M50 75 Q 35 70, 30 55" stroke="#2F6B1F" strokeWidth="2" fill="none" />
          <path d="M50 75 Q 55 55, 70 50" stroke="#2F6B1F" strokeWidth="2" fill="none" />
          <path d="M50 75 Q 65 75, 70 90" stroke="#2F6B1F" strokeWidth="2" fill="none" />
          {/* Little hills / ground */}
          <path d="M-10 140 Q 40 135, 90 140" fill="#2F6B1F" opacity="0.3" />
        </svg>

        {/* Account Switcher / User Info at Bottom */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 18,
            cursor: 'pointer',
            background: isDark ? '#1E293B' : '#F4F5EF',
            border: `1px solid ${isDark ? '#334155' : '#E8E8E3'}`,
            zIndex: 10,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#2F6B1F',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', lineHeight: 1.2 }}>
                {displayName} Family
              </div>
              <span style={{ fontSize: 11, color: '#5B6472', fontWeight: 600 }}>
                Family Admin
              </span>
            </div>
          </div>
          {/* Dropdown Chevron */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B6472" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </aside>

      {/* ── RESPONSIVE VIEWPORT CONTAINER ── */}
      <div className="layout-content-wrapper">
        {children}
      </div>

      {/* Inject styling rules specifically for responsive layout */}
      <style dangerouslySetInnerHTML={{ __html: `
          .layout-root {
            width: 100%;
            min-height: 100vh;
          }

          .layout-content-wrapper {
            width: 100%;
            margin: 0 auto;
          }

          @media (min-width: 1024px) {
            .layout-root {
              display: flex;
              background-color: ${isDark ? '#0A0F1D' : '#FAFAF7'};
            }
            .desktop-sidebar {
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              bottom: 0 !important;
              width: 240px !important;
              transform: none !important;
              box-sizing: border-box !important;
              background-color: ${isDark ? '#141c2e' : '#ffffff'} !important;
              border-right: 1px solid ${isDark ? '#24324a' : '#f0ede6'} !important;
              z-index: 1000 !important;
            }
            .desktop-only-illustration {
              display: block !important;
            }
            .layout-content-wrapper {
              margin-left: 240px !important;
              width: calc(100% - 240px) !important;
              max-width: 1200px !important;
              padding: 32px 48px !important;
              box-sizing: border-box;
              background-color: ${isDark ? '#0A0F1D' : '#FAFAF7'};
            }
            /* Hide mobile bottom navigation dock */
            nav[style*="position: 'fixed'"], nav[style*="position: fixed"] {
              display: none !important;
            }
          }
        `}} />
    </div>
  )
}
