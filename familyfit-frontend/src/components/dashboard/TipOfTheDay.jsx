import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, RotateCw, ArrowRight, Sparkles } from 'lucide-react'

const KERALA_TIPS_POOL = [
  {
    id: 1,
    category: 'Ayurvedic Digestion',
    title: 'Warm Cumin & Chukku Water',
    summary: 'Sipping water boiled with cumin seeds (Jeera) and dry ginger awakens gastric enzymes, soothing morning bloating and promoting gentle absorption.',
    recipeId: 1,
    recipeName: 'Steamed Puttu & Kadala',
    color: '#FF9600',
  },
  {
    id: 2,
    category: 'Heart & Blood Sugar',
    title: 'Palakkadan Red Matta Benefits',
    summary: 'Parboiled red matta preserves its fiber-rich bran coat, releasing complex carbs gradually and preventing afternoon sugar crashes.',
    recipeId: 2,
    recipeName: 'Traditional Avial & Matta',
    color: '#E08500',
  },
  {
    id: 3,
    category: 'Immunity & Superfoods',
    title: 'Moringa Leaf (Muringayila) Power',
    summary: 'Pair fresh moringa leaves with a splash of fresh lemon or rasam — natural vitamin C multiplies plant iron uptake threefold.',
    recipeId: 3,
    recipeName: 'Muringayila Thoran',
    color: '#58CC02',
  },
  {
    id: 4,
    category: 'Post-Meal Wellness',
    title: 'The 100-Step Shatapadi Walk',
    summary: 'Ayurvedic tradition recommends a relaxed 100-step stroll after heavy lunches to prevent post-meal lethargy and aid digestion.',
    recipeId: 1,
    recipeName: 'Mild Vegetable Stew',
    color: '#CE82FF',
  },
]

export default function TipOfTheDay({ selectedMember }) {
  const [tipIndex, setTipIndex] = useState(0)

  const handleShuffle = () => {
    setTipIndex((prev) => (prev + 1) % KERALA_TIPS_POOL.length)
  }

  const tip = KERALA_TIPS_POOL[tipIndex]

  return (
    <div className="duo-card p-5 sm:p-6 flex flex-col justify-between font-['Nunito',sans-serif] h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black">
              <Lightbulb size={18} />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
                Kerala Wisdom
              </span>
              <h3 className="text-base font-black text-[#1F2A24] leading-tight">
                Tip of the Day
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            className="w-8 h-8 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] hover:bg-[#F9F9F9] active:translate-y-[2px] active:border-b-2 text-[#666666] hover:text-[#1F2A24] flex items-center justify-center transition-all cursor-pointer"
            title="Next tip"
            aria-label="Next tip"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Tip Body */}
        <div className="pt-3.5 space-y-2">
          <span className="inline-block text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
            {tip.category}
          </span>

          <h4 className="text-sm font-black text-[#1F2A24] leading-snug">
            {tip.title}
          </h4>

          <p className="text-xs font-semibold text-[#666666] leading-relaxed line-clamp-3">
            {tip.summary}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3.5 mt-4 border-t-2 border-[#F0F0F0]">
        <Link
          to={`/recipes/${tip.recipeId}`}
          className="text-xs font-black text-[#D97706] hover:text-[#B45309] flex items-center justify-between group"
        >
          <span className="truncate pr-2">Try with: {tip.recipeName}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  )
}
