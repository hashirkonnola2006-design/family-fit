import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// ── DESIGN SYSTEM ICONS ──
const LeafIcon = ({ size = 28, color = "#2E5B1A" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 24 10 14 20 8C20 8 22 18 12 24C10.5 24.9 9 24.5 8 24Z" fill={color} />
    <path d="M6 18C6 18 12 10 24 6C24 6 22 18 14 20C10 21 7.5 19.5 6 18Z" fill="#81C784" />
    <path d="M9 23C13 17 18 13 24 6" stroke="#EBF5E1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const FilterIconWhite = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <circle cx="14" cy="6" r="2.5" fill="white" />
    <line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="10" cy="18" r="2.5" fill="white" />
  </svg>
)

const BookmarkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E5B1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const BasketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E5B1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const CalendarStreakIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="4" ry="4" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="1.5" fill="#FF8A00" />
  </svg>
)

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const FlameIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.67-1.5-3.5-3.5-5.5-2 2-3.5 3.83-3.5 5.5z" fill="#FF8A00" />
    <path d="M12 2c1 3 4 4.5 4 9a6 6 0 1 1-12 0c0-4 3.5-7 5-9 0 2.5 1.5 3.5 3 2z" />
  </svg>
)

const HeartCardIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "#121826"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ArrowRightIcon = ({ color = "#2E5B1A" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E5B1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const HeartShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

// ── REFERENCE DATA ──
const RECOMMENDED_RECIPES = [
  {
    id: 1001,
    name: 'Kerala Vegetable Upma',
    tag: 'Great for Everyone',
    category: 'Breakfast',
    prepTimeMinutes: 25,
    kcal: 280,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
  },
  {
    id: 1002,
    name: 'Green Moong Smoothie',
    tag: 'Detoxifying • Immunity Boost',
    category: 'Smoothies',
    prepTimeMinutes: 10,
    kcal: 180,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80',
  },
  {
    id: 1003,
    name: 'Kerala Vegetable Stew',
    tag: 'High Fiber • Heart Healthy',
    category: 'Lunch',
    prepTimeMinutes: 20,
    kcal: 260,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  },
]

const CATEGORY_CHIPS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Smoothies', 'Desserts']
const HEALTH_TAGS = ['High Fiber', 'Low Sugar', 'Gluten Free', 'Quick', 'Spicy', 'New']

const DEFAULT_FAMILY_MEMBERS = [
  { id: 1, name: 'Dad', avatar: '👨‍💼', restriction: 'Low Sodium', status: 'Good', statusType: 'good' },
  { id: 2, name: 'Mom', avatar: '👩‍💼', restriction: 'Low Sugar', status: 'Good', statusType: 'good' },
  { id: 3, name: 'Anya', avatar: '👧', restriction: 'Nut Allergy', status: 'Needs attention', statusType: 'warning' },
  { id: 4, name: 'Hashir', avatar: '👨‍💻', restriction: 'No restrictions', status: 'Good', statusType: 'good' },
]

export default function HomePage() {
  const { user } = useAuth()
  const { family } = useFamily()
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('')
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

  const rawName = user?.familyName || family?.name || user?.name || 'Hashir'
  let displayName = rawName.replace(/ family$/i, '').trim()
  if (!displayName || displayName === 'My Family') displayName = 'Hashir'

  const realMembers = family?.members || []
  const displayMembers = realMembers.length > 0
    ? realMembers.map((m) => ({
        id: m.id,
        name: m.name,
        avatar: m.gender === 'FEMALE' ? '👩' : '👨',
        restriction: m.allergies?.length > 0 ? m.allergies.join(', ') : m.dietPreference !== 'NO_PREFERENCE' ? m.dietPreference : 'No restrictions',
        status: m.allergies?.length > 0 ? 'Needs attention' : 'Good',
        statusType: m.allergies?.length > 0 ? 'warning' : 'good',
      }))
    : DEFAULT_FAMILY_MEMBERS

  const filteredRecommendations = useMemo(() => {
    return RECOMMENDED_RECIPES.filter((r) => {
      const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.tag.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory
      const matchesTag = !selectedTag || r.tag.toLowerCase().includes(selectedTag.toLowerCase())
      return matchesSearch && matchesCategory && matchesTag
    })
  }, [search, selectedCategory, selectedTag])

  return (
    <div
      className="landing-page-root"
      style={{
        background: isDark ? '#0A0F1D' : '#F6F7F2',
        fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
        color: isDark ? '#F8FAFC' : '#212121',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── MAIN CONTAINER ── */}
      <main style={{ flex: 1, maxWidth: 1240, width: '100%', margin: '0 auto', padding: '24px 24px 48px 24px' }}>
        {/* ── 03. HERO BANNER ── */}
        <section
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            marginBottom: 28,
            boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
            minHeight: 400,
            backgroundImage: `linear-gradient(to right, rgba(14, 20, 12, 0.90) 0%, rgba(14, 20, 12, 0.75) 45%, rgba(14, 20, 12, 0.1) 100%), url('/hero_sadya.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            display: 'flex',
            alignItems: 'center',
            padding: '48px 40px',
          }}
        >
          <div style={{ maxWidth: 540, zIndex: 2, position: 'relative' }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'DM Serif Display', serif",
                fontSize: 46,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                margin: '0 0 16px 0',
                letterSpacing: '-0.5px',
              }}
            >
              Wholesome <span style={{ color: '#FF8A00' }}>Kerala</span> meals,<br />
              stronger every day.
            </h1>

            <p
              style={{
                fontSize: 15,
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.5,
                margin: '0 0 28px 0',
                fontWeight: 400,
              }}
            >
              Personalized nutrition, healthy recipes and smart planning for your family's well-being.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/recipes')}
                style={{
                  background: '#2E7D32',
                  color: 'white',
                  border: 'none',
                  padding: '13px 26px',
                  borderRadius: 30,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(46,125,50,0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>🍃</span> Let's eat healthy
              </button>

              <button
                onClick={() => navigate('/recipes')}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>Explore recipes</span>
                <ArrowRightIcon color="white" />
              </button>
            </div>

            {/* 04. SEARCH & FILTER FLOATING BAR */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 32,
                padding: '6px 6px 6px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                maxWidth: 480,
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Search meals, plans, recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  color: '#212121',
                  background: 'transparent',
                }}
              />
              <button
                onClick={() => navigate('/recipes')}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#2E7D32',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <FilterIconWhite />
              </button>
            </div>
          </div>
        </section>

        {/* ── 07. FEATURE / ACTION BUTTONS (4 CARDS ROW) ── */}
        <section
          style={{
            background: isDark ? '#141C2E' : '#FFFFFF',
            borderRadius: 24,
            padding: 20,
            marginBottom: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: `1px solid ${isDark ? '#24324A' : '#F0F2EB'}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {/* Card 1: Saved Recipes */}
          <div
            onClick={() => navigate('/recipes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 16,
              background: isDark ? '#1E293B' : '#FAFAF7',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#EBF5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookmarkIcon />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  Saved Recipes
                </h4>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  {savedRecipeIds.length} recipes
                </span>
              </div>
            </div>
            <ArrowRightIcon color="#94A3B8" />
          </div>

          {/* Card 2: Favorites */}
          <div
            onClick={() => navigate('/recipes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 16,
              background: isDark ? '#1E293B' : '#FAFAF7',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeartIcon />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  Favorites
                </h4>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  8 meals
                </span>
              </div>
            </div>
            <ArrowRightIcon color="#94A3B8" />
          </div>

          {/* Card 3: Smart Grocery */}
          <div
            onClick={() => navigate('/grocery')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 16,
              background: isDark ? '#1E293B' : '#FAFAF7',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#EBF5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BasketIcon />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  Smart Grocery
                </h4>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  18 items
                </span>
              </div>
            </div>
            <ArrowRightIcon color="#94A3B8" />
          </div>

          {/* Card 4: Meal Streak */}
          <div
            onClick={() => navigate('/tips')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 16,
              background: isDark ? '#1E293B' : '#FAFAF7',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarStreakIcon />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  Meal Streak
                </h4>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  5 days
                </span>
              </div>
            </div>
            <ArrowRightIcon color="#94A3B8" />
          </div>
        </section>

        {/* ── 10. CATEGORY CHIPS & 11. TAGS / LABELS ── */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
            {CATEGORY_CHIPS.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 20,
                    border: 'none',
                    background: active ? '#2E7D32' : isDark ? '#1E293B' : '#FFFFFF',
                    color: active ? 'white' : isDark ? '#94A3B8' : '#4A5568',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: active ? '0 4px 12px rgba(46,125,50,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {HEALTH_TAGS.map((tag) => {
              const active = selectedTag === tag
              return (
                <span
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 14,
                    background: active ? '#81C784' : isDark ? '#1E293B' : '#EBF5E1',
                    color: active ? 'white' : '#2E7D32',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        </section>

        {/* ── SECTION: RECOMMENDED & FAMILY OVERVIEW GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 24, marginBottom: 36 }} className="main-content-grid">
          {/* LEFT 3/4: RECOMMENDED RECIPES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LeafIcon size={22} color="#2E7D32" />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: isDark ? '#F8FAFC' : '#212121' }}>
                  Recommended for your family
                </h2>
              </div>
              <button
                onClick={() => navigate('/recipes')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>View all recipes</span>
                <ArrowRightIcon color="#2E7D32" />
              </button>
            </div>

            {/* 08. RECIPE CARDS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
              {filteredRecommendations.map((recipe) => {
                const isSaved = savedRecipeIds.includes(String(recipe.id))
                return (
                  <div
                    key={recipe.id}
                    style={{
                      background: isDark ? '#141C2E' : '#FFFFFF',
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                      border: `1px solid ${isDark ? '#24324A' : '#F0F2EB'}`,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Image Container with Floating Heart Button */}
                    <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        onClick={() => toggleSaveRecipe(recipe.id)}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: '#FFFFFF',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        <HeartCardIcon filled={isSaved} />
                      </button>
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0', color: isDark ? '#F8FAFC' : '#212121' }}>
                          {recipe.name}
                        </h3>

                        {/* Tag Pill */}
                        <div style={{ marginBottom: 12 }}>
                          <span
                            style={{
                              background: '#EBF5E1',
                              color: '#2E7D32',
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: 12,
                              display: 'inline-block',
                            }}
                          >
                            {recipe.tag}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ClockIcon />
                          <span>{recipe.prepTimeMinutes} min</span>
                        </div>
                        <span>|</span>
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

          {/* RIGHT 1/4: 09. FAMILY OVERVIEW CARD */}
          <div>
            <div
              style={{
                background: isDark ? '#141C2E' : '#F6F8F3',
                borderRadius: 24,
                padding: 20,
                border: `1px solid ${isDark ? '#24324A' : '#E5EBDD'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: 18 }}>👥</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: isDark ? '#F8FAFC' : '#212121' }}>
                  Your family at a glance
                </h3>
              </div>

              {/* Members List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {displayMembers.map((member) => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: '#EBF5E1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                        }}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121', lineHeight: 1.2 }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>
                          {member.restriction}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: member.statusType === 'good' ? '#2E7D32' : '#FF8A00',
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: member.statusType === 'good' ? '#2E7D32' : '#FF8A00',
                        }}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Manage Family Button */}
              <button
                onClick={() => navigate('/profile')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1.5px solid #2E7D32',
                  color: '#2E7D32',
                  padding: '10px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>Manage family</span>
                <ArrowRightIcon color="#2E7D32" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 12. PLAN BENEFIT CARDS ── */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px 0', color: isDark ? '#F8FAFC' : '#212121' }}>
                Curated Kerala Plans for Your Family
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 400 }}>
                Balanced weekly meal plans inspired by Kerala tradition.
              </p>
            </div>
            <button
              onClick={() => navigate('/recipes')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2E7D32',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>Explore plans</span>
              <ArrowRightIcon color="#2E7D32" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {/* Plan 1 */}
            <div
              onClick={() => navigate('/recipes')}
              style={{
                background: isDark ? '#141C2E' : '#F6F8F3',
                borderRadius: 20,
                padding: 20,
                border: `1px solid ${isDark ? '#24324A' : '#E2EAD8'}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EBF5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheckIcon />
                </div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  For Weight Balance
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  Balanced meals for healthy weight
                </span>
                <ArrowRightIcon color="#2E7D32" />
              </div>
            </div>

            {/* Plan 2 */}
            <div
              onClick={() => navigate('/recipes')}
              style={{
                background: isDark ? '#141C2E' : '#F6F8F3',
                borderRadius: 20,
                padding: 20,
                border: `1px solid ${isDark ? '#24324A' : '#E2EAD8'}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EBF5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LeafIcon size={20} color="#2E7D32" />
                </div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  For Immunity
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  Boost immunity with nutritious food
                </span>
                <ArrowRightIcon color="#2E7D32" />
              </div>
            </div>

            {/* Plan 3 */}
            <div
              onClick={() => navigate('/recipes')}
              style={{
                background: isDark ? '#141C2E' : '#FFF8F0',
                borderRadius: 20,
                padding: 20,
                border: `1px solid ${isDark ? '#24324A' : '#FFE8D1'}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 120,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartShieldIcon />
                </div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                  For Heart Health
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                  Good for your heart, every day
                </span>
                <ArrowRightIcon color="#FF8A00" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 13. TESTIMONIAL / REVIEW CARD ── */}
        <section
          style={{
            background: isDark ? '#141C2E' : '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: `1px solid ${isDark ? '#24324A' : '#F0F2EB'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#EBF5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            👩
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                Anitha Nair
              </h4>
              <span style={{ color: '#FF8A00', fontSize: 13 }}>⭐⭐⭐⭐⭐</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>
              "FamilyFit has made our daily meals healthier and planning so easy. My kids love the recipes!"
            </p>
          </div>
        </section>
      </main>

      {/* ── 23. FOOTER ── */}
      <footer
        style={{
          background: isDark ? '#0A0F1D' : '#F6F7F2',
          borderTop: `1px solid ${isDark ? '#1E293B' : '#EAECE5'}`,
          padding: '48px 24px 24px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 36,
              marginBottom: 40,
            }}
          >
            {/* Col 1: Logo & Socials */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <LeafIcon size={26} color="#2E7D32" />
                <span style={{ fontSize: 20, fontWeight: 800, color: isDark ? '#FFFFFF' : '#2E7D32' }}>
                  Family<span style={{ color: '#81C784' }}>Fit</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, marginBottom: 16, maxWidth: 240 }}>
                Wholesome Kerala meals and smart planning for a healthier family.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['facebook', 'instagram', 'youtube', 'pinterest'].map((social) => (
                  <span
                    key={social}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isDark ? '#1E293B' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    🌐
                  </span>
                ))}
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h5 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                Quick Links
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#64748B' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/recipes')}>Recipes</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/grocery')}>Grocery</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/tips')}>Tips</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>About Us</li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div>
              <h5 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                Resources
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#64748B' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/recipes')}>Meal Plans</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/tips')}>Health Guide</li>
                <li style={{ cursor: 'pointer' }}>Privacy Policy</li>
                <li style={{ cursor: 'pointer' }}>Terms & Conditions</li>
                <li style={{ cursor: 'pointer' }}>Help Center</li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h5 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 700, color: isDark ? '#F8FAFC' : '#212121' }}>
                Newsletter
              </h5>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.4, marginBottom: 14 }}>
                Subscribe for healthy recipes and family tips.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                    outline: 'none',
                    fontSize: 13,
                    flex: 1,
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    color: isDark ? '#F8FAFC' : '#212121',
                  }}
                />
                <button
                  onClick={() => alert('Thank you for subscribing!')}
                  style={{
                    background: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${isDark ? '#1E293B' : '#EAECE5'}`,
              paddingTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#94A3B8',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span>© 2026 FamilyFit. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


