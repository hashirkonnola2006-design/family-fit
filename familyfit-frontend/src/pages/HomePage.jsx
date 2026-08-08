import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// ── ICONS ──
const LeafIcon = ({ size = 24, color = "#2E5B1A" }) => (
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E65100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.67-1.5-3.5-3.5-5.5-2 2-3.5 3.83-3.5 5.5z" fill="#FF8A00" />
    <path d="M12 2c1 3 4 4.5 4 9a6 6 0 1 1-12 0c0-4 3.5-7 5-9 0 2.5 1.5 3.5 3 2z" />
  </svg>
)

const HeartIcon = ({ filled = false }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const StarRating = () => (
  <div style={{ display: 'flex', gap: 2, color: '#F59E0B' }}>
    {'★'.repeat(5)}
  </div>
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
    name: 'Rorstas Salad',
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
    iconBg: '#EBF5E1',
    iconColor: '#2E7D32',
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

const TESTIMONIALS = [
  {
    name: 'Anitha Nair',
    quote: 'FamilyFit has made our daily meals healthier and planning so easy.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rohit Menon',
    quote: 'The recipes are delicious and my kids actually enjoy eating healthy now!',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Priya Suresh',
    quote: 'Personalized plans and grocery tips have saved us so much time.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
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
    <div className="landing-redesign-root">
      {/* ── 01. HERO BANNER SECTION ── */}
      <section className="hero-banner-card">
        <div className="hero-left-content">
          <h1 className="hero-headline">
            Wholesome Kerala meals,<br />
            stronger every day.
          </h1>
          <p className="hero-subtitle">
            Personalized nutrition, healthy recipes and smart planning for your family's well-being.
          </p>

          <div className="hero-actions-row">
            <button className="btn-primary-white" onClick={() => navigate('/recipes')}>
              <LeafIcon size={20} color="#2E5B1A" />
              <span>Let's eat healthy</span>
            </button>
            <button className="btn-secondary-link" onClick={() => navigate('/recipes')}>
              <span>Explore recipes</span>
              <ArrowRight />
            </button>
          </div>

          {/* Floating Search Bar */}
          <div className="hero-search-pill">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search meals, plans, recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="filter-circle-btn" onClick={() => navigate('/recipes')}>
              <FilterIcon />
            </button>
          </div>
        </div>

        <div className="hero-right-photo-wrapper">
          <img
            src="/hero_family_kerala.jpg"
            alt="Family eating healthy Kerala food together"
            className="hero-family-photo"
          />
        </div>
      </section>

      {/* ── 02. FITNESS + NUTRITION EQUALS TRANSFORMATION (RECIPES GRID) ── */}
      <section className="section-container">
        <div className="section-header-center">
          <div className="leaf-overhead-icon">🍃</div>
          <h2 className="section-title">Fitness plus Nutrition equals Transformation</h2>
        </div>

        <div className="recipes-four-grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-img-container">
                <img src={recipe.image} alt={recipe.name} className="recipe-img" />
                <button
                  className="favorite-heart-btn"
                  onClick={() => toggleFavorite(recipe.id)}
                  aria-label="Save recipe"
                >
                  <HeartIcon filled={favorites.includes(recipe.id)} />
                </button>
              </div>

              <div className="recipe-info">
                <h3 className="recipe-name">{recipe.name}</h3>
                <span className="recipe-tag-pill">{recipe.tag}</span>

                <div className="recipe-meta-row">
                  <div className="recipe-meta-item">
                    <ClockIcon />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="recipe-meta-divider">|</div>
                  <div className="recipe-meta-item">
                    <FlameIcon />
                    <span>{recipe.kcal}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="loved-by-families-header">
          <div className="loved-by-left">
            <div className="heart-leaf-icon">💚</div>
            <div>
              <h3 className="loved-title">Loved by Families</h3>
              <p className="loved-sub">Real families. Real results.</p>
            </div>
          </div>
          <button className="view-all-link" onClick={() => navigate('/tips')}>
            <span>View all reviews</span>
            <ArrowRight />
          </button>
        </div>
      </section>

      {/* ── 03. CURATED KERALA PLANS SECTION ── */}
      <section className="section-container" style={{ marginTop: 40 }}>
        <div className="section-header-row">
          <div>
            <h2 className="section-title-left">Curated Kerala Plans for Your Family</h2>
            <p className="section-sub-left">Balanced weekly meal plans inspired by Kerala tradition.</p>
          </div>
          <button className="explore-plans-link" onClick={() => navigate('/recipes')}>
            <span>Explore plans</span>
            <ArrowRight />
          </button>
        </div>

        <div className="plans-three-grid">
          {CURATED_PLANS.map((plan) => (
            <div key={plan.id} className="plan-card">
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

                <h3 className="plan-title">{plan.title}</h3>
                <p className="plan-sub">{plan.sub}</p>

                <button className="plan-arrow-btn" onClick={() => navigate('/recipes')}>
                  <ArrowRight />
                </button>
              </div>

              <div className="plan-right-img-container">
                <img src={plan.image} alt={plan.title} className="plan-img" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04. TESTIMONIALS & RATING BLOCK ── */}
      <section className="section-container" style={{ marginTop: 40, marginBottom: 60 }}>
        <div className="testimonials-box">
          <div className="testimonials-left-summary">
            <h3 className="loved-hero-title">Loved by<br />Families <span style={{ color: '#81C784' }}>🍃</span></h3>
            <p className="loved-hero-sub">Real families. Real results.</p>
            <div style={{ margin: '14px 0 8px 0' }}>
              <StarRating />
            </div>
            <p className="loved-rating-score"><strong>4.8/5</strong> from 1,200+ families</p>
          </div>

          <div className="testimonials-cards-grid">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="t-user-row">
                  <img src={t.avatar} alt={t.name} className="t-avatar" />
                  <div>
                    <h4 className="t-name">{t.name}</h4>
                    <StarRating />
                  </div>
                </div>
                <p className="t-quote">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05. FOOTER SECTION ── */}
      <footer className="site-footer">
        <div className="footer-top-grid">
          {/* Col 1: Brand info */}
          <div className="footer-col-brand">
            <div className="footer-brand">
              <LeafIcon size={24} color="#2E5B1A" />
              <span className="footer-brand-name">FamilyFit</span>
            </div>
            <p className="footer-slogan">Wholesome Kerala meals and smart planning for a healthier family.</p>

            <div className="footer-socials">
              <a href="#" className="social-icon-circle" aria-label="Website">🌐</a>
              <a href="#" className="social-icon-circle" aria-label="Instagram">📸</a>
              <a href="#" className="social-icon-circle" aria-label="Facebook">📘</a>
              <a href="#" className="social-icon-circle" aria-label="YouTube">▶️</a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('/')}>Home ›</button></li>
              <li><button onClick={() => navigate('/recipes')}>Recipes ›</button></li>
              <li><button onClick={() => navigate('/grocery')}>Grocery ›</button></li>
              <li><button onClick={() => navigate('/tips')}>Tips ›</button></li>
              <li><button onClick={() => navigate('/profile')}>Profile ›</button></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('/recipes')}>Meal Plans ›</button></li>
              <li><button onClick={() => navigate('/tips')}>Health Guide ›</button></li>
              <li><button onClick={() => navigate('/tips')}>Privacy Policy ›</button></li>
              <li><button onClick={() => navigate('/tips')}>Terms & Conditions ›</button></li>
              <li><button onClick={() => navigate('/tips')}>Help Center ›</button></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
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
            <p className="no-spam-note">🍃 No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <span>© 2026 FamilyFit. All rights reserved.</span>
          <span className="footer-center-leaf">🍃</span>
          <div className="footer-legal-links">
            <a href="#">Privacy</a>
            <span>|</span>
            <a href="#">Terms</a>
            <span>|</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* ── STYLES ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-redesign-root {
          min-height: 100vh;
          background-color: ${isDark ? '#0B132B' : '#FAFCF7'};
          color: ${isDark ? '#F1F5F9' : '#1E293B'};
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          padding: 24px 24px 0 24px;
          max-width: 1240px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* 01. Hero Banner Card */
        .hero-banner-card {
          background: linear-gradient(135deg, #3C5036 0%, #2D3E28 100%);
          border-radius: 32px;
          padding: 48px 48px 48px 56px;
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 36px;
          align-items: center;
          color: #ffffff;
          box-shadow: 0 20px 50px rgba(45, 62, 40, 0.25);
          overflow: hidden;
          margin-bottom: 48px;
        }

        @media (max-width: 960px) {
          .hero-banner-card {
            grid-template-columns: 1fr;
            padding: 32px 24px;
          }
          .hero-right-photo-wrapper {
            height: 300px !important;
          }
        }

        .hero-headline {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 16px 0;
          letter-spacing: -0.8px;
          color: #ffffff;
        }

        .hero-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.5;
          margin: 0 0 28px 0;
          max-width: 480px;
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .btn-primary-white {
          background: #ffffff;
          color: #2E5B1A;
          border: none;
          padding: 14px 26px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transition: transform 0.15s ease;
        }

        .btn-primary-white:hover {
          transform: translateY(-2px);
        }

        .btn-secondary-link {
          background: transparent;
          color: #ffffff;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-secondary-link:hover {
          text-decoration: underline;
        }

        .hero-search-pill {
          background: #ffffff;
          border-radius: 50px;
          padding: 6px 6px 6px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.15);
          max-width: 440px;
        }

        .hero-search-pill input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1e293b;
          background: transparent;
        }

        .filter-circle-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2E5B1A;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .hero-right-photo-wrapper {
          width: 100%;
          height: 380px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0,0,0,0.25);
        }

        .hero-family-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* 02. Section Headers & Grids */
        .section-container {
          margin-bottom: 48px;
        }

        .section-header-center {
          text-align: center;
          margin-bottom: 28px;
        }

        .leaf-overhead-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .section-title {
          font-size: 26px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1E4D18'};
          margin: 0;
          letter-spacing: -0.4px;
        }

        .recipes-four-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 900px) {
          .recipes-four-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 540px) {
          .recipes-four-grid {
            grid-template-columns: 1fr;
          }
        }

        .recipe-card {
          background: ${isDark ? '#1E293B' : '#FFFFFF'};
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.04);
          border: 1px solid ${isDark ? '#334155' : '#EAEFE5'};
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .recipe-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.08);
        }

        .recipe-img-container {
          position: relative;
          width: 100%;
          height: 170px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .recipe-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .favorite-heart-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .recipe-info {
          padding: 16px;
        }

        .recipe-name {
          font-size: 15px;
          font-weight: 700;
          color: ${isDark ? '#F8FAFC' : '#1E293B'};
          margin: 0 0 8px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .recipe-tag-pill {
          display: inline-block;
          background: ${isDark ? '#166534' : '#EBF5E1'};
          color: ${isDark ? '#DCFCE7' : '#2E7D32'};
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
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
          gap: 4px;
        }

        .recipe-meta-divider {
          color: #CBD5E1;
        }

        .loved-by-families-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
        }

        .loved-by-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .heart-leaf-icon {
          font-size: 22px;
        }

        .loved-title {
          font-size: 18px;
          font-weight: 800;
          margin: 0;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
        }

        .loved-sub {
          font-size: 12px;
          color: #64748B;
          margin: 2px 0 0 0;
        }

        .view-all-link {
          background: none;
          border: none;
          color: #2E7D32;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        /* 03. Curated Plans Grid */
        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-title-left {
          font-size: 24px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0 0 4px 0;
        }

        .section-sub-left {
          font-size: 13px;
          color: #64748B;
          margin: 0;
        }

        .explore-plans-link {
          background: none;
          border: none;
          color: #2E7D32;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
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

        .plan-card {
          background: ${isDark ? '#1E293B' : '#FFFFFF'};
          border-radius: 24px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid ${isDark ? '#334155' : '#EAEFE5'};
          box-shadow: 0 6px 20px rgba(0,0,0,0.03);
        }

        .plan-left-info {
          flex: 1;
          padding-right: 16px;
        }

        .plan-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .plan-title {
          font-size: 16px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0 0 4px 0;
        }

        .plan-sub {
          font-size: 12px;
          color: #64748B;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        .plan-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${isDark ? '#334155' : '#455B3F'};
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .plan-right-img-container {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }

        .plan-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* 04. Testimonials Block */
        .testimonials-box {
          background: ${isDark ? '#1E293B' : '#FFFFFF'};
          border-radius: 28px;
          padding: 32px;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          border: 1px solid ${isDark ? '#334155' : '#EAEFE5'};
          box-shadow: 0 8px 24px rgba(0,0,0,0.03);
          align-items: center;
        }

        @media (max-width: 860px) {
          .testimonials-box {
            grid-template-columns: 1fr;
          }
        }

        .loved-hero-title {
          font-size: 26px;
          font-weight: 800;
          color: #1E4D18;
          line-height: 1.2;
          margin: 0 0 6px 0;
        }

        .loved-hero-sub {
          font-size: 13px;
          color: #64748B;
          margin: 0;
        }

        .loved-rating-score {
          font-size: 13px;
          color: #475569;
          margin: 0;
        }

        .testimonials-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .testimonials-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .testimonial-card {
          background: ${isDark ? '#0F172A' : '#FAFCF7'};
          border-radius: 18px;
          padding: 20px;
          border: 1px solid ${isDark ? '#334155' : '#E8F0E1'};
        }

        .t-user-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .t-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
        }

        .t-name {
          font-size: 14px;
          font-weight: 700;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0 0 2px 0;
        }

        .t-quote {
          font-size: 12.5px;
          color: #475569;
          line-height: 1.5;
          margin: 0;
          font-style: italic;
        }

        /* 05. Site Footer */
        .site-footer {
          background: ${isDark ? '#090D16' : '#F3F7EB'};
          border-radius: 28px 28px 0 0;
          padding: 48px 40px 24px 40px;
          margin-top: 40px;
          border: 1px solid ${isDark ? '#1E293B' : '#E4EED8'};
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 32px;
          margin-bottom: 40px;
        }

        @media (max-width: 860px) {
          .footer-top-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .footer-brand-name {
          font-size: 20px;
          font-weight: 800;
          color: #1E4D18;
        }

        .footer-slogan {
          font-size: 13px;
          color: #64748B;
          line-height: 1.5;
          margin: 0 0 18px 0;
          max-width: 260px;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .social-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .footer-heading {
          font-size: 14px;
          font-weight: 800;
          color: ${isDark ? '#FFFFFF' : '#1E293B'};
          margin: 0 0 16px 0;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #64748B;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          text-align: left;
        }

        .footer-links button:hover {
          color: #2E7D32;
        }

        .newsletter-sub {
          font-size: 13px;
          color: #64748B;
          margin: 0 0 14px 0;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .newsletter-form input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 13px;
          background: #ffffff;
        }

        .btn-subscribe {
          background: #2E5B1A;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .no-spam-note {
          font-size: 11px;
          color: #64748B;
          margin: 0;
        }

        .footer-bottom-bar {
          border-top: 1px solid ${isDark ? '#1E293B' : '#E0EAD3'};
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748B;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-legal-links a {
          color: #64748B;
          text-decoration: none;
        }

        .footer-legal-links a:hover {
          color: #2E7D32;
        }
      `}} />
    </div>
  )
}
