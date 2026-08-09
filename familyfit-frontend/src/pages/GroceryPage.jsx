import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'
import { useFamily } from '../context/FamilyContext'
import { useGrocery, KERALA_GROCERY_DATASET } from '../context/GroceryContext'
import { useTheme } from '../context/ThemeContext'

const BUDGET_PRESETS = [500, 1000, 1500, 2500, 3500, 5000]

export default function GroceryPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const { budget, setBudget, budgetPeriod, setBudgetPeriod } = useGrocery()
  const navigate = useNavigate()

  const members = family?.members || []

  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [tempBudget, setTempBudget] = useState(budget || 1500)
  const [toast, setToast] = useState('')
  const [sortBy, setSortBy] = useState('Recommended')
  const [favorites, setFavorites] = useState([201]) // default favorite items

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const selectedMember =
    selectedMemberId === 'ALL'
      ? null
      : members.find((m) => String(m.id) === String(selectedMemberId)) || null

  const rawRecommendations = KERALA_GROCERY_DATASET

  // Filter produce items for primary view (Produce category first, or all based on selection)
  const produceItems = rawRecommendations.filter(
    (item) => item.category === 'Produce'
  )
  const otherItems = rawRecommendations.filter(
    (item) => item.category !== 'Produce'
  )

  const handlePeriodChange = (period) => {
    setBudgetPeriod(period)
    if (period === 'Daily' && budget > 1000) setBudget(300)
    else if (period === 'Weekly' && (budget < 500 || budget > 3000))
      setBudget(1500)
    else if (period === '2-Week') setBudget(1500)
    showToastMsg(`Recommendations scaled to ${period} budget!`)
  }

  const handleSaveBudget = (e) => {
    e.preventDefault()
    setBudget(Math.max(10, parseFloat(tempBudget) || 1500))
    setShowBudgetModal(false)
    showToastMsg('Target budget updated! 💰')
  }

  return (
    <div
      style={{
        background: isDark ? '#0A0F1D' : '#FAFAFA',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        color: isDark ? '#F8FAFC' : '#111827',
        minHeight: '100vh',
        paddingBottom: 80,
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
            background: '#1B4D2E',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 700,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          {toast}
        </div>
      )}

      {/* Main Responsive Wrapper */}
      <div
        style={{
          maxWidth: 1380,
          margin: '0 auto',
          padding: '24px 32px',
        }}
      >
        {/* ── HERO BANNER SECTION ── */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #141C2E 0%, #0F172A 100%)'
              : '#F4F3ED',
            borderRadius: 28,
            padding: '40px 48px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            minHeight: 280,
          }}
        >
          {/* Leaf Background Patterns */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              left: 280,
              width: 320,
              height: 320,
              background:
                'radial-gradient(circle, rgba(129,199,132,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          {/* Hero Left Content */}
          <div style={{ zIndex: 2, maxWidth: 640 }}>
            <h1
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: isDark ? '#F8FAFC' : '#111827',
                margin: '0 0 12px 0',
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              Grocery{' '}
              <span style={{ color: '#2E7D32', fontWeight: 800 }}>
                Advisory
              </span>
            </h1>

            <p
              style={{
                fontSize: 16,
                color: isDark ? '#94A3B8' : '#4B5563',
                margin: '0 0 24px 0',
                fontWeight: 500,
                maxWidth: 480,
                lineHeight: 1.4,
              }}
            >
              Smart ingredient recommendations for a healthier Kerala lifestyle.
            </p>

            {/* 3 Feature Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isDark ? '#CBD5E1' : '#374151',
                }}
              >
                <span style={{ fontSize: 16 }}>🍃</span> Personalized for your family
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isDark ? '#CBD5E1' : '#374151',
                }}
              >
                <span style={{ fontSize: 16 }}>🍲</span> Kerala ingredients
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isDark ? '#CBD5E1' : '#374151',
                }}
              >
                <span style={{ fontSize: 16 }}>💚</span> Nutrition focused
              </div>
            </div>
          </div>

          {/* Hero Right Image (Salad Bowl photography) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: 480,
              height: 280,
              borderRadius: 24,
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/grocery_hero_salad.png"
              alt="Fresh Kerala Salad Bowl"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>

        {/* ── FLOATING TARGET FAMILY BUDGET BAR ── */}
        <div
          style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: 20,
            padding: '20px 28px',
            marginTop: 20,
            marginBottom: 32,
            boxShadow: isDark
              ? '0 8px 30px rgba(0,0,0,0.3)'
              : '0 4px 24px rgba(0,0,0,0.05)',
            border: isDark ? '1px solid #334155' : '1px solid #EFECE6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {/* Section 1: Wallet & Budget Amount */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: isDark ? 'rgba(52,211,153,0.15)' : '#E8F0E3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              👛
            </div>

            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isDark ? '#94A3B8' : '#6B7280',
                  lineHeight: 1.2,
                }}
              >
                Family Budget ({budgetPeriod})
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: isDark ? '#34D399' : '#1B4D2E',
                    letterSpacing: '-0.5px',
                  }}
                >
                  ₹{budget}
                </span>

                <button
                  onClick={() => {
                    setTempBudget(budget)
                    setShowBudgetModal(true)
                  }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isDark ? '#334155' : '#F0F4EC',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: isDark ? '#34D399' : '#2E7D32',
                  }}
                  title="Edit Budget"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Scale Duration Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderLeft: isDark ? '1px solid #334155' : '1px solid #F0EFE9',
              borderRight: isDark ? '1px solid #334155' : '1px solid #F0EFE9',
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#4B5563',
                maxWidth: 160,
                lineHeight: 1.3,
              }}
            >
              {budgetPeriod.toLowerCase()} personalized recommendations
            </div>

            <div
              style={{
                background: isDark ? '#0F172A' : '#F3F4F6',
                borderRadius: 24,
                padding: 4,
                display: 'flex',
                gap: 4,
              }}
            >
              {['Daily', 'Weekly', '2-Week'].map((period) => {
                const active = budgetPeriod === period
                return (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    style={{
                      border: 'none',
                      background: active
                        ? isDark
                          ? '#34D399'
                          : '#1B4D2E'
                        : 'transparent',
                      color: active
                        ? isDark
                          ? '#0F172A'
                          : '#FFFFFF'
                        : isDark
                        ? '#94A3B8'
                        : '#4B5563',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {period}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Target Status Pill */}
          <div
            style={{
              background: isDark ? 'rgba(52,211,153,0.1)' : '#F0F7EB',
              border: isDark
                ? '1px solid rgba(52,211,153,0.2)'
                : '1px solid #E2F0D9',
              borderRadius: 16,
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
            }}
            onClick={() => showToastMsg('Target budget is optimally balanced!')}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: isDark ? 'rgba(52,211,153,0.2)' : '#E4F2DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              📋
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isDark ? '#34D399' : '#1B4D2E',
                  lineHeight: 1.2,
                }}
              >
                On track for your target
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: isDark ? '#94A3B8' : '#668059',
                  fontWeight: 500,
                }}
              >
                You're all set! Let's keep it healthy.
              </div>
            </div>

            <span
              style={{
                fontSize: 16,
                color: isDark ? '#34D399' : '#1B4D2E',
                marginLeft: 4,
              }}
            >
              ›
            </span>
          </div>
        </div>

        {/* ── FILTER & SORT BAR ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isDark ? '#94A3B8' : '#6B7280',
                marginBottom: 8,
              }}
            >
              Filter recommendations by family member
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              {/* All Members Dropdown Button */}
              <button
                onClick={() => setSelectedMemberId('ALL')}
                style={{
                  background:
                    selectedMemberId === 'ALL'
                      ? isDark
                        ? '#34D399'
                        : '#1B4D2E'
                      : isDark
                      ? '#1E293B'
                      : '#FFFFFF',
                  color:
                    selectedMemberId === 'ALL'
                      ? isDark
                        ? '#0F172A'
                        : '#FFFFFF'
                      : isDark
                      ? '#F8FAFC'
                      : '#374151',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: `1px solid ${
                    selectedMemberId === 'ALL'
                      ? 'transparent'
                      : isDark
                      ? '#334155'
                      : '#E5E7EB'
                  }`,
                }}
              >
                <span>👥 All Members</span>
                <span style={{ fontSize: 10 }}>▾</span>
              </button>

              {/* Individual Member Filter Pills */}
              {members.map((m) => {
                const active = selectedMemberId === String(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMemberId(String(m.id))}
                    style={{
                      border: `1px solid ${
                        active ? '#1B4D2E' : isDark ? '#334155' : '#E5E7EB'
                      }`,
                      background: active
                        ? isDark
                          ? '#1E293B'
                          : '#F0F7EB'
                        : isDark
                        ? '#1E293B'
                        : '#FFFFFF',
                      color: isDark ? '#F8FAFC' : '#111827',
                      padding: '6px 14px 6px 8px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <MemberAvatar member={m} size={22} />
                    <span>{m.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#6B7280',
              }}
            >
              Sort by:
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                color: isDark ? '#F8FAFC' : '#111827',
                border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                borderRadius: 12,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
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

        {/* ── CATEGORY HEADER: Produce (8) ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>🍃</span>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              margin: 0,
              color: isDark ? '#F8FAFC' : '#111827',
            }}
          >
            Produce{' '}
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#6B7280',
              }}
            >
              ({produceItems.length})
            </span>
          </h2>
        </div>

        {/* ── 5-COLUMN GROCERY GRID ── */}
        <div className="grocery-5col-grid">
          {produceItems.map((item) => {
            const isFav = favorites.includes(item.id)
            return (
              <div
                key={item.id}
                style={{
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  borderRadius: 20,
                  border: `1px solid ${isDark ? '#334155' : '#ECEAE3'}`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isDark
                    ? '0 4px 16px rgba(0,0,0,0.2)'
                    : '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Image Box with Custom Background Tint */}
                <div
                  style={{
                    height: 170,
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />

                  {/* Heart / Favorite Button in top right */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      color: isFav ? '#E11D48' : '#9CA3AF',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFav ? '#E11D48' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Content Details */}
                <div
                  style={{
                    padding: '16px 16px 18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {/* Item Title */}
                    <h3
                      style={{
                        fontSize: 14.5,
                        fontWeight: 800,
                        margin: 0,
                        color: isDark ? '#F8FAFC' : '#111827',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </h3>

                    {/* Pink Badge Tag */}
                    <div>
                      <span
                        style={{
                          background: '#FFF0F5',
                          color: '#DB2777',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 12,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <span style={{ fontSize: 10 }}>♥</span> Great for Whole
                        Family
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 12,
                        color: isDark ? '#94A3B8' : '#6B7280',
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.whyBuy}
                    </p>
                  </div>

                  {/* Bottom Row: Price + Shopping Cart Icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: isDark ? '#F8FAFC' : '#111827',
                      }}
                    >
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() =>
                        showToastMsg(`Added ${item.name} to grocery list! 🛒`)
                      }
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: isDark ? '#34D399' : '#1B4D2E',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isDark ? '#0F172A' : '#FFFFFF',
                        boxShadow: '0 2px 8px rgba(27,77,46,0.25)',
                        transition: 'transform 0.15s ease',
                      }}
                      title="Add to List"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── ADDITIONAL CATEGORIES (Protein, Dairy, Pantry) ── */}
        {otherItems.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 20 }}>🥩</span>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                  color: isDark ? '#F8FAFC' : '#111827',
                }}
              >
                Protein & Staples{' '}
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: isDark ? '#94A3B8' : '#6B7280',
                  }}
                >
                  ({otherItems.length})
                </span>
              </h2>
            </div>

            <div className="grocery-5col-grid">
              {otherItems.map((item) => {
                const isFav = favorites.includes(item.id)
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isDark ? '#1E293B' : '#FFFFFF',
                      borderRadius: 20,
                      border: `1px solid ${isDark ? '#334155' : '#ECEAE3'}`,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: isDark
                        ? '0 4px 16px rgba(0,0,0,0.2)'
                        : '0 2px 12px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      style={{
                        height: 170,
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
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(4px)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: isFav ? '#E11D48' : '#9CA3AF',
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={isFav ? '#E11D48' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    <div
                      style={{
                        padding: '16px 16px 18px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 14.5,
                            fontWeight: 800,
                            margin: 0,
                            color: isDark ? '#F8FAFC' : '#111827',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.name}
                        </h3>

                        <div>
                          <span
                            style={{
                              background: '#FFF0F5',
                              color: '#DB2777',
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: 12,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <span style={{ fontSize: 10 }}>♥</span> Great for
                            Whole Family
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: 12,
                            color: isDark ? '#94A3B8' : '#6B7280',
                            fontWeight: 500,
                            margin: 0,
                            lineHeight: 1.35,
                          }}
                        >
                          {item.whyBuy}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: isDark ? '#F8FAFC' : '#111827',
                          }}
                        >
                          ₹{item.price}
                        </span>

                        <button
                          onClick={() =>
                            showToastMsg(`Added ${item.name} to grocery list! 🛒`)
                          }
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: isDark ? '#34D399' : '#1B4D2E',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isDark ? '#0F172A' : '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(27,77,46,0.25)',
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── EDIT BUDGET MODAL ── */}
      {showBudgetModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              background: isDark ? '#1E293B' : 'white',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                  color: isDark ? '#F8FAFC' : '#111827',
                }}
              >
                Set Recommendation Budget (₹)
              </h3>
              <button
                type="button"
                onClick={() => setShowBudgetModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSaveBudget}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDark ? '#94A3B8' : '#4B5563',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Target Budget Scale (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 14,
                    border: '2px solid #1B4D2E',
                    fontSize: 22,
                    fontWeight: 900,
                    outline: 'none',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    color: isDark ? '#F8FAFC' : '#111827',
                    background: isDark ? '#0F172A' : '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDark ? '#94A3B8' : '#4B5563',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Quick Presets (INR)
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  {BUDGET_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTempBudget(amt)}
                      style={{
                        padding: '10px',
                        borderRadius: 12,
                        border:
                          Number(tempBudget) === amt
                            ? '2px solid #1B4D2E'
                            : `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                        background:
                          Number(tempBudget) === amt
                            ? isDark
                              ? '#1E293B'
                              : '#E4EDD4'
                            : 'transparent',
                        color:
                          Number(tempBudget) === amt
                            ? isDark
                              ? '#34D399'
                              : '#1B4D2E'
                            : isDark
                            ? '#94A3B8'
                            : '#374151',
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 8,
                  background: '#1B4D2E',
                  color: 'white',
                  border: 'none',
                  padding: 14,
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(27,77,46,0.3)',
                }}
              >
                Apply Recommendation Scale
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* CSS Styles for 5-column grid & responsive breakpoints */}
      <style>{`
        .grocery-5col-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        @media (max-width: 1280px) {
          .grocery-5col-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .grocery-5col-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
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
