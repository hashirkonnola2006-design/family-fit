import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, RotateCw, ArrowRight, Sparkles } from 'lucide-react'

const KERALA_TIPS_POOL = [
  {
    id: 1,
    category: 'Ayurvedic Digestion',
    title: 'Warm Cumin & Dry Ginger Chukku Water',
    summary: 'Sipping water infused with cumin (Jeera) and dry ginger awakens gastric agni, soothing morning acid reflux and promoting gentle absorption.',
    recipeId: 1,
    recipeName: 'Steamed Puttu & Kadala',
  },
  {
    id: 2,
    category: 'Heart & Blood Sugar',
    title: 'Why Palakkadan Red Matta Wins Over Polished Rice',
    summary: 'Parboiled red matta retains its bran coat rich in magnesium, delivering complex carbohydrates that keep blood sugar stable throughout the afternoon.',
    recipeId: 2,
    recipeName: 'Traditional Avial & Matta',
  },
  {
    id: 3,
    category: 'Immunity & Micronutrients',
    title: 'Moringa Leaf (Muringayila) Iron Absorption',
    summary: 'Pair fresh drumstick leaves with a splash of lemon or tomato — the natural vitamin C multiplies non-heme plant iron absorption threefold.',
    recipeId: 3,
    recipeName: 'Muringayila Thoran',
  },
  {
    id: 4,
    category: 'Post-Meal Wellness',
    title: 'The 100-Step Shatapadi Metabolic Walk',
    summary: 'Traditional Ayurvedic wisdom advises a gentle 100-pace indoor stroll after heavy Kerala meals to prevent blood pooling in the abdomen.',
    recipeId: 1,
    recipeName: 'Mild Vegetable Stew',
  },
]

export default function TipOfTheDay({ selectedMember }) {
  const [tipIndex, setTipIndex] = useState(0)

  const handleShuffle = () => {
    setTipIndex((prev) => (prev + 1) % KERALA_TIPS_POOL.length)
  }

  const tip = KERALA_TIPS_POOL[tipIndex]

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-sm flex flex-col justify-between transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FAF7F0] border border-[#E2DBD0] text-[#3F5A3A] flex items-center justify-center">
              <Lightbulb size={15} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F5A3A]">
                Daily Kerala Wisdom
              </span>
              <h3 className="text-base font-extrabold text-[#1F2A24] font-['Plus_Jakarta_Sans'] leading-tight">
                Tip of the Day
              </h3>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            className="w-7 h-7 rounded-lg bg-[#FAF7F0] hover:bg-[#EDE8DE] text-[#6B7A70] hover:text-[#1F2A24] flex items-center justify-center transition-all cursor-pointer"
            title="Next tip"
          >
            <RotateCw size={13} />
          </button>
        </div>

        {/* Tip Content */}
        <div className="pt-4 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF5E4] text-[#2E7D32]">
            {tip.category}
          </span>

          <h4 className="text-sm font-bold text-[#1F2A24] font-['Plus_Jakarta_Sans'] leading-snug">
            {tip.title}
          </h4>

          <p className="text-xs text-[#6B7A70] leading-relaxed line-clamp-3">
            {tip.summary}
          </p>
        </div>
      </div>

      {/* Action link */}
      <div className="pt-4 mt-4 border-t border-[#EDE8DE]">
        <Link
          to={`/recipes/${tip.recipeId}`}
          className="text-xs font-bold text-[#3F5A3A] hover:text-[#32492E] flex items-center justify-between group transition-colors"
        >
          <span className="group-hover:underline">Try with: {tip.recipeName}</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
