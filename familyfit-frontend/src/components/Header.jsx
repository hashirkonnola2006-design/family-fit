import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { LayoutDashboard, Utensils, ShoppingCart, Sparkles, UserRound, Flame, Bell, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { Logo } from './brand/Logo'

const NAV_LINKS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/recipes', label: 'Recipes', icon: Utensils },
  { path: '/grocery', label: 'Groceries', icon: ShoppingCart },
  { path: '/tips', label: 'Wellness', icon: Sparkles },
  { path: '/profile', label: 'Family', icon: UserRound },
]

export default function Header() {
  const { user, logout } = useAuth()
  const { family } = useFamily()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const rawName = user?.familyName || family?.name || user?.name || 'Family'
  const displayName = rawName.replace(/ family$/i, '').trim() || 'Family'

  const signOut = () => {
    logout()
    navigate('/login')
    setMobileOpen(false)
  }

  return (
    <header className="app-header app-header-modern">
      <div className="app-header-inner">
        {/* Dashboard Top Nav: Lockup color on cream/white (>=640px), Mark only below 640px */}
        <div className="flex items-center">
          <div className="hidden sm:block">
            <Logo variant="lockup" tone="color" height={32} asLink />
          </div>
          <div className="block sm:hidden">
            <Logo variant="mark" tone="color" height={28} asLink />
          </div>
        </div>

        <nav className="app-main-nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ path, label, icon: Icon }) => {
            const active = pathname === path || (path === '/dashboard' && pathname === '/home')
            return <Link key={path} to={path} aria-current={active ? 'page' : undefined} className={`app-nav-link${active ? ' is-active' : ''}`}>
              <Icon size={17} strokeWidth={active ? 2.25 : 1.9} /><span>{label}</span>
            </Link>
          })}
        </nav>

        <div className="app-header-actions">
          <span className="streak-chip" title="Healthy meal logging streak"><Flame size={16} fill="currentColor" /> <span>3 day streak</span></span>
          <button type="button" className="header-icon-button notification-button" onClick={() => alert('All family health alerts are up to date! 🌿')} aria-label="Notifications" title="Notifications"><Bell size={17} /><span className="notification-dot" /></button>
          <Link to="/profile" className="user-chip" aria-label={`Open ${displayName} profile`}>
            <span className="user-avatar">{displayName[0]?.toUpperCase() || 'H'}</span>
            <span className="user-chip-name">{displayName === 'Family' ? 'Healthy Family' : displayName}</span>
            <ChevronDown size={14} className="text-[#6f7b72] shrink-0" />
          </Link>
          <button type="button" className="header-icon-button signout-button" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
          <button type="button" className="header-icon-button mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && <nav className="mobile-nav-panel" aria-label="Mobile navigation">
        {NAV_LINKS.map(({ path, label, icon: Icon }) => {
          const active = pathname === path || (path === '/dashboard' && pathname === '/home')
          return <Link key={path} to={path} aria-current={active ? 'page' : undefined} className={`mobile-nav-link${active ? ' is-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <Icon size={18} /><span>{label}</span>
          </Link>
        })}
        <button type="button" className="mobile-nav-link mobile-signout" onClick={signOut}><LogOut size={18} /><span>Sign out</span></button>
      </nav>}
    </header>
  )
}
