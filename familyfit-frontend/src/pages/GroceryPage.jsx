import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import MemberAvatar from '../components/MemberAvatar'
import { useFamily } from '../context/FamilyContext'
import { useGrocery, KERALA_GROCERY_DATASET } from '../context/GroceryContext'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Other']

const CATEGORY_ICONS = {
  Produce: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25451c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 7 0 6-4.5 11-10 11z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  Protein: '🥩',
  Dairy: '🥛',
  Pantry: '🌾',
  Other: '🍎',
}

const BUDGET_PRESETS = [500, 1000, 1500, 2500, 3500, 5000]

const DEFAULT_MEMBER = {
  id: 1,
  name: 'aadityan',
  role: 'PARENT',
  gender: 'MALE',
  fitnessGoal: 'MUSCLE_GAIN',
  dietPreference: 'HIGH_PROTEIN',
  allergies: [],
  dislikes: [],
}

/**
 * Evaluates whether a grocery item is suitable and a strong match for a member.
 */
function evaluateItemSuitability(item, member) {
  if (!member) return { isSuitable: true, isStrongMatch: false, isGenuineMatch: true }

  const memberAllergies = Array.isArray(member.allergies) ? member.allergies : []
  const memberDislikes = Array.isArray(member.dislikes) ? member.dislikes : []
  const lowName = ((item.name || '') + ' ' + (item.whyBuy || '') + ' ' + (item.category || '')).toLowerCase()

  const allergenMatch = memberAllergies.find((allergen) => {
    if (Array.isArray(item.allergies) && item.allergies.includes(allergen)) return true
    if (allergen === 'Milk/Dairy' && (lowName.includes('milk') || lowName.includes('curd') || lowName.includes('ghee'))) return true
    if (allergen === 'Eggs' && lowName.includes('egg')) return true
    if (allergen === 'Seafood/Fish' && (lowName.includes('fish') || lowName.includes('mathi') || lowName.includes('ayala'))) return true
    return false
  })

  if (allergenMatch) return { isSuitable: false, isStrongMatch: false, isGenuineMatch: false }

  const dislikeMatch = memberDislikes.find((d) => d.trim() && lowName.includes(d.toLowerCase()))
  if (dislikeMatch) return { isSuitable: false, isStrongMatch: false, isGenuineMatch: false }

  return { isSuitable: true, isStrongMatch: true, isGenuineMatch: true }
}

