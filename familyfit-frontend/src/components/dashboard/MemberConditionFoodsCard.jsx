import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, HeartPulse, ArrowRight, CheckCircle2, ChevronRight, Activity } from 'lucide-react'
import MemberAvatar from '../MemberAvatar'

// Evidence-backed therapeutic Kerala food recommendations for conditions and goals
const THERAPEUTIC_FOOD_MAP = {
  // ── CONDITIONS ──
  'diabetes': {
    target: 'Blood Glucose Control & Insulin Sensitivity',
    badgeText: 'Reduces Blood Sugar',
    badgeColor: '#16A34A',
    badgeBg: '#DCFCE7',
    foods: [
      {
        foodName: 'Bitter Gourd (Pavakka)',
        action: 'Eating this directly reduces blood sugar',
        reason: 'Contains charantin and polypeptide-p (plant insulin) that stimulates cellular glucose uptake and regenerates pancreatic beta cells.',
        prepTip: 'Pavakka Mezhukkupuratti or lightly salted steamed slices.',
        icon: '🥒',
      },
      {
        foodName: 'Fenugreek Seeds (Uluva)',
        action: 'Slows sugar absorption and stops post-meal spikes',
        reason: 'Rich in 4-hydroxyisoleucine soluble fiber which delays stomach emptying and improves glucose tolerance.',
        prepTip: 'Uluva Kanji (Fenugreek rice porridge) or soaked seed infusion.',
        icon: '🌱',
      },
      {
        foodName: 'Kerala Matta Rice (Unpolished)',
        action: 'Prevents glycemic spikes compared to white rice',
        reason: 'High bran fiber content yields a low glycemic index, providing sustained energy without triggering rapid insulin surges.',
        prepTip: 'Boiled traditional double-cooked Matta with vegetable thoran.',
        icon: '🌾',
      },
      {
        foodName: 'Cinnamon & Jamun (Njaval)',
        action: 'Enhances cell insulin sensitivity',
        reason: 'Cinnamaldehyde mimics insulin and increases glucose transportation into muscles and liver cells.',
        prepTip: 'Add 1/2 tsp fresh Ceylon cinnamon powder to morning herbal tea.',
        icon: '🫐',
      },
    ],
  },

  'high blood pressure': {
    target: 'Natural Vasodilation & Sodium Regulation',
    badgeText: 'Lowers Blood Pressure',
    badgeColor: '#0284C7',
    badgeBg: '#E0F2FE',
    foods: [
      {
        foodName: 'Drumsticks & Moringa Leaves (Muringayila)',
        action: 'Relaxes blood vessel walls and flushes excess sodium',
        reason: 'High in bioavailable potassium and quercetin, counteracting dietary sodium and dilating constricted arteries.',
        prepTip: 'Muringayila Thoran or light drumstick dal sambar.',
        icon: '🌿',
      },
      {
        foodName: 'Garlic (Veluthulli)',
        action: 'Naturally lowers systolic and diastolic pressure',
        reason: 'Allicin triggers the production of nitric oxide and hydrogen sulfide, relaxing arterial tension.',
        prepTip: 'Lightly crushed cloves in rasam or tempered tadka.',
        icon: '🧄',
      },
      {
        foodName: 'Beetroot Thoran',
        action: 'Expands blood vessels via dietary nitrates',
        reason: 'Natural nitrates convert to blood nitric oxide within 2 hours, significantly improving arterial elasticity.',
        prepTip: 'Finely grated beetroot stir-fry with grated coconut.',
        icon: '🥗',
      },
      {
        foodName: 'Tender Coconut Water (Elaneer)',
        action: 'Regulates electrolyte balance and heart rhythm',
        reason: 'Abundant in potassium, L-arginine, and magnesium which reduce vascular resistance.',
        prepTip: 'Fresh unprocessed morning tender coconut water.',
        icon: '🥥',
      },
    ],
  },

  'high cholesterol': {
    target: 'LDL Cholesterol Reduction & Artery Protection',
    badgeText: 'Reduces LDL Cholesterol',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    foods: [
      {
        foodName: 'Fresh Curry Leaves (Kariveppila)',
        action: 'Inhibits cholesterol oxidation in arteries',
        reason: 'Carbazole alkaloids and antioxidant flavonoids bind to lipids and prevent plaque formation.',
        prepTip: 'Kariveppila Chammanthi (fresh raw curry leaf chutney).',
        icon: '🍃',
      },
      {
        foodName: 'Mathi / Sardines (Kerala Coast Catch)',
        action: 'Reduces blood triglycerides and raises good HDL',
        reason: 'High concentration of Omega-3 EPA & DHA fatty acids cleanses arterial walls and reduces systemic inflammation.',
        prepTip: 'Kudampuli fish curry with minimal oil.',
        icon: '🐟',
      },
      {
        foodName: 'Flaxseeds (Cheruchana Vithu) & Oats',
        action: 'Binds to cholesterol in the gut to flush it out',
        reason: 'Beta-glucan and mucilage soluble fibers trap dietary cholesterol and bile acids, preventing reabsorption.',
        prepTip: 'Ground flaxseed stirred into warm breakfast oatmeal or kanji.',
        icon: '🥣',
      },
    ],
  },

  'heart disease': {
    target: 'Cardiovascular Strength & Arterial Elasticity',
    badgeText: 'Cardio-Protective',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    foods: [
      {
        foodName: 'Cold-Pressed Coconut Oil (Moderate)',
        action: 'Supplies medium-chain clean fuel for cardiac cells',
        reason: 'Lauric acid provides direct cellular energy without placing heavy metabolic load on arteries.',
        prepTip: 'Use for traditional light tempering rather than deep frying.',
        icon: '🥥',
      },
      {
        foodName: 'Spinach (Cheera) & Green Leafy Thoran',
        action: 'Lowers homocysteine and prevents arterial stiffness',
        reason: 'Rich in dietary folates, magnesium, and Vitamin K2 that support vascular endothelial health.',
        prepTip: 'Cheera Thoran with green chillies and garlic.',
        icon: '🥬',
      },
    ],
  },

  'thyroid': {
    target: 'Endocrine Support & T4-to-T3 Hormone Conversion',
    badgeText: 'Supports Thyroid Health',
    badgeColor: '#7C3AED',
    badgeBg: '#EDE9FE',
    foods: [
      {
        foodName: 'Pumpkin Seeds & Brazil Nuts',
        action: 'Provides essential selenium and zinc for hormone synthesis',
        reason: 'Deiodinase enzymes that convert inactive T4 into active metabolic T3 require organic selenium cofactors.',
        prepTip: 'A small handful of lightly roasted pumpkin seeds as an afternoon snack.',
        icon: '🎃',
      },
      {
        foodName: 'Ash Gourd (Kumbalanga)',
        action: 'Alkalizes system and reduces autoimmune thyroid inflammation',
        reason: 'Highly cooling and mineral-dense, it flushes metabolic toxins without interfering with iodine uptake.',
        prepTip: 'Kumbalanga Olan with coconut milk and green chillies.',
        icon: '🍈',
      },
    ],
  },

  'kidney disease': {
    target: 'Low Renal Filtration Strain & Fluid Balance',
    badgeText: 'Protects Kidney Function',
    badgeColor: '#059669',
    badgeBg: '#D1FAE5',
    foods: [
      {
        foodName: 'Vellarikka / Cucumber & Bottle Gourd',
        action: 'Provides gentle hydration with near-zero sodium strain',
        reason: 'High cellular water content flushes out uric acid and eases glomerular filtration load.',
        prepTip: 'Mild stew or cooling cucumber salad.',
        icon: '🥒',
      },
      {
        foodName: 'Amla / Indian Gooseberry (Nellikka)',
        action: 'Prevents urinary tract inflammation and oxidative renal stress',
        reason: 'Potent non-acidic Vitamin C complex scavenges free radicals in kidney tubules.',
        prepTip: 'Fresh crushed amla juice diluted in warm water.',
        icon: '🫒',
      },
    ],
  },

  // ── GOALS ──
  'lose weight': {
    target: 'Accelerated Fat Oxidation & Prolonged Satiety',
    badgeText: 'Burns Fat & Satiates',
    badgeColor: '#EA580C',
    badgeBg: '#FFEDD5',
    foods: [
      {
        foodName: 'Horse Gram (Muthira Soup)',
        action: 'Burns stored fat and curbs hunger spikes',
        reason: 'Contains polyphenols and slowly digestible proteins that stimulate satiety hormones (PYY) and boost metabolic burn.',
        prepTip: 'Muthira Chammanthi or warm boiled horse gram soup.',
        icon: '🥣',
      },
      {
        foodName: 'Cabbage & French Beans Thoran',
        action: 'Fills the stomach with fiber and minimal calories',
        reason: 'Takes more calories to digest than it provides, stabilizing blood sugar and preventing late evening cravings.',
        prepTip: 'Steamed thoran with mustard seeds and fresh coconut.',
        icon: '🥬',
      },
    ],
  },

  'gain muscle': {
    target: 'Lean Muscle Protein Synthesis & Recovery',
    badgeText: 'Builds Muscle Tissue',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    foods: [
      {
        foodName: 'Country Eggs & Nadan Chicken',
        action: 'Supplies complete leucine-rich muscle building blocks',
        reason: 'Highest biological value protein directly triggers mTOR pathway for athletic recovery and hypertrophy.',
        prepTip: 'Boiled country eggs or low-oil pepper chicken roast.',
        icon: '🥚',
      },
      {
        foodName: 'Steamed Nendran Plantain with Ghee',
        action: 'Rapidly replenishes muscular glycogen without bloating',
        reason: 'Complex prebiotic potassium-rich carbohydrates fuel intense workouts and prevent muscle fatigue.',
        prepTip: 'Steamed Nendran banana eaten post-exercise.',
        icon: '🍌',
      },
      {
        foodName: 'Sprouted Green Gram (Cherupayar Mula)',
        action: 'Enzyme-rich plant protein for continuous repair',
        reason: 'Sprouting doubles bioavailable lysine and protein absorption efficiency.',
        prepTip: 'Sprouted moong salad with grated carrot and lime.',
        icon: '🌱',
      },
    ],
  },

  'grow healthy': {
    target: 'Bone Mineralization & Cognitive Development',
    badgeText: 'Optimal Kids Growth',
    badgeColor: '#16A34A',
    badgeBg: '#DCFCE7',
    foods: [
      {
        foodName: 'Ragi (Finger Millet) & Steamed Banana',
        action: 'Provides 10x more natural calcium for bone density',
        reason: 'Crucial for skeletal elongation and dental mineralization in developing kids.',
        prepTip: 'Ragi Kurukku or soft Ragi Puttu with grated coconut.',
        icon: '🥣',
      },
      {
        foodName: 'Pure Cow Ghee (Nadan Neyy)',
        action: 'Nourishes brain cells and lipid-soluble vitamin uptake',
        reason: 'Contains DHA and butyric acid essential for growing neuron synapses and gut mucosal health.',
        prepTip: '1 tsp melted over warm rice and dal for children.',
        icon: '🧈',
      },
      {
        foodName: 'Fresh Thayir (Curd / Yogurt)',
        action: 'Builds strong immunity and childhood gut microbiome',
        reason: 'Supplies bioavailable calcium and live lactic cultures to prevent digestive allergies.',
        prepTip: 'Fresh mild curd rice or seasoned moru.',
        icon: '🥛',
      },
    ],
  },

  'maintain weight': {
    target: 'Balanced Cellular Nourishment & Sustained Vitality',
    badgeText: 'Hormonal Balance',
    badgeColor: '#24402F',
    badgeBg: '#EAF9DE',
    foods: [
      {
        foodName: 'Traditional Kerala Sadya Vegetables (Avial)',
        action: 'Complete micronutrient spectrum in a single meal',
        reason: 'Combines 8+ colorful local vegetables with raw coconut paste for optimal vitamin and mineral synergy.',
        prepTip: 'Avial made with coconut oil and fresh curry leaves.',
        icon: '🍛',
      },
    ],
  },
}

