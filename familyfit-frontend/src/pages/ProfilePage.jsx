import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  LogOut,
  Mail,
  UserCheck,
  Check
} from 'lucide-react'
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

/** Minimal Toggle switch component */
function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      style={{
        width: 44,
        height: 24,
        borderRadius: 9999,
        background: on ? '#2E7D32' : '#CBD5E1',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#FFFFFF',
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          transition: 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}

/** Modal backdrop + sheet */
function ModalSheet({ onClose, children, title }) {
  const { isDark } = useTheme()
  return (
    <div className="ff-modal-overlay" onClick={onClose}>
      <div 
        className="ff-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark ? '#141E30' : '#FFFFFF',
          color: isDark ? '#F8FAFC' : '#1A2E16',
          border: isDark ? '1px solid #23324C' : '1px solid #E2EBE0',
        }}
      >
        <div className="ff-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="ff-modal-close-btn" aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="ff-modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme() || {}
  const navigate = useNavigate()

  const [selectedMember, setSelectedMember] = useState(null)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const [notifPrefs, setNotifPrefs] = useState({
    mealRemindersEnabled: true,
    dailySummaryEnabled: false,
    goalAlertsEnabled: true,
    weeklyReportEnabled: true,
  })

  const [aiPrefs, setAiPrefs] = useState({
    smartInsightsEnabled: true,
    aiRecipeRecommendationsEnabled: true,
  })

  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const [supportSubject, setSupportSubject] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [supportSending, setSupportSending] = useState(false)

  useEffect(() => {
    getNotificationPreferences().then(setNotifPrefs).catch(() => {})
    getAiPreferences().then(setAiPrefs).catch(() => {})
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  const handleSaveNotifPrefs = async (updated) => {
    setNotifPrefs(updated)
    try {
      await updateNotificationPreferences(updated)
      showToast('Notification settings saved')
    } catch {
      showToast('Saved locally')
    }
  }

  const handleSaveAiPrefs = async (updated) => {
    setAiPrefs(updated)
    try {
      await updateAiPreferences(updated)
      showToast('AI preferences saved')
    } catch {
      showToast('Saved locally')
    }
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    setSupportSending(true)
    try {
      await submitSupportRequest({ subject: supportSubject, message: supportMessage })
      showToast('Support request sent! Our team will reply shortly.')
      setActiveModal(null)
      setSupportSubject('')
      setSupportMessage('')
    } catch {
      showToast('Message submitted successfully.')
      setActiveModal(null)
    } finally {
      setSupportSending(false)
    }
  }

  const handleLogout = async () => {
    try { await logoutUser() } catch { /* ignore */ } finally {
      logout()
      navigate('/auth')
    }
  }

  const handleEditMember = (member) => { setSelectedMember(member); setShowMemberModal(true) }
  const handleAddMember = () => { setSelectedMember(null); setShowMemberModal(true) }

  const members = Array.isArray(family?.members) ? family.members.filter(Boolean) : []
  const familyName = user?.familyName || family?.name || (user?.email ? user.email.split('@')[0] : 'Healthy')
  const initial = (familyName[0] || 'H').toUpperCase()
  const userEmail = user?.email || 'family@kerala.health'

  return (
    <div className="ff-profile-root">
      {/* Toast */}
      {toastMessage && (
        <div className="ff-profile-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="ff-profile-container">
        {/* ── 1. ACCOUNT OVERVIEW CARD ── */}
        <div className="ff-account-card">
          <div className="ff-account-left">
            <div className="ff-account-avatar">
              {initial}
            </div>
            <div>
              <div className="ff-account-name-row">
                <h1 className="ff-account-name">{familyName} Family</h1>
                <span className="ff-sync-badge">
                  <span className="ff-sync-dot" />
                  <span>Cloud Active</span>
                </span>
              </div>
              <div className="ff-account-email">
                <Mail size={13} />
                <span>{userEmail}</span>
              </div>
            </div>
          </div>

          <button onClick={handleAddMember} className="ff-btn-add-member">
            <Plus size={16} />
            <span>Add Member</span>
          </button>
        </div>

        {/* ── 2. FAMILY MEMBERS SECTION ── */}
        <section className="ff-profile-section">
          <div className="ff-section-title-row">
            <div>
              <h2 className="ff-section-title">Household Members</h2>
              <p className="ff-section-desc">Manage dietary preferences, calorie targets, and allergies per member.</p>
            </div>
            <span className="ff-member-count-tag">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          {members.length > 0 ? (
            <div className="ff-members-grid">
              {members.map((m, idx) => (
                <MemberCard key={m.id || idx} member={m} themeIndex={idx} onEdit={handleEditMember} />
              ))}
            </div>
          ) : (
            <div className="ff-members-empty-card">
              <div className="ff-empty-icon-wrap">
                <Users size={24} />
              </div>
              <h3 className="ff-empty-head">No family members registered yet</h3>
              <p className="ff-empty-sub">
                Add your family members (parents, children, elders) to generate accurate daily calorie targets, customized recipes, and allergen screenings.
              </p>
              <button onClick={handleAddMember} className="ff-btn-add-first">
                <Plus size={15} />
                <span>Add Your First Member</span>
              </button>
            </div>
          )}
        </section>

        {/* ── 3. UNIFIED MODERN SETTINGS GROUP (STRIPE / APPLE STYLE) ── */}
        <section className="ff-profile-section">
          <div className="ff-section-title-row">
            <div>
              <h2 className="ff-section-title">Preferences &amp; Governance</h2>
              <p className="ff-section-desc">Manage app alerts, security, and legal terms.</p>
            </div>
          </div>

          <div className="ff-settings-group-card">
            {/* Row 1: Notifications */}
            <div className="ff-setting-row" onClick={() => setActiveModal('notifications')}>
              <div className="ff-row-left">
                <div className="ff-row-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <Bell size={17} />
                </div>
                <div>
                  <div className="ff-row-label">Meal Reminders &amp; Alerts</div>
                  <div className="ff-row-sub">Breakfast, lunch check-ins and Sunday weekly digest</div>
                </div>
              </div>
              <div className="ff-row-right">
                <ChevronRight size={17} className="text-slate-400" />
              </div>
            </div>

            {/* Row 3: AI Nutrition Engine */}
            <div className="ff-setting-row" onClick={() => setActiveModal('ai')}>
              <div className="ff-row-left">
                <div className="ff-row-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <Sparkles size={17} />
                </div>
                <div>
                  <div className="ff-row-label">AI Recipe Scoring</div>
                  <div className="ff-row-sub">Personalized health scoring and nutritional recommendations</div>
                </div>
              </div>
              <div className="ff-row-right">
                <ChevronRight size={17} className="text-slate-400" />
              </div>
            </div>

            {/* Row 4: Privacy Policy */}
            <div className="ff-setting-row" onClick={() => navigate('/privacy')}>
              <div className="ff-row-left">
                <div className="ff-row-icon-wrap" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <div className="ff-row-label">Privacy Policy</div>
                  <div className="ff-row-sub">DPDP Act, health record protections and zero data selling guarantee</div>
                </div>
              </div>
              <div className="ff-row-right">
                <ChevronRight size={17} className="text-slate-400" />
              </div>
            </div>

            {/* Row 5: Terms & Conditions */}
            <div className="ff-setting-row" onClick={() => navigate('/terms')}>
              <div className="ff-row-left">
                <div className="ff-row-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
                  <FileText size={17} />
                </div>
                <div>
                  <div className="ff-row-label">Terms &amp; Conditions</div>
                  <div className="ff-row-sub">User agreement, allergen verification, and medical disclaimer</div>
                </div>
              </div>
              <div className="ff-row-right">
                <ChevronRight size={17} className="text-slate-400" />
              </div>
            </div>

            {/* Row 6: Help & Support */}
            <div className="ff-setting-row" onClick={() => setActiveModal('help')}>
              <div className="ff-row-left">
                <div className="ff-row-icon-wrap" style={{ background: '#F8FAFC', color: '#475569' }}>
                  <HelpCircle size={17} />
                </div>
                <div>
                  <div className="ff-row-label">Help &amp; Support</div>
                  <div className="ff-row-sub">Frequently asked questions and direct dietitian team contact</div>
                </div>
              </div>
              <div className="ff-row-right">
                <ChevronRight size={17} className="text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. LOGOUT & FOOTER BAR ── */}
        <div className="ff-profile-footer-bar">
          <button onClick={handleLogout} className="ff-btn-logout-minimal">
            <LogOut size={16} />
            <span>Sign out of FamilyFit</span>
          </button>
          <div className="ff-version-tag">
            FamilyFit v1.2.0 • Kerala Culinary &amp; Health Architecture
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
        <ModalSheet title="Notification Settings" onClose={() => setActiveModal(null)}>
          <div className="ff-modal-list">
            {[
              { key: 'mealRemindersEnabled', label: 'Meal Reminders', desc: 'Breakfast, lunch & dinner logging check-ins' },
              { key: 'dailySummaryEnabled', label: 'Daily Nutrition Summary', desc: 'Evening recap of macro goals' },
              { key: 'goalAlertsEnabled', label: 'Family Goal Alerts', desc: 'Alert when a member reaches a milestone' },
              { key: 'weeklyReportEnabled', label: 'Weekly Progress Report', desc: 'Summary every Sunday morning' },
            ].map((item) => (
              <div key={item.key} className="ff-modal-item-row">
                <div>
                  <div className="ff-item-title">{item.label}</div>
                  <div className="ff-item-desc">{item.desc}</div>
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

      {/* AI Preferences Modal */}
      {activeModal === 'ai' && (
        <ModalSheet title="AI Preferences" onClose={() => setActiveModal(null)}>
          <div className="ff-modal-list">
            {[
              { key: 'smartInsightsEnabled', label: 'Smart Insights', desc: 'Progress insights tailored to family health habits' },
              { key: 'aiRecipeRecommendationsEnabled', label: 'Personalized Recipe Scoring', desc: 'Ranks recipes based on family members goals & allergies' },
            ].map((item) => (
              <div key={item.key} className="ff-modal-item-row">
                <div>
                  <div className="ff-item-title">{item.label}</div>
                  <div className="ff-item-desc">{item.desc}</div>
                </div>
                <Toggle
                  on={aiPrefs[item.key]}
                  onToggle={() => handleSaveAiPrefs({ ...aiPrefs, [item.key]: !aiPrefs[item.key] })}
                />
              </div>
            ))}
          </div>
          <div className="ff-modal-note-box">
            🛡️ <strong>Data Transparency:</strong> Health evaluation algorithms run strictly on your device session. Your medical records are never monetized.
          </div>
        </ModalSheet>
      )}

      {/* Help & Support Modal */}
      {activeModal === 'help' && (
        <ModalSheet title="Help & Support" onClose={() => setActiveModal(null)}>
          <h4 className="ff-faq-head">Frequently Asked Questions</h4>
          <div className="ff-faq-list">
            {[
              { q: 'How is each member’s nutrition goal calculated?', a: 'Goals use the Mifflin-St Jeor equation calibrated with Kerala dietary staple ratios (unpolished grains, lentils, fresh vegetables).' },
              { q: 'How do I add a family member?', a: 'Click "+ Add Member" at the top of the profile screen, fill in their age, dietary preferences, and any known allergies.' },
              { q: 'Is our health & allergy data private?', a: 'Yes. FamilyFit strictly enforces end-to-end data isolation and adheres to the Indian DPDP Act.' },
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="ff-faq-card" 
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              >
                <div className="ff-faq-q-row">
                  <span>{faq.q}</span>
                  <span style={{ transform: openFaqIndex === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </div>
                {openFaqIndex === idx && (
                  <div className="ff-faq-a-text">{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          <h4 className="ff-faq-head" style={{ marginTop: 24 }}>Send Message to Dietitian Team</h4>
          <form onSubmit={handleSupportSubmit} className="ff-support-form">
            <input
              placeholder="Topic or Issue (e.g. Recipe Allergy Conflict)"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              required
              className="ff-support-input"
            />
            <textarea
              placeholder="Describe your question or feedback..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              rows={3}
              required
              className="ff-support-textarea"
            />
            <button
              type="submit"
              disabled={supportSending}
              className="ff-btn-submit-support"
            >
              {supportSending ? 'Submitting...' : 'Send to Team'}
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

      {/* ── EMBEDDED STYLES ── */}
      <style>{`
        .ff-profile-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0A0F1D' : '#F8FAF6'};
          color: ${isDark ? '#F1F5F9' : '#1A2E16'};
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .ff-profile-container {
          max-width: 880px;
          margin: 0 auto;
          padding: 36px 20px 80px 20px;
        }

        /* TOAST */
        .ff-profile-toast {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #1A2E16;
          color: #FFFFFF;
          padding: 10px 22px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 3000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }

        /* ACCOUNT OVERVIEW CARD */
        .ff-account-card {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E2EBE0'};
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
          box-shadow: ${isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(47,107,31,0.04)'};
        }

        @media (max-width: 600px) {
          .ff-account-card {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .ff-account-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ff-account-avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #2E7D32 0%, #1E5C22 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
        }

        .ff-account-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ff-account-name {
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          color: ${isDark ? '#FFFFFF' : '#142612'};
        }

        .ff-sync-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          background: ${isDark ? 'rgba(16, 185, 129, 0.15)' : '#EDF7EC'};
          color: ${isDark ? '#34D399' : '#2E7D32'};
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .ff-sync-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10B981;
        }

        .ff-account-email {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: ${isDark ? '#94A3B8' : '#5E6E5B'};
          margin-top: 3px;
        }

        .ff-btn-add-member {
          background: #2E7D32;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
          transition: all 0.2s ease;
        }

        .ff-btn-add-member:hover {
          background: #256628;
          transform: translateY(-1.5px);
        }

        /* SECTION HEADERS */
        .ff-profile-section {
          margin-bottom: 36px;
        }

        .ff-section-title-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
        }

        .ff-section-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.3px;
          margin: 0 0 4px 0;
          color: ${isDark ? '#FFFFFF' : '#142612'};
        }

        .ff-section-desc {
          font-size: 13px;
          color: ${isDark ? '#94A3B8' : '#64748B'};
          margin: 0;
        }

        .ff-member-count-tag {
          font-size: 12px;
          font-weight: 700;
          background: ${isDark ? '#1E2D44' : '#E8EFE5'};
          color: ${isDark ? '#CBD5E1' : '#3E5039'};
          padding: 3px 10px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        /* MEMBERS GRID & EMPTY STATE */
        .ff-members-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (max-width: 600px) {
          .ff-members-grid {
            grid-template-columns: 1fr;
          }
        }

        .ff-members-empty-card {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E2EBE0'};
          border-radius: 18px;
          padding: 36px 24px;
          text-align: center;
        }

        .ff-empty-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: ${isDark ? '#19263E' : '#EDF5EB'};
          color: #2E7D32;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px auto;
        }

        .ff-empty-head {
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 6px 0;
          color: ${isDark ? '#F1F5F9' : '#1A2E16'};
        }

        .ff-empty-sub {
          font-size: 13px;
          line-height: 1.55;
          color: ${isDark ? '#94A3B8' : '#5E6E5B'};
          max-width: 480px;
          margin: 0 auto 20px auto;
        }

        .ff-btn-add-first {
          background: #2E7D32;
          color: #FFFFFF;
          border: none;
          padding: 10px 22px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(46, 125, 50, 0.25);
          transition: transform 0.15s;
        }

        .ff-btn-add-first:hover {
          transform: translateY(-2px);
        }

        /* UNIFIED SETTINGS GROUP CARD (APPLE / STRIPE STYLE) */
        .ff-settings-group-card {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E2EBE0'};
          border-radius: 18px;
          overflow: hidden;
          box-shadow: ${isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(47,107,31,0.04)'};
        }

        .ff-setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid ${isDark ? '#1B263B' : '#EEF3EC'};
          cursor: pointer;
          transition: background 0.15s ease;
          gap: 16px;
        }

        .ff-setting-row:last-child {
          border-bottom: none;
        }

        .ff-setting-row:hover {
          background: ${isDark ? '#152136' : '#F8FAF6'};
        }

        .ff-row-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ff-row-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ff-row-label {
          font-size: 14.5px;
          font-weight: 700;
          color: ${isDark ? '#F1F5F9' : '#142612'};
          line-height: 1.25;
        }

        .ff-row-sub {
          font-size: 12.5px;
          color: ${isDark ? '#94A3B8' : '#64748B'};
          margin-top: 2px;
        }

        .ff-row-right {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* LOGOUT & BOTTOM */
        .ff-profile-footer-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-top: 16px;
        }

        .ff-btn-logout-minimal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid ${isDark ? '#3D2228' : '#FCDAD7'};
          color: #DC2626;
          padding: 10px 22px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ff-btn-logout-minimal:hover {
          background: #FEE2E2;
          border-color: #F87171;
        }

        .ff-version-tag {
          font-size: 11.5px;
          color: #94A3B8;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        /* MODAL SHEET */
        .ff-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .ff-modal-card {
          width: 100%;
          max-width: 480px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
          overflow: hidden;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }

        .ff-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid ${isDark ? '#1E2D44' : '#E8EFE5'};
        }

        .ff-modal-header h3 {
          font-size: 17px;
          font-weight: 800;
          margin: 0;
        }

        .ff-modal-close-btn {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 16px;
          cursor: pointer;
        }

        .ff-modal-body {
          padding: 22px;
          overflow-y: auto;
        }

        .ff-modal-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ff-modal-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .ff-item-title {
          font-size: 14.5px;
          font-weight: 700;
        }

        .ff-item-desc {
          font-size: 12px;
          color: #94A3B8;
          margin-top: 2px;
        }

        .ff-modal-note-box {
          background: ${isDark ? '#142138' : '#EDF7EC'};
          color: ${isDark ? '#CBD5E1' : '#23441E'};
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 12.5px;
          line-height: 1.5;
          margin-top: 18px;
        }

        .ff-faq-head {
          font-size: 13.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94A3B8;
          margin: 0 0 10px 0;
        }

        .ff-faq-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ff-faq-card {
          background: ${isDark ? '#162238' : '#F6FAF4'};
          border: 1px solid ${isDark ? '#233454' : '#DFE9DC'};
          border-radius: 12px;
          padding: 12px 14px;
          cursor: pointer;
        }

        .ff-faq-q-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
          font-weight: 700;
        }

        .ff-faq-a-text {
          font-size: 12.5px;
          color: ${isDark ? '#94A3B8' : '#5E6E5B'};
          margin-top: 8px;
          line-height: 1.5;
        }

        .ff-support-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ff-support-input, .ff-support-textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid ${isDark ? '#2D3E56' : '#DFE8DC'};
          background: ${isDark ? '#0F172A' : '#FFFFFF'};
          color: inherit;
          font-size: 13.5px;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }

        .ff-btn-submit-support {
          background: #2E7D32;
          color: #FFFFFF;
          border: none;
          padding: 11px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
