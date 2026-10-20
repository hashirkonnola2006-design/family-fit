import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Check, Square } from 'lucide-react'
import { useGrocery, KERALA_GROCERY_DATASET } from '../../context/GroceryContext'

export default function GrocerySnapshot() {
  const { budget = 1500, budgetPeriod = '2-Week' } = useGrocery()

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
      try { localStorage.setItem('familyfit_grocery_checked', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const estimatedSpent = 785
  const remainingBudget = Math.max(0, budget - estimatedSpent)
  const budgetPercent = Math.min(100, Math.round((estimatedSpent / budget) * 100))

  const sampleItems = (KERALA_GROCERY_DATASET || []).slice(0, 3)

  return (
    <div className="duo-card p-5 sm:p-6 flex flex-col justify-between font-['Nunito',sans-serif] h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-black">
              <ShoppingBag size={18} />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
                Pantry &amp; Market
              </span>
              <h3 className="text-base font-black text-[#1F2A24] leading-tight">
                Grocery Snapshot
              </h3>
            </div>
          </div>

          <span className="text-xs font-black text-[#0284C7] bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-0.5 rounded-full">
            {budgetPeriod}
          </span>
        </div>

        {/* 16px Chunky Budget Progress Bar */}
        <div className="py-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-[#666666]">Estimated Expense</span>
            <span className="text-[#1F2A24]">₹{estimatedSpent} / ₹{budget}</span>
          </div>

          <div className="duo-progress-track">
            <div
              className="duo-progress-fill bg-[#1CB0F6]"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-[#777777]">
            <span>{checkedIds.length} items checked</span>
            <span className="text-[#58A700]">₹{remainingBudget} left</span>
          </div>
        </div>

        {/* Quick Checkable Items */}
        <div className="space-y-2 pt-1">
          {sampleItems.map((item) => {
            const isChecked = checkedIds.includes(item.id)
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isChecked
                    ? 'bg-[#F9F9F9] border-[#E5E5E5] text-[#999999]'
                    : 'bg-white border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] text-[#1F2A24] hover:bg-[#FAFAF8]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                      isChecked
                        ? 'bg-[#58CC02] border-[#58A700] text-white scale-105'
                        : 'border-[#CCCCCC] bg-white'
                    }`}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span className={`text-xs font-extrabold truncate ${isChecked ? 'line-through text-[#999999]' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] font-black text-[#666666] shrink-0">
                  {item.qty || '1 pack'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3.5 mt-4 border-t-2 border-[#F0F0F0]">
        <Link
          to="/grocery"
          className="text-xs font-black text-[#0284C7] hover:text-[#0369A1] flex items-center justify-between group"
        >
          <span>Open Full Grocery List</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
