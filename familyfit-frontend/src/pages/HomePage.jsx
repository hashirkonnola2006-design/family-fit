import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
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

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E4D18" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="14" cy="6" r="2.5" fill="#CFE8A9" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="10" cy="18" r="2.5" fill="#CFE8A9" />
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

// ── REFERENCE DATA ──
const RECOMMENDED_RECIPES = [
  {
    id: 1001,
    name: 'Kerala Chicken Biryani',
    tag: 'Great for Dad',
    prepTimeMinutes: 30,
    kcal: 520,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
  },
  {
    id: 1002,
    name: 'Malabar Fish Curry',
    tag: 'Great for Mom',
    prepTimeMinutes: 25,
    kcal: 410,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
  },
  {
    id: 1003,
    name: 'Appam with Vegetable Stew',
    tag: 'Great for Anya',
    prepTimeMinutes: 20,
    kcal: 520,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
  },
  {
    id: 1004,
    name: 'Puttu with Kadala Curry',
    tag: 'Great for All',
    prepTimeMinutes: 15,
    kcal: 280,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
  },
]

const FAMILY_MEMBERS = [
  {
    id: 'hashir',
    name: 'Hashir',
    kcal: '1,980 kcal',
    avatar: '/avatars/teen_male.png',
    status: 'On track',
  },
  {
    id: 'mom',
    name: 'Mom',
    kcal: '1,760 kcal',
    avatar: '/avatars/adult_female.png',
    status: 'On track',
  },
  {
    id: 'dad',
    name: 'Dad',
    kcal: '2,240 kcal',
    avatar: '/avatars/adult_male.png',
    status: 'On track',
  },
  {
    id: 'anya',
    name: 'Anya',
    kcal: '1,480 kcal',
    avatar: '/avatars/child_female.png',
    status: 'On track',
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [savedRecipeIds, setSavedRecipeIds] = useState(['1001', '1002'])
  const navigate = useNavigate()

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

  const initial = user?.name ? user.name[0].toUpperCase() : 'H'
  const familyName = user?.familyName || 'Hashir'

  const filteredRecipes = search
    ? RECOMMENDED_RECIPES.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : RECOMMENDED_RECIPES

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0A0F1D' : '#FAFAF7',
        paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: isDark ? '#F8FAFC' : '#121826',
        position: 'relative',
        boxSizing: 'border-box',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ── 1 & 2. HERO SECTION & HEADER ── */}
      <div style={{ padding: '16px 16px 0 16px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 32,
            boxShadow: isDark ? '0 25px 45px rgba(0,0,0,0.5)' : '0 25px 45px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            background: isDark ? '#141C2E' : '#FFFFFF',
            minHeight: 280,
          }}
        >
          {/* Background Food Photo */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '65%',
              height: '100%',
              backgroundImage: 'url("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          />

          {/* Smooth Gradient Overlay for legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'linear-gradient(to right, #141C2E 42%, rgba(20,28,46,0.85) 68%, rgba(20,28,46,0.15) 100%)'
                : 'linear-gradient(to right, #FAFAF7 38%, rgba(250,250,247,0.88) 65%, rgba(250,250,247,0.1) 100%)',
            }}
          />

          {/* Content Wrapper */}
          <div style={{ position: 'relative', zIndex: 2, padding: '20px 20px 38px 20px' }}>
            {/* Top Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LeafIcon />
                <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px', color: isDark ? '#F8FAFC' : '#1E4D18', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Family<span style={{ color: '#F97316' }}>Fit</span>
                </span>
              </div>

              {/* Right Icons: Notification Bell & User Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  style={{
                    width: 42,
                    height: 42,
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
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: '#2F6B1F',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(47,107,31,0.25)',
                  }}
                >
                  {initial}
                </div>
              </div>
            </div>

            {/* Headline & Subtext */}
            <div style={{ maxWidth: '78%' }}>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: isDark ? '#F8FAFC' : '#121826',
                  lineHeight: 1.18,
                  margin: 0,
                  letterSpacing: '-0.5px',
                }}
              >
                Good evening,<br />
                <span style={{ color: '#2F6B1F', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {familyName} family!
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#F97316" />
                  </svg>
                </span>
              </h1>

              <p
                style={{
                  fontSize: 13,
                  color: isDark ? '#94A3B8' : '#5B6472',
                  marginTop: 8,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  margin: '8px 0 0',
                }}
              >
                Wholesome Kerala meals,<br />made for your family.
              </p>

              {/* Green Accent Swoop */}
              <div style={{ marginTop: 6 }}>
                <svg width="65" height="8" viewBox="0 0 65 8" fill="none">
                  <path d="M2 6C20 2 45 2 63 6" stroke="#2F6B1F" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. SEARCH BAR (Overlapping Hero) ── */}
        <div style={{ padding: '0 10px', marginTop: -24, position: 'relative', zIndex: 10 }}>
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
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#CFE8A9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <FilterIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. QUICK STATS ROW ── */}
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

      {/* ── 5. RECOMMENDED FOR YOUR FAMILY ── */}
      <div style={{ padding: '0 16px', marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isDark ? '#F8FAFC' : '#121826', letterSpacing: '-0.3px' }}>
            Recommended for your family
          </h2>
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
                }}
              >
                {/* Photo Top */}
                <div style={{ position: 'relative', width: '100%', height: 135 }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

      {/* ── 6. YOUR FAMILY AT A GLANCE ── */}
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

        {/* 4 Member Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
          }}
        >
          {FAMILY_MEMBERS.map((member) => (
            <div
              key={member.id}
              onClick={() => navigate('/profile')}
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
              {/* Avatar Illustration */}
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: '#F4F5EF',
                  overflow: 'hidden',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              {/* Name */}
              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#121826' }}>
                {member.name}
              </div>

              {/* Kcal */}
              <div style={{ fontSize: 11, fontWeight: 500, color: '#5B6472', marginTop: 2 }}>
                {member.kcal}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34A853' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#2F6B1F' }}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UNTOUCHED FIXED BOTTOM NAV DOCK ── */}
      <BottomNav />
    </div>
  )
}