function cleanConditionKey(str) {
  return (str || '').toLowerCase().trim()
}

export default function MemberConditionFoodsCard({ familyMembers = [] }) {
  // Extract members with their matching therapeutic foods
  const memberRecommendations = useMemo(() => {
    const list = []

    familyMembers.forEach((member) => {
      if (!member) return

      const memberConditions = Array.isArray(member.healthConditions)
        ? member.healthConditions
        : member.healthConditions
        ? [member.healthConditions]
        : []

      const memberGoal = member.goal || ''

      const gatheredFoods = []
      const tags = []

      // 1. Match from conditions (e.g. Diabetes, High Blood Pressure)
      memberConditions.forEach((cond) => {
        const key = cleanConditionKey(cond)
        if (THERAPEUTIC_FOOD_MAP[key]) {
          const entry = THERAPEUTIC_FOOD_MAP[key]
          tags.push({ label: cond, ...entry })
          gatheredFoods.push(...entry.foods)
        }
      })

      // 2. Match from dietary goals (e.g. Lose weight, Gain muscle, Low sugar)
      const goalKey = cleanConditionKey(memberGoal)
      if (THERAPEUTIC_FOOD_MAP[goalKey] && !tags.some((t) => cleanConditionKey(t.label) === goalKey)) {
        const entry = THERAPEUTIC_FOOD_MAP[goalKey]
        tags.push({ label: memberGoal, ...entry })
        gatheredFoods.push(...entry.foods)
      }

      // Fallback if no specific condition or goal mapped
      if (gatheredFoods.length === 0) {
        const defaultEntry = THERAPEUTIC_FOOD_MAP['maintain weight']
        tags.push({ label: 'General Wellness', ...defaultEntry })
        gatheredFoods.push(...defaultEntry.foods)
      }

      list.push({
        memberId: member.id || member._id,
        member,
        name: member.name,
        role: member.role,
        tags,
        foods: gatheredFoods,
      })
    })

    return list
  }, [familyMembers])

  // Active member selection
  const [activeMemberId, setActiveMemberId] = useState(() => {
    // Default to the first member who has an active condition (e.g. Madhavan or Sarada)
    const withCondition = familyMembers.find(
      (m) => m && Array.isArray(m.healthConditions) && m.healthConditions.length > 0 && m.healthConditions[0] !== 'None'
    )
    return withCondition ? String(withCondition.id || withCondition._id) : 'ALL'
  })

  const displayedMembers = useMemo(() => {
    if (activeMemberId === 'ALL') return memberRecommendations
    return memberRecommendations.filter(
      (m) => String(m.memberId) === String(activeMemberId)
    )
  }, [memberRecommendations, activeMemberId])

  return (
    <div className="duo-card p-5 sm:p-6 flex flex-col justify-between font-['Nunito',sans-serif] h-full bg-white border-2 border-[#ECEAE3] shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF9DE] text-[#24402F] flex items-center justify-center font-black">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#777777]">
                Targeted Nutrition
              </span>
              <h3 className="text-base font-black text-[#1F2A24] leading-tight">
                Good Foods For Health Conditions
              </h3>
            </div>
          </div>

          <span className="text-xs font-black text-[#24402F] bg-[#EAF9DE] border border-[#C4D1A8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <HeartPulse size={12} className="text-[#58CC02]" />
            Personalized
          </span>
        </div>

        {/* Member Selector Tabs */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveMemberId('ALL')}
            className={`text-[11px] font-black px-3 py-1 rounded-full border transition-all ${
              activeMemberId === 'ALL'
                ? 'bg-[#24402F] text-white border-[#24402F] shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            All Members ({memberRecommendations.length})
          </button>
          {memberRecommendations.map((item) => (
            <button
              key={item.memberId}
              type="button"
              onClick={() => setActiveMemberId(String(item.memberId))}
              className={`text-[11px] font-black px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
                activeMemberId === String(item.memberId)
                  ? 'bg-[#24402F] text-white border-[#24402F] shadow-xs'
                  : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
              }`}
            >
              <MemberAvatar member={item.member} size={16} />
              <span>{item.name}</span>
              {item.tags[0] && (
                <span
                  style={{ backgroundColor: item.tags[0].badgeBg, color: item.tags[0].badgeColor }}
                  className="text-[9.5px] px-1.5 py-0.2 rounded font-extrabold"
                >
                  {item.tags[0].label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Member Therapeutic Foods List */}
        <div className="pt-3.5 space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {displayedMembers.map((mItem) => (
            <div
              key={mItem.memberId}
              className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#EBE8DF] space-y-3"
            >
              {/* Member Profile Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MemberAvatar member={mItem.member} size={26} />
                  <div>
                    <div className="text-xs font-black text-[#1F2A24] flex items-center gap-1.5">
                      <span>{mItem.name}</span>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white text-[#6B7280] border border-[#E5E7EB]">
                        {mItem.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {mItem.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: t.badgeBg,
                        color: t.badgeColor,
                      }}
                      className="text-[10.5px] font-black px-2 py-0.5 rounded-full tracking-wide"
                    >
                      {t.badgeText} ({t.label})
                    </span>
                  ))}
                </div>
              </div>

              {/* Foods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mItem.foods.map((food, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl flex-shrink-0">{food.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-[#111827] leading-tight">
                          {food.foodName}
                        </div>
                        <div className="text-[11px] font-bold text-[#047857] leading-tight pt-0.5">
                          ✓ {food.action}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-[#4B5563] leading-relaxed font-medium pl-1">
                      {food.reason}
                    </p>

                    {food.prepTip && (
                      <div className="text-[10px] font-semibold text-[#6B7280] bg-[#F9FAFB] p-1.5 rounded-lg border border-[#F3F4F6]">
                        <span className="font-bold text-[#374151]">Kerala Recipe: </span>
                        {food.prepTip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-2 border-t border-[#F0F0F0]">
        <Link
          to="/recipes"
          className="flex items-center justify-between text-xs font-black text-[#24402F] hover:text-[#58CC02] transition-colors"
        >
          <span>Explore Condition-Specific Kerala Recipes</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
