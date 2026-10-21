import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Utensils, ShoppingCart, Sparkles, Settings, LogOut, Menu, X } from 'lucide-react'
import { Logo } from './brand/Logo'

const NAV_LINKS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/recipes', label: 'Recipes', icon: Utensils },
  { path: '/grocery', label: 'Groceries', icon: ShoppingCart },
  { path: '/tips', label: 'Wellness', icon: Sparkles },
  { path: '/profile', label: 'Settings', icon: Settings },
]

export default function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = () => {
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
          <button
            type="button"
            className="header-signout-btn signout-button"
            onClick={handleSignOut}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
          <button
            type="button"
            className="header-icon-button mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
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
        <button
          type="button"
          className="mobile-nav-link mobile-signout"
          onClick={handleSignOut}
        >
          <LogOut size={18} /><span>Log out</span>
        </button>
      </nav>}
    </header>
  )
}

