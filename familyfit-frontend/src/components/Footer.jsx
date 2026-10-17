import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Globe, 
  ArrowUp, 
  CheckCircle2,
  Leaf
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
)

export default function Footer() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setSubmitting(true)
    setTimeout(() => {
      setSubscribed(true)
      setSubmitting(false)
      setEmail('')
    }, 450)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="ff-footer-root">
      <div className="ff-footer-inner">
        {/* ── MINIMAL NEWSLETTER STRIP ── */}
        <div className="ff-footer-newsletter-strip">
          <div className="ff-newsletter-copy">
            <h4 className="ff-nl-title">Weekly Wellness Digest</h4>
            <p className="ff-nl-sub">Kerala-inspired meal plans and nutrition tips in your inbox.</p>
          </div>

          <div className="ff-newsletter-action-col">
            {subscribed ? (
              <div className="ff-nl-success">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="ff-nl-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  required
                  className="ff-nl-input"
                />
                <button type="submit" disabled={submitting} className="ff-nl-btn">
                  {submitting ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── MINIMAL 3-COLUMN DIRECTORY ── */}
        <div className="ff-footer-grid">
          {/* Column 1: Brand & Tagline */}
          <div className="ff-col-brand">
            <Link to="/" className="ff-brand-link">
              <Leaf size={18} className="ff-brand-icon" />
              <span className="ff-brand-name">FamilyFit</span>
            </Link>
            <p className="ff-brand-tagline">
              Wholesome food wisdom and personalized nutrition for the whole family.
            </p>
            <div className="ff-social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ff-social-icon" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="ff-social-icon" aria-label="YouTube">
                <YoutubeIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="ff-social-icon" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="ff-social-icon" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="https://familyfit.health" target="_blank" rel="noreferrer" className="ff-social-icon" aria-label="Website">
                <Globe size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="ff-col-nav">
            <h5 className="ff-col-heading">Navigation</h5>
            <ul className="ff-links-list">
              <li>
                <button onClick={() => navigate('/')} className="ff-link-item">Home</button>
              </li>
              <li>
                <button onClick={() => navigate('/recipes')} className="ff-link-item">Recipes</button>
              </li>
              <li>
                <button onClick={() => navigate('/grocery')} className="ff-link-item">Grocery</button>
              </li>
              <li>
                <button onClick={() => navigate('/tips')} className="ff-link-item">Health Tips</button>
              </li>
              <li>
                <button onClick={() => navigate('/profile')} className="ff-link-item">Family Profile</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Policies (STRICTLY 2 LINKS) */}
          <div className="ff-col-nav">
            <h5 className="ff-col-heading">Trust &amp; Policies</h5>
            <ul className="ff-links-list">
              <li>
                <button onClick={() => navigate('/privacy')} className="ff-link-item">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="ff-link-item">
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ── MINIMAL BOTTOM BAR ── */}
        <div className="ff-footer-bottom">
          <p className="ff-copyright">
            © {new Date().getFullYear()} FamilyFit. All rights reserved.
          </p>

          <button onClick={scrollToTop} className="ff-btn-top">
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>

      <style>{`
        .ff-footer-root {
          width: 100%;
          background: ${isDark ? '#080D1A' : '#F6F9F5'};
          border-top: 1px solid ${isDark ? '#1E293B' : '#E5ECE2'};
          color: ${isDark ? '#94A3B8' : '#64748B'};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          position: relative;
          z-index: 10;
        }

        .ff-footer-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 24px 80px 24px;
        }

        @media (min-width: 768px) {
          .ff-footer-inner {
            padding: 44px 32px 48px 32px;
          }
        }

        /* ── NEWSLETTER STRIP ── */
        .ff-footer-newsletter-strip {
          background: ${isDark ? '#0F172A' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E293B' : '#E2E8F0'};
          border-radius: 14px;
          padding: 18px 24px;
          margin-bottom: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ff-newsletter-copy {
          max-width: 440px;
        }

        .ff-nl-title {
          font-size: 15px;
          font-weight: 700;
          color: ${isDark ? '#F1F5F9' : '#0F172A'};
          margin: 0 0 3px 0;
          letter-spacing: -0.2px;
        }

        .ff-nl-sub {
          font-size: 13px;
          color: ${isDark ? '#94A3B8' : '#64748B'};
          margin: 0;
          line-height: 1.4;
        }

        .ff-newsletter-action-col {
          flex: 1;
          min-width: 260px;
          max-width: 380px;
        }

        .ff-nl-form {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .ff-nl-input {
          flex: 1;
          height: 38px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid ${isDark ? '#334155' : '#CBD5E1'};
          background: ${isDark ? '#090E17' : '#F8FAFC'};
          color: ${isDark ? '#F8FAFC' : '#0F172A'};
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .ff-nl-input:focus {
          border-color: #2E7D32;
        }

        .ff-nl-btn {
          height: 38px;
          padding: 0 16px;
          background: #2E7D32;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s ease, transform 0.1s ease;
          white-space: nowrap;
        }

        .ff-nl-btn:hover {
          opacity: 0.92;
        }

        .ff-nl-btn:active {
          transform: scale(0.98);
        }

        .ff-nl-success {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #10B981;
        }

        /* ── 3-COLUMN DIRECTORY ── */
        .ff-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 36px;
          padding-bottom: 32px;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E2E8F0'};
        }

        @media (max-width: 640px) {
          .ff-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        .ff-col-brand {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ff-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-decoration: none;
        }

        .ff-brand-icon {
          color: ${isDark ? '#34D399' : '#2E7D32'};
        }

        .ff-brand-name {
          font-size: 16px;
          font-weight: 700;
          color: ${isDark ? '#F1F5F9' : '#0F172A'};
          letter-spacing: -0.3px;
        }

        .ff-brand-tagline {
          font-size: 13px;
          line-height: 1.5;
          color: ${isDark ? '#94A3B8' : '#64748B'};
          margin: 0;
          max-width: 280px;
        }

        .ff-social-links {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .ff-social-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${isDark ? '#0F172A' : '#E2E8F0'};
          color: ${isDark ? '#94A3B8' : '#475569'};
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .ff-social-icon:hover {
          color: #2E7D32;
          background: ${isDark ? '#1E293B' : '#CBD5E1'};
        }

        .ff-col-heading {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: ${isDark ? '#CBD5E1' : '#334155'};
          margin: 0 0 14px 0;
        }

        .ff-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ff-link-item {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
          color: ${isDark ? '#94A3B8' : '#64748B'};
          cursor: pointer;
          text-align: left;
          transition: color 0.15s ease;
          display: inline-block;
        }

        .ff-link-item:hover {
          color: ${isDark ? '#FFFFFF' : '#0F172A'};
        }

        /* ── BOTTOM BAR ── */
        .ff-footer-bottom {
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: ${isDark ? '#64748B' : '#94A3B8'};
          flex-wrap: wrap;
          gap: 12px;
        }

        .ff-copyright {
          margin: 0;
        }

        .ff-btn-top {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.15s ease;
        }

        .ff-btn-top:hover {
          color: ${isDark ? '#F1F5F9' : '#0F172A'};
        }
      `}</style>
    </footer>
  )
}
