import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Check, Sparkles, Plus, ExternalLink } from 'lucide-react'
import { useGrocery } from '../../context/GroceryContext'

export default function GrocerySnapshot() {
  const {
    cartItemsArray = [],
    cartCount = 0,
    cartSubtotal = 0,
    budget = 1500,
    budgetPeriod = '2-Week',
    addToCart,
    recommendations = [],
  } = useGrocery()

  const [checkedIds, setCheckedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('familyfit_grocery_checked')
      return saved ? JSON.parse(saved) : [201, 203]
    } catch {
      return [201, 203]
    }
  })

  const toggleCheck = (id) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      try {
        localStorage.setItem('familyfit_grocery_checked', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const estimatedSpent = cartSubtotal
  const remainingBudget = Math.max(0, budget - estimatedSpent)
  const budgetPercent = Math.min(100, Math.round((estimatedSpent / budget) * 100))

  // First 3 items from real grocery basket
  const displayedItems = cartItemsArray.slice(0, 3)
  const remainingCount = Math.max(0, cartItemsArray.length - 3)
  const hasMore = remainingCount > 0

  // Count how many displayed items are checked
  const checkedInBasket = cartItemsArray.filter((it) => checkedIds.includes(it.id)).length

  return (
    <div className="duo-card p-6 sm:p-7 flex flex-col justify-between font-['Nunito',sans-serif] h-full bg-white border-2 border-[#ECEAE3] rounded-3xl shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#F0F0F0] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-black">
              <ShoppingBag size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#777777]">
                  Pantry &amp; Market
                </span>
                <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                  {budgetPeriod}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1F2A24] leading-tight">
                Grocery Snapshot
              </h3>
            </div>
          </div>

          {/* Button leading directly to Grocery Bucket / Basket */}
          <Link
            to="/grocery?basket=open"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-sm transition-all cursor-pointer group"
          >
            <ShoppingBag size={14} className="group-hover:scale-110 transition-transform" />
            <span>Grocery Basket ({cartCount})</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 16px Chunky Budget Progress Bar */}
        <div className="py-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-[#666666]">Estimated Expense</span>
            <span className="text-[#1F2A24] font-black text-sm">
              ₹{estimatedSpent} / ₹{budget}
            </span>
          </div>

          <div className="duo-progress-track">
            <div
              className="duo-progress-fill bg-[#1CB0F6]"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-[#777777]">
            <span>
              {checkedInBasket} of {cartItemsArray.length} items checked
            </span>
            <span className="text-[#58A700] font-black">₹{remainingBudget} left</span>
          </div>
        </div>

        {/* Basket Items List */}
        <div className="space-y-2 pt-1">
          {cartItemsArray.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-2">
              <p className="text-xs font-bold text-[#64748B]">
                Your grocery basket is currently empty.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link
                  to="/grocery"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-black hover:bg-[#0369A1] transition-colors"
                >
                  <Plus size={13} />
                  <span>Browse Kerala Groceries</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {displayedItems.map((item) => {
                const isChecked = checkedIds.includes(item.id)
                const itemTotal = (item.price || 0) * (item.quantity || 1)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isChecked
                        ? 'bg-[#F9F9F9] border-[#E5E5E5] text-[#999999]'
                        : 'bg-white border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] text-[#1F2A24] hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                          isChecked
                            ? 'bg-[#58CC02] border-[#58A700] text-white scale-105'
                            : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span
                        className={`text-xs font-black truncate ${
                          isChecked ? 'line-through text-[#999999]' : 'text-[#1F2A24]'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <span className="text-[11px] font-bold text-[#666666]">
                        {item.quantity} {item.unit || 'pack'}
                      </span>
                      <span className="text-xs font-black text-[#0284C7]">
                        ₹{itemTotal}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* "+3 more" Pill / Button */}
              {hasMore && (
                <Link
                  to="/grocery?basket=open"
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] hover:bg-[#E0F2FE] text-[#0284C7] flex items-center justify-between text-xs font-black transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-[10px] font-black">
                      +{remainingCount}
                    </span>
                    <span>+{remainingCount} more in grocery basket</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold group-hover:translate-x-1 transition-transform">
                    <span>Open Basket</span>
                    <ArrowRight size={13} />
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-3 border-t border-[#F0F0F0] flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/grocery?basket=open"
          className="text-xs sm:text-sm font-black text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 group transition-colors"
        >
          <ShoppingBag size={15} />
          <span>Go to Grocery Basket ({cartCount} items • ₹{cartSubtotal})</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
        <Link
          to="/grocery"
          className="text-xs font-bold text-[#6B7280] hover:text-[#0284C7] transition-colors"
        >
          Market Items →
        </Link>
      </div>
    </div>
  )
}
