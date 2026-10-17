import { useState } from 'react'
import { X, Check, Search, ShieldCheck, Flame, Clock } from 'lucide-react'
import { SAFE_SWAP_SUGGESTIONS } from '../../services/dashboardService'

export default function MealSwapModal({
  isOpen,
  slotKey,
  onClose,
  onConfirmSwap,
}) {
  const [selectedDish, setSelectedDish] = useState(SAFE_SWAP_SUGGESTIONS[0])
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filteredDishes = SAFE_SWAP_SUGGESTIONS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleApply = () => {
    if (selectedDish) {
      onConfirmSwap(slotKey, selectedDish)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-[#E2DBD0] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EDE8DE] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F5A3A]">
              Swap Meal Option
            </span>
            <h3 className="text-lg font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
              Choose replacement for {slotKey?.toUpperCase()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#EDE8DE] flex items-center justify-center text-[#6B7A70] hover:text-[#1F2A24] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9B91]" />
            <input
              type="text"
              placeholder="Search safe Kerala dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#DCD5C8] bg-[#FAF7F0] text-xs font-medium text-[#1F2A24] outline-none focus:border-[#3F5A3A]"
            />
          </div>

          {/* Dish Options List */}
          <div className="space-y-2.5">
            {filteredDishes.map((dish) => {
              const isSelected = selectedDish?.id === dish.id
              return (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#3F5A3A] bg-[#EAF5E4]/50 shadow-xs'
                      : 'border-[#EDE8DE] bg-white hover:border-[#3F5A3A]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#1F2A24]">
                        {dish.name}
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] text-[#6B7A70] mt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-[#1F2A24]">
                          <Flame size={11} className="text-[#F26B3A]" />
                          {dish.kcal} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {dish.cookTimeMinutes}m
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-[#EAF5E4] text-[#2E7D32] text-[10px] font-bold">
                          {dish.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#3F5A3A] border-[#3F5A3A] text-white'
                        : 'border-[#CBD5E1]'
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EDE8DE] bg-[#FAF7F0] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#DCD5C8] text-[#1F2A24] text-xs font-semibold hover:bg-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Confirm Swap
          </button>
        </div>
      </div>
    </div>
  )
}
