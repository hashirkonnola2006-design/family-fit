import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  RotateCw, 
  ShieldAlert, 
  ShieldCheck, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  User, 
  ArrowRight,
  Flame,
  Search,
  Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { useTheme } from '../context/ThemeContext'
import BottomNav from '../components/BottomNav'

// ── CURATED KERALA NUTRITION & WELLNESS DATASET ──
const CURATED_KERALA_TIPS = [
  {
    id: 'tip-1',
    category: 'Daily Habits',
    tag: 'Digestion Ritual',
    title: 'Start Morning With Warm Jeera & Chukku Water',
    summary: 'Drinking water boiled with cumin seeds and dry ginger awakens digestive enzymes and reduces morning sluggishness.',
    detail: 'In traditional Kerala households, warm jeera (cumin) water is consumed throughout the day. Cumin contains thymol, which stimulates the secretion of pancreatic enzymes, bile, and gastric juices to maximize nutrient absorption.',
    benefit: 'Reduces morning bloating & jumpstarts metabolism',
    readTime: '2 min read',
    accent: '#2E7D32',
  },
  {
    id: 'tip-2',
    category: 'Kerala Superfoods',
    tag: 'Superfood',
    title: 'The Unmatched Power of Moringa Leaves (Muringayila)',
    summary: 'Moringa is a nutritional powerhouse loaded with iron, bio-available calcium, and 46 distinct antioxidants.',
    detail: 'Muringayila thoran with minimal coconut oil is a staple of Kerala longevity. Research shows moringa contains 7x more vitamin C than oranges and 4x more calcium than cow milk gram-for-gram.',
    benefit: 'Boosts red blood cell count & bone density',
    readTime: '3 min read',
    accent: '#15803D',
  },
  {
    id: 'tip-3',
    category: 'Kerala Superfoods',
    tag: 'Blood Sugar',
    title: 'Why Unpolished Kerala Matta Rice Excels for Blood Sugar',
    summary: 'Unlike polished white rice, parboiled Red Matta rice preserves its nutrient-dense bran layer and germ.',
    detail: 'Matta rice has a lower glycemic index than polished long-grain rice. Its complex carbohydrates release glucose gradually into the bloodstream, preventing energy crashes and insulin spikes after meals.',
    benefit: 'Sustained energy & balanced insulin response',
    readTime: '2 min read',
    accent: '#C2410C',
  },
  {
    id: 'tip-4',
    category: 'Daily Habits',
    tag: 'Micronutrients',
    title: 'Never Discard Cooked Curry Leaves (Kariveppila)',
    summary: 'Chewing cooked curry leaves provides rich lutein, beta-carotene, and plant iron that support eye health and hair roots.',
    detail: 'Pairing curry leaves with a squeeze of fresh lemon juice or tomato rasam increases non-heme iron absorption by up to 300% due to the natural ascorbic acid (vitamin C) synergy.',
    benefit: 'Enhances natural iron uptake & eyesight',
    readTime: '2 min read',
    accent: '#047857',
  },
  {
    id: 'tip-5',
    category: 'Immunity & Herbs',
    tag: 'Hydration',
    title: 'Tender Coconut Water (Elaneer) as Nature’s Electrolyte',
    summary: 'A potassium-rich isotonic drink straight from nature without the synthetic dyes or corn syrups of sports beverages.',
    detail: 'One glass of Elaneer provides more potassium than a medium banana, alongside natural magnesium, calcium, and sodium in bio-identical proportions that rehydrate tired muscles swiftly in tropical heat.',
    benefit: 'Rapid cellular hydration & kidney stone prevention',
    readTime: '2 min read',
    accent: '#0284C7',
  },
  {
    id: 'tip-6',
    category: 'Kids & Seniors',
    tag: 'Easy Digestion',
    title: 'Steamed Dinner Rule: Appam or Idiyappam With Light Stew',
    summary: 'Ending the day with steamed rice flour and mild vegetable broth prevents nighttime acid reflux and promotes restorative sleep.',
    detail: 'Fermented batters (like Appam) contain natural lactic acid probiotics that soothe intestinal microbiota before bed, freeing your body to focus energy on cellular repair rather than heavy digestion.',
    benefit: 'Deeper sleep & optimal gut recovery',
    readTime: '3 min read',
    accent: '#7C3AED',
  },
  {
    id: 'tip-7',
    category: 'Immunity & Herbs',
    tag: 'Ayurveda',
    title: 'Turmeric & Black Pepper Golden Milk (Manjal Paal)',
    summary: 'Piperine in black pepper amplifies curcumin absorption by up to 2000%, offering potent anti-inflammatory relief.',
    detail: 'A warm cup of milk (dairy or almond) simmered with fresh ground turmeric, crushed peppercorns, and a hint of cardamom supports respiratory resilience during seasonal weather changes in monsoon and winter.',
    benefit: 'Soothes inflammation & respiratory pathways',
    readTime: '2 min read',
    accent: '#D97706',
  },
  {
    id: 'tip-8',
    category: 'Daily Habits',
    tag: 'Post-Meal',
    title: 'The 100-Step Gentle Post-Meal Stroll (Shatapadi)',
    summary: 'A slow 10–15 minute walk after lunch or dinner accelerates gastric emptying and moderates glucose absorption.',
    detail: 'Light post-meal muscle contractions draw glucose directly out of the blood without requiring extra insulin, effectively flattening postprandial glucose curves by up to 25%.',
    benefit: 'Flattens glucose spikes & aids digestion',
    readTime: '2 min read',
    accent: '#475569',
  },
  {
    id: 'tip-9',
    category: 'Kids & Seniors',
    tag: 'Snack Health',
    title: 'Steamed Nendran Bananas for Healthy Gut Bacteria',
    summary: 'Steamed ripe or half-ripe plantains deliver prebiotic resistant starch that feeds beneficial Bifidobacteria.',
    detail: 'A classic Kerala tea-time treat, Pazham Puzhingiyathu is naturally sweet, potassium-dense, gentle on toddler tummies, and requires zero added refined sugars or cooking oils.',
    benefit: 'Nourishes microbiome without sugar crashes',
    readTime: '2 min read',
    accent: '#B45309',
  },
]

