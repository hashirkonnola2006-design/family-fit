import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  EyeOff, 
  Database, 
  Users, 
  FileText, 
  Mail, 
  CheckCircle, 
  Printer, 
  Share2,
  Calendar,
  Sparkles,
  HeartHandshake
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import Footer from '../components/Footer'

const SECTIONS = [
  { id: 'commitment', title: '1. Our Privacy Commitment' },
  { id: 'data-collected', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Family Data' },
  { id: 'allergen-safety', title: '4. Allergies & Health Records' },
  { id: 'data-security', title: '5. Storage, Encryption & Sync' },
  { id: 'children-seniors', title: '6. Minors & Senior Data Protection' },
  { id: 'cookies', title: '7. Cookies & Local Storage' },
  { id: 'your-rights', title: '8. Your Rights & Data Deletion' },
  { id: 'contact', title: '9. Contact Privacy Officer' },
]

export default function PrivacyPolicyPage() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('commitment')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FamilyFit Privacy Policy',
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="ff-privacy-page-root">
      {/* ── TOP NAV HEADER BAR ── */}
      <header className="ff-privacy-header-bar">
        <div className="ff-privacy-header-content">
          <button onClick={() => navigate(-1)} className="ff-privacy-back-btn">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="ff-privacy-nav-brand">
            <Link to="/" className="ff-brand-link">
              <span className="ff-brand-dot" />
              <span>FamilyFit Legal & Trust</span>
            </Link>
          </div>
          <div className="ff-privacy-header-actions">
            <button onClick={handleShare} className="ff-btn-icon-subtle" title="Share link">
              <Share2 size={16} />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button onClick={handlePrint} className="ff-btn-icon-subtle" title="Print document">
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="ff-privacy-hero">
        <div className="ff-privacy-hero-inner">
          <div className="ff-privacy-badge">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Verified DPDP Act & Privacy Shield Compliant</span>
          </div>
          <h1 className="ff-privacy-title">FamilyFit Privacy Policy</h1>
          <p className="ff-privacy-subtitle">
            Your family's health, dietary choices, and culinary traditions are personal. We protect your nutritional records with hospital-grade privacy standards and zero advertiser tracking.
          </p>

          <div className="ff-privacy-meta-row">
            <div className="ff-meta-item">
              <Calendar size={15} />
              <span>Effective: October 2026</span>
            </div>
            <div className="ff-meta-dot">•</div>
            <div className="ff-meta-item">
              <FileText size={15} />
              <span>Version 2.4 (Global Edition)</span>
            </div>
            <div className="ff-meta-dot">•</div>
            <div className="ff-meta-item">
              <Lock size={15} />
              <span>256-bit AES Storage Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 TRUST HIGHLIGHT CARDS ── */}
      <section className="ff-privacy-highlights-container">
        <div className="ff-privacy-highlights-grid">
          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap emerald">
              <EyeOff size={22} />
            </div>
            <h4 className="ff-highlight-head">Zero Data Selling</h4>
            <p className="ff-highlight-desc">
              We never sell, rent, or trade your family's personal health metrics, email, or eating habits to third-party data brokers.
            </p>
          </div>

          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap blue">
              <Database size={22} />
            </div>
            <h4 className="ff-highlight-head">Local-First Storage</h4>
            <p className="ff-highlight-desc">
              Your meal plans and groceries are cached securely in your device browser for offline access and rapid loading.
            </p>
          </div>

          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap purple">
              <Users size={22} />
            </div>
            <h4 className="ff-highlight-head">Family Safe Profiles</h4>
            <p className="ff-highlight-desc">
              Children and senior citizen profiles are protected with strict parental control barriers and no behavioral profiling.
            </p>
          </div>

          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap amber">
              <HeartHandshake size={22} />
            </div>
            <h4 className="ff-highlight-head">Instant Data Portability</h4>
            <p className="ff-highlight-desc">
              Export your saved recipes and family records or delete your account permanently with a single request.
            </p>
          </div>
        </div>
      </section>

      {/* ── TWO COLUMN CONTENT WITH STICKY TOC ── */}
      <div className="ff-privacy-main-layout">
        <aside className="ff-privacy-toc-sidebar">
          <div className="ff-toc-sticky-card">
            <h3 className="ff-toc-header">Table of Contents</h3>
            <nav className="ff-toc-nav">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`ff-toc-link ${activeSection === sec.id ? 'active' : ''}`}
                >
                  {sec.title}
                </a>
              ))}
            </nav>
            <div className="ff-toc-support-card">
              <div className="ff-toc-support-icon">
                <Mail size={16} />
              </div>
              <div className="ff-toc-support-text">
                <div className="ff-support-title">Have questions?</div>
                <div className="ff-support-sub">privacy@familyfit.health</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── DETAILED LEGAL ARTICLES ── */}
        <main className="ff-privacy-content-body">
          <article id="commitment" className="ff-legal-section">
            <div className="ff-section-num">Section 01</div>
            <h2>Our Privacy Commitment</h2>
            <p>
              At <strong>FamilyFit</strong>, we believe wholesome family wellness starts with absolute trust. Whether you are tracking daily calories for your toddler, planning low-glycemic Kerala meals for a parent managing diabetes, or organizing weekend family feasts, we treat your household data with the highest ethical and security standards.
            </p>
            <p>
              This Privacy Policy explains how FamilyFit ("we", "our", or "the Service") collects, protects, utilizes, and stores information when you use our web applications, responsive interfaces, and associated meal planning engines.
            </p>
            <div className="ff-callout-box">
              <Sparkles size={18} className="text-emerald-500" />
              <div>
                <strong>The Core FamilyFit Guarantee:</strong> We are a family nutrition tool, not an advertising network. Our revenue model does not depend on exploiting your personal health vulnerabilities.
              </div>
            </div>
          </article>

          <article id="data-collected" className="ff-legal-section">
            <div className="ff-section-num">Section 02</div>
            <h2>Information We Collect</h2>
            <p>To provide accurate dietary recommendations and personalized family meal guidance, we collect the following categories of information:</p>
            
            <ul className="ff-bullet-list">
              <li>
                <strong>Account Credentials:</strong> Family display name, primary email address, encrypted password hash (JWT authentication), and regional preference (Kerala / South Indian cuisine defaults).
              </li>
              <li>
                <strong>Family Member Profiles:</strong> Nickname or first name, age group (Child, Adult, Senior), gender, dietary lifestyle (Vegetarian, Non-Vegetarian, Pescatarian, Jain), and baseline activity level.
              </li>
              <li>
                <strong>Health & Dietary Goals:</strong> Target calorie ranges, macro objectives (e.g., High-Protein, Low-Carb), and wellness priorities (e.g., Blood Sugar Harmony, Muscle Gain, Digestion Support).
              </li>
              <li>
                <strong>Allergies & Food Dislikes:</strong> Specific food allergies (e.g., Peanuts, Tree Nuts, Dairy, Seafood, Eggs, Gluten) and ingredients marked as disliked to automatically exclude them from meal plans.
              </li>
              <li>
                <strong>App Usage & Pantry Lists:</strong> Favorite recipes, custom weekly meal schedule selections, grocery budget allocations, and completed pantry items.
              </li>
            </ul>
          </article>

          <article id="how-we-use" className="ff-legal-section">
            <div className="ff-section-num">Section 03</div>
            <h2>How We Use Family Data</h2>
            <p>We process your information exclusively to deliver and enhance the core capabilities of the FamilyFit platform:</p>
            
            <div className="ff-grid-subsections">
              <div className="ff-sub-card">
                <h4>🎯 Personalized Recipe Recommendations</h4>
                <p>Matching traditional Kerala recipes to each member's specific daily caloric and macronutrient targets.</p>
              </div>
              <div className="ff-sub-card">
                <h4>⚠️ Allergen Safety Filtering</h4>
                <p>Cross-referencing recipe ingredients against every family member's declared allergies to flag potential risks.</p>
              </div>
              <div className="ff-sub-card">
                <h4>🛒 Smart Grocery Scaling</h4>
                <p>Calculating exact ingredient quantities for weekly grocery runs based on family member count and budget.</p>
              </div>
              <div className="ff-sub-card">
                <h4>🌿 Age-Appropriate Nutrition Nudges</h4>
                <p>Providing scientifically grounded lifestyle tips tailored to toddlers, busy working parents, and elders.</p>
              </div>
            </div>
          </article>

          <article id="allergen-safety" className="ff-legal-section">
            <div className="ff-section-num">Section 04</div>
            <h2>Allergies & Health Records Safeguards</h2>
            <p>
              We treat dietary restrictions and allergy disclosures as <em>Sensitive Personal Data</em>. When you input an allergy (such as dairy, shellfish, or gluten):
            </p>
            <ol className="ff-ordered-list">
              <li>The information is utilized solely by the local suitability engine to display warning tags and conflict badges.</li>
              <li>Your health conditions (e.g., Diabetes, Hypertension) are never mapped to advertising profiles or shared with pharmaceutical sponsors.</li>
              <li>You may modify or delete any allergy record instantly from your Family Profile at any time.</li>
            </ol>
            <div className="ff-alert-box-warning">
              <strong>Important Notice:</strong> While our algorithmic allergy scanner searches for known ingredients and Kerala culinary variations, you must always exercise personal vigilance when preparing raw groceries and packaged store goods.
            </div>
          </article>

          <article id="data-security" className="ff-legal-section">
            <div className="ff-section-num">Section 05</div>
            <h2>Storage, Encryption & Cloud Sync</h2>
            <p>FamilyFit implements enterprise-grade technical safeguards to defend your data:</p>
            <ul className="ff-bullet-list">
              <li><strong>In-Transit Encryption:</strong> All data exchanged between your browser and our servers is encrypted using Transport Layer Security (TLS 1.3 / HTTPS).</li>
              <li><strong>Token Authentication:</strong> We utilize short-lived JSON Web Tokens (JWT) stored in secure browser storage with automated expiration.</li>
              <li><strong>Local Storage Redundancy:</strong> Offline meal plans and cached recipes remain isolated within your browser's private application sandbox.</li>
              <li><strong>Zero Plaintext Storage:</strong> Passwords are cryptographic hashes generated via industry-standard hashing algorithms (BCrypt / Argon2).</li>
            </ul>
          </article>

          <article id="children-seniors" className="ff-legal-section">
            <div className="ff-section-num">Section 06</div>
            <h2>Minors & Senior Family Members' Data Protection</h2>
            <p>
              FamilyFit is designed for household administration by parents, legal guardians, or designated heads of families.
            </p>
            <p>
              We do not knowingly allow children under 13 to create standalone individual user accounts. Child member profiles exist strictly as sub-profiles administered under a primary adult account. We do not track children across external websites, and no child profile data is subjected to predictive commercial marketing.
            </p>
          </article>

          <article id="cookies" className="ff-legal-section">
            <div className="ff-section-num">Section 07</div>
            <h2>Cookies & Local Storage Usage</h2>
            <p>
              We use minimal, strictly necessary cookies and browser local storage:
            </p>
            <div className="ff-table-wrapper">
              <table className="ff-cookie-table">
                <thead>
                  <tr>
                    <th>Storage Key</th>
                    <th>Purpose</th>
                    <th>Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>familyfit_token</code></td>
                    <td>Secure session authentication & API access</td>
                    <td>Session / 30 Days</td>
                  </tr>
                  <tr>
                    <td><code>familyfit_saved_recipes</code></td>
                    <td>Your bookmarked favorites list for quick access</td>
                    <td>Persistent Local</td>
                  </tr>
                  <tr>
                    <td><code>familyfit_grocery_state</code></td>
                    <td>Active checklist items & pantry purchases</td>
                    <td>Persistent Local</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article id="your-rights" className="ff-legal-section">
            <div className="ff-section-num">Section 08</div>
            <h2>Your Rights & Data Deletion</h2>
            <p>Under international privacy regulations (including India's DPDP Act, EU GDPR, and CCPA), you hold full sovereign authority over your data:</p>
            <div className="ff-rights-grid">
              <div className="ff-right-item">
                <CheckCircle size={18} className="text-emerald-500" />
                <div>
                  <strong>Right to Access:</strong> View all family member profiles, nutrition logs, and stored credentials at any time in your Profile dashboard.
                </div>
              </div>
              <div className="ff-right-item">
                <CheckCircle size={18} className="text-emerald-500" />
                <div>
                  <strong>Right to Correction:</strong> Update ages, dietary tags, calorie targets, and allergies with real-time propagation across meal plans.
                </div>
              </div>
              <div className="ff-right-item">
                <CheckCircle size={18} className="text-emerald-500" />
                <div>
                  <strong>Right to Erasure:</strong> Request permanent purging of your account and all associated family records within 72 hours.
                </div>
              </div>
              <div className="ff-right-item">
                <CheckCircle size={18} className="text-emerald-500" />
                <div>
                  <strong>Right to Portability:</strong> Request an export of your saved recipes and family dietary records in JSON or CSV format.
                </div>
              </div>
            </div>
          </article>

          <article id="contact" className="ff-legal-section">
            <div className="ff-section-num">Section 09</div>
            <h2>Contact Privacy Officer</h2>
            <p>
              If you have any questions, grievances, or data portability requests regarding this Privacy Policy, our dedicated Data Protection Officer is ready to assist:
            </p>
            
            <div className="ff-contact-card">
              <div className="ff-contact-row">
                <Mail size={18} className="text-emerald-600" />
                <span><strong>Email:</strong> privacy@familyfit.health</span>
              </div>
              <div className="ff-contact-row">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span><strong>Grievance Office:</strong> FamilyFit Health Technologies, Infopark Kochi, Kerala, India - 682042</span>
              </div>
              <div className="ff-contact-row">
                <FileText size={18} className="text-emerald-600" />
                <span><strong>Response SLA:</strong> Verified responses within 48 business hours</span>
              </div>
            </div>

            <div className="ff-final-cta-bar">
              <button onClick={() => navigate('/')} className="ff-btn-primary-pill">
                Return to FamilyFit Dashboard
              </button>
              <button onClick={() => navigate('/terms')} className="ff-btn-secondary-pill">
                Read Terms & Conditions
              </button>
            </div>
          </article>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* ── EMBEDDED STYLES ── */}
      <style>{`
        .ff-privacy-page-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0A0F1D' : '#F8FAF6'};
          color: ${isDark ? '#E2E8F0' : '#1F2937'};
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .ff-privacy-header-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: ${isDark ? 'rgba(10, 15, 29, 0.92)' : 'rgba(255, 255, 255, 0.92)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E2EBE0'};
        }

        .ff-privacy-header-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ff-privacy-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: ${isDark ? '#1E293B' : '#EDF4E8'};
          border: 1px solid ${isDark ? '#334155' : '#D5E2D0'};
          color: ${isDark ? '#E2E8F0' : '#2D4428'};
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ff-privacy-back-btn:hover {
          background: #2E7D32;
          color: #FFFFFF;
          border-color: #2E7D32;
          transform: translateX(-2px);
        }

        .ff-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          color: ${isDark ? '#F1F5F9' : '#1E2E1B'};
        }

        .ff-brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
        }

        .ff-privacy-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ff-btn-icon-subtle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid ${isDark ? '#2D3748' : '#D1DDD0'};
          color: ${isDark ? '#94A3B8' : '#4A5568'};
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ff-btn-icon-subtle:hover {
          background: ${isDark ? '#1E293B' : '#EAF2E6'};
          color: ${isDark ? '#FFFFFF' : '#1A2E16'};
        }

        /* HERO */
        .ff-privacy-hero {
          background: ${isDark 
            ? 'linear-gradient(180deg, #101B2B 0%, #0A0F1D 100%)' 
            : 'linear-gradient(180deg, #EDF5EA 0%, #F8FAF6 100%)'};
          padding: 56px 24px 36px 24px;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E2EBE0'};
        }

        .ff-privacy-hero-inner {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .ff-privacy-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: ${isDark ? 'rgba(16, 185, 129, 0.15)' : '#E3F2DF'};
          color: ${isDark ? '#34D399' : '#23611B'};
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
          padding: 5px 14px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .ff-privacy-title {
          font-size: 38px;
          font-weight: 900;
          color: ${isDark ? '#FFFFFF' : '#112210'};
          letter-spacing: -0.6px;
          margin: 0 0 16px 0;
          line-height: 1.15;
        }

        @media (max-width: 640px) {
          .ff-privacy-title {
            font-size: 30px;
          }
        }

        .ff-privacy-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: ${isDark ? '#94A3B8' : '#4B5C47'};
          margin: 0 0 24px 0;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        .ff-privacy-meta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 12.5px;
          color: ${isDark ? '#64748B' : '#687764'};
          flex-wrap: wrap;
        }

        .ff-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .ff-meta-dot {
          color: #94A3B8;
        }

        /* HIGHLIGHT CARDS */
        .ff-privacy-highlights-container {
          max-width: 1280px;
          margin: -24px auto 40px auto;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .ff-privacy-highlights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        @media (max-width: 1024px) {
          .ff-privacy-highlights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .ff-privacy-highlights-grid {
            grid-template-columns: 1fr;
          }
        }

        .ff-highlight-card {
          background: ${isDark ? '#131C2D' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E293B' : '#DFE8DC'};
          border-radius: 20px;
          padding: 24px;
          box-shadow: ${isDark ? '0 10px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(47,107,31,0.06)'};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ff-highlight-card:hover {
          transform: translateY(-3px);
          box-shadow: ${isDark ? '0 16px 32px rgba(0,0,0,0.45)' : '0 12px 28px rgba(47,107,31,0.12)'};
        }

        .ff-highlight-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .ff-highlight-icon-wrap.emerald { background: #D1FAE5; color: #059669; }
        .ff-highlight-icon-wrap.blue    { background: #DBEAFE; color: #2563EB; }
        .ff-highlight-icon-wrap.purple  { background: #F3E8FF; color: #7C3AED; }
        .ff-highlight-icon-wrap.amber   { background: #FEF3C7; color: #D97706; }

        .ff-highlight-head {
          font-size: 16px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1A2B17'};
          margin: 0 0 8px 0;
        }

        .ff-highlight-desc {
          font-size: 13px;
          line-height: 1.55;
          color: ${isDark ? '#94A3B8' : '#556551'};
          margin: 0;
        }

        /* TWO COLUMN MAIN CONTENT */
        .ff-privacy-main-layout {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 80px 24px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 48px;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .ff-privacy-main-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .ff-privacy-toc-sidebar {
            display: none;
          }
        }

        .ff-toc-sticky-card {
          position: sticky;
          top: 88px;
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2A3E' : '#DFE8DC'};
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }

        .ff-toc-header {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${isDark ? '#94A3B8' : '#5E6F5A'};
          margin: 0 0 14px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#EDF2EA'};
        }

        .ff-toc-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ff-toc-link {
          font-size: 13px;
          color: ${isDark ? '#94A3B8' : '#4B5947'};
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.15s ease;
          display: block;
          font-weight: 500;
        }

        .ff-toc-link:hover, .ff-toc-link.active {
          background: ${isDark ? 'rgba(16, 185, 129, 0.15)' : '#EDF6EA'};
          color: #2E7D32;
          font-weight: 700;
        }

        .ff-toc-support-card {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid ${isDark ? '#1E293B' : '#EDF2EA'};
        }

        .ff-toc-support-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: ${isDark ? '#1E293B' : '#EDF5EA'};
          color: #2E7D32;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ff-support-title {
          font-size: 12px;
          font-weight: 700;
          color: ${isDark ? '#F1F5F9' : '#1A2B17'};
        }

        .ff-support-sub {
          font-size: 11px;
          color: #94A3B8;
        }

        /* ARTICLE BODY */
        .ff-privacy-content-body {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2A3E' : '#DFE8DC'};
          border-radius: 24px;
          padding: 44px 52px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.03);
        }

        @media (max-width: 640px) {
          .ff-privacy-content-body {
            padding: 28px 20px;
          }
        }

        .ff-legal-section {
          padding-bottom: 40px;
          margin-bottom: 40px;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#EDF2EA'};
          scroll-margin-top: 96px;
        }

        .ff-legal-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .ff-section-num {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #2E7D32;
          margin-bottom: 6px;
        }

        .ff-legal-section h2 {
          font-size: 24px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#112210'};
          margin: 0 0 16px 0;
          letter-spacing: -0.3px;
        }

        .ff-legal-section p {
          font-size: 15px;
          line-height: 1.7;
          color: ${isDark ? '#CBD5E1' : '#3E4D3A'};
          margin: 0 0 16px 0;
        }

        .ff-callout-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: ${isDark ? 'rgba(16, 185, 129, 0.1)' : '#EFF8EC'};
          border-left: 4px solid #10B981;
          padding: 16px 20px;
          border-radius: 0 14px 14px 0;
          font-size: 14px;
          line-height: 1.55;
          color: ${isDark ? '#E2E8F0' : '#23441E'};
          margin: 20px 0;
        }

        .ff-alert-box-warning {
          background: ${isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2'};
          border-left: 4px solid #EF4444;
          padding: 16px 20px;
          border-radius: 0 14px 14px 0;
          font-size: 14px;
          line-height: 1.55;
          color: ${isDark ? '#FCA5A5' : '#991B1B'};
          margin: 20px 0;
        }

        .ff-bullet-list, .ff-ordered-list {
          padding-left: 20px;
          margin: 0 0 20px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14.5px;
          line-height: 1.65;
          color: ${isDark ? '#CBD5E1' : '#3E4D3A'};
        }

        .ff-grid-subsections {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        @media (max-width: 640px) {
          .ff-grid-subsections {
            grid-template-columns: 1fr;
          }
        }

        .ff-sub-card {
          background: ${isDark ? '#141E30' : '#F6FAF4'};
          border: 1px solid ${isDark ? '#23324C' : '#DFEAD9'};
          border-radius: 16px;
          padding: 18px;
        }

        .ff-sub-card h4 {
          font-size: 14.5px;
          font-weight: 700;
          color: ${isDark ? '#FFFFFF' : '#1A2B17'};
          margin: 0 0 6px 0;
        }

        .ff-sub-card p {
          font-size: 13px;
          color: ${isDark ? '#94A3B8' : '#576653'};
          margin: 0;
          line-height: 1.5;
        }

        .ff-table-wrapper {
          overflow-x: auto;
          margin: 20px 0;
        }

        .ff-cookie-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .ff-cookie-table th {
          background: ${isDark ? '#192438' : '#EAF2E6'};
          color: ${isDark ? '#FFFFFF' : '#1A2E16'};
          font-weight: 700;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 2px solid ${isDark ? '#2C3A52' : '#D1DFCE'};
        }

        .ff-cookie-table td {
          padding: 12px 16px;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E7EFE4'};
          color: ${isDark ? '#CBD5E1' : '#3E4D3A'};
        }

        .ff-cookie-table code {
          background: ${isDark ? '#212E45' : '#E1EBE0'};
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 12px;
          color: #2E7D32;
        }

        .ff-rights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        @media (max-width: 640px) {
          .ff-rights-grid {
            grid-template-columns: 1fr;
          }
        }

        .ff-right-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: ${isDark ? '#141E30' : '#F6FAF4'};
          border: 1px solid ${isDark ? '#23324C' : '#DFEAD9'};
          padding: 16px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.55;
        }

        .ff-contact-card {
          background: ${isDark ? '#141E30' : '#F4F9F2'};
          border: 1px solid ${isDark ? '#23324C' : '#DCE8D8'};
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 24px 0;
        }

        .ff-contact-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .ff-final-cta-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .ff-btn-primary-pill {
          background: linear-gradient(135deg, #2E7D32 0%, #1E5C22 100%);
          color: #FFFFFF;
          border: none;
          padding: 12px 26px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(46, 125, 50, 0.25);
          transition: all 0.2s ease;
        }

        .ff-btn-primary-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(46, 125, 50, 0.35);
        }

        .ff-btn-secondary-pill {
          background: ${isDark ? '#1E293B' : '#FFFFFF'};
          border: 1.5px solid ${isDark ? '#334155' : '#D1DCD0'};
          color: ${isDark ? '#E2E8F0' : '#2D3F2B'};
          padding: 12px 24px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ff-btn-secondary-pill:hover {
          background: ${isDark ? '#2D3748' : '#EDF4EA'};
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