export default function GroceryPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const { budget, setBudget, budgetPeriod, setBudgetPeriod } = useGrocery()
  const navigate = useNavigate()

  const rawMembers = family?.members || []
  const members = rawMembers.length > 0 ? rawMembers : [DEFAULT_MEMBER]

  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [tempBudget, setTempBudget] = useState(budget || 1500)
  const [toast, setToast] = useState('')
  const [sortBy, setSortBy] = useState('Recommended')

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const selectedMember = selectedMemberId === 'ALL'
    ? null
    : members.find((m) => String(m.id) === String(selectedMemberId)) || members[0]

  const rawRecommendations = KERALA_GROCERY_DATASET

  const filteredRecommendations = selectedMemberId === 'ALL'
    ? rawRecommendations
    : rawRecommendations.filter((item) => {
        if (!selectedMember) return true
        const evalRes = evaluateItemSuitability(item, selectedMember)
        return evalRes.isSuitable
      })

  const handlePeriodChange = (period) => {
    setBudgetPeriod(period)
    if (period === 'Daily' && budget > 1000) setBudget(300)
    else if (period === 'Weekly' && (budget < 500 || budget > 3000)) setBudget(1500)
    else if (period === '2-Week') setBudget(1500)
    showToastMsg(`Recommendations scaled to ${period} budget!`)
  }

  const handleSaveBudget = (e) => {
    e.preventDefault()
    setBudget(Math.max(10, parseFloat(tempBudget) || 1500))
    setShowBudgetModal(false)
    showToastMsg('Target budget updated! 💰')
  }

  const familyName = family?.name || 'Healthy Family'
  const initial = (familyName[0] || 'H').toUpperCase()

  return (
    <div
      className="page-responsive-container"
      style={{
        background: isDark ? '#0a0f1d' : '#fcfaf5',
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: isDark ? '#f8fafc' : '#111827',
        position: 'relative',
      }}
    >
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#94A3B8' : '#121826'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
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

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1b3815',
            color: 'white',
            padding: '12px 22px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}

      {/* ── HERO BANNER HEADER ── */}
      <div
        className="grocery-hero"
        style={{
          position: 'relative',
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #0a0f1d 100%)'
            : 'linear-gradient(135deg, #f7f4ed 0%, #ebe4d3 100%)',
          padding: '20px 20px 60px 20px',
          overflow: 'visible',
        }}
      >
        {/* Fresh Vegetable Basket Image positioned at top right (Mobile Only) */}
        <div
          className="mobile-only-header"
          style={{
            position: 'absolute',
            top: -10,
            right: -15,
            width: 250,
            height: 240,
            borderRadius: '0 0 0 120px',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"
            alt="Fresh Kerala Vegetables Basket"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'linear-gradient(to right, #0f172a 0%, rgba(15,23,42,0.4) 40%, transparent 100%)'
                : 'linear-gradient(to right, #f7f4ed 0%, rgba(247,244,237,0.3) 35%, transparent 100%)',
            }}
          />
        </div>

        {/* Top Header Row (Mobile Only) */}
        <div
          className="mobile-only-header"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25451c" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: isDark ? '#34d399' : '#25451c',
                letterSpacing: '-0.3px',
              }}
            >
              Family Fit
            </span>
          </div>

          {/* User Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: isDark ? '#34d399' : '#25451c',
              color: isDark ? '#0f172a' : 'white',
              fontWeight: 800,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {initial}
          </div>
        </div>

        <div className="grocery-hero-grid" style={{ width: '100%' }}>
          <div className="grocery-hero-left">
            {/* Hero Title & Subtitle */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: 260, marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', 'DM Serif Display', Georgia, serif",
              fontSize: 36,
              fontWeight: 900,
              color: isDark ? '#f8fafc' : '#1b3815',
              margin: '0 0 8px 0',
              lineHeight: 1.08,
              letterSpacing: '-0.4px',
            }}
          >
            Grocery<br />Advisory
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: isDark ? '#94a3b8' : '#405837',
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            Nutritional guide & Kerala<br />ingredient recommendations.
          </p>
        </div>

        {/* ── TARGET FAMILY BUDGET FLOATING CARD ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: 24,
            padding: '18px 20px',
            boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 28px rgba(0,0,0,0.06)',
            border: isDark ? '1px solid #334155' : '1px solid #f0eee8',
          }}
        >
          {/* Top Row: Label & Time Period Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: isDark ? '#94a3b8' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              TARGET FAMILY BUDGET ({budgetPeriod.toUpperCase()})
            </span>

            {/* Time Period Selector Toggle */}
            <div
              style={{
                background: isDark ? '#0f172a' : '#f1f3f4',
                borderRadius: 20,
                padding: 3,
                display: 'flex',
                gap: 2,
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
                      background: active ? (isDark ? '#34d399' : '#25451c') : 'transparent',
                      color: active ? (isDark ? '#0f172a' : 'white') : (isDark ? '#94a3b8' : '#4b5563'),
                      padding: '5px 12px',
                      borderRadius: 16,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {period}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Budget Amount & Edit Pencil Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: isDark ? '#f8fafc' : '#111827', letterSpacing: '-0.5px' }}>
              ₹{budget || 1500}
            </span>
            <button
              onClick={() => { setTempBudget(budget || 1500); setShowBudgetModal(true) }}
              aria-label="Edit budget"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: isDark ? 'rgba(52,211,153,0.18)' : '#e4edd4',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#34d399' : '#25451c'} strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          {/* Subtext description */}
          <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#6b7280', marginTop: 10, fontWeight: 500, lineHeight: 1.4, maxWidth: 260 }}>
            💡 Personalized ingredient recommendations to fit your family's ₹{budget || 1500} {budgetPeriod.toLowerCase()} target.
          </div>

          {/* 3D Clipboard & Bowl Graphic on right bottom of card */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 14,
              width: 90,
              height: 90,
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {/* Soft green backdrop glow */}
              <circle cx="50" cy="50" r="40" fill="#e8f3d6" opacity="0.8" />
              {/* Clipboard body */}
              <rect x="35" y="20" width="40" height="55" rx="6" fill="#2e5b12" />
              <rect x="38" y="23" width="34" height="49" rx="4" fill="#ffffff" />
              {/* Top clip */}
              <rect x="45" y="16" width="20" height="8" rx="2" fill="#1b3815" />
              {/* Checkmarks */}
              <path d="M43 34l3 3 8-8" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" />
              <line x1="58" y1="34" x2="67" y2="34" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              <path d="M43 46l3 3 8-8" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" />
              <line x1="58" y1="46" x2="67" y2="46" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              <path d="M43 58l3 3 8-8" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" />
              <line x1="58" y1="58" x2="67" y2="58" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              {/* Bowl with Carrots in front */}
              <ellipse cx="40" cy="78" rx="22" ry="10" fill="#9a7b56" />
              <ellipse cx="40" cy="76" rx="20" ry="8" fill="#d4a373" />
              <circle cx="34" cy="72" r="6" fill="#f97316" />
              <circle cx="44" cy="73" r="5" fill="#f97316" />
              <path d="M30 68c-2-4-1-7 2-8" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          </div>
          </div>
          {/* Hero Right Column (Desktop Only) */}
          <div className="grocery-hero-right" style={{ display: 'none' }}>
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"
              alt="Fresh Kerala Vegetables Basket Desktop"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* ── MAIN BODY CONTENT ── */}
      <div style={{ padding: '24px 20px 0 20px' }}>

        {/* Filter Recommendations by Family Member */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 14.5, fontWeight: 800, color: isDark ? '#f8fafc' : '#111827', margin: '0 0 12px 0' }}>
            Filter recommendations by family member
          </h2>

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {/* All Members Button */}
            <button
              onClick={() => setSelectedMemberId('ALL')}
              style={{
                border: 'none',
                background: selectedMemberId === 'ALL'
                  ? isDark ? '#34d399' : '#25451c'
                  : isDark ? '#1e293b' : '#ffffff',
                color: selectedMemberId === 'ALL'
                  ? isDark ? '#0f172a' : 'white'
                  : isDark ? '#94a3b8' : '#25451c',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: selectedMemberId === 'ALL' ? '0 3px 10px rgba(37,69,28,0.2)' : 'none',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <span>All Members</span>
            </button>

            {/* Member Buttons */}
            {members.map((m) => {
              const active = selectedMemberId === String(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberId(String(m.id))}
                  style={{
                    border: active ? '2px solid #25451c' : `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                    background: active ? (isDark ? '#1e293b' : '#ffffff') : (isDark ? '#1e293b' : '#ffffff'),
                    color: isDark ? '#f8fafc' : '#111827',
                    padding: '6px 14px 6px 8px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <MemberAvatar member={m} size={24} />
                  <span>{m.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Header: Produce (8) & Sort by */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {CATEGORY_ICONS.Produce}
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: isDark ? '#f8fafc' : '#111827' }}>
              Produce <span style={{ fontSize: 15, fontWeight: 600, color: isDark ? '#94a3b8' : '#6b7280' }}>(8)</span>
            </h2>
          </div>

          <div
            onClick={() => showToastMsg('Sorted by highest nutritional priority')}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: isDark ? '#34d399' : '#25451c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Sort by</span>
            <span>&rsaquo;</span>
          </div>
        </div>

        {/* ── GROCERY ITEM CARDS LIST ── */}
        <div className="grocery-responsive-grid" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredRecommendations.map((item) => {
            const targetMember = selectedMember || members[0]
            const targetMemberName = targetMember?.name || 'aadityan'

            return (
              <div
                key={item.id}
                className="grocery-item-card"
                style={{
                  background: isDark ? '#141c2e' : '#ffffff',
                  borderRadius: 20,
                  padding: 14,
                  boxShadow: isDark ? '0 4px 18px rgba(0,0,0,0.4)' : '0 4px 18px rgba(0,0,0,0.04)',
                  border: isDark ? '1px solid #24324a' : '1px solid #f0ede6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'transform 0.15s ease',
                }}
              >
                {/* Left Food Image */}
                <div style={{ width: 80, height: 80, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>

                {/* Middle Item Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: isDark ? '#f8fafc' : '#111827', lineHeight: 1.25 }}>
                    {item.name}
                  </h3>

                  {/* Pink Goal Highlight Pill */}
                  <div>
                    <span
                      style={{
                        background: '#fce7f3',
                        color: '#be185d',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 10,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>♥</span> Great for {targetMemberName}
                    </span>
                  </div>

                  {/* Why Buy / Description */}
                  <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#4b5563', fontWeight: 500, lineHeight: 1.35 }}>
                    {item.whyBuy}
                  </div>

                  {/* Suited for Member Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span
                      style={{
                        background: isDark ? 'rgba(52,211,153,0.15)' : '#edf6db',
                        color: isDark ? '#34d399' : '#25451c',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 8,
                      }}
                    >
                      Suited for:
                    </span>
                    <MemberAvatar member={targetMember} size={22} />
                  </div>
                </div>

                {/* Right Estimated Price & Chevron Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#9ca3af', fontWeight: 600 }}>Est.</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: isDark ? '#f8fafc' : '#111827', lineHeight: 1.1 }}>
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Green Circle Chevron Button */}
                  <button
                    aria-label="View detail"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isDark ? 'rgba(52,211,153,0.18)' : '#edf6db',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#34d399' : '#25451c'} strokeWidth="3" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

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
              background: isDark ? '#1e2530' : 'white',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: isDark ? '#f0f6fc' : '#111827' }}>
                Set Recommendation Budget (₹)
              </h3>
              <button
                type="button"
                onClick={() => setShowBudgetModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 6 }}>
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
                    border: '2px solid #25451c',
                    fontSize: 22,
                    fontWeight: 900,
                    outline: 'none',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    color: '#111827',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 6 }}>
                  Quick Presets (INR)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {BUDGET_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTempBudget(amt)}
                      style={{
                        padding: '10px',
                        borderRadius: 12,
                        border: Number(tempBudget) === amt ? '2px solid #25451c' : '1px solid #e5e7eb',
                        background: Number(tempBudget) === amt ? '#e4edd4' : 'transparent',
                        color: Number(tempBudget) === amt ? '#25451c' : '#374151',
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
                  background: '#25451c',
                  color: 'white',
                  border: 'none',
                  padding: 14,
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37,69,28,0.3)',
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

      {/* Responsive overrides block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .grocery-hero {
            background: transparent !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          .grocery-hero-grid {
            display: flex !important;
            align-items: center;
            gap: 32px;
            justify-content: space-between;
            width: 100%;
          }
          .grocery-hero-left {
            width: 45% !important;
            max-width: 45% !important;
          }
          .grocery-hero-right {
            display: block !important;
            width: 53% !important;
            height: 280px !important;
            border-radius: 32px !important;
            overflow: hidden !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          }
          .grocery-responsive-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
          }
          .grocery-item-card {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 18px !important;
            gap: 12px !important;
          }
          .grocery-item-card > div:first-child {
            width: 100% !important;
            height: 140px !important;
          }
        }
      `}} />
    </div>
  )
}

