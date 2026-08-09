import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import TestimonialMarquee from '../components/ui/marquee-01'

// ── ICONS ──
const LeafIcon = ({ size = 20, color = "#3D4A2E" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill={color} />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="14" cy="6" r="2.5" fill="white" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="10" cy="18" r="2.5" fill="white" />
  </svg>
)

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.67-1.5-3.5-3.5-5.5-2 2-3.5 3.83-3.5 5.5z" fill="#F97316" />
    <path d="M12 2c1 3 4 4.5 4 9a6 6 0 1 1-12 0c0-4 3.5-7 5-9 0 2.5 1.5 3.5 3 2z" />
  </svg>
)

const HeartIcon = ({ filled = false, size = 18, color = "#475569" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ArrowRight = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ── DATA ──
const RECIPES = [
  {
    id: 1,
    name: 'Kerala Vegetable Upma',
    tag: 'Great for Everyone',
    time: '25 min',
    kcal: '280 kcal',
    image: '/kerala_vegetable_upma.png',
  },
  {
    id: 2,
    name: 'Green Moong Smoothie',
    tag: 'Detoxifying • Immunity Boost',
    time: '10 min',
    kcal: '180 kcal',
    image: '/green_moong_smoothie.png',
  },
  {
    id: 3,
    name: 'Kerala Vegetable Stew',
    tag: 'High Fiber • Heart Healthy',
    time: '20 min',
    kcal: '260 kcal',
    image: '/kerala_vegetable_stew.png',
  },
  {
    id: 4,
    name: 'Rorstas',
    tag: 'High Protein • Nutritious',
    time: '15 min',
    kcal: '230 kcal',
    image: '/heart_health_salmon_salad.png',
  },
]

const CURATED_PLANS = [
  {
    id: 'plan-1',
    title: 'For Weight Balance',
    sub: 'Balanced meals for healthy weight',
    image: '/kerala_vegetable_upma.png',
    iconBg: '#E8F0E3',
    iconColor: '#3D4A2E',
    type: 'shield',
  },
  {
    id: 'plan-2',
    title: 'For Immunity',
    sub: 'Boost immunity with nutritious food',
    image: '/green_moong_smoothie.png',
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    type: 'leaf',
  },
  {
    id: 'plan-3',
    title: 'For Heart Health',
    sub: 'Good for your heart, every day',
    image: '/heart_health_salmon_salad.png',
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
    type: 'heart',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([1, 3])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const filteredRecipes = useMemo(() => {
    if (!search) return RECIPES
    return RECIPES.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.tag.toLowerCase().includes(search.toLowerCase()))
  }, [search])

  return (
    <div className="landing-page-root">
      {/* ── 01. HERO SECTION (SOLID DARK OLIVE GREEN WITH CONTAINED 2-COLUMN PHOTO) ── */}
      <section className="hero-olive-container">
        <div className="hero-inner-content">
          {/* Left Column: Heading, Subheading, CTAs, Search */}
          <div className="hero-left-col">
            <h1 className="hero-heading">
              Wholesome Kerala meals,<br />
              stronger every day.
            </h1>
            <p className="hero-subheading">
              Personalized nutrition, healthy recipes and smart planning for your family's well-being.
            </p>

            <div className="hero-ctas-row">
              <button className="btn-solid-white-pill" onClick={() => navigate('/recipes')}>
                <LeafIcon size={18} color="#3D4A2E" />
                <span>Let's eat healthy</span>
              </button>
              <button className="btn-plain-text-link" onClick={() => navigate('/recipes')}>
                <span>Explore recipes</span>
                <ArrowRight color="#FFFFFF" />
              </button>
            </div>

            {/* Pill Search Bar */}
            <div className="hero-search-pill-bar">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search meals, plans, recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-filter-circle" onClick={() => navigate('/recipes')}>
                <FilterIcon />
              </button>
            </div>
          </div>

          {/* Right Column: Contained Family Photo with rounded corners */}
          <div className="hero-right-col">
            <img
              src="/hero_family_kerala.jpg"
              alt="Family enjoying wholesome Kerala food"
              className="hero-family-photo"
            />
          </div>
        </div>

        {/* Organic Bottom Curve matching reference image */}
        <div className="hero-bottom-curve-svg">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '50px', display: 'block' }}>
            <path d="M0,0 C380,56 760,58 1440,16 L1440,60 L0,60 Z" fill={isDark ? '#0A0F1D' : '#F5F3EE'} />
          </svg>
        </div>
      </section>

      {/* ── 02. FITNESS PLUS NUTRITION EQUALS TRANSFORMATION (RECIPES SECTION) ── */}
      <section className="section-main-wrapper">
        <div className="fitness-header-center">
          <div className="leaf-header-icon-wrap">
            <LeafIcon size={20} color="#3D4A2E" />
          </div>
          <h2 className="fitness-heading">
            Fitness plus Nutrition<br />
            equals Transformation
          </h2>

          {/* Hand-drawn style short wavy SVG line (~80px wide) */}
          <div className="squiggle-line-wrap">
            <svg width="80" height="8" viewBox="0 0 80 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4 C 15 1, 25 7, 40 4 C 55 1, 65 7, 78 4" stroke="#81C784" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 4 Recipe Cards Grid */}
        <div className="recipe-cards-grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card-clean">
              <div className="recipe-card-img-wrap">
                <img src={recipe.image} alt={recipe.name} className="recipe-card-img" />
                <button
                  className="favorite-heart-float"
                  onClick={() => toggleFavorite(recipe.id)}
                  aria-label="Save recipe"
                >
                  <HeartIcon filled={favorites.includes(recipe.id)} size={16} />
                </button>
              </div>

              <div className="recipe-card-body">
                <h3 className="recipe-card-title">{recipe.name}</h3>
                <span className="recipe-card-tag-pill">{recipe.tag}</span>

                <div className="recipe-meta-row">
                  <div className="recipe-meta-item">
                    <ClockIcon />
                    <span>{recipe.time}</span>
                  </div>
                  <span className="recipe-meta-divider">|</span>
                  <div className="recipe-meta-item">
                    <FlameIcon />
                    <span>{recipe.kcal}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 03. LOVED BY FAMILIES (TESTIMONIAL MARQUEE SECTION) ── */}
        <div className="loved-by-families-container">
          <div className="loved-header-row">
            <div className="loved-header-left">
              <div className="heart-icon-badge">
                <HeartIcon filled={false} size={20} color="#3D4A2E" />
              </div>
              <div>
                <h3 className="loved-title">Loved by Families</h3>
                <p className="loved-subtitle">Real families. Real results.</p>
              </div>
            </div>
            <button className="view-reviews-link" onClick={() => navigate('/tips')}>
              <span>View all reviews</span>
              <ArrowRight color="#3D4A2E" />
            </button>
          </div>

          {/* Infinite Marquee Testimonials */}
          <TestimonialMarquee />
        </div>

        {/* ── 04. CURATED KERALA PLANS SECTION ── */}
        <div className="curated-plans-container">
          <div className="plans-header-row">
            <div>
              <h2 className="plans-title">Curated Kerala Plans for Your Family</h2>
              <p className="plans-sub">Balanced weekly meal plans inspired by Kerala tradition.</p>
            </div>
            <button className="view-reviews-link" onClick={() => navigate('/recipes')}>
              <span>Explore plans</span>
              <ArrowRight color="#3D4A2E" />
            </button>
          </div>

          <div className="plans-three-grid">
            {CURATED_PLANS.map((plan) => (
              <div key={plan.id} className="plan-card-clean">
                <div className="plan-left-info">
                  <div className="plan-icon-circle" style={{ background: plan.iconBg }}>
                    {plan.type === 'shield' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={plan.iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    )}
                    {plan.type === 'leaf' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={plan.iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
                      </svg>
                    )}
                    {plan.type === 'heart' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={plan.iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    )}
                  </div>

                  <h3 className="plan-card-title">{plan.title}</h3>
                  <p className="plan-card-sub">{plan.sub}</p>

                  <button className="plan-arrow-circle-btn" onClick={() => navigate('/recipes')}>
                    <ArrowRight color="#3D4A2E" />
                  </button>
                </div>

                <div className="plan-right-img-wrap">
                  <img src={plan.image} alt={plan.title} className="plan-img" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05. FOOTER ── */}
      <footer className="site-footer-redesign">
        <div className="footer-top-grid">
          <div className="footer-col-brand">
            <div className="footer-brand-row">
              <LeafIcon size={24} color="#3D4A2E" />
              <span className="footer-brand-name">FamilyFit</span>
            </div>
            <p className="footer-slogan">Wholesome Kerala meals and smart planning for a healthier family.</p>
            <div className="footer-socials">
              <a href="#" className="social-circle" aria-label="Website">🌐</a>
              <a href="#" className="social-circle" aria-label="Instagram">📸</a>
              <a href="#" className="social-circle" aria-label="Facebook">📘</a>
              <a href="#" className="social-circle" aria-label="YouTube">▶️</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('/')}>Home</button></li>
              <li><button onClick={() => navigate('/recipes')}>Recipes</button></li>
              <li><button onClick={() => navigate('/grocery')}>Grocery</button></li>
              <li><button onClick={() => navigate('/tips')}>Tips</button></li>
              <li><button onClick={() => navigate('/profile')}>Profile</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('/recipes')}>Meal Plans</button></li>
              <li><button onClick={() => navigate('/tips')}>Health Guide</button></li>
              <li><button onClick={() => navigate('/tips')}>Privacy Policy</button></li>
              <li><button onClick={() => navigate('/tips')}>Terms & Conditions</button></li>
            </ul>
          </div>

          <div className="footer-col-newsletter">
            <h4 className="footer-heading">Newsletter</h4>
            <p className="newsletter-sub">Subscribe for healthy recipes and family tips.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-subscribe">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 FamilyFit. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <span>•</span>
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* ── CSS STYLES ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-page-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0A0F1D' : '#F5F3EE'};
          color: ${isDark ? '#F1F5F9' : '#1E293B'};
          font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
          width: 100%;
          overflow-x: hidden;
        }

        /* HERO SECTION WITH SOLID DARK OLIVE GREEN BACKGROUND & CONTAINED RIGHT PHOTO */
        .hero-olive-container {
          background-color: #3D4A2E;
          position: relative;
          padding: 40px 80px 0 80px;
          color: #ffffff;
          width: 100%;
          box-sizing: border-box;
        }

        .hero-inner-content {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding-bottom: 24px;
        }

        @media (max-width: 980px) {
          .hero-olive-container {
            padding: 32px 24px 0 24px;
          }
          .hero-inner-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .hero-left-col {
          width: 100%;
        }

        .hero-heading {
          font-size: 52px;
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.8px;
          color: #FFFFFF;
          margin: 0 0 16px 0;
        }

        @media (max-width: 640px) {
          .hero-heading {
            font-size: 36px;
          }
        }

        .hero-subheading {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.86);
          line-height: 1.55;
          margin: 0 0 32px 0;
          max-width: 450px;
        }

        .hero-ctas-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .btn-solid-white-pill {
          background: #FFFFFF;
          color: #3D4A2E;
          border: none;
          padding: 14px 28px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-solid-white-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }

        .btn-plain-text-link {
          background: transparent;
          color: #FFFFFF;
          border: none;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          transition: opacity 0.15s ease;
        }

        .btn-plain-text-link:hover {
          opacity: 0.85;
          text-decoration: underline;
        }

        .hero-search-pill-bar {
          background: #FFFFFF;
          border-radius: 9999px;
          padding: 6px 6px 6px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 440px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
        }

        .hero-search-pill-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1E293B;
          background: transparent;
          font-family: inherit;
        }

        .search-filter-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3B4B32;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.15s ease;
        }

        .search-filter-circle:hover {
          background-color: #2D3A20;
        }

        .hero-right-col {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-family-photo {
          width: 100%;
          max-width: 560px;
          height: 380px;
          border-radius: 24px;
          object-fit: cover;
          object-position: center;
          display: block;
          border: none;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }

        @media (max-width: 980px) {
          .hero-family-photo {
            height: 280px;
          }
        }

        .hero-bottom-curve-svg {
          width: 100%;
          overflow: hidden;
          line-height: 0;
          margin-top: 10px;
        }

        /* MAIN CONTENT AREA WITH CONSISTENT 80px HORIZONTAL PADDING */
        .section-main-wrapper {
          max-width: 1320px;
          margin: 0 auto;
          padding: 48px 80px 48px 80px;
          box-sizing: border-box;
        }

        @media (max-width: 980px) {
          .section-main-wrapper {
            padding: 40px 24px 32px 24px;
          }
        }

        .fitness-header-center {
          text-align: center;
          margin-bottom: 36px;
        }

        .leaf-header-icon-wrap {
          margin-bottom: 4px;
        }

        .fitness-heading {
          font-size: 32px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#3D4A2E'};
          margin: 4px 0 6px 0;
          letter-spacing: -0.5px;
          line-height: 1.25;
        }

        .squiggle-line-wrap {
          display: flex;
          justify-content: center;
          margin-top: 6px;
        }

        /* RECIPE CARDS GRID */
        .recipe-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 56px;
        }

        @media (max-width: 1024px) {
          .recipe-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .recipe-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .recipe-card-clean {
          background: ${isDark ? '#1E293B' : '#FFFFFF'};
          border-radius: 20px;
          overflow: hidden;
          border: none;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .recipe-card-clean:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
        }

        .recipe-card-img-wrap {
          position: relative;
          width: 100%;
          height: 150px;
          overflow: hidden;
          background: #EAEFE7;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .recipe-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .favorite-heart-float {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
          transition: transform 0.15s ease;
        }

        .favorite-heart-float:hover {
          transform: scale(1.08);
        }

        .recipe-card-body {
          padding: 16px;
        }

        .recipe-card-title {
          font-size: 15px;
          font-weight: 700;
          color: ${isDark ? '#F8FAFC' : '#1E293B'};
          margin: 0 0 8px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .recipe-card-tag-pill {
          display: inline-block;
          background: ${isDark ? '#166534' : '#E8F0E3'};
          color: ${isDark ? '#DCFCE7' : '#3D4A2E'};
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 14px;
        }

        .recipe-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #64748B;
          font-weight: 600;
        }

        .recipe-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .recipe-meta-divider {
          color: #CBD5E1;
        }

        /* LOVED BY FAMILIES SECTION */
        .loved-by-families-container {
          margin-bottom: 60px;
        }

        .loved-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .loved-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .heart-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #E8F0E3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loved-title {
          font-size: 20px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0;
        }

        .loved-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 2px 0 0 0;
        }

        .view-reviews-link {
          background: none;
          border: none;
          color: ${isDark ? '#81C784' : '#3D4A2E'};
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .view-reviews-link:hover {
          text-decoration: underline;
        }

        /* CURATED PLANS */
        .curated-plans-container {
          margin-bottom: 60px;
        }

        .plans-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .plans-title {
          font-size: 24px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0 0 4px 0;
        }

        .plans-sub {
          font-size: 13px;
          color: #64748B;
          margin: 0;
        }

        .plans-three-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 860px) {
          .plans-three-grid {
            grid-template-columns: 1fr;
          }
        }

        .plan-card-clean {
          background: ${isDark ? '#1E293B' : '#FFFFFF'};
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }

        .plan-left-info {
          flex: 1;
        }

        .plan-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .plan-card-title {
          font-size: 16px;
          font-weight: 700;
          color: ${isDark ? '#F8FAFC' : '#1E293B'};
          margin: 0 0 4px 0;
        }

        .plan-card-sub {
          font-size: 12px;
          color: #64748B;
          margin: 0 0 16px 0;
        }

        .plan-arrow-circle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #E8F0E3;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .plan-right-img-wrap {
          width: 90px;
          height: 90px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .plan-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* FOOTER */
        .site-footer-redesign {
          background: ${isDark ? '#0F172A' : '#EAEFE7'};
          padding: 60px 80px 32px 80px;
          border-top: 1px solid ${isDark ? '#1E293B' : '#DFE6DB'};
        }

        @media (max-width: 980px) {
          .site-footer-redesign {
            padding: 40px 24px 24px 24px;
          }
        }

        .footer-top-grid {
          max-width: 1320px;
          margin: 0 auto 40px auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 40px;
        }

        @media (max-width: 860px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
        }

        .footer-brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .footer-brand-name {
          font-size: 22px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#3D4A2E'};
        }

        .footer-slogan {
          font-size: 13px;
          color: #64748B;
          line-height: 1.5;
          margin: 0 0 20px 0;
          max-width: 300px;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
        }

        .social-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .footer-heading {
          font-size: 15px;
          font-weight: 700;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0 0 16px 0;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #64748B;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }

        .footer-links button:hover {
          color: #3D4A2E;
          text-decoration: underline;
        }

        .newsletter-sub {
          font-size: 13px;
          color: #64748B;
          margin: 0 0 16px 0;
        }

        .newsletter-form {
          display: flex;
          gap: 8px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 10px 16px;
          border-radius: 9999px;
          border: 1px solid #CBD5E1;
          font-size: 13px;
          outline: none;
        }

        .btn-subscribe {
          background: #3D4A2E;
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .footer-bottom-bar {
          max-width: 1320px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid ${isDark ? '#1E293B' : '#D5DDD1'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
        }

        .footer-bottom-links {
          display: flex;
          gap: 12px;
        }

        .footer-bottom-links a {
          color: #64748B;
          text-decoration: none;
        }
      `}} />
    </div>
  )
}
