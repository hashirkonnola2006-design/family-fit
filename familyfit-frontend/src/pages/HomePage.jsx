import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// ── DESIGN SYSTEM ICONS ──
const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill="#1E4D18" />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#2F6B1F" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#CFE8A9" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const SmallLeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" fill="#1E4D18" />
  </svg>
)

const WhiteLeafIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" fill="white" />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121826" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121826" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const FilterIconWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="14" cy="6" r="2.5" fill="white" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="10" cy="18" r="2.5" fill="white" />
  </svg>
)

const BookmarkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7DAA4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const BasketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7DAA4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const CalendarStreakIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="4" ry="4" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="1.5" fill="#F97316" />
  </svg>
)

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5B6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const FlameIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.67-1.5-3.5-3.5-5.5-2 2-3.5 3.83-3.5 5.5z" fill="#F97316" />
    <path d="M12 2c1 3 4 4.5 4 9a6 6 0 1 1-12 0c0-4 3.5-7 5-9 0 2.5 1.5 3.5 3 2z" />
  </svg>
)

const HeartCardIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "#121826"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F6B1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ── TIME-BASED DYNAMIC GREETING GENERATOR ──
function getDynamicGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    const morningGreetings = [
      'Rise and dine,',
      'Good morning, sunshine!',
      "Up and at 'em,",
      'Fresh start,',
    ]
    return morningGreetings[Math.floor(Math.random() * morningGreetings.length)]
  }

  if (hour >= 12 && hour < 17) {
    return 'Good afternoon,'
  }

  if (hour >= 17 && hour < 21) {
    return 'Good evening,'
  }

  const nightGreetings = [
    'Burning the midnight snack,',
    'Good night,',
    'Late-night cravings?,',
  ]
  return nightGreetings[Math.floor(Math.random() * nightGreetings.length)]
}

