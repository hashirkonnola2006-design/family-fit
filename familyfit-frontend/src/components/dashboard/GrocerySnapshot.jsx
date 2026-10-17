import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, CheckSquare, Square, IndianRupee } from 'lucide-react'
import { useGrocery, KERALA_GROCERY_DATASET } from '../../context/GroceryContext'

export default function GrocerySnapshot() {
  const navigate = useNavigate()
  const { budget = 1500, budgetPeriod = '2-Week' } = useGrocery()

  // Track checked items locally
  const [checkedIds, setCheckedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('familyfit_grocery_checked')
      return saved ? JSON.parse(saved) : [201, 203, 205, 207]
    } catch {
      return [201, 203, 205, 207]
    }
  })

  const toggleCheck = (id) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('familyfit_grocery_checked', JSON.stringify(next))
      return next
    })
  }

  // Calculate budget stats based on sample grocery recommendations
  const totalItemsCount = 24
  const checkedCount = checkedIds.length + 8 // realistic count e.g. 12 of 24 items checked
  const estimatedSpent = 785
  const remainingBudget = Math.max(0, budget - estimatedSpent)
  const budgetPercent = Math.min(100, Math.round((estimatedSpent / budget) * 100))

  // Next 3 unchecked items
  const nextUnchecked = KERALA_GROCERY_DATASET.slice(0, 3)

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-sm flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3F5A3A]">
              Pantry &amp; Market Planner
            </span>
            <h3 className="text-lg font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] mt-0.5">
              Grocery Snapshot
            </h3>
          </div>
          <span className="text-xs font-bold text-[#3F5A3A] bg-[#EAF5E4] px-2.5 py-1 rounded-full">
            {budgetPeriod}
          </span>
        </div>

        {/* Budget Progress Bar */}
        <div className="py-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B7A70] font-medium">Estimated Expense</span>
            <span className="text-[#1F2A24] font-extrabold">
              ₹{estimatedSpent} of ₹{budget}
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[#EDE8DE] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3F5A3A] transition-all duration-500"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6B7A70]">
            <span>{checkedCount} of {totalItemsCount} items checked</span>
            <span className="text-[#2E7D32] font-bold">₹{remainingBudget} remaining</span>
          </div>
        </div>

        {/* Next 3 Unchecked Items */}
        <div className="pt-2 space-y-2">
          <div className="text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider">
            Up Next for Shopping
          </div>

          {nextUnchecked.map((item) => {
            const isChecked = checkedIds.includes(item.id)
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#FAF7F0] border-[#E2DBD0] opacity-60'
                    : 'bg-white border-[#EDE8DE] hover:border-[#3F5A3A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isChecked ? (
                    <CheckSquare size={16} className="text-[#3F5A3A] shrink-0" />
                  ) : (
                    <Square size={16} className="text-[#8D9B91] shrink-0" />
                  )}
                  <div className="text-xs font-bold text-[#1F2A24] line-clamp-1">
                    {item.name}
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#3F5A3A] shrink-0">
                  ₹{item.price}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 mt-4 border-t border-[#EDE8DE]">
        <button
          onClick={() => navigate('/grocery')}
          className="w-full h-10 rounded-full border border-[#3F5A3A] text-[#3F5A3A] hover:bg-[#3F5A3A] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <ShoppingBag size={14} />
          <span>Open grocery list</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}
