import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import MemberCard from '../components/MemberCard'
import MemberModal from '../components/MemberModal'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getAiPreferences,
  updateAiPreferences,
  submitSupportRequest,
  logoutUser,
} from '../api/settings'

/** Reusable settings row */
function SettingsRow({ icon, iconBg, iconColor, label, subtitle, right, onClick }) {
  const { isDark } = useTheme()
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isDark ? '#1e2530' : 'white',
        borderRadius: 18,
        padding: '15px 18px',
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        border: isDark ? '1px solid #2d3748' : '1px solid #f0ede8',
        transition: 'background 0.15s ease',
        gap: 14,
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.background = isDark ? '#232c3a' : '#fafaf8')}
      onMouseLeave={e => onClick && (e.currentTarget.style.background = isDark ? '#1e2530' : 'white')}
    >
      {/* Icon square */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 20,
        }}
      >
        {icon}
      </div>

      {/* Label + Subtitle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#f0f6fc' : '#111827', lineHeight: 1.2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: isDark ? '#8b949e' : '#6b7280', fontWeight: 500, marginTop: 2 }}>
          {subtitle}
        </div>
      </div>

      {/* Right content */}
      <div style={{ flexShrink: 0 }}>
        {right}
      </div>
    </div>
  )
}

/** Chevron right icon */
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

/** Toggle switch component */
function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onToggle() }}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        background: on ? '#5e8404' : '#d1d5db',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.22s ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          transition: 'left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
        }}
      />
    </div>
  )
}

