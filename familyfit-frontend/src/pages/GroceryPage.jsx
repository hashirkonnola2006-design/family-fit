import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Check,
  Heart,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Copy,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'
import { useFamily } from '../context/FamilyContext'
import { useGrocery, KERALA_GROCERY_DATASET } from '../context/GroceryContext'
import { useTheme } from '../context/ThemeContext'
import {
  RETAIL_MARKUP,
  mapApiPricesToGroceryItems,
} from '../utils/commodityMap'

export default function GroceryPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const {
    cart,
    cartItemsArray,
    cartCount,
    cartSubtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useGrocery()

  const navigate = useNavigate()
  const location = useLocation()
  const members = Array.isArray(family?.members) ? family.members.filter(Boolean) : []

  // ── States ──
  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Recommended')
  const [favorites, setFavorites] = useState([201, 212])
  const [toast, setToast] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      (window.location.search.includes('basket') ||
        window.location.search.includes('cart') ||
        window.location.hash.includes('basket') ||
        window.location.hash.includes('cart'))
    )
  })
  const [onlyBeneficialFilter, setOnlyBeneficialFilter] = useState(true)

  // Ensure page starts from top on mount and location changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
  }, [location.pathname])

  // Auto-open cart if query param or hash changes
  useEffect(() => {
    if (
      location.search.includes('basket') ||
      location.search.includes('cart') ||
      location.hash.includes('basket') ||
      location.hash.includes('cart')
    ) {
      setIsCartOpen(true)
    }
  }, [location])

  // ── Live Mandi Prices State ──
  const [rawApiResponse, setRawApiResponse] = useState(null)
  const [mappedPrices, setMappedPrices] = useState({})
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [priceError, setPriceError] = useState(null)

  // Fetch /api/prices on load from backend proxy
  useEffect(() => {
    let isMounted = true
    setIsLoadingPrices(true)
    setPriceError(null)

    fetch('/api/prices')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!isMounted) return
        if (data && Array.isArray(data.items)) {
          setRawApiResponse(data)
          const mapped = mapApiPricesToGroceryItems(data.items, RETAIL_MARKUP)
          setMappedPrices(mapped)
          if (data.stale) {
            console.info('[PRICES] Serving cached Kerala mandi data')
          }
        } else {
          setPriceError(data?.error || 'No mandi records returned')
        }
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('[PRICES] Proxy fetch failed:', err.message)
        setPriceError('Could not connect to live prices server')
      })
      .finally(() => {
        if (isMounted) setIsLoadingPrices(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // ── Helper: Price Lookup ──
  const getItemPriceInfo = (item) => {
    if (!item) return { priceText: '₹0', rawPrice: 0, marketDateText: null, isLive: false }

    const liveMatch = mappedPrices[item.name]

    if (liveMatch) {
      return {
        priceText: `~₹${liveMatch.finalItemPrice}`,
        unitText: liveMatch.unit || '1 kg',
        rawPrice: liveMatch.finalItemPrice,
        wholesalePrice: liveMatch.wholesalePerKg,
        marketDateText: liveMatch.smallPriceText,
        isLive: true,
        marketsCount: liveMatch.marketsReporting,
      }
    }

    return {
      priceText: item.price ? `₹${item.price}` : 'Market Price',
      unitText: item.unit || '1 kg',
      rawPrice: item.price || 0,
      wholesalePrice: null,
      marketDateText: null,
      isLive: false,
      marketsCount: 0,
    }
  }

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  // ── Member Selection ──
  const selectedMember = useMemo(() => {
    if (selectedMemberId === 'ALL') return null
    return members.find((m) => m && String(m.id) === String(selectedMemberId)) || null
  }, [members, selectedMemberId])

  // ── Allergy Matching Function ──
  const checkMemberAllergyMatch = (itemAllergies, memberAllergies) => {
    if (!itemAllergies?.length || !memberAllergies) return false
    const memList = Array.isArray(memberAllergies)
      ? memberAllergies
      : typeof memberAllergies === 'string'
      ? memberAllergies.split(',').map((s) => s.trim())
      : []

    return memList.some((m) => {
      const cleanM = (m || '').toLowerCase().trim()
      if (!cleanM || cleanM === 'none') return false
      return itemAllergies.some((i) => {
        const cleanI = (i || '').toLowerCase().trim()
        return cleanM.includes(cleanI) || cleanI.includes(cleanM)
      })
    })
  }

  // Find all family members who have an allergy conflict with this item
  const getConflictingMembers = (item) => {
    if (!item?.allergies || item.allergies.length === 0) return []
    return members.filter((m) => checkMemberAllergyMatch(item.allergies, m.allergies))
  }

  // ── Health Benefit Match for Selected Member ──
  const checkIsGoodForMember = (item, member) => {
    if (!item || !member) return false

    // Check conditions
    const memberConditions = Array.isArray(member.healthConditions)
      ? member.healthConditions.map((c) => (c || '').toLowerCase().trim())
      : typeof member.healthConditions === 'string'
      ? member.healthConditions.split(',').map((c) => c.toLowerCase().trim())
      : []

    const matchesCondition = (item.goodForConditions || []).some((itemCond) =>
      memberConditions.some((mCond) => mCond.includes(itemCond) || itemCond.includes(mCond))
    )

    // Check goals
    const memberGoal = (member.goal || '').toLowerCase().trim()
    const matchesGoal = (item.goodForGoals || []).some((itemGoal) =>
      memberGoal.includes(itemGoal) || itemGoal.includes(memberGoal)
    )

    return matchesCondition || matchesGoal
  }

  // ── Filter and Sort Groceries ──
  const processedItems = useMemo(() => {
    let items = [...KERALA_GROCERY_DATASET]

    // 1. Category Filter
    if (selectedCategory !== 'ALL') {
      items = items.filter((item) => item.category === selectedCategory)
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.whyBuy.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
    }

    // 3. Member Filter / Sorting ("if u click a person, it will show foods that are good for that person")
    if (selectedMember) {
      if (onlyBeneficialFilter) {
        // Show foods that are good for this person (excluding unsafe allergic foods)
        items = items.filter((item) => {
          const isGood = checkIsGoodForMember(item, selectedMember)
          const isAllergic = checkMemberAllergyMatch(item.allergies, selectedMember.allergies)
          return isGood && !isAllergic
        })
      } else {
        // Prioritize beneficial foods first, then safe foods, and unsafe at the very end
        items.sort((a, b) => {
          const aGood = checkIsGoodForMember(a, selectedMember)
          const bGood = checkIsGoodForMember(b, selectedMember)
          const aAllergic = checkMemberAllergyMatch(a.allergies, selectedMember.allergies)
          const bAllergic = checkMemberAllergyMatch(b.allergies, selectedMember.allergies)

          if (aAllergic && !bAllergic) return 1
          if (!aAllergic && bAllergic) return -1
          if (aGood && !bGood) return -1
          if (!aGood && bGood) return 1
          return 0
        })
      }
    }

    // 4. Sort Filter
    if (sortBy === 'PriceLowHigh') {
      items.sort(
        (a, b) => (getItemPriceInfo(a).rawPrice || 0) - (getItemPriceInfo(b).rawPrice || 0)
      )
    } else if (sortBy === 'PriceHighLow') {
      items.sort(
        (a, b) => (getItemPriceInfo(b).rawPrice || 0) - (getItemPriceInfo(a).rawPrice || 0)
      )
    }

    return items
  }, [
    selectedCategory,
    searchQuery,
    selectedMember,
    onlyBeneficialFilter,
    sortBy,
    mappedPrices,
    members,
  ])

  // ── Copy Shopping List ──
  const handleCopyCart = () => {
    if (cartItemsArray.length === 0) {
      showToastMsg('Your cart is empty!')
      return
    }

    const lines = [
      'FamilyFit Kerala Grocery Shopping List:',
      ...cartItemsArray.map(
        (it, idx) =>
          `${idx + 1}. ${it.name} - ${it.quantity} × ₹${it.price} = ₹${it.quantity * it.price}`
      ),
      `\nTotal Estimated Cost: ₹${cartSubtotal}`,
      'Prices verified with Kerala market pricing data.',
    ]

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      showToastMsg('Shopping list copied to clipboard!')
    })
  }

  const orangeColor = '#F4511E'
  const greenColor = '#10B981'

  return (
    <div
      className="grocery-page-root"
      style={{
        background: isDark ? '#0A0F1D' : '#F8FAF9',
        fontFamily: "'Nunito', 'Plus Jakarta Sans', sans-serif",
        color: isDark ? '#F8FAFC' : '#111827',
        minHeight: '100vh',
        paddingBottom: 90,
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1F2937',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 800,
            zIndex: 4000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#58CC02',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={14} strokeWidth={3} color="#FFFFFF" />
          </div>
          <span>{toast}</span>
        </div>
      )}

      {/* ── HERO BANNER MATCHING RECIPES PAGE (ORANGE THEME) ── */}
      <div
        className="ff-grocery-hero"
        style={{
          position: 'relative',
          background: isDark
            ? 'linear-gradient(to right, rgba(30, 15, 6, 0.96) 0%, rgba(42, 20, 6, 0.90) 45%, rgba(42, 20, 6, 0.65) 75%, rgba(42, 20, 6, 0.25) 100%), url(/grocery_orange_hero.png) no-repeat right center / cover'
            : 'linear-gradient(to right, rgba(234, 88, 12, 0.96) 0%, rgba(234, 88, 12, 0.90) 45%, rgba(234, 88, 12, 0.65) 75%, rgba(234, 88, 12, 0.20) 100%), url(/grocery_orange_hero.png) no-repeat right center / cover',
          overflow: 'hidden',
          minHeight: 340,
          display: 'flex',
          alignItems: 'center',
          padding: '40px 60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left content protected by scrim */}
        <div className="ff-grocery-hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '50%', flexShrink: 0 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#FFF3E0',
              letterSpacing: 2,
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 10,
            }}
          >
            KERALA SMART GROCERY ADVISORY
          </span>

          <h1
            className="ff-grocery-hero-title"
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 12px 0',
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }}
          >
            Fresh Groceries &amp; Prices
          </h1>

          <p
            style={{
              fontSize: 15,
              color: '#FFF7ED',
              margin: '0 0 24px 0',
              lineHeight: 1.6,
              fontWeight: 500,
              textShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}
          >
            Fresh Kerala market prices, member-tailored superfoods,<br />and active allergen safety screening.
          </p>

          {/* Search Bar matching Recipes page */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#FFFFFF',
              border: '1px solid #FED7AA',
              borderRadius: 9999,
              padding: '8px 8px 8px 20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              maxWidth: 420,
              width: '100%',
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search groceries, kappa, chena, plantains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 13.5,
                color: '#111827',
                background: 'transparent',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#FFF3E0',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={15} color="#EA580C" />
              </button>
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SlidersHorizontal size={15} color="#EA580C" />
              </div>
            )}
          </div>

          {/* Stats row with dividers matching Recipes page */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginTop: 20,
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 600,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="#FFEDD5" /> Personalized Health
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#FFEDD5" /> Severe Allergy Screening
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShoppingCart size={14} color="#FFEDD5" /> Direct Cart Checkout
            </span>
          </div>
        </div>

        {/* Quick Cart Pill in Hero Corner */}
        {cartCount > 0 && (
          <button
            className="ff-grocery-cart-pill"
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'absolute',
              top: 36,
              right: 60,
              zIndex: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #FED7AA',
              padding: '10px 18px',
              borderRadius: 9999,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#FFEDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EA580C',
              }}
            >
              <ShoppingCart size={15} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: 10,
                  color: '#9A3412',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Cart
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#111827',
                }}
              >
                {cartCount} Items • ₹{cartSubtotal}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '28px 24px 32px 24px',
        }}
      >
        {/* ── SECTION 1: FILTER BY FAMILY MEMBER (Click to sort / see foods good for that person) ── */}
        {members.length > 0 && (
          <div
          style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: 24,
            padding: '20px 24px',
            marginBottom: 24,
            boxShadow: isDark
              ? '0 6px 24px rgba(0,0,0,0.25)'
              : '0 4px 20px rgba(0,0,0,0.04)',
            border: isDark ? '1px solid #334155' : '1px solid #EAE6DF',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: isDark ? '#94A3B8' : '#78716C',
                  display: 'block',
                  marginBottom: 2,
                }}
              >
                Sort &amp; Personalize
              </span>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  margin: 0,
                  color: isDark ? '#F8FAFC' : '#1F2937',
                }}
              >
                Filter Groceries By Family Member
              </h2>
            </div>

            {selectedMember && (
              <button
                onClick={() => setSelectedMemberId('ALL')}
                style={{
                  background: 'transparent',
                  border: `1px solid ${isDark ? '#475569' : '#D1D5DB'}`,
                  borderRadius: 16,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 800,
                  color: isDark ? '#CBD5E1' : '#4B5563',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <X size={14} /> Reset to All Family
              </button>
            )}
          </div>

          {/* Member Selection Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {/* All Members Button */}
            <button
              onClick={() => setSelectedMemberId('ALL')}
              style={{
                background:
                  selectedMemberId === 'ALL'
                    ? orangeColor
                    : isDark
                    ? '#0F172A'
                    : '#F3F4F6',
                color:
                  selectedMemberId === 'ALL'
                    ? '#FFFFFF'
                    : isDark
                    ? '#F8FAFC'
                    : '#374151',
                border: `1.5px solid ${
                  selectedMemberId === 'ALL'
                    ? orangeColor
                    : isDark
                    ? '#334155'
                    : '#E5E7EB'
                }`,
                padding: '8px 18px',
                borderRadius: 20,
                fontSize: 13.5,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
              }}
            >
              <Users size={16} />
              <span>All Family Members</span>
            </button>

            {/* Individual Member Pills */}
            {members.map((m) => {
              const active = selectedMemberId === String(m.id)
              const conditionBadge =
                Array.isArray(m.healthConditions) && m.healthConditions.length > 0
                  ? m.healthConditions[0]
                  : m.goal || null

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberId(String(m.id))}
                  style={{
                    border: `1.5px solid ${
                      active ? orangeColor : isDark ? '#334155' : '#E5E7EB'
                    }`,
                    background: active
                      ? '#FBE9E7'
                      : isDark
                      ? '#0F172A'
                      : '#FFFFFF',
                    color: active
                      ? orangeColor
                      : isDark
                      ? '#F8FAFC'
                      : '#1F2937',
                    padding: '6px 14px 6px 8px',
                    borderRadius: 20,
                    fontSize: 13.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: active ? '0 4px 12px rgba(244,81,30,0.2)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <MemberAvatar member={m} size={24} />
                  <span>{m.name}</span>
                  {conditionBadge && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: active
                          ? orangeColor
                          : isDark
                          ? '#334155'
                          : '#F3F4F6',
                        color: active ? '#FFFFFF' : isDark ? '#94A3B8' : '#6B7280',
                      }}
                    >
                      {conditionBadge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Member Specific Beneficial Banner */}
          {selectedMember && (
            <div
              style={{
                marginTop: 18,
                padding: '12px 18px',
                borderRadius: 16,
                background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
                border: `1.5px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 900,
                      color: isDark ? '#6EE7B7' : '#065F46',
                    }}
                  >
                    Showing therapeutic foods for {selectedMember.name} (
                    {selectedMember.healthConditions?.join(', ') ||
                      selectedMember.goal ||
                      'General Wellness'}
                    )
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isDark ? '#A7F3D0' : '#047857',
                      fontWeight: 600,
                    }}
                  >
                    Items are filtered to reduce disease markers (e.g. lowering blood sugar, hypertension) and meet daily fitness goals.
                  </div>
                </div>
              </div>

              {/* Beneficial Only Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: isDark ? '#A7F3D0' : '#065F46',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={onlyBeneficialFilter}
                  onChange={(e) => setOnlyBeneficialFilter(e.target.checked)}
                  style={{ accentColor: '#10B981', width: 16, height: 16, cursor: 'pointer' }}
                />
                <span>Only show foods beneficial for {selectedMember.name}</span>
              </label>
            </div>
          )}
        </div>
        )}

        {/* ── SECTION 2: CATEGORY TABS, SEARCH, AND MANDI LIVE BADGE ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'ALL', label: 'All Items', count: KERALA_GROCERY_DATASET.length },
              {
                id: 'Produce',
                label: 'Fresh Produce',
                count: KERALA_GROCERY_DATASET.filter((i) => i.category === 'Produce').length,
              },
              {
                id: 'Protein',
                label: 'Protein & Fish',
                count: KERALA_GROCERY_DATASET.filter((i) => i.category === 'Protein').length,
              },
              {
                id: 'Dairy',
                label: 'Dairy',
                count: KERALA_GROCERY_DATASET.filter((i) => i.category === 'Dairy').length,
              },
              {
                id: 'Pantry',
                label: 'Pantry & Grains',
                count: KERALA_GROCERY_DATASET.filter((i) => i.category === 'Pantry').length,
              },
            ].map((cat) => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: active
                      ? isDark
                        ? '#334155'
                        : '#1F2937'
                      : isDark
                      ? '#1E293B'
                      : '#FFFFFF',
                    color: active ? '#FFFFFF' : isDark ? '#94A3B8' : '#4B5563',
                    border: `1px solid ${
                      active
                        ? 'transparent'
                        : isDark
                        ? '#334155'
                        : '#E5E7EB'
                    }`,
                    padding: '8px 16px',
                    borderRadius: 16,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {cat.label} ({cat.count})
                </button>
              )
            })}
          </div>

          {/* Right Controls: Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#94A3B8' : '#6B7280' }}>
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  color: isDark ? '#F8FAFC' : '#111827',
                  border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  borderRadius: 14,
                  padding: '7px 12px',
                  fontSize: 12.5,
                  fontWeight: 800,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Recommended">Recommended</option>
                <option value="PriceLowHigh">Price: Low to High</option>
                <option value="PriceHighLow">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: 5-COLUMN GROCERY GRID ── */}
        {processedItems.length === 0 ? (
          <div
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: 24,
              padding: '60px 24px',
              textAlign: 'center',
              border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <ShoppingCart size={44} color={isDark ? '#64748B' : '#9CA3AF'} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>
              No matching groceries found
            </h3>
            <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 440, margin: '0 auto 20px auto' }}>
              {selectedMember
                ? `No specific foods marked for ${selectedMember.name} in this category.`
                : 'Try adjusting your search query or category filters.'}
            </p>
            {selectedMember && (
              <button
                onClick={() => setOnlyBeneficialFilter(false)}
                style={{
                  background: orangeColor,
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Show All Groceries with Highlights
              </button>
            )}
          </div>
        ) : (
          <div className="grocery-5col-grid">
            {processedItems.map((item) => {
              const isFav = favorites.includes(item.id)
              const priceInfo = getItemPriceInfo(item)
              const cartItem = cart[item.id]
              const itemQuantity = cartItem?.quantity || 0

              // Allergy calculations:
              // 1. When NOT sorted (selectedMemberId === 'ALL'), check if ANY family member is allergic
              const conflictingMembers = getConflictingMembers(item)
              const hasGeneralAllergyConflict =
                selectedMemberId === 'ALL' && conflictingMembers.length > 0

              // 2. When sorted by a specific person, check if that person is allergic
              const isSelectedMemberAllergic =
                Boolean(selectedMember) &&
                checkMemberAllergyMatch(item.allergies, selectedMember.allergies)

              // 3. Check if food is beneficial for the selected person
              const isBeneficialForSelected =
                Boolean(selectedMember) && checkIsGoodForMember(item, selectedMember)

              return (
                <div
                  key={item.id}
                  style={{
                    background: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: 22,
                    border: hasGeneralAllergyConflict || isSelectedMemberAllergic
                      ? '2px solid #EF4444'
                      : isBeneficialForSelected
                      ? '2px solid #10B981'
                      : isDark
                      ? '1px solid #334155'
                      : '1px solid #EAE6DF',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isBeneficialForSelected
                      ? '0 6px 20px rgba(16, 185, 129, 0.12)'
                      : hasGeneralAllergyConflict
                      ? '0 6px 20px rgba(239, 68, 68, 0.12)'
                      : isDark
                      ? '0 4px 16px rgba(0,0,0,0.2)'
                      : '0 2px 12px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {/* ── ALLERGEN "X" HEADER DIRECTLY ABOVE THE GROCERY ── */}
                  {/* (Requirement: "and if not sorted it will show and x above the grocery indicating severe allergy") */}
                  {hasGeneralAllergyConflict && (
                    <div
                      style={{
                        background: '#FEF2F2',
                        borderBottom: '1.5px solid #FECACA',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#DC2626',
                        fontSize: 11.5,
                        fontWeight: 900,
                        lineHeight: 1.25,
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 900,
                          flexShrink: 0,
                          boxShadow: '0 2px 5px rgba(220,38,38,0.3)',
                        }}
                      >
                        ✕
                      </span>
                      <span>
                        Severe Allergy:{' '}
                        <strong>{conflictingMembers.map((m) => m.name).join(', ')}</strong>
                      </span>
                    </div>
                  )}

                  {/* Allergen Warning when sorted by specific person */}
                  {isSelectedMemberAllergic && (
                    <div
                      style={{
                        background: '#FEF2F2',
                        borderBottom: '1.5px solid #FECACA',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#DC2626',
                        fontSize: 11.5,
                        fontWeight: 900,
                        lineHeight: 1.25,
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        ✕
                      </span>
                      <span>
                        Unsafe for {selectedMember.name} (Severe Allergy)
                      </span>
                    </div>
                  )}

                  {/* Beneficial Highlight Banner when sorted by specific person */}
                  {isBeneficialForSelected && !isSelectedMemberAllergic && (
                    <div
                      style={{
                        background: '#ECFDF5',
                        borderBottom: '1.5px solid #A7F3D0',
                        padding: '7px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#065F46',
                        fontSize: 11,
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      <Sparkles size={13} color="#10B981" />
                      <span>Recommended for {selectedMember.name}</span>
                    </div>
                  )}

                  {/* Image Container */}
                  <div
                    style={{
                      height: 165,
                      width: '100%',
                      background: isDark ? '#0F172A' : item.bgTint || '#F6F7F2',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/images/tapioca_kappa.jpg'
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Category Tag on Image */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {item.category}
                    </span>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        color: isFav ? orangeColor : '#9CA3AF',
                      }}
                    >
                      <Heart
                        size={16}
                        fill={isFav ? orangeColor : 'none'}
                        color={isFav ? orangeColor : '#9CA3AF'}
                      />
                    </button>
                  </div>

                  {/* Content Details */}
                  <div
                    style={{
                      padding: '14px 14px 16px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <h3
                        style={{
                          fontSize: 14.5,
                          fontWeight: 900,
                          margin: 0,
                          color: isDark ? '#F8FAFC' : '#111827',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.name}
                      </h3>

                      {/* Direct Health Action Callout */}
                      {item.healthHighlight && (
                        <div
                          style={{
                            background: isBeneficialForSelected
                              ? '#ECFDF5'
                              : isDark
                              ? '#0F172A'
                              : '#F9FAFB',
                            border: `1px solid ${
                              isBeneficialForSelected
                                ? '#A7F3D0'
                                : isDark
                                ? '#334155'
                                : '#E5E7EB'
                            }`,
                            padding: '6px 9px',
                            borderRadius: 10,
                            fontSize: 11,
                            fontWeight: 700,
                            color: isBeneficialForSelected
                              ? '#065F46'
                              : isDark
                              ? '#94A3B8'
                              : '#4B5563',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.healthHighlight}
                        </div>
                      )}

                      <p
                        style={{
                          fontSize: 11.5,
                          color: isDark ? '#94A3B8' : '#6B7280',
                          fontWeight: 600,
                          margin: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.whyBuy}
                      </p>
                    </div>

                    {/* Price & Add to Cart Controls */}
                    <div
                      style={{
                        borderTop: `1px solid ${isDark ? '#334155' : '#F3F4F6'}`,
                        paddingTop: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      {/* Price Section */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 900,
                            color: isDark ? '#F8FAFC' : '#111827',
                            letterSpacing: '-0.5px',
                          }}
                        >
                          {priceInfo.priceText}
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isDark ? '#94A3B8' : '#6B7280',
                              marginLeft: 4,
                            }}
                          >
                            / {priceInfo.unitText}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button or Stepper */}
                      {itemQuantity === 0 ? (
                        <button
                          onClick={() => {
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: priceInfo.rawPrice || item.price,
                              unit: priceInfo.unitText,
                              category: item.category,
                              imageUrl: item.imageUrl,
                            })
                            showToastMsg(`Added ${item.name} to cart! 🛒`)
                          }}
                          style={{
                            width: '100%',
                            background: orangeColor,
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: 14,
                            fontSize: 13,
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: '0 4px 12px rgba(244,81,30,0.25)',
                            transition: 'transform 0.15s ease',
                          }}
                        >
                          <Plus size={16} strokeWidth={3} />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isDark ? '#0F172A' : '#FBE9E7',
                            border: `1.5px solid ${orangeColor}`,
                            borderRadius: 14,
                            padding: '4px 6px',
                          }}
                        >
                          <button
                            onClick={() => updateCartQuantity(item.id, itemQuantity - 1)}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 10,
                              background: '#FFFFFF',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: orangeColor,
                              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            }}
                          >
                            <Minus size={15} strokeWidth={3} />
                          </button>

                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 900,
                              color: orangeColor,
                            }}
                          >
                            {itemQuantity} in Cart
                          </span>

                          <button
                            onClick={() => updateCartQuantity(item.id, itemQuantity + 1)}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 10,
                              background: orangeColor,
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#FFFFFF',
                              boxShadow: '0 1px 4px rgba(244,81,30,0.3)',
                            }}
                          >
                            <Plus size={15} strokeWidth={3} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── CART SLIDE-OVER DRAWER / MODAL ── */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 3500,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              height: '100%',
              background: isDark ? '#1E293B' : '#FFFFFF',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: '#FBE9E7',
                    color: orangeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingCart size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      margin: 0,
                      color: isDark ? '#F8FAFC' : '#111827',
                    }}
                  >
                    Your Grocery Cart
                  </h3>
                  <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                    {cartCount} total items selected
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {cartItemsArray.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <ShoppingCart size={40} color="#94A3B8" />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 6px 0' }}>
                    Your cart is currently empty
                  </h4>
                  <p style={{ fontSize: 13, margin: 0 }}>
                    Browse through fresh produce and health superfoods to add them to your list.
                  </p>
                </div>
              ) : (
                cartItemsArray.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      background: isDark ? '#0F172A' : '#F9FAFB',
                      border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                      borderRadius: 16,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    {/* Item Thumbnail & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = '/images/tapioca_kappa.jpg'
                        }}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: isDark ? '#F8FAFC' : '#111827',
                            lineHeight: 1.25,
                          }}
                        >
                          {it.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                          ₹{it.price} / {it.unit}
                        </div>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => updateCartQuantity(it.id, it.quantity - 1)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          background: isDark ? '#334155' : '#FFFFFF',
                          border: `1px solid ${isDark ? '#475569' : '#D1D5DB'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: isDark ? '#FFFFFF' : '#1F2937',
                        }}
                      >
                        <Minus size={12} />
                      </button>

                      <span style={{ fontSize: 13, fontWeight: 900, minWidth: 16, textAlign: 'center' }}>
                        {it.quantity}
                      </span>

                      <button
                        onClick={() => updateCartQuantity(it.id, it.quantity + 1)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          background: orangeColor,
                          border: 'none',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 900,
                        color: isDark ? '#F8FAFC' : '#111827',
                        minWidth: 50,
                        textAlign: 'right',
                      }}
                    >
                      ₹{it.price * it.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartItemsArray.length > 0 && (
              <div
                style={{
                  padding: '20px 24px',
                  borderTop: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#6B7280' }}>
                    Estimated Basket Subtotal:
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: orangeColor,
                    }}
                  >
                    ₹{cartSubtotal}
                  </span>
                </div>

                <button
                  onClick={handleCopyCart}
                  style={{
                    width: '100%',
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
                  }}
                >
                  <Copy size={16} /> Copy Grocery Checklist
                </button>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      clearCart()
                      showToastMsg('Cart cleared!')
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: `1px solid ${isDark ? '#475569' : '#D1D5DB'}`,
                      color: '#EF4444',
                      padding: '10px',
                      borderRadius: 14,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Trash2 size={14} /> Clear Cart
                  </button>

                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      showToastMsg('Groceries saved to meal plan basket!')
                    }}
                    style={{
                      flex: 1,
                      background: isDark ? '#334155' : '#1F2937',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px',
                      borderRadius: 14,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Cart Badge on Mobile & Tablets */}
      {cartCount > 0 && !isCartOpen && (
        <div
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: 84,
            right: 24,
            background: orangeColor,
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 30,
            boxShadow: '0 8px 24px rgba(244,81,30,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 1000,
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          <ShoppingCart size={18} />
          <span>Cart ({cartCount}) • ₹{cartSubtotal}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* CSS Styles for Responsive Grid */}
      <style>{`
        .grocery-5col-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        @media (max-width: 1380px) {
          .grocery-5col-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1080px) {
          .grocery-5col-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .ff-grocery-hero-content {
            max-width: 70% !important;
          }
        }

        @media (max-width: 768px) {
          .ff-grocery-hero {
            padding: 28px 18px !important;
            min-height: auto !important;
            background-position: right center !important;
          }
          .ff-grocery-hero-content {
            max-width: 100% !important;
          }
          .ff-grocery-hero-title {
            font-size: 30px !important;
            margin-bottom: 8px !important;
          }
          .ff-grocery-cart-pill {
            top: 14px !important;
            right: 14px !important;
            padding: 6px 12px !important;
            font-size: 11px !important;
          }
          .grocery-5col-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .grocery-5col-grid {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
