import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useFamily } from '../context/FamilyContext'
import { useGrocery } from '../context/GroceryContext'
import { useTheme } from '../context/ThemeContext'

const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Bakery', 'Other']

const CATEGORY_ICONS = {
  Produce: '🥑',
  Protein: '🥩',
  Dairy: '🥛',
  Pantry: '🌾',
  Bakery: '🍞',
  Other: '🍎',
}

const BUDGET_PRESETS = [25, 50, 75, 100, 150, 200]

export default function GroceryPage() {
  const { family } = useFamily()
  const { isDark } = useTheme()
  const {
    groceryItems,
    budget,
    setBudget,
    budgetPeriod,
    setBudgetPeriod,
    togglePantry,
    removeItem,
    addCustomItem,
  } = useGrocery()

  const navigate = useNavigate()
  const members = family?.members || []

  const [selectedMemberId, setSelectedMemberId] = useState('ALL')
  const [showAddModal, setShowAddModal]         = useState(false)
  const [showBudgetModal, setShowBudgetModal]   = useState(false)
  const [toast, setToast]                       = useState('')

  // Add Item form state
  const [newItemName, setNewItemName]         = useState('')
  const [newItemPrice, setNewItemPrice]       = useState('')
  const [newItemCategory, setNewItemCategory] = useState('Produce')
  const [newItemReason, setNewItemReason]     = useState('')
  const [newItemAllergy, setNewItemAllergy]   = useState('')

  // Edit Budget state
  const [tempBudget, setTempBudget]           = useState(budget)

  const showToastMsg = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Helper to determine if an item is suited for a given member
  const isItemForMember = (item, member) => {
    if (!member) return true
    const memberIds = item.memberIds || []
    // 1. Direct ID match (string or number)
    if (memberIds.some((id) => String(id) === String(member.id))) return true
    // 2. Name match in whyBuy
    if (item.whyBuy && item.whyBuy.toLowerCase().includes(member.name.toLowerCase())) return true
    // 3. Great for member match
    if (item.greatForMemberId && String(item.greatForMemberId) === String(member.id)) return true
    // 4. Fallback if item's memberIds are legacy demo IDs (1, 2, 3) not present in current family
    const currentMemberIdSet = new Set(members.map((m) => String(m.id)))
    const hasValidCurrentId = memberIds.some((id) => currentMemberIdSet.has(String(id)))
    if (!hasValidCurrentId) return true
    return false
  }

  // Filter items by selected member
  const filteredItems = selectedMemberId === 'ALL'
    ? groceryItems
    : groceryItems.filter((i) => {
        const selectedMember = members.find((m) => String(m.id) === String(selectedMemberId))
        return isItemForMember(i, selectedMember)
      })

  // Calculate budget statistics (excluding items marked as Pantry / Have It)
  const nonPantryItems = groceryItems.filter((i) => !i.isPantry)
  const runningTotal = nonPantryItems.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0)
  const budgetRatio = budget > 0 ? Math.min(runningTotal / budget, 1.2) : 0
  const isOverBudget = runningTotal > budget

  // Allergy conflict check
  const allergyConflicts = []
  groceryItems.forEach((item) => {
    if (Array.isArray(item.allergies) && item.allergies.length > 0) {
      members.forEach((m) => {
        if (Array.isArray(m.allergies)) {
          const match = m.allergies.find((a) => item.allergies.includes(a))
          if (match) {
            allergyConflicts.push({ itemName: item.name, memberName: m.name, allergy: match })
          }
        }
      })
    }
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return
    addCustomItem({
      name: newItemName.trim(),
      price: parseFloat(newItemPrice) || 3.50,
      category: newItemCategory,
      whyBuy: newItemReason.trim() || 'Family nutrition choice',
      memberIds: selectedMemberId !== 'ALL' ? [Number(selectedMemberId)] : members.map((m) => m.id),
      allergies: newItemAllergy ? [newItemAllergy] : [],
    })
    setNewItemName('')
    setNewItemPrice('')
    setNewItemReason('')
    setNewItemAllergy('')
    setShowAddModal(false)
    showToastMsg('Added item to Grocery list! 🛒')
  }

  const handlePeriodChange = (period) => {
    setBudgetPeriod(period)
    // Optional smart default recommendation when changing periods
    if (period === 'Daily' && budget > 50) setBudget(25)
    else if (period === 'Weekly' && (budget < 30 || budget > 120)) setBudget(75)
    else if (period === '2-Week' && budget < 60) setBudget(120)
    showToastMsg(`Budget period updated to ${period}`)
  }

  const handleSaveBudget = (e) => {
    e.preventDefault()
    setBudget(Math.max(1, parseFloat(tempBudget) || 50))
    setShowBudgetModal(false)
    showToastMsg('Target budget updated! 💰')
  }

  const familyName = family?.name || 'Healthy Family'
  const initial = (familyName[0] || 'F').toUpperCase()

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: isDark ? '#0a0f1d' : '#fcfaf5',
        paddingBottom: 'calc(110px + env(safe-area-inset-bottom, 0px))',
        fontFamily: "'Inter', sans-serif",
        color: isDark ? '#f8fafc' : '#1a1a1a',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111827',
            color: 'white',
            padding: '12px 22px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            zIndex: 3000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}

      {/* ── 1. HEADER BAR & BUDGET SECTION ── */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #0a0f1d 100%)'
            : 'linear-gradient(135deg, #f3f7e6 0%, #fffdf4 100%)',
          padding: 'max(24px, env(safe-area-inset-top, 24px)) 24px 20px 24px',
          borderRadius: '0 0 32px 32px',
          borderBottom: isDark ? '1px solid #1e293b' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e5b12" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2e5b12', letterSpacing: '-0.3px' }}>
              Family Fit
            </span>
          </div>

          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#2e5b12',
              color: 'white',
              fontWeight: 800,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(46,91,18,0.3)',
            }}
          >
            {initial}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
              Smart Grocery
            </h1>
            <p style={{ fontSize: 13, color: '#3d6b24', fontWeight: 600, margin: 0 }}>
              Tailored to goals, allergies & budget.
            </p>
          </div>

          {/* + Add Item button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(61,107,63,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Add Item
          </button>
        </div>

        {/* ── BUDGET CONTROL CARD ── */}
        <div
          style={{
            marginTop: 18,
            background: 'white',
            borderRadius: 20,
            padding: '14px 16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Target Budget ({budgetPeriod})
              </div>
              <div
                onClick={() => { setTempBudget(budget); setShowBudgetModal(true) }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, cursor: 'pointer' }}
                title="Click to edit budget"
              >
                <span style={{ fontSize: 24, fontWeight: 900, color: '#2e5b12' }}>${budget}</span>
                <span style={{ fontSize: 14, color: '#6b7280' }}>✏️</span>
              </div>
            </div>

            {/* Time Period Selector: Daily, Weekly, 2-Week */}
            <div style={{ background: '#f3f4f6', borderRadius: 14, padding: 3, display: 'flex', gap: 3 }}>
              {['Daily', 'Weekly', '2-Week'].map((period) => {
                const active = budgetPeriod === period
                return (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    style={{
                      border: 'none',
                      background: active ? '#2e5b12' : 'transparent',
                      color: active ? 'white' : '#4b5563',
                      padding: '6px 10px',
                      borderRadius: 11,
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
        </div>
      </div>

      <div style={{ padding: '20px 20px 0 20px' }}>

        {/* ── 2. BUDGET PROGRESS BAR CARD ── */}
        <div
          style={{
            background: isDark ? '#161b22' : 'white',
            borderRadius: 22,
            padding: 16,
            marginBottom: 20,
            boxShadow: isDark ? '0 4px 18px rgba(0,0,0,0.3)' : '0 4px 18px rgba(0,0,0,0.05)',
            border: isDark ? '1px solid #21262d' : '1px solid #f0ede8',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563' }}>
              Estimated Total: <strong style={{ color: isDark ? '#f0f6fc' : '#111827', fontSize: 16 }}>${runningTotal.toFixed(2)}</strong>
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: isOverBudget ? '#dc2626' : '#2e5b12',
                background: isOverBudget ? '#fde8e8' : '#e2f0d9',
                padding: '4px 10px',
                borderRadius: 12,
              }}
            >
              {isOverBudget ? `+$${(runningTotal - budget).toFixed(2)} Over` : `$${(budget - runningTotal).toFixed(2)} Remaining`}
            </span>
          </div>

          {/* Progress bar line */}
          <div style={{ height: 10, borderRadius: 5, background: isDark ? '#21262d' : '#e5e7eb', overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(budgetRatio * 100, 100)}%`,
                background: isOverBudget
                  ? 'linear-gradient(90deg, #f59e0b 0%, #dc2626 100%)'
                  : 'linear-gradient(90deg, #7ab648 0%, #2e5b12 100%)',
                borderRadius: 5,
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* CHEAPER SWAP SUGGESTION BANNER IF OVER BUDGET */}
          {isOverBudget && (
            <div
              style={{
                marginTop: 14,
                background: '#fffbeb',
                border: '1.5px dashed #f59e0b',
                borderRadius: 14,
                padding: 12,
                fontSize: 12,
                color: '#92400e',
                lineHeight: 1.45,
              }}
            >
              💡 <strong>Cheaper Swap Suggestion:</strong> Swap Wild Salmon ($14.99) for Frozen White Fish Fillets ($8.99) to save <strong>$6.00</strong> with high protein!
            </div>
          )}
        </div>



        {/* ── 4. MEMBER AVATAR FILTER ROW ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#8b949e' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Filter by Family Member
          </div>

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {/* All button */}
            <button
              onClick={() => setSelectedMemberId('ALL')}
              style={{
                border: selectedMemberId === 'ALL' ? 'none' : `1px solid ${isDark ? '#30363d' : '#d1dca7'}`,
                background: selectedMemberId === 'ALL' ? '#2e4a19' : isDark ? '#161b22' : 'white',
                color: selectedMemberId === 'ALL' ? 'white' : '#2e5b12',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>👥</span> All Members
            </button>

            {/* Member buttons */}
            {members.map((m) => {
              const active = selectedMemberId === String(m.id)
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberId(String(m.id))}
                  style={{
                    border: active ? '2px solid #2e5b12' : `1px solid ${isDark ? '#30363d' : '#e5e7eb'}`,
                    background: active ? (isDark ? '#1f2937' : '#e2f0d9') : (isDark ? '#161b22' : 'white'),
                    color: isDark ? '#f0f6fc' : '#111827',
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
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#2e5b12',
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {m.name[0]}
                  </div>
                  <span>{m.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 5. CATEGORIZED GROCERY ITEMS ── */}
        <div>
          {CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat)
            if (catItems.length === 0) return null

            return (
              <div key={cat} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[cat] || '📦'}</span>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: isDark ? '#f0f6fc' : '#111827' }}>
                    {cat} <span style={{ fontSize: 13, color: '#8b949e', fontWeight: 600 }}>({catItems.length})</span>
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {catItems.map((item) => {
                    const greatMember = members.find((m) => String(m.id) === String(item.greatForMemberId))

                    const hasAllergyConflict = members.some(
                      (m) => Array.isArray(m.allergies) && item.allergies && item.allergies.some((a) => m.allergies.includes(a))
                    )

                    const suitedMembers = members.filter((m) => isItemForMember(item, m))

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: isDark ? '#161b22' : 'white',
                          borderRadius: 20,
                          padding: '14px 16px',
                          boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
                          border: hasAllergyConflict
                            ? '1.5px solid #fecaca'
                            : item.isPantry
                            ? `1px dashed ${isDark ? '#30363d' : '#d1d5db'}`
                            : isDark ? '1px solid #21262d' : '1px solid #f0ede8',
                          opacity: item.isPantry ? 0.75 : 1,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Top row: Name + Price + Pantry Toggle */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: 15,
                                  fontWeight: 800,
                                  color: isDark ? '#f0f6fc' : '#111827',
                                  textDecoration: item.isPantry ? 'line-through' : 'none',
                                }}
                              >
                                {item.name}
                              </span>

                              {/* Great For Badge */}
                              {greatMember && (
                                <span
                                  style={{
                                    background: '#fce7f3',
                                    color: '#be185d',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                  }}
                                >
                                  ❤️ Great for {greatMember.name}
                                </span>
                              )}

                              {/* Allergy Conflict Badge */}
                              {hasAllergyConflict && (
                                <span
                                  style={{
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                  }}
                                >
                                  ⚠️ Allergy Warning
                                </span>
                              )}
                            </div>

                            {/* "Why Buy" Reason */}
                            {item.whyBuy && (
                              <div style={{ fontSize: 12, color: isDark ? '#8b949e' : '#4b5563', marginTop: 4, fontWeight: 500 }}>
                                💡 {item.whyBuy}
                              </div>
                            )}
                          </div>

                          {/* Price & Delete */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span
                              style={{
                                fontSize: 16,
                                fontWeight: 900,
                                color: item.isPantry ? '#9ca3af' : '#2e5b12',
                                textDecoration: item.isPantry ? 'line-through' : 'none',
                              }}
                            >
                              ${Number(item.price).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                fontSize: 16,
                                cursor: 'pointer',
                                padding: 2,
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Bottom Row: Member Avatars + Pantry Toggle Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: isDark ? '1px solid #21262d' : '1px solid #f9fafb' }}>
                          {/* Member Avatars */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginRight: 4 }}>Suited for:</span>
                            {suitedMembers.length > 0 ? (
                              suitedMembers.map((m) => (
                                <div
                                  key={m.id}
                                  title={`${m.name}`}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    background: '#2e5b12',
                                    color: 'white',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {m.name[0]}
                                </div>
                              ))
                            ) : (
                              <span style={{ fontSize: 11, color: '#9ca3af' }}>All Family</span>
                            )}
                          </div>

                          {/* Pantry / Have It Toggle Button */}
                          <button
                            onClick={() => togglePantry(item.id)}
                            style={{
                              border: item.isPantry ? 'none' : '1px solid #d1d5db',
                              background: item.isPantry ? '#2e5b12' : 'transparent',
                              color: item.isPantry ? 'white' : '#6b7280',
                              padding: '4px 10px',
                              borderRadius: 14,
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <span>{item.isPantry ? '✔ Have it (Pantry)' : 'Pantry?'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 6. EDIT BUDGET MODAL ── */}
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
          onClick={() => setShowBudgetModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
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
                Set Target Budget
              </h3>
              <button
                onClick={() => setShowBudgetModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 6 }}>
                  Budget Amount ($)
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
                    border: '2px solid #2e5b12',
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
                  Quick Presets
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
                        border: Number(tempBudget) === amt ? '2px solid #2e5b12' : '1px solid #e5e7eb',
                        background: Number(tempBudget) === amt ? '#e2f0d9' : 'transparent',
                        color: Number(tempBudget) === amt ? '#2e5b12' : '#374151',
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 8,
                  background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: 14,
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(61,107,63,0.3)',
                }}
              >
                Save Budget
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 7. ADD CUSTOM ITEM MODAL ── */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: isDark ? '#1e2530' : 'white',
              borderRadius: '28px 28px 0 0',
              padding: 24,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: isDark ? '#f0f6fc' : '#111827' }}>
                Add Custom Grocery Item
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 4 }}>
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Almond Milk"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid #e5e7eb',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 4 }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="3.99"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: '1.5px solid #e5e7eb',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 4 }}>
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: '1.5px solid #e5e7eb',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: 'white',
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#8b949e' : '#4b5563', display: 'block', marginBottom: 4 }}>
                  Why buy this? (Nutritional reason)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dairy-free calcium alternative"
                  value={newItemReason}
                  onChange={(e) => setNewItemReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid #e5e7eb',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 10,
                  background: 'linear-gradient(135deg, #5e8404 0%, #3d6b3f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: 14,
                  borderRadius: 16,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(61,107,63,0.3)',
                }}
              >
                Add Item to List
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