// ── REFERENCE DATA ──
const RECOMMENDED_RECIPES = [
  {
    id: 1001,
    name: 'Kerala Vegetable Upma',
    tag: 'Great for Everyone',
    prepTimeMinutes: 25,
    kcal: 280,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&q=80',
  },
  {
    id: 1002,
    name: 'Green Moong Smoothie',
    tag: 'Detoxifying • Immunity Boost',
    prepTimeMinutes: 10,
    kcal: 180,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80',
  },
  {
    id: 1003,
    name: 'Kerala Vegetable Stew',
    tag: 'High Fiber • Heart Healthy',
    prepTimeMinutes: 20,
    kcal: 260,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const { family, setActiveMember } = useFamily()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [savedRecipeIds, setSavedRecipeIds] = useState(['1001', '1002'])
  const navigate = useNavigate()

  // Compute random dynamic greeting once on screen load
  const greetingLine = useMemo(() => getDynamicGreeting(), [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('familyfit_saved_recipes')
      if (saved) {
        setSavedRecipeIds(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const toggleSaveRecipe = (recipeId) => {
    const idStr = String(recipeId)
    let updated = []
    if (savedRecipeIds.includes(idStr)) {
      updated = savedRecipeIds.filter((i) => i !== idStr)
    } else {
      updated = [...savedRecipeIds, idStr]
    }
    setSavedRecipeIds(updated)
    localStorage.setItem('familyfit_saved_recipes', JSON.stringify(updated))
  }

  // Dynamic Family Name formatting: "{FamilyName} family!"
  const rawName = user?.familyName || family?.name || user?.name || 'Hashir'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Hashir'

  const memberList = family?.members || []
  const initial = displayName ? displayName[0].toUpperCase() : 'H'

  const filteredRecipes = search
    ? RECOMMENDED_RECIPES.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : RECOMMENDED_RECIPES

  return (
    <div
      className="page-responsive-container"
      style={{
        background: isDark ? '#0A0F1D' : '#FAFAF7',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: isDark ? '#F8FAFC' : '#121826',
        position: 'relative',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ── 1. HERO SECTION ── */}
      <div
        className="homepage-hero"
        style={{
          position: 'relative',
          background: isDark ? '#141C2E' : '#FAFAF7',
          padding: '16px 16px 28px 16px',
          borderRadius: '0 0 36px 36px',
          boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.06)',
          backgroundImage: 'url("/hero_biryani.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'right 30% center',
          minHeight: 380,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Top Bar Header (Mobile Only) */}
        <div className="mobile-only-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LeafIcon />
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px', color: isDark ? '#F8FAFC' : '#1E4D18', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Family<span style={{ color: '#F97316' }}>Fit</span>
            </span>
          </div>

          {/* Right Header Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isDark ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${isDark ? '#334155' : '#E8E8E3'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onClick={() => alert('No new notifications')}
            >
              <BellIcon />
              <span
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F97316',
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </button>

            <div
              onClick={() => navigate('/profile')}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#1E4D18',
                color: 'white',
                fontWeight: 700,
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(30,77,24,0.25)',
              }}
            >
              {initial}
            </div>
          </div>
        </div>

        {/* Desktop-Only Header (bell + profile right-aligned) */}
        <div className="desktop-only-header" style={{ display: 'none', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isDark ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDark ? '#334155' : '#E8E8E3'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            onClick={() => alert('No new notifications')}
          >
            <BellIcon />
            <span
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#F97316',
                border: '1.5px solid #FFFFFF',
              }}
            />
          </button>
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#1E4D18',
              color: 'white',
              fontWeight: 700,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30,77,24,0.25)',
            }}
          >
            {initial}
          </div>
        </div>

        <div className="homepage-hero-grid" style={{ width: '100%', position: 'relative' }}>
          {/* Torn Paper Borders (Desktop Only) */}
          <svg className="torn-edge-top" viewBox="0 0 1200 20" preserveAspectRatio="none" style={{ display: 'none', position: 'absolute', top: -1, left: 0, width: '100%', height: 16, zIndex: 5, pointerEvents: 'none' }}>
            <path d="M0 0 L1200 0 L1200 12 Q1150 6 1100 14 T1000 8 T900 12 T800 6 T700 14 T600 8 T500 10 T400 14 T300 6 T200 12 T100 8 T0 12 Z" fill={isDark ? "#0A0F1D" : "#FAFAF7"} />
          </svg>
          <svg className="torn-edge-bottom" viewBox="0 0 1200 20" preserveAspectRatio="none" style={{ display: 'none', position: 'absolute', bottom: -1, left: 0, width: '100%', height: 16, zIndex: 5, pointerEvents: 'none' }}>
            <path d="M0 20 L1200 20 L1200 8 Q1150 14 1100 6 T1000 12 T900 8 T800 14 T700 6 T600 12 T500 10 T400 6 T300 14 T200 8 T100 12 T0 8 Z" fill={isDark ? "#0A0F1D" : "#FAFAF7"} />
          </svg>
          <svg className="torn-edge-left" viewBox="0 0 20 600" preserveAspectRatio="none" style={{ display: 'none', position: 'absolute', top: 0, left: -1, height: '100%', width: 16, zIndex: 5, pointerEvents: 'none' }}>
            <path d="M0 0 L0 600 L12 600 Q6 550 14 500 T8 400 T12 300 T6 200 T14 100 T8 0 Z" fill={isDark ? "#0A0F1D" : "#FAFAF7"} />
          </svg>
          <svg className="torn-edge-right" viewBox="0 0 20 600" preserveAspectRatio="none" style={{ display: 'none', position: 'absolute', top: 0, right: -1, height: '100%', width: 16, zIndex: 5, pointerEvents: 'none' }}>
            <path d="M20 0 L20 600 L8 600 Q14 550 6 500 T12 400 T8 300 T14 200 T6 100 T12 0 Z" fill={isDark ? "#0A0F1D" : "#FAFAF7"} />
          </svg>
          {/* Hero Left Content Text & Action Button */}
          <div className="homepage-hero-left" style={{ zIndex: 2, marginTop: 38, maxWidth: '52%' }}>
            {/* Greeting Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <SmallLeafIcon />
              <span style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826' }}>
                {greetingLine}
              </span>
            </div>

            {/* Family Name Headline */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#1E4D18',
                  lineHeight: 1.15,
                  margin: 0,
                  letterSpacing: '-0.5px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {displayName.toLowerCase()} family!
              </h1>

              {/* Thin Orange Underline */}
              <div
                style={{
                  width: 80,
                  height: 3.5,
                  background: '#F97316',
                  borderRadius: 2,
                  marginTop: 4,
                }}
              />
            </div>

            {/* Subtext */}
            <p
              style={{
                fontSize: 13,
                color: isDark ? '#CBD5E1' : '#5B6472',
                fontWeight: 500,
                lineHeight: 1.4,
                margin: '0 0 14px 0',
              }}
            >
              Wholesome Kerala meals,<br />made for your family.
            </p>

            {/* Pill-Shaped Button */}
            <button
              onClick={() => navigate('/recipes')}
              style={{
                background: '#1E4D18',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 999,
                padding: '8px 16px',
                fontSize: 12.5,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(30,77,24,0.2)',
                transition: 'transform 0.2s ease',
              }}
            >
              <WhiteLeafIcon />
              <span>Let's eat healthy</span>
            </button>

            {/* Responsive Search Bar Container */}
            <div className="homepage-search-container" style={{ position: 'absolute', bottom: -22, left: 16, right: 16, zIndex: 10 }}>
              <div
                style={{
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  borderRadius: 28,
                  padding: '8px 8px 8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: isDark ? '1px solid #334155' : '1px solid #F4F5EF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <SearchIcon />
                  <input
                    placeholder="Search meals, plans, recipes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 14,
                      fontWeight: 500,
                      color: isDark ? '#F8FAFC' : '#121826',
                      background: 'transparent',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  />
                </div>

                <button
                  onClick={() => navigate('/recipes')}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#2F6B1F',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(47,107,31,0.25)',
                  }}
                >
                  <FilterIconWhite />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Right Column (Desktop Only) */}
          <div className="homepage-hero-right" style={{ display: 'none' }}></div>
        </div>
      </div>

      {/* ── 3. QUICK STATS ROW ── */}
      <div style={{ padding: '0 16px', marginTop: 24 }}>
        <div
          style={{
            background: isDark ? '#141C2E' : '#FFFFFF',
            borderRadius: 24,
            padding: '18px 12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: isDark ? '1px solid #24324A' : '1px solid #F4F5EF',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 4,
            textAlign: 'center',
          }}
        >
          {/* Saved Recipes */}
          <div
            onClick={() => navigate('/recipes')}
            className="quick-stat-item"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#F4F5EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <BookmarkIcon />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', lineHeight: 1.2 }}>
              Saved Recipes
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7DAA4B', marginTop: 4 }}>
              12 recipes
            </div>
          </div>

          {/* Favorites */}
          <div
            onClick={() => navigate('/recipes')}
            className="quick-stat-item"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#FFF4ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <HeartIcon />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', lineHeight: 1.2 }}>
              Favorites
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316', marginTop: 4 }}>
              8 meals
            </div>
          </div>

          {/* Smart Grocery */}
          <div
            onClick={() => navigate('/grocery')}
            className="quick-stat-item"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#F4F5EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <BasketIcon />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', lineHeight: 1.2 }}>
              Smart Grocery
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7DAA4B', marginTop: 4 }}>
              18 items
            </div>
          </div>

          {/* Meal Streak */}
          <div
            onClick={() => navigate('/tips')}
            className="quick-stat-item"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#FFF4ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <CalendarStreakIcon />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', lineHeight: 1.2 }}>
              Meal Streak
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F97316', marginTop: 4 }}>
              5 days
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. RECOMMENDED FOR YOUR FAMILY ── */}
      <div style={{ padding: '0 16px', marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ borderLeft: '4px solid #2F6B1F', paddingLeft: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isDark ? '#F8FAFC' : '#121826', letterSpacing: '-0.3px' }}>
              Recommended for your family
            </h2>
          </div>

          <button
            onClick={() => navigate('/recipes')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2F6B1F',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            View all <ArrowRightIcon />
          </button>
        </div>

        {/* Horizontal Recipe Cards */}
        <div
          className="recommended-grid"
          style={{
            display: 'flex',
            gap: 14,
            overflowX: 'auto',
            paddingBottom: 10,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {filteredRecipes.map((recipe) => {
            const isSaved = savedRecipeIds.includes(String(recipe.id))

            return (
              <div
                key={recipe.id}
                onClick={() => navigate('/recipes')}
                className="recommended-card"
                style={{
                  width: 210,
                  background: isDark ? '#141C2E' : '#FFFFFF',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: isDark ? '1px solid #24324A' : '1px solid #F4F5EF',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease',
                }}
              >
                {/* Photo Top */}
                <div style={{ position: 'relative', width: '100%', height: 135, overflow: 'hidden' }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveRecipe(recipe.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    <HeartCardIcon filled={isSaved} />
                  </button>
                </div>

                {/* Content Bottom */}
                <div style={{ padding: '14px 14px 16px 14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', lineHeight: 1.25 }}>
                      {recipe.name}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <span
                        style={{
                          background: '#CFE8A9',
                          color: '#1E4D18',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-block',
                        }}
                      >
                        {recipe.tag}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, fontSize: 12, fontWeight: 600, color: '#5B6472' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ClockIcon />
                      <span>{recipe.prepTimeMinutes} min</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FlameIcon />
                      <span>{recipe.kcal} kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 5. YOUR FAMILY AT A GLANCE ── */}
      <div style={{ padding: '0 16px', marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isDark ? '#F8FAFC' : '#121826', letterSpacing: '-0.3px' }}>
            Your family at a glance
          </h3>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2F6B1F',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            Manage <ArrowRightIcon />
          </button>
        </div>

        {/* Dynamic Family Members Grid */}
        {memberList.length === 0 ? (
          <div
            onClick={() => navigate('/profile')}
            style={{
              background: isDark ? '#141C2E' : '#FFFFFF',
              borderRadius: 24,
              padding: '24px 16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: isDark ? '1px dashed #334155' : '1px dashed #CFE8A9',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#CFE8A9',
                color: '#1E4D18',
                fontSize: 24,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}
            >
              +
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826' }}>
              Add Family Member
            </div>
            <div style={{ fontSize: 12, color: '#5B6472', marginTop: 4 }}>
              Set up profiles to customize meals and calorie goals
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(memberList.length + (memberList.length < 4 ? 1 : 0), 4)}, 1fr)`,
              gap: 10,
            }}
          >
            {memberList.map((member) => {
              const targetKcal = member.dailyKcalTarget
                ? `${member.dailyKcalTarget.toLocaleString()} kcal`
                : member.weightKg
                ? `${Math.round(member.weightKg * 28).toLocaleString()} kcal`
                : '1,980 kcal'

              return (
                <div
                  key={member.id}
                  onClick={() => {
                    setActiveMember(member)
                    navigate('/profile')
                  }}
                  style={{
                    background: isDark ? '#141C2E' : '#FFFFFF',
                    borderRadius: 24,
                    padding: '14px 6px 14px 6px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    border: isDark ? '1px solid #24324A' : '1px solid #F4F5EF',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <MemberAvatar member={member} size={58} />
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {member.name}
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 500, color: '#5B6472', marginTop: 2 }}>
                    {targetKcal}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34A853' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#2F6B1F' }}>
                      On track
                    </span>
                  </div>
                </div>
              )
            })}

            {memberList.length < 4 && (
              <div
                onClick={() => navigate('/profile')}
                style={{
                  background: isDark ? '#141C2E' : '#FFFFFF',
                  borderRadius: 24,
                  padding: '14px 6px 14px 6px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: isDark ? '1px dashed #334155' : '1.5px dashed #CFE8A9',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#CFE8A9',
                    color: '#1E4D18',
                    fontSize: 20,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 6,
                  }}
                >
                  +
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2F6B1F' }}>
                  Add Member
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── UNTOUCHED FIXED BOTTOM NAV DOCK ── */}
      <BottomNav />

      {/* Responsive overrides block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .homepage-hero {
            background-image: none !important;
            min-height: auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .homepage-hero-grid {
            display: flex !important;
            align-items: center;
            gap: 32px;
            justify-content: space-between;
            background: #F2ECE0 !important; /* Sandy Beige Parchment */
            border-radius: 32px;
            padding: 40px !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.04);
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
          }
          .torn-edge-top, .torn-edge-bottom, .torn-edge-left, .torn-edge-right {
            display: block !important;
          }
          .homepage-hero-left {
            width: 45% !important;
            max-width: 45% !important;
            padding: 0 !important;
            margin-top: 0 !important;
            position: relative;
          }
          .homepage-hero-left h1 {
            font-family: 'DM Serif Display', Georgia, serif !important;
            color: #1b3815 !important;
            font-size: 40px !important;
            font-weight: 900 !important;
          }
          .homepage-hero-right {
            display: block !important;
            width: 53% !important;
            height: 380px !important;
            background-image: url("https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=1200&q=80") !important;
            background-size: cover;
            background-position: center;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          }
          .homepage-search-container {
            position: static !important;
            width: 100% !important;
            margin-top: 24px !important;
            left: auto !important;
            right: auto !important;
            padding: 0 !important;
          }
          .quick-stat-item:not(:last-child) {
            border-right: 1.5px solid ${isDark ? '#24324a' : '#f0ede6'} !important;
          }
          .recommended-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
            overflow: visible !important;
          }
          .recommended-card {
            width: 100% !important;
          }
        }
      `}} />
    </div>
  )
}

