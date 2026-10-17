import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  FileText, 
  AlertTriangle, 
  Scale, 
  ArrowLeft, 
  CheckCircle, 
  Share2, 
  Printer, 
  Calendar, 
  ShieldAlert, 
  UtensilsCrossed, 
  Users, 
  Mail,
  HelpCircle
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import Footer from '../components/Footer'

const SECTIONS = [
  { id: 'agreement', title: '1. Agreement to Terms' },
  { id: 'eligibility', title: '2. User Accounts & Family Profiles' },
  { id: 'medical-disclaimer', title: '3. Medical & Nutritional Disclaimer' },
  { id: 'allergen-disclaimer', title: '4. Allergen & Ingredient Safety' },
  { id: 'macro-accuracy', title: '5. Macro & Caloric Estimations' },
  { id: 'user-conduct', title: '6. Acceptable Use & Conduct' },
  { id: 'intellectual-property', title: '7. Intellectual Property & Recipes' },
  { id: 'service-changes', title: '8. Modifications & Service Uptime' },
  { id: 'limitation-liability', title: '9. Limitation of Liability' },
  { id: 'governing-law', title: '10. Governing Law & Jurisdiction' },
  { id: 'contact', title: '11. Support & Grievances' },
]

export default function TermsConditionsPage() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('agreement')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FamilyFit Terms and Conditions',
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
    <div className="ff-terms-page-root">
      {/* ── TOP NAV HEADER BAR ── */}
      <header className="ff-terms-header-bar">
        <div className="ff-terms-header-content">
          <button onClick={() => navigate(-1)} className="ff-terms-back-btn">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="ff-terms-nav-brand">
            <Link to="/" className="ff-brand-link">
              <span className="ff-brand-dot" />
              <span>FamilyFit Legal & Terms</span>
            </Link>
          </div>
          <div className="ff-terms-header-actions">
            <button onClick={handleShare} className="ff-btn-icon-subtle" title="Share link">
              <Share2 size={16} />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button onClick={handlePrint} className="ff-btn-icon-subtle" title="Print terms">
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="ff-terms-hero">
        <div className="ff-terms-hero-inner">
          <div className="ff-terms-badge">
            <Scale size={16} className="text-emerald-500" />
            <span>Official User Agreement & Community Guidelines</span>
          </div>
          <h1 className="ff-terms-title">Terms & Conditions</h1>
          <p className="ff-terms-subtitle">
            Please read these terms carefully before utilizing FamilyFit. By accessing our platform, meal planning algorithms, or Kerala culinary database, you agree to be bound by these provisions.
          </p>

          <div className="ff-terms-meta-row">
            <div className="ff-meta-item">
              <Calendar size={15} />
              <span>Effective Date: October 2026</span>
            </div>
            <div className="ff-meta-dot">•</div>
            <div className="ff-meta-item">
              <FileText size={15} />
              <span>Version 2.4 (All Jurisdictions)</span>
            </div>
            <div className="ff-meta-dot">•</div>
            <div className="ff-meta-item">
              <CheckCircle size={15} className="text-emerald-500" />
              <span>Binding Legal Agreement</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 SUMMARY HIGHLIGHT CARDS ── */}
      <section className="ff-terms-highlights-container">
        <div className="ff-terms-highlights-grid">
          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap amber">
              <AlertTriangle size={22} />
            </div>
            <h4 className="ff-highlight-head">Not Medical Advice</h4>
            <p className="ff-highlight-desc">
              FamilyFit provides dietary ideas and nutritional tracking. Always consult qualified healthcare professionals for medical conditions.
            </p>
          </div>

          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap red">
              <ShieldAlert size={22} />
            </div>
            <h4 className="ff-highlight-head">Allergen Verification</h4>
            <p className="ff-highlight-desc">
              Cross-contamination in grocery supplies and kitchens is unpredictable. Always verify physical food packaging before serving.
            </p>
          </div>

          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap blue">
              <Users size={22} />
            </div>
            <h4 className="ff-highlight-head">Family Account Care</h4>
            <p className="ff-highlight-desc">
              The primary account holder assumes responsibility for accuracy when creating profiles for minors and dependent elders.
            </p>
          </div>

          <div className="ff-highlight-card">
            <div className="ff-highlight-icon-wrap emerald">
              <UtensilsCrossed size={22} />
            </div>
            <h4 className="ff-highlight-head">Recipe Integrity</h4>
            <p className="ff-highlight-desc">
              Our curated Kerala heritage recipes and meal algorithms are protected by copyright for personal, non-commercial household use.
            </p>
          </div>
        </div>
      </section>

      {/* ── TWO COLUMN LAYOUT WITH TOC ── */}
      <div className="ff-terms-main-layout">
        <aside className="ff-terms-toc-sidebar">
          <div className="ff-toc-sticky-card">
            <h3 className="ff-toc-header">Sections</h3>
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
                <HelpCircle size={16} />
              </div>
              <div className="ff-toc-support-text">
                <div className="ff-support-title">Need clarification?</div>
                <div className="ff-support-sub">legal@familyfit.health</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ARTICLES ── */}
        <main className="ff-terms-content-body">
          <article id="agreement" className="ff-legal-section">
            <div className="ff-section-num">Section 01</div>
            <h2>Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement between you ("User", "Account Holder", or "you") and <strong>FamilyFit Health Technologies</strong> ("FamilyFit", "we", "us", or "our"), governing your access to and use of our web portal, responsive applications, and nutritional planning tools.
            </p>
            <p>
              By signing up, logging in, or continuing to browse and use FamilyFit, you confirm that you have read, understood, and agreed to be bound by all of these Terms. If you do not agree, you must immediately discontinue use of the Service.
            </p>
          </article>

          <article id="eligibility" className="ff-legal-section">
            <div className="ff-section-num">Section 02</div>
            <h2>User Accounts & Family Profiles</h2>
            <p>
              To access personalized meal planning, you must register for a family account:
            </p>
            <ul className="ff-bullet-list">
              <li>
                <strong>Account Age:</strong> You must be at least 18 years of age or the age of legal majority in your jurisdiction to establish an account.
              </li>
              <li>
                <strong>Household Representation:</strong> You may add sub-profiles for your immediate family members (spouse, children, parents, elders). You represent that you possess lawful authority to manage dietary planning for everyone in your household profile.
              </li>
              <li>
                <strong>Security:</strong> You are responsible for safeguarding your login credentials. FamilyFit is not liable for unauthorized actions taken through compromised passwords.
              </li>
            </ul>
          </article>

          <article id="medical-disclaimer" className="ff-legal-section">
            <div className="ff-section-num">Section 03</div>
            <h2>Medical & Nutritional Health Disclaimer</h2>
            <div className="ff-alert-box-warning">
              <strong>CRITICAL NOTICE:</strong> FAMILYFIT IS AN EDUCATIONAL LIFESTYLE AND NUTRITION PLANNING UTILITY. IT DOES NOT PROVIDE MEDICAL ADVICE, CLINICAL DIAGNOSIS, OR THERAPEUTIC TREATMENT FOR ANY DISEASE.
            </div>
            <p>
              The nutritional breakdowns, calorie targets, macro splits, and recipe suggestions provided across FamilyFit:
            </p>
            <ol className="ff-ordered-list">
              <li>Are general estimates synthesized from public nutritional datasets (e.g., USDA, National Institute of Nutrition India) and traditional culinary guidelines.</li>
              <li>Should never replace consultation with a licensed clinical dietitian, physician, or certified endocrinologist.</li>
              <li>Do not guarantee specific weight loss, blood sugar reversal, or athletic performance outcomes, as individual metabolic responses vary widely.</li>
            </ol>
            <p>
              If a family member experiences acute symptoms, unexpected allergic reactions, or severe digestive distress, seek emergency medical care immediately.
            </p>
          </article>

          <article id="allergen-disclaimer" className="ff-legal-section">
            <div className="ff-section-num">Section 04</div>
            <h2>Allergen & Ingredient Safety Responsibility</h2>
            <p>
              FamilyFit provides an automated <strong>Allergy & Dislike Warning Engine</strong>. While our algorithms cross-reference common ingredient strings (such as dairy, seafood, eggs, peanuts, tree nuts, and gluten):
            </p>
            <ul className="ff-bullet-list">
              <li>
                <strong>Packaging Variations:</strong> Commercial food brands, packaged spice mixes (masalas), and restaurant preparations frequently alter formulations or process ingredients in facilities with trace allergens.
              </li>
              <li>
                <strong>User Duty:</strong> You remain strictly responsible for inspecting physical food labels, raw ingredients, and expiration dates prior to cooking or consumption.
              </li>
              <li>
                <strong>No Liability:</strong> FamilyFit disclaims all liability for accidental ingestion of allergens or adverse physical reactions resulting from food prepared using our recipe ideas.
              </li>
            </ul>
          </article>

          <article id="macro-accuracy" className="ff-legal-section">
            <div className="ff-section-num">Section 05</div>
            <h2>Macro & Caloric Estimations</h2>
            <p>
              Traditional Kerala cooking utilizes variable home measures (e.g., "half a scraped coconut", "a fistful of curry leaves", "one ladle of coconut oil"). Consequently:
            </p>
            <p>
              All listed calories, protein grams, carbohydrate counts, and fat metrics represent calculated culinary approximations. Variances in specific oil brands, cooking temperatures, rice polishing methods (e.g., Single Boiled vs Double Boiled Matta), and portion sizing will affect actual macronutrient outcomes.
            </p>
          </article>

          <article id="user-conduct" className="ff-legal-section">
            <div className="ff-section-num">Section 06</div>
            <h2>Acceptable Use & Conduct</h2>
            <p>When using FamilyFit, you agree that you will not:</p>
            <ul className="ff-bullet-list">
              <li>Use automated scrapers, bots, or crawlers to extract our recipe database or proprietary algorithms without written authorization.</li>
              <li>Attempt to reverse engineer, decompile, or compromise the security architecture of the application or cloud databases.</li>
              <li>Submit abusive, defamatory, or deceptive content through feedback forms or support channels.</li>
              <li>Resell, redistribute, or commercially exploit meal plan outputs generated by the platform.</li>
            </ul>
          </article>

          <article id="intellectual-property" className="ff-legal-section">
            <div className="ff-section-num">Section 07</div>
            <h2>Intellectual Property & Recipes</h2>
            <p>
              The FamilyFit brand, logo, application interface, visual design tokens, curated Kerala photography, software code, and editorial guidance are the exclusive intellectual property of FamilyFit Health Technologies.
            </p>
            <p>
              You are granted a limited, revocable, non-exclusive license to view and print recipes for personal domestic use within your household. Commercial reproduction or public publishing without attribution is strictly prohibited.
            </p>
          </article>

          <article id="service-changes" className="ff-legal-section">
            <div className="ff-section-num">Section 08</div>
            <h2>Modifications & Service Uptime</h2>
            <p>
              We continually enhance FamilyFit by adding new Kerala regional recipes, optimizing nutrient calculation models, and improving mobile responsive views. We reserve the right to modify or temporarily suspend features with or without prior notice.
            </p>
          </article>

          <article id="limitation-liability" className="ff-legal-section">
            <div className="ff-section-num">Section 09</div>
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, FamilyFit and its officers, directors, dietitians, and developers shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from:
            </p>
            <ol className="ff-ordered-list">
              <li>Your reliance on recipe information, caloric targets, or grocery budget estimations.</li>
              <li>Any allergic reaction, culinary injury, or kitchen burn sustained while cooking recipes found on the platform.</li>
              <li>Temporary technical outages or inability to access cloud synchronization.</li>
            </ol>
          </article>

          <article id="governing-law" className="ff-legal-section">
            <div className="ff-section-num">Section 10</div>
            <h2>Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any legal dispute, arbitration, or claim arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ernakulam / Kochi, Kerala, India</strong>.
            </p>
          </article>

          <article id="contact" className="ff-legal-section">
            <div className="ff-section-num">Section 11</div>
            <h2>Support & Grievances</h2>
            <p>
              For legal inquiries, copyright notices, or account assistance, please reach out to our legal team:
            </p>
            <div className="ff-contact-card">
              <div className="ff-contact-row">
                <Mail size={18} className="text-emerald-600" />
                <span><strong>Legal Counsel:</strong> legal@familyfit.health</span>
              </div>
              <div className="ff-contact-row">
                <Scale size={18} className="text-emerald-600" />
                <span><strong>Corporate Office:</strong> FamilyFit Health Technologies, Infopark Kochi, Kerala, India</span>
              </div>
            </div>

            <div className="ff-final-cta-bar">
              <button onClick={() => navigate('/')} className="ff-btn-primary-pill">
                I Understand & Agree — Continue
              </button>
              <button onClick={() => navigate('/privacy')} className="ff-btn-secondary-pill">
                View Privacy Policy
              </button>
            </div>
          </article>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* ── EMBEDDED STYLES ── */}
      <style>{`
        .ff-terms-page-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0A0F1D' : '#F8FAF6'};
          color: ${isDark ? '#E2E8F0' : '#1F2937'};
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .ff-terms-header-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: ${isDark ? 'rgba(10, 15, 29, 0.92)' : 'rgba(255, 255, 255, 0.92)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E2EBE0'};
        }

        .ff-terms-header-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ff-terms-back-btn {
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

        .ff-terms-back-btn:hover {
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

        .ff-terms-header-actions {
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
        .ff-terms-hero {
          background: ${isDark 
            ? 'linear-gradient(180deg, #101B2B 0%, #0A0F1D 100%)' 
            : 'linear-gradient(180deg, #EDF5EA 0%, #F8FAF6 100%)'};
          padding: 56px 24px 36px 24px;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E2EBE0'};
        }

        .ff-terms-hero-inner {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .ff-terms-badge {
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

        .ff-terms-title {
          font-size: 38px;
          font-weight: 900;
          color: ${isDark ? '#FFFFFF' : '#112210'};
          letter-spacing: -0.6px;
          margin: 0 0 16px 0;
          line-height: 1.15;
        }

        @media (max-width: 640px) {
          .ff-terms-title {
            font-size: 30px;
          }
        }

        .ff-terms-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: ${isDark ? '#94A3B8' : '#4B5C47'};
          margin: 0 0 24px 0;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }

        .ff-terms-meta-row {
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
        .ff-terms-highlights-container {
          max-width: 1280px;
          margin: -24px auto 40px auto;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .ff-terms-highlights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        @media (max-width: 1024px) {
          .ff-terms-highlights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .ff-terms-highlights-grid {
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

        .ff-highlight-icon-wrap.amber   { background: #FEF3C7; color: #D97706; }
        .ff-highlight-icon-wrap.red     { background: #FEE2E2; color: #DC2626; }
        .ff-highlight-icon-wrap.blue    { background: #DBEAFE; color: #2563EB; }
        .ff-highlight-icon-wrap.emerald { background: #D1FAE5; color: #059669; }

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
        .ff-terms-main-layout {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 80px 24px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 48px;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .ff-terms-main-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .ff-terms-toc-sidebar {
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
        .ff-terms-content-body {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2A3E' : '#DFE8DC'};
          border-radius: 24px;
          padding: 44px 52px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.03);
        }

        @media (max-width: 640px) {
          .ff-terms-content-body {
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
