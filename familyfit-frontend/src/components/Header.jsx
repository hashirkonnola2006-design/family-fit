import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'

export default function Header({ showSearch = false }) {
  const { user } = useAuth()
  const { family } = useFamily()
  const navigate = useNavigate()

  const initial = (family?.name || user?.familyName || 'F')[0].toUpperCase()

  return (
    <header className="app-header">
      <div className="logo">
        <span>🌿</span>
        <span>Family Fit</span>
      </div>
      <div className="header-actions">
        <button
          className="icon-btn"
          id="header-notifications-btn"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="notification-badge" />
        </button>
        <button
          className="icon-btn"
          style={{ overflow: 'hidden', padding: 0, background: 'var(--color-primary)' }}
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
            {initial}
          </div>
        </button>
      </div>
    </header>
  )
}
