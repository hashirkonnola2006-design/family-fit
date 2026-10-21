import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, RotateCw, ArrowRight, Repeat, Users, CheckCircle2, Sparkles, Calendar } from 'lucide-react'
import MemberAvatar from '../MemberAvatar'

// Curated evidence-backed Kerala family wellness habits designed for daily repetition
const KERALA_TIPS_POOL = [
  {
    id: 1,
    category: 'Ayurvedic Digestion',
    timing: 'Daily Morning Habit',
    title: 'Warm Cumin & Chukku Water (Jeeraka Vellam)',
    summary: 'Sipping warm water boiled with cumin seeds (Jeera) and crushed dry ginger (Chukku) activates digestive fires (Agni), soothing morning gastric discomfort and promoting gentle absorption.',
    compoundingBenefit: 'Repeated daily before breakfast, it strengthens stomach mucosal lining, curbs chronic bloating, and primes gut enzymes for all meals.',
    targetCondition: 'digestion',
    defaultBeneficiary: 'Whole Family',
    recipeId: 2,
    recipeName: 'Steamed Puttu & Kadala Curry',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
  {
    id: 2,
    category: 'Blood Glucose Control',
    timing: 'Daily Post-Meal Walk',
    title: 'The 100-Step Shatapadi Walk',
    summary: 'Taking a relaxed 100-to-200 step stroll 10 to 15 minutes after lunch or dinner activates large leg muscles, which immediately absorb circulating glucose without requiring excess insulin.',
    compoundingBenefit: 'Repeated daily after meals, it reduces post-prandial glycemic spikes by up to 30% and completely prevents afternoon sluggishness.',
    targetCondition: 'diabetes',
    defaultBeneficiary: 'Grandparents & Diabetics',
    recipeId: 1,
    recipeName: 'Traditional Avial & Red Matta',
    color: '#16A34A',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
  },
  {
    id: 3,
    category: 'Arterial & Blood Pressure',
    timing: 'Include 3-4 Days a Week',
    title: 'Fresh Moringa Leaf (Muringayila) Habit',
    summary: 'Moringa leaves provide abundant bioavailable potassium and quercetin, naturally relaxing arterial tension and counteracting excess sodium from curries and pickles.',
    compoundingBenefit: 'Consistently eating moringa thoran or drumstick broth stabilizes systolic pressure and elevates natural iron absorption without constipation.',
    targetCondition: 'high blood pressure',
    defaultBeneficiary: 'Grandparents & Parents',
    recipeId: 3,
    recipeName: 'Muringayila Thoran with Matta Rice',
    color: '#0284C7',
    badgeBg: '#E0F2FE',
    badgeText: '#075985',
  },
  {
    id: 4,
    category: 'Cholesterol & Liver Care',
    timing: 'Daily Morning Ritual',
    title: 'Fresh Curry Leaf (Kariveppila) Morning Chew',
    summary: 'Chewing 5 to 7 raw washed curry leaves with warm water releases carbazole alkaloids and antioxidants that inhibit lipid oxidation and protect hepatic cells.',
    compoundingBenefit: 'Repeated daily over weeks, it significantly cleanses arterial plaque, aids liver detox, and promotes strong hair pigmentation.',
    targetCondition: 'high cholesterol',
    defaultBeneficiary: 'Parents & Working Adults',
    recipeId: 1,
    recipeName: 'Kariveppila Chammanthi with Kanji',
    color: '#059669',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
  },
  {
    id: 5,
    category: 'Fasting Blood Sugar',
    timing: 'Daily Empty Stomach Ritual',
    title: 'Fenugreek (Uluva) Overnight Soaked Water',
    summary: 'Soaking a teaspoon of fenugreek seeds overnight extracts 4-hydroxyisoleucine and galactomannan soluble fiber into the water, slowing sugar absorption in the intestine.',
    compoundingBenefit: 'Drinking this every morning steadily brings down fasting morning blood sugar levels and enhances pancreatic beta-cell sensitivity.',
    targetCondition: 'diabetes',
    defaultBeneficiary: 'Grandfather & Diabetic Members',
    recipeId: 1,
    recipeName: 'Uluva Kanji (Fenugreek Porridge)',
    color: '#16A34A',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
  },
  {
    id: 6,
    category: 'Childhood Growth & Energy',
    timing: 'Daily Evening Tea-Time Habit',
    title: 'Sprouted Green Gram (Cherupayar) Snack',
    summary: 'Replacing processed packaged evening snacks with warm sprouted green gram seasoned with grated coconut and lemon delivers double the bioavailable plant protein and lysine.',
    compoundingBenefit: 'Daily repetition fuels steady bone elongation, sustained focus for schoolwork, and active muscle recovery without digestive heaviness.',
    targetCondition: 'kids',
    defaultBeneficiary: 'Children & Teenagers',
    recipeId: 2,
    recipeName: 'Sprouted Moong & Kadala Snack',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
  {
    id: 7,
    category: 'Gut Microbiome & Hydration',
    timing: 'Daily Post-Lunch Habit',
    title: 'Seasoned Pacha Moru (Spiced Buttermilk)',
    summary: 'Fresh buttermilk churned with crushed green chillies, ginger, curry leaves, and a pinch of rock salt provides millions of live lactobacilli probiotics and natural electrolytes.',
    compoundingBenefit: 'Drinking this daily cools internal body heat during hot humid afternoons, protects against gastric infections, and restores gut flora.',
    targetCondition: 'digestion',
    defaultBeneficiary: 'Whole Family',
    recipeId: 1,
    recipeName: 'Kerala Spiced Sambharam with Lunch',
    color: '#0284C7',
    badgeBg: '#E0F2FE',
    badgeText: '#075985',
  },
  {
    id: 8,
    category: 'Brain & Joint Nutrition',
    timing: 'Daily Lunch Ritual',
    title: 'Desi Cow Ghee on Hot First Morsel',
    summary: 'Adding half a teaspoon of pure cow ghee over the first warm bite of steamed rice and parippu introduces butyric acid and lipid-soluble vitamins directly to intestinal cells.',
    compoundingBenefit: 'Repeating this daily nourishes developing brain synapses in children while lubricating stiff arthritic joints in family elders.',
    targetCondition: 'general',
    defaultBeneficiary: 'Kids & Seniors',
    recipeId: 1,
    recipeName: 'Steamed Matta Rice with Dal & Ghee',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
  {
    id: 9,
    category: 'Restful Sleep & GERD Defense',
    timing: 'Every Night Habit',
    title: 'Early Light Dinner (2 Hours Before Sleep)',
    summary: 'Completing light dinners (like Kanzi, steamed appams, or soup) before 8 PM allows the stomach to completely empty before reclining into bed.',
    compoundingBenefit: 'Daily adherence eliminates nighttime acid reflux, lowers sleeping resting heart rate, and triggers deeper stages of restorative cellular repair.',
    targetCondition: 'heart',
    defaultBeneficiary: 'Whole Family',
    recipeId: 1,
    recipeName: 'Light Vegetable Stew with Appam',
    color: '#7C3AED',
    badgeBg: '#EDE9FE',
    badgeText: '#5B21B6',
  },
  {
    id: 10,
    category: 'Immune Resilience',
    timing: 'Daily Morning Vitality',
    title: 'Fresh Amla / Indian Gooseberry (Nellikka) Routine',
    summary: 'A single fresh gooseberry contains more heat-stable Vitamin C than 20 oranges, bound with protective tannins that guard white blood cells from oxidative breakdown.',
    compoundingBenefit: 'Making this a family morning habit drastically cuts down seasonal colds, viral infections, and allergic asthma episodes in school-going kids.',
    targetCondition: 'immunity',
    defaultBeneficiary: 'Whole Family',
    recipeId: 1,
    recipeName: 'Nellikka Chammanthi with Kanji',
    color: '#16A34A',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
  },
  {
    id: 11,
    category: 'Heart & Vascular Flow',
    timing: 'Daily Lunch Addition',
    title: 'Crushed Garlic in Warm Pepper Rasam',
    summary: 'Lightly crushing fresh garlic cloves into hot rasam releases allicin and hydrogen sulfide, which gently dilate constricted blood vessels and support arterial flow.',
    compoundingBenefit: 'A daily cup with lunch prevents systemic arterial stiffening, lowers bad LDL cholesterol oxidation, and clears respiratory airways.',
    targetCondition: 'high blood pressure',
    defaultBeneficiary: 'Grandmother & Parents',
    recipeId: 1,
    recipeName: 'Authentic Kerala Poondu Rasam',
    color: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
  },
  {
    id: 12,
    category: 'Bone & Mood Regulation',
    timing: 'Daily Morning Habit (7:00 - 8:30 AM)',
    title: '15 Minutes of Gentle Morning Sun & Barefoot Stroll',
    summary: 'Gentle early morning sunlight stimulates natural Vitamin D synthesis in the skin, which is essential for transporting calcium into bone matrix and teeth.',
    compoundingBenefit: 'Practiced together as a family morning ritual, it anchors circadian sleep hormones, reduces morning joint stiffness, and prevents osteopenia in elders.',
    targetCondition: 'general',
    defaultBeneficiary: 'Grandparents & Kids',
    recipeId: 2,
    recipeName: 'Steamed Nendran Plantain with Ghee',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
  {
    id: 13,
    category: 'Kidney Hydration & Cooling',
    timing: 'Mid-Morning Hydration (Twice a Week)',
    title: 'Ash Gourd (Kumbalanga) Cooling Infusion',
    summary: 'Ash gourd is 96% pure structured alkaline water with high potassium, flushing out metabolic uric acid crystals and easing glomerular filtration workload.',
    compoundingBenefit: 'Regularly repeated, it prevents kidney stone crystallization, relieves body heat, and maintains systemic fluid balance during warm months.',
    targetCondition: 'kidney',
    defaultBeneficiary: 'Adults & Seniors',
    recipeId: 1,
    recipeName: 'Kumbalanga Olan with Coconut Milk',
    color: '#059669',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
  },
  {
    id: 14,
    category: 'Natural Energy & Iron',
    timing: 'Daily Sweetening Switch',
    title: 'Replace White Sugar with Organic Sharkkara (Jaggery)',
    summary: 'Switching family tea, porridge, and payasam sweetening from refined white sugar to unrefined palm or cane jaggery preserves organic iron, magnesium, and trace minerals.',
    compoundingBenefit: 'Daily repetition avoids sudden insulin spikes followed by afternoon fatigue, while providing steady micronutrients that protect against anemia.',
    targetCondition: 'immunity',
    defaultBeneficiary: 'Mothers & Children',
    recipeId: 2,
    recipeName: 'Traditional Ragi Kurukku with Jaggery',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
]

// Deterministic calendar day index generator
function getDaySeed(poolLength) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  // Generate a distinct number for each day of the year
  return (year * 372 + (month + 1) * 31 + day) % poolLength
}

export default function TipOfTheDay({ selectedMember, familyMembers = [] }) {
  const poolLength = KERALA_TIPS_POOL.length
  const todayDefaultIndex = useMemo(() => getDaySeed(poolLength), [poolLength])

  const [tipIndex, setTipIndex] = useState(todayDefaultIndex)
  const isTodayTip = tipIndex === todayDefaultIndex

  const handleShuffle = () => {
    setTipIndex((prev) => (prev + 1) % poolLength)
  }

  const handleResetToToday = () => {
    setTipIndex(todayDefaultIndex)
  }

  const tip = KERALA_TIPS_POOL[tipIndex]

  // Identify matching family members for whom this habit is particularly impactful
  const matchingMembers = useMemo(() => {
    if (!familyMembers || familyMembers.length === 0) return []

    return familyMembers.filter((m) => {
      if (!m) return false
      const conditions = (Array.isArray(m.healthConditions) ? m.healthConditions : [m.healthConditions || ''])
        .map((c) => (c || '').toLowerCase())

      const role = (m.role || '').toLowerCase()
      const age = Number(m.age) || 30

      if (tip.targetCondition === 'diabetes' && conditions.some((c) => c.includes('diabet'))) return true
      if (tip.targetCondition === 'high blood pressure' && conditions.some((c) => c.includes('pressure') || c.includes('hypertens'))) return true
      if (tip.targetCondition === 'high cholesterol' && conditions.some((c) => c.includes('cholesterol'))) return true
      if (tip.targetCondition === 'heart' && conditions.some((c) => c.includes('heart') || c.includes('pressure'))) return true
      if (tip.targetCondition === 'kids' && (age < 18 || role.includes('child') || role.includes('son') || role.includes('daughter'))) return true
      return false
    })
  }, [familyMembers, tip])

  // Current date formatted cleanly (e.g. "Wednesday, Oct 21")
  const todayFormatted = useMemo(() => {
    try {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'Today'
    }
  }, [])

  return (
    <div className="duo-card p-6 sm:p-7 flex flex-col justify-between font-['Nunito',sans-serif] h-full bg-white border-2 border-[#ECEAE3] rounded-3xl shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#F0F0F0] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black">
              <Lightbulb size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#777777]">
                  Kerala Family Wisdom
                </span>
                <span className="text-[10.5px] font-extrabold px-2 py-0.2 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] flex items-center gap-1">
                  <Calendar size={11} />
                  <span>{todayFormatted}</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1F2A24] leading-tight">
                Tip of the Day
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isTodayTip ? (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#EAF9DE] text-[#1F5D3A] border border-[#C4D1A8] flex items-center gap-1">
                <Sparkles size={12} />
                <span>Today's Daily Habit</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResetToToday}
                className="text-xs font-black px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] hover:text-[#1F2A24] border border-[#E5E7EB] transition-colors cursor-pointer"
                title="Back to today's habit"
              >
                Back to Today's Tip
              </button>
            )}

            <button
              type="button"
              onClick={handleShuffle}
              className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] hover:bg-[#F9F9F9] active:translate-y-[2px] active:border-b-2 text-[#4B5563] hover:text-[#1F2A24] flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Shuffle to another family habit"
              aria-label="Next habit tip"
            >
              <RotateCw size={14} />
            </button>
          </div>
        </div>

        {/* Tip Body */}
        <div className="pt-4 space-y-3.5">
          {/* Timing & Category Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{ backgroundColor: tip.badgeBg, color: tip.badgeText }}
              className="text-xs font-black px-3 py-1 rounded-full border border-black/5 tracking-wide"
            >
              {tip.category}
            </span>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] flex items-center gap-1">
              <Repeat size={12} className="text-[#1F5D3A]" />
              <span>{tip.timing}</span>
            </span>
          </div>

          {/* Heading */}
          <h4 className="text-base sm:text-lg font-black text-[#1F2A24] leading-snug">
            {tip.title}
          </h4>

          {/* Main Description */}
          <p className="text-xs sm:text-[13px] font-semibold text-[#4B5563] leading-relaxed">
            {tip.summary}
          </p>

          {/* Compounding Habit Callout */}
          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#EBEBEB] space-y-1.5">
            <div className="text-[11px] font-black uppercase tracking-wide text-[#1F5D3A] flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#16A34A]" />
              <span>If Repeated by Family:</span>
            </div>
            <p className="text-xs text-[#374151] font-semibold leading-relaxed">
              {tip.compoundingBenefit}
            </p>
          </div>

          {/* Recommended Beneficiaries Pill */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="font-black text-[#6B7280] flex items-center gap-1">
              <Users size={13} />
              <span>Beneficial for:</span>
            </span>

            {matchingMembers.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {matchingMembers.map((m) => (
                  <span
                    key={m.id || m._id}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF9DE] text-[#1F5D3A] border border-[#C4D1A8] text-xs font-extrabold"
                  >
                    <MemberAvatar member={m} size={16} />
                    <span>{m.name}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#374151] text-xs font-bold border border-[#E5E7EB]">
                {tip.defaultBeneficiary}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-4 mt-4 border-t border-[#F0F0F0] flex items-center justify-between flex-wrap gap-2">
        <Link
          to={`/recipes/${tip.recipeId}`}
          className="text-xs sm:text-sm font-black text-[#D97706] hover:text-[#B45309] flex items-center gap-1.5 group transition-colors"
        >
          <span className="truncate">Try with: {tip.recipeName}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link
          to="/tips"
          className="text-xs font-black text-[#1F5D3A] hover:underline flex items-center gap-1"
        >
          <span>More Habits in Wellness</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}