/** Modal backdrop + sheet */
function ModalSheet({ onClose, children, title }) {
  const { isDark } = useTheme()
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: isDark ? '#1e2530' : 'white',
          borderRadius: '28px 28px 0 0',
          padding: '24px 24px calc(24px + env(safe-area-inset-bottom, 0px))',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#d1d5db', margin: '0 auto 20px' }} />
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: isDark ? '#f0f6fc' : '#111827', letterSpacing: '-0.3px' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: isDark ? '#2d3748' : '#f3f4f6',
              border: 'none', fontSize: 18, cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { logout } = useAuth()
  const { family } = useFamily()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [activeModal, setActiveModal] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [notifPrefs, setNotifPrefs] = useState({
    mealRemindersEnabled: true,
    dailySummaryEnabled: true,
    goalAlertsEnabled: true,
    weeklyReportEnabled: true,
  })
  const [aiPrefs, setAiPrefs] = useState({
    smartInsightsEnabled: true,
    aiRecipeRecommendationsEnabled: true,
  })
  const [language, setLanguage] = useState(() => localStorage.getItem('familyfit_lang') || 'English (US)')
  const [supportSubject, setSupportSubject] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [supportSending, setSupportSending] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const familyId = family?.id || 1

  useEffect(() => {
    async function load() {
      try {
        const [notifRes, aiRes] = await Promise.all([
          getNotificationPreferences(familyId),
          getAiPreferences(familyId),
        ])
        setNotifPrefs(notifRes.data)
        setAiPrefs(aiRes.data)
      } catch (e) { console.error(e) }
    }
    load()
  }, [familyId])

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000) }

  const handleSaveNotifPrefs = async (newPrefs) => {
    setNotifPrefs(newPrefs)
    try { await updateNotificationPreferences(familyId, newPrefs); showToast('Notification preferences saved! 🔔') } catch (e) { console.error(e) }
  }

  const handleSaveAiPrefs = async (newPrefs) => {
    setAiPrefs(newPrefs)
    try { await updateAiPreferences(familyId, newPrefs); showToast('AI preferences saved! 🤖') } catch (e) { console.error(e) }
  }

  const handleSelectLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('familyfit_lang', lang)
    showToast(`Language set to ${lang} 🌐`)
    setActiveModal(null)
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    if (!supportSubject || !supportMessage) return
    setSupportSending(true)
    try {
      await submitSupportRequest({ familyId, email: family?.email || 'user@example.com', subject: supportSubject, message: supportMessage })
      showToast('Support request sent! 💌')
      setSupportSubject(''); setSupportMessage(''); setActiveModal(null)
    } catch (err) { console.error(err) } finally { setSupportSending(false) }
  }

  const handleLogout = async () => {
    try { await logoutUser() } catch (e) { /* ignore */ } finally { logout(); navigate('/auth') }
  }

  const handleEditMember = (member) => { setSelectedMember(member); setShowMemberModal(true) }
  const handleAddMember = () => { setSelectedMember(null); setShowMemberModal(true) }

  const members = family?.members || []
  const familyName = family?.name || 'Healthy Family'
  const initial = (familyName[0] || 'T').toUpperCase()

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0d1117' : '#f7f4ef',
        color: isDark ? '#f0f6fc' : '#111827',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Toast ── */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: '#1a1a1a', color: 'white', padding: '12px 22px',
            borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* ── 1. TOP HEADER BAR ── */}
      <div
        style={{
          padding: 'max(20px, env(safe-area-inset-top, 20px)) 22px 16px',
          background: isDark ? '#161b22' : 'linear-gradient(135deg, #f3f7e6 0%, #fffdf4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e5b12" strokeWidth="2.5">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <span style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#7ab648' : '#2e5b12', letterSpacing: '-0.3px' }}>
            Family Fit
          </span>
        </div>

        {/* Bell + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: isDark ? '#21262d' : 'white',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#f0f6fc' : '#111827'} strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid white' }} />
          </button>

          <div
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#2e5b12', color: 'white',
              fontWeight: 800, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(46,91,18,0.3)',
            }}
          >
            {initial}
          </div>
        </div>
      </div>

      {/* ── 2. PAGE TITLE + ADD MEMBER ── */}
      <div style={{ padding: '20px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.5px', color: isDark ? '#f0f6fc' : '#111827' }}>
              Family Members
            </h1>
            <p style={{ fontSize: 14, color: isDark ? '#8b949e' : '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>
              Together, we grow healthy.
            </p>
          </div>

          {/* + Add Member pill button */}
          <button
            onClick={handleAddMember}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px',
              borderRadius: 30,
              border: `1.5px solid ${isDark ? '#3d6b24' : '#2e5b12'}`,
              background: 'transparent',
              color: isDark ? '#7ab648' : '#2e5b12',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              marginTop: 4,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2e5b12'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#7ab648' : '#2e5b12' }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Add Member
          </button>
        </div>
      </div>

      {/* ── 3. MEMBER CARDS GRID ── */}
      <div style={{ padding: '18px 16px 0' }}>
        {members.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {members.map((m, idx) => (
              <MemberCard key={m.id} member={m} themeIndex={idx} onEdit={handleEditMember} />
            ))}
          </div>
        ) : (
          /* Empty state with fallback demo members */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {[
              { id: 1, name: 'David', age: 38, heightCm: 178, weightKg: 82, bmi: 25.9, allergies: ['Shellfish'] },
              { id: 2, name: 'Sarah', age: 35, heightCm: 165, weightKg: 63, bmi: 23.1, allergies: [] },
              { id: 3, name: 'Leo', age: 8, heightCm: 128, weightKg: 28, bmi: 17.1, allergies: ['Dairy'] },
              { id: 4, name: 'Maya', age: 5, heightCm: 105, weightKg: 18, bmi: 16.3, allergies: [] },
            ].map((m, idx) => (
              <MemberCard key={m.id} member={m} themeIndex={idx} onEdit={() => handleAddMember()} />
            ))}
          </div>
        )}

        {/* ── 4. SETTINGS SECTION ── */}
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 14px 6px', letterSpacing: '-0.3px', color: isDark ? '#f0f6fc' : '#111827' }}>
          Settings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>

          {/* Notifications */}
          <SettingsRow
            icon="🔔"
            iconBg={isDark ? '#1a3009' : '#e2f0d9'}
            iconColor="#2e5b12"
            label="Notifications"
            subtitle="Manage alerts and reminders"
            right={<ChevronRight />}
            onClick={() => setActiveModal('notifications')}
          />

          {/* Dark Mode */}
          <SettingsRow
            icon="🌙"
            iconBg={isDark ? '#21262d' : '#f3f4f6'}
            iconColor={isDark ? '#8b949e' : '#374151'}
            label="Dark Mode"
            subtitle="Switch between light and dark"
            right={<Toggle on={isDark} onToggle={toggleTheme} />}
            onClick={toggleTheme}
          />

          {/* Language */}
          <SettingsRow
            icon="🌐"
            iconBg={isDark ? '#1a2a40' : '#e0f2fe'}
            iconColor="#0284c7"
            label="Language"
            subtitle="Choose your preferred language"
            right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2e5b12' }}>{language}</span>
                <ChevronRight />
              </div>
            }
            onClick={() => setActiveModal('language')}
          />

          {/* AI Preferences */}
          <SettingsRow
            icon="🤖"
            iconBg={isDark ? '#2a1f10' : '#ffedd5'}
            iconColor="#ea580c"
            label="AI Preferences"
            subtitle="Customize your AI experience"
            right={<ChevronRight />}
            onClick={() => setActiveModal('ai')}
          />

          {/* Help & Support */}
          <SettingsRow
            icon="❓"
            iconBg={isDark ? '#261f10' : '#fef3c7'}
            iconColor="#d97706"
            label="Help & Support"
            subtitle="Get help and find answers"
            right={<ChevronRight />}
            onClick={() => setActiveModal('help')}
          />
        </div>

        {/* ── 5. LOGOUT BUTTON ── */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: isDark ? '#1e2530' : 'white',
            border: '1.5px solid #fecaca',
            borderRadius: 18,
            padding: '15px 18px',
            cursor: 'pointer',
            color: '#dc2626',
            fontSize: 15, fontWeight: 800,
            boxShadow: '0 2px 10px rgba(220,38,38,0.06)',
            transition: 'background 0.15s ease',
            marginBottom: 20,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#1e2530' : 'white' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>

        <div style={{ textAlign: 'center', color: isDark ? '#6e7681' : '#9ca3af', fontSize: 11, fontWeight: 600, marginTop: 8, letterSpacing: '0.3px' }}>
          FAMILY FIT v1.2.0 (2026.08)
        </div>
      </div>

      {/* ── MODAL OVERLAYS ── */}

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
        <ModalSheet title="Notification Settings" onClose={() => setActiveModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { key: 'mealRemindersEnabled', label: 'Meal Reminders', desc: 'Breakfast, lunch & dinner check-ins' },
              { key: 'dailySummaryEnabled', label: 'Daily Nutrition Summary', desc: 'Evening recap of macro goals' },
              { key: 'goalAlertsEnabled', label: 'Family Goal Alerts', desc: 'Alert when a member reaches a milestone' },
              { key: 'weeklyReportEnabled', label: 'Weekly Progress Report', desc: 'Summary every Sunday morning' },
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginTop: 2 }}>{item.desc}</div>
                </div>
                <Toggle
                  on={notifPrefs[item.key]}
                  onToggle={() => handleSaveNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                />
              </div>
            ))}
          </div>
        </ModalSheet>
      )}

      {/* Language Modal */}
      {activeModal === 'language' && (
        <ModalSheet title="Select Language" onClose={() => setActiveModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['English (US)', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)', 'Hindi (हिंदी)'].map((lang) => {
              const active = language === lang
              return (
                <div
                  key={lang}
                  onClick={() => handleSelectLanguage(lang)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: active ? '#e2f0d9' : 'transparent',
                    color: active ? '#2e5b12' : 'inherit',
                    fontWeight: active ? 800 : 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: `1px solid ${active ? '#c8e6c9' : 'transparent'}`,
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span>{lang}</span>
                  {active && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e5b12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        </ModalSheet>
      )}

      {/* AI Preferences Modal */}
      {activeModal === 'ai' && (
        <ModalSheet title="AI Preferences" onClose={() => setActiveModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { key: 'smartInsightsEnabled', label: 'Smart Insights', desc: 'AI-powered progress insights on Progress screen' },
              { key: 'aiRecipeRecommendationsEnabled', label: 'AI Recipe Recommendations', desc: 'Personalized recipe scoring based on health goals' },
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginTop: 2 }}>{item.desc}</div>
                </div>
                <Toggle
                  on={aiPrefs[item.key]}
                  onToggle={() => handleSaveAiPrefs({ ...aiPrefs, [item.key]: !aiPrefs[item.key] })}
                />
              </div>
            ))}
          </div>
          <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: 14, fontSize: 13, color: '#2e5b12', lineHeight: 1.5, fontWeight: 500, marginTop: 20 }}>
            🛡️ <strong>Data Transparency:</strong> AI recommendations process family profiles locally. Your data stays private.
          </div>
        </ModalSheet>
      )}

      {/* Help & Support Modal */}
      {activeModal === 'help' && (
        <ModalSheet title="Help & Support" onClose={() => setActiveModal(null)}>
          <h4 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 10px 0' }}>Frequently Asked Questions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {[
              { q: 'How is my nutrition goal calculated?', a: 'Goals use the Mifflin-St Jeor formula based on age, height, weight, and activity level.' },
              { q: 'How do I add a family member?', a: 'Tap "+ Add Member" at the top of this screen, fill in their details, and tap save.' },
              { q: 'Is my health data private?', a: 'Yes — all data is encrypted and strictly isolated to your family account.' },
            ].map((faq, idx) => (
              <div key={idx} style={{ background: '#f9fafb', borderRadius: 14, padding: 14, cursor: 'pointer' }} onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}>
                <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5e8404" strokeWidth="2.5" strokeLinecap="round" style={{ transform: openFaqIndex === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {openFaqIndex === idx && (
                  <div style={{ fontSize: 13, color: '#4b5563', marginTop: 8, lineHeight: 1.5, fontWeight: 500 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 12px 0' }}>Contact Support</h4>
          <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              placeholder="Subject"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              required
              style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
            <textarea
              placeholder="Describe your question or issue..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              rows={3}
              required
              style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'none' }}
            />
            <button
              type="submit"
              disabled={supportSending}
              style={{
                background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
                color: 'white', border: 'none', padding: '14px', borderRadius: 16,
                fontWeight: 800, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(61,107,63,0.3)', fontFamily: 'inherit',
              }}
            >
              {supportSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </ModalSheet>
      )}

      {/* Member Edit/Add Modal */}
      {showMemberModal && (
        <MemberModal
          member={selectedMember}
          onClose={() => setShowMemberModal(false)}
        />
      )}

      <BottomNav />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