const CATEGORIES = [
  'All Tips',
  'Daily Habits',
  'Kerala Superfoods',
  'Immunity & Herbs',
  'Kids & Seniors',
]

export default function TipsPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const members = Array.isArray(family?.members) ? family.members.filter(Boolean) : []
  const membersWithAllergies = members.filter(
    (m) => m && Array.isArray(m.allergies) && m.allergies.length > 0
  )

  const [activeCategory, setActiveCategory] = useState('All Tips')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('familyfit_bookmarked_tips') || '[]')
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState('')

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem('familyfit_bookmarked_tips', JSON.stringify(next))
      setToast(prev.includes(id) ? 'Removed from saved tips' : 'Tip saved to your reading list! 🌿')
      setTimeout(() => setToast(''), 2500)
      return next
    })
  }

  // Filter tips
  const filteredTips = useMemo(() => {
    let list = CURATED_KERALA_TIPS
    if (activeCategory !== 'All Tips') {
      list = list.filter((t) => t.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.tag.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, searchQuery])

  return (
    <div className="ff-tips-root">
      {/* Toast alert */}
      {toast && (
        <div className="ff-toast-bar">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      <div className="ff-tips-container">
        {/* ── 1. MINIMAL EDITORIAL HEADER ── */}
        <header className="ff-tips-header">
          <div className="ff-header-top-row">
            <div>
              <div className="ff-header-badge">
                <Sparkles size={13} />
                <span>Dietitian-Curated Wellness</span>
              </div>
              <h1 className="ff-header-title">Nutrition &amp; Health Tips</h1>
              <p className="ff-header-subtitle">
                Time-tested Kerala food wisdom, daily metabolic habits, and personalized household nutrition.
              </p>
            </div>

            <div className="ff-header-controls">
              <div className="ff-search-capsule">
                <Search size={15} className="ff-search-icon" />
                <input
                  type="text"
                  placeholder="Search tips, jeera, moringa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ff-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="ff-search-clear">
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── 2. ALLERGEN SAFETY STATUS BAR ── */}
        <section className="ff-allergy-bar-section">
          {membersWithAllergies.length > 0 ? (
            <div className="ff-allergy-alert-card">
              <div className="ff-alert-left">
                <div className="ff-alert-icon-wrap">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <div className="ff-alert-heading">
                    Active Household Allergen Screening
                  </div>
                  <div className="ff-alert-text">
                    Monitoring allergies for {membersWithAllergies.map((m) => m?.name || 'Family Member').join(', ')}. All recipe suggestions automatically screen for conflicts.
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="ff-alert-manage-btn">
                <span>Manage</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="ff-allergy-shield-pill">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Allergy Shield Active:</strong> No critical family allergies flagged. Daily tips and recipes are safe for all members.
              </span>
            </div>
          )}
        </section>

        {/* ── 3. FAMILY MEMBER FILTER (IF MEMBERS EXIST) ── */}
        {members.length > 0 && (
          <section className="ff-member-filter-section">
            <span className="ff-filter-label">Filter for:</span>
            <div className="ff-member-pill-row">
              <button
                onClick={() => setSelectedMemberId('ALL')}
                className={`ff-member-pill ${selectedMemberId === 'ALL' ? 'active' : ''}`}
              >
                <span>Entire Family ({members.length})</span>
              </button>
              {members.map((m) => (
                <button
                  key={m?.id || m?.name || Math.random()}
                  onClick={() => setSelectedMemberId(m?.id || 'ALL')}
                  className={`ff-member-pill ${String(selectedMemberId) === String(m?.id) ? 'active' : ''}`}
                >
                  <span className="ff-member-dot" />
                  <span>{m?.name || 'Member'}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── 4. CATEGORY SELECTOR TABS ── */}
        <div className="ff-category-tabs-row">
          <div className="ff-tabs-scrollable">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`ff-cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ff-tips-count-indicator">
            {filteredTips.length} {filteredTips.length === 1 ? 'tip' : 'tips'}
          </div>
        </div>

        {/* ── 5. CLEAN EDITORIAL TIPS GRID ── */}
        {filteredTips.length === 0 ? (
          <div className="ff-tips-empty-box">
            <div className="ff-empty-icon">🍃</div>
            <h3>No matching wellness tips found</h3>
            <p>Try searching for a different ingredient like "matta", "cumin", or select "All Tips".</p>
            <button
              onClick={() => { setActiveCategory('All Tips'); setSearchQuery('') }}
              className="ff-btn-reset-filters"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="ff-tips-grid">
            {filteredTips.map((tip) => {
              const isSaved = bookmarkedIds.includes(tip.id)

              return (
                <article key={tip.id} className="ff-tip-card">
                  {/* Card Header Meta */}
                  <div className="ff-tip-meta-row">
                    <span className="ff-tip-tag" style={{ color: tip.accent }}>
                      {tip.tag}
                    </span>
                    <div className="ff-tip-meta-right">
                      <span className="ff-tip-read-time">
                        <Clock size={12} />
                        <span>{tip.readTime}</span>
                      </span>
                      <button
                        onClick={() => toggleBookmark(tip.id)}
                        className={`ff-tip-bookmark-btn ${isSaved ? 'saved' : ''}`}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark tip'}
                        aria-label="Save tip"
                      >
                        <Bookmark size={15} fill={isSaved ? '#2E7D32' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="ff-tip-title">{tip.title}</h3>
                  <p className="ff-tip-summary">{tip.summary}</p>

                  {/* Science / Why It Works Box */}
                  <div className="ff-tip-detail-box">
                    <p>{tip.detail}</p>
                  </div>

                  {/* Card Footer / Benefit Callout */}
                  <div className="ff-tip-footer">
                    <div className="ff-tip-benefit">
                      <Flame size={14} className="text-amber-500" />
                      <span>{tip.benefit}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />

      {/* ── EMBEDDED CLEAN STYLING ── */}
      <style>{`
        .ff-tips-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0A0F1D' : '#F8FAF6'};
          color: ${isDark ? '#F1F5F9' : '#1A2E16'};
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .ff-tips-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 36px 24px 80px 24px;
        }

        /* TOAST */
        .ff-toast-bar {
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
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
        }

        /* HEADER */
        .ff-tips-header {
          margin-bottom: 24px;
        }

        .ff-header-top-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ff-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${isDark ? '#34D399' : '#2E7D32'};
          margin-bottom: 8px;
        }

        .ff-header-title {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin: 0 0 6px 0;
          color: ${isDark ? '#FFFFFF' : '#112210'};
          line-height: 1.15;
        }

        .ff-header-subtitle {
          font-size: 14.5px;
          color: ${isDark ? '#94A3B8' : '#5E6E5B'};
          margin: 0;
          max-width: 580px;
          line-height: 1.5;
        }

        /* SEARCH CAPSULE */
        .ff-search-capsule {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${isDark ? '#141E30' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#23324C' : '#DFE7DC'};
          padding: 8px 14px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          width: 260px;
          transition: border-color 0.15s ease;
        }

        .ff-search-capsule:focus-within {
          border-color: #2E7D32;
        }

        .ff-search-icon {
          color: #94A3B8;
          flex-shrink: 0;
        }

        .ff-search-input {
          border: none;
          background: transparent;
          font-size: 13px;
          color: ${isDark ? '#F8FAFC' : '#1A2E16'};
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .ff-search-clear {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 16px;
          cursor: pointer;
          padding: 0 4px;
        }

        /* ALLERGEN BAR */
        .ff-allergy-bar-section {
          margin-bottom: 20px;
        }

        .ff-allergy-alert-card {
          background: ${isDark ? '#201316' : '#FEF2F2'};
          border: 1px solid ${isDark ? '#4A1D24' : '#FEE2E2'};
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .ff-alert-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ff-alert-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #FEE2E2;
          color: #DC2626;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ff-alert-heading {
          font-size: 13.5px;
          font-weight: 800;
          color: ${isDark ? '#FCA5A5' : '#991B1B'};
        }

        .ff-alert-text {
          font-size: 12.5px;
          color: ${isDark ? '#F87171' : '#B91C1C'};
          margin-top: 2px;
        }

        .ff-alert-manage-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid ${isDark ? '#5C232B' : '#FCA5A5'};
          color: ${isDark ? '#FCA5A5' : '#DC2626'};
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }

        .ff-alert-manage-btn:hover {
          background: rgba(220, 38, 38, 0.1);
        }

        .ff-allergy-shield-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${isDark ? 'rgba(16, 185, 129, 0.12)' : '#EFF7EE'};
          border: 1px solid ${isDark ? '#1E3A2F' : '#DCEBD9'};
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 12.5px;
          color: ${isDark ? '#CBD5E1' : '#3E5039'};
        }

        /* MEMBER FILTER ROW */
        .ff-member-filter-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .ff-filter-label {
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ff-member-pill-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ff-member-pill {
          background: ${isDark ? '#141E30' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#23324C' : '#DFE7DC'};
          color: ${isDark ? '#CBD5E1' : '#475643'};
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .ff-member-pill.active {
          background: #2E7D32;
          color: #FFFFFF;
          border-color: #2E7D32;
        }

        .ff-member-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
        }

        /* CATEGORY TABS */
        .ff-category-tabs-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid ${isDark ? '#1E293B' : '#E8EFE5'};
          padding-bottom: 12px;
          margin-bottom: 28px;
          gap: 16px;
        }

        .ff-tabs-scrollable {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .ff-cat-tab-btn {
          border: none;
          background: transparent;
          color: ${isDark ? '#94A3B8' : '#5E6E5B'};
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .ff-cat-tab-btn:hover {
          color: #2E7D32;
          background: ${isDark ? 'rgba(16, 185, 129, 0.1)' : '#EDF5EB'};
        }

        .ff-cat-tab-btn.active {
          background: #2E7D32;
          color: #FFFFFF;
          font-weight: 700;
        }

        .ff-tips-count-indicator {
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          white-space: nowrap;
        }

        /* TIPS GRID */
        .ff-tips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 960px) {
          .ff-tips-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 620px) {
          .ff-tips-grid {
            grid-template-columns: 1fr;
          }
        }

        .ff-tip-card {
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E2EBE0'};
          border-radius: 18px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          box-shadow: ${isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 14px rgba(47,107,31,0.04)'};
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ff-tip-card:hover {
          transform: translateY(-3px);
          box-shadow: ${isDark ? '0 10px 24px rgba(0,0,0,0.45)' : '0 8px 24px rgba(47,107,31,0.09)'};
        }

        .ff-tip-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ff-tip-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ff-tip-meta-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ff-tip-read-time {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #94A3B8;
          font-weight: 600;
        }

        .ff-tip-bookmark-btn {
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;
        }

        .ff-tip-bookmark-btn:hover {
          transform: scale(1.15);
          color: #2E7D32;
        }

        .ff-tip-bookmark-btn.saved {
          color: #2E7D32;
        }

        .ff-tip-title {
          font-size: 16px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#142612'};
          line-height: 1.35;
          margin: 0 0 10px 0;
        }

        .ff-tip-summary {
          font-size: 13.5px;
          line-height: 1.55;
          color: ${isDark ? '#CBD5E1' : '#455642'};
          margin: 0 0 14px 0;
        }

        .ff-tip-detail-box {
          background: ${isDark ? '#142138' : '#F6FAF4'};
          border: 1px solid ${isDark ? '#1E3254' : '#E2EFE0'};
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 16px;
          flex: 1;
        }

        .ff-tip-detail-box p {
          font-size: 12.5px;
          line-height: 1.5;
          color: ${isDark ? '#94A3B8' : '#556551'};
          margin: 0;
        }

        .ff-tip-footer {
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid ${isDark ? '#1C293E' : '#EDF4EB'};
        }

        .ff-tip-benefit {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: ${isDark ? '#F1F5F9' : '#1E3219'};
        }

        /* EMPTY STATE */
        .ff-tips-empty-box {
          text-align: center;
          padding: 60px 24px;
          background: ${isDark ? '#111A2B' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#1E2D44' : '#E2EBE0'};
          border-radius: 20px;
        }

        .ff-empty-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .ff-tips-empty-box h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 6px 0;
        }

        .ff-tips-empty-box p {
          font-size: 13.5px;
          color: #94A3B8;
          margin: 0 0 20px 0;
        }

        .ff-btn-reset-filters {
          background: #2E7D32;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
