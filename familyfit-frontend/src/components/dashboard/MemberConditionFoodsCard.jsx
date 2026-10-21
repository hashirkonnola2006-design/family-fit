import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, HeartPulse, ArrowRight, CheckCircle2 } from 'lucide-react'
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
      },
      {
        foodName: 'Fenugreek Seeds (Uluva)',
        action: 'Slows sugar absorption and stops post-meal spikes',
        reason: 'Rich in 4-hydroxyisoleucine soluble fiber which delays stomach emptying and improves glucose tolerance.',
        prepTip: 'Uluva Kanji (Fenugreek rice porridge) or soaked seed infusion.',
      },
      {
        foodName: 'Kerala Matta Rice (Unpolished)',
        action: 'Prevents glycemic spikes compared to white rice',
        reason: 'High bran fiber content yields a low glycemic index, providing sustained energy without triggering rapid insulin surges.',
        prepTip: 'Boiled traditional double-cooked Matta with vegetable thoran.',
      },
      {
        foodName: 'Cinnamon & Jamun (Njaval)',
        action: 'Enhances cell insulin sensitivity',
        reason: 'Cinnamaldehyde mimics insulin and increases glucose transportation into muscles and liver cells.',
        prepTip: 'Add 1/2 tsp fresh Ceylon cinnamon powder to morning herbal tea.',
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
      },
      {
        foodName: 'Garlic (Veluthulli)',
        action: 'Naturally lowers systolic and diastolic pressure',
        reason: 'Allicin triggers the production of nitric oxide and hydrogen sulfide, relaxing arterial tension.',
        prepTip: 'Lightly crushed cloves in rasam or tempered tadka.',
      },
      {
        foodName: 'Beetroot Thoran',
        action: 'Expands blood vessels via dietary nitrates',
        reason: 'Natural nitrates convert to blood nitric oxide within 2 hours, significantly improving arterial elasticity.',
        prepTip: 'Finely grated beetroot stir-fry with grated coconut.',
      },
      {
        foodName: 'Tender Coconut Water (Elaneer)',
        action: 'Regulates electrolyte balance and heart rhythm',
        reason: 'Abundant in potassium, L-arginine, and magnesium which reduce vascular resistance.',
        prepTip: 'Fresh unprocessed morning tender coconut water.',
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
      },
      {
        foodName: 'Mathi / Sardines (Kerala Coast Catch)',
        action: 'Reduces blood triglycerides and raises good HDL',
        reason: 'High concentration of Omega-3 EPA & DHA fatty acids cleanses arterial walls and reduces systemic inflammation.',
        prepTip: 'Kudampuli fish curry with minimal oil.',
      },
      {
        foodName: 'Flaxseeds (Cheruchana Vithu) & Oats',
        action: 'Binds to cholesterol in the gut to flush it out',
        reason: 'Beta-glucan and mucilage soluble fibers trap dietary cholesterol and bile acids, preventing reabsorption.',
        prepTip: 'Ground flaxseed stirred into warm breakfast oatmeal or kanji.',
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
      },
      {
        foodName: 'Spinach (Cheera) & Green Leafy Thoran',
        action: 'Lowers homocysteine and prevents arterial stiffness',
        reason: 'Rich in dietary folates, magnesium, and Vitamin K2 that support vascular endothelial health.',
        prepTip: 'Cheera Thoran with green chillies and garlic.',
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
      },
      {
        foodName: 'Ash Gourd (Kumbalanga)',
        action: 'Alkalizes system and reduces autoimmune thyroid inflammation',
        reason: 'Highly cooling and mineral-dense, it flushes metabolic toxins without interfering with iodine uptake.',
        prepTip: 'Kumbalanga Olan with coconut milk and green chillies.',
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
      },
      {
        foodName: 'Amla / Indian Gooseberry (Nellikka)',
        action: 'Prevents urinary tract inflammation and oxidative renal stress',
        reason: 'Potent non-acidic Vitamin C complex scavenges free radicals in kidney tubules.',
        prepTip: 'Fresh crushed amla juice diluted in warm water.',
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
      },
      {
        foodName: 'Cabbage & French Beans Thoran',
        action: 'Fills the stomach with fiber and minimal calories',
        reason: 'Takes more calories to digest than it provides, stabilizing blood sugar and preventing late evening cravings.',
        prepTip: 'Steamed thoran with mustard seeds and fresh coconut.',
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
      },
      {
        foodName: 'Steamed Nendran Plantain with Ghee',
        action: 'Rapidly replenishes muscular glycogen without bloating',
        reason: 'Complex prebiotic potassium-rich carbohydrates fuel intense workouts and prevent muscle fatigue.',
        prepTip: 'Steamed Nendran banana eaten post-exercise.',
      },
      {
        foodName: 'Sprouted Green Gram (Cherupayar Mula)',
        action: 'Enzyme-rich plant protein for continuous repair',
        reason: 'Sprouting doubles bioavailable lysine and protein absorption efficiency.',
        prepTip: 'Sprouted moong salad with grated carrot and lime.',
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
      },
      {
        foodName: 'Pure Cow Ghee (Nadan Neyy)',
        action: 'Nourishes brain cells and lipid-soluble vitamin uptake',
        reason: 'Contains DHA and butyric acid essential for growing neuron synapses and gut mucosal health.',
        prepTip: '1 tsp melted over warm rice and dal for children.',
      },
      {
        foodName: 'Fresh Thayir (Curd / Yogurt)',
        action: 'Builds strong immunity and childhood gut microbiome',
        reason: 'Supplies bioavailable calcium and live lactic cultures to prevent digestive allergies.',
        prepTip: 'Fresh mild curd rice or seasoned moru.',
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
    <div className="duo-card p-6 sm:p-7 flex flex-col justify-between font-['Nunito',sans-serif] h-full bg-white border-2 border-[#ECEAE3] rounded-3xl shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#F0F0F0] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF9DE] text-[#1F5D3A] flex items-center justify-center font-black">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#777777] block">
                Targeted Nutrition
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1F2A24] leading-tight">
                Good Foods For Health Conditions
              </h3>
            </div>
          </div>

          <Link
            to="/tips"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#1F5D3A] text-white hover:bg-[#174A2E] shadow-sm transition-all cursor-pointer group"
          >
            <HeartPulse size={14} className="text-[#86EFAC] group-hover:scale-110 transition-transform" />
            <span>Wellness Page</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Member Selector Tabs */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveMemberId('ALL')}
            style={{
              backgroundColor: activeMemberId === 'ALL' ? '#1F5D3A' : '#F3F4F6',
              color: activeMemberId === 'ALL' ? '#FFFFFF' : '#1F2937',
              border: `1.5px solid ${activeMemberId === 'ALL' ? '#143F27' : '#E5E7EB'}`,
            }}
            className="text-xs sm:text-[13px] font-black px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs shrink-0"
          >
            All Members ({memberRecommendations.length})
          </button>
          {memberRecommendations.map((item) => {
            const active = activeMemberId === String(item.memberId)
            return (
              <button
                key={item.memberId}
                type="button"
                onClick={() => setActiveMemberId(String(item.memberId))}
                style={{
                  backgroundColor: active ? '#1F5D3A' : '#F3F4F6',
                  color: active ? '#FFFFFF' : '#1F2937',
                  border: `1.5px solid ${active ? '#143F27' : '#E5E7EB'}`,
                }}
                className="text-xs sm:text-[13px] font-black px-3.5 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <MemberAvatar member={item.member} size={22} />
                <span
                  style={{ color: active ? '#FFFFFF' : '#1F2937' }}
                  className="font-black"
                >
                  {item.name}
                </span>
                {item.tags[0] && (
                  <span
                    style={{
                      backgroundColor: active ? 'rgba(255, 255, 255, 0.22)' : item.tags[0].badgeBg,
                      color: active ? '#FFFFFF' : item.tags[0].badgeColor,
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md font-extrabold"
                  >
                    {item.tags[0].label}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Member Therapeutic Foods List */}
        <div className="pt-4 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {displayedMembers.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#FAFAF8] border border-dashed border-[#DFDACB] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#EBF4EC] text-[#1F5D3A] flex items-center justify-center mx-auto">
                <Sparkles size={20} />
              </div>
              <div className="text-sm font-black text-[#1F2A24]">
                No Family Conditions Active
              </div>
              <p className="text-xs font-semibold text-[#6B7280] max-w-sm mx-auto leading-relaxed">
                {familyMembers.length === 0
                  ? 'Add your family members in Profile to discover personalized therapeutic foods and Kerala superfoods.'
                  : 'All registered family members are in good health with standard balanced meal guidelines.'}
              </p>
              {familyMembers.length === 0 && (
                <Link
                  to="/profile"
                  className="inline-block mt-2 text-xs font-bold text-[#1F5D3A] hover:underline cursor-pointer"
                >
                  Add Members in Profile &rarr;
                </Link>
              )}
            </div>
          ) : (
            displayedMembers.map((mItem) => (
              <div
                key={mItem.memberId}
                className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#EBE8DF] space-y-3"
              >
                {/* Member Profile Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <MemberAvatar member={mItem.member} size={28} />
                  <div>
                    <div className="text-xs font-black text-[#1F2A24] flex items-center gap-1.5">
                      <span>{mItem.name}</span>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-white text-[#6B7280] border border-[#E5E7EB]">
                        {mItem.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {mItem.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: t.badgeBg,
                        color: t.badgeColor,
                      }}
                      className="text-[10.5px] font-black px-2.5 py-0.5 rounded-full tracking-wide"
                    >
                      {t.badgeText} ({t.label})
                    </span>
                  ))}
                  <Link
                    to="/tips"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-[#EAF9DE] text-[#1F5D3A] hover:bg-[#D5E7DA] border border-[#C4D1A8] transition-colors"
                  >
                    <span>Wellness Page</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Foods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mItem.foods.map((food, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#EAF9DE] text-[#1F5D3A] flex items-center justify-center shrink-0 border border-[#C4D1A8]/40">
                        <Sparkles size={16} />
                      </div>
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
                      <div className="text-[10px] font-semibold text-[#6B7280] bg-[#F9FAFB] p-2 rounded-lg border border-[#F3F4F6]">
                        <span className="font-bold text-[#374151]">Kerala Recipe: </span>
                        {food.prepTip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-4 mt-3 border-t border-[#F0F0F0] flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/tips"
          className="flex items-center gap-2 text-sm font-black text-[#1F5D3A] hover:text-[#174A2E] hover:underline transition-colors"
        >
          <Sparkles size={16} />
          <span>View Full Wellness & Nutrition Guide</span>
          <ArrowRight size={15} />
        </Link>
        <Link
          to="/recipes"
          className="text-xs font-bold text-[#6B7280] hover:text-[#1F5D3A] transition-colors"
        >
          Kerala Recipes →
        </Link>
      </div>
    </div>
  )
}
