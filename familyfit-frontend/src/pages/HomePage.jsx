import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import BottomNav from '../components/BottomNav'
import MemberModal from '../components/MemberModal'

// ── Dashboard Bento Grid Components ──
import GreetingHeader from '../components/dashboard/GreetingHeader'
import FamilyStrip from '../components/dashboard/FamilyStrip'
import TodayMeals from '../components/dashboard/TodayMeals'
import NutritionSummary from '../components/dashboard/NutritionSummary'
import HealthAlerts from '../components/dashboard/HealthAlerts'
import GrocerySnapshot from '../components/dashboard/GrocerySnapshot'
import TipOfTheDay from '../components/dashboard/TipOfTheDay'
import QuickActions from '../components/dashboard/QuickActions'
import ProgressChart from '../components/dashboard/ProgressChart'
import RecommendedRecipes from '../components/dashboard/RecommendedRecipes'
import MealSwapModal from '../components/dashboard/MealSwapModal'
import WeightLogModal from '../components/dashboard/WeightLogModal'
import DashboardFooter from '../components/dashboard/DashboardFooter'

// ── Services & Mock Layer ──
import {
  DAYS_OF_WEEK,
  getStoredMealPlan,
  toggleMealEaten,
  swapMealDish,
  getWaterIntake,
  updateWaterIntake,
} from '../services/dashboardService'

// ── Lucide Icons ──
import { AlertCircle, RotateCw, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { family, loading: familyLoading, error: familyError, refresh: refreshFamily } = useFamily()
  const { isDark } = useTheme()

  // ── Household Members ──
  const members = useMemo(() => family?.members || [], [family?.members])
  const familyName = family?.name || user?.familyName || 'Family'

  // ── Selected Member Filter ('all' or member ID) ──
  const [selectedMemberId, setSelectedMemberId] = useState('all')

  const selectedMember = useMemo(() => {
    if (selectedMemberId === 'all') return null
    return members.find((m) => String(m.id) === String(selectedMemberId)) || null
  }, [members, selectedMemberId])

  // ── Today Day Index (0 = Mon, ..., 5 = Sat, 6 = Sun) ──
  const currentDayIndex = useMemo(() => {
    const jsDay = new Date().getDay() // 0 = Sun, 1 = Mon ... 6 = Sat
    return (jsDay + 6) % 7 // Maps Mon->0, Sat->5, Sun->6
  }, [])

  const [selectedDayIndex, setSelectedDayIndex] = useState(currentDayIndex)

  // ── Meal Plan State ──
  const [mealPlan, setMealPlan] = useState(() => getStoredMealPlan(currentDayIndex))

  // Sync meal plan when switching days
  useEffect(() => {
    const plan = getStoredMealPlan(selectedDayIndex)
    setMealPlan(plan)
  }, [selectedDayIndex])

  // ── Water Intake State ──
  const [waterGlasses, setWaterGlasses] = useState(() => getWaterIntake(selectedMemberId))

  useEffect(() => {
    setWaterGlasses(getWaterIntake(selectedMemberId))
  }, [selectedMemberId])

  const handleUpdateWater = useCallback((delta) => {
    const updated = updateWaterIntake(selectedMemberId, delta)
    setWaterGlasses(updated)
  }, [selectedMemberId])

  // ── Modals State ──
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [swapModalSlot, setSwapModalSlot] = useState(null)
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)

  // ── Toast Notification Feedback ──
  const [toastMessage, setToastMessage] = useState(null)
  const showToast = useCallback((msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }, [])

  // ── Meal Plan Actions ──
  const handleToggleEaten = useCallback((slotKey, eaten) => {
    const updated = toggleMealEaten(selectedDayIndex, slotKey, eaten)
    if (updated) {
      setMealPlan({ ...updated })
      showToast(eaten ? `Marked ${slotKey} as eaten` : `Unmarked ${slotKey}`)
    }
  }, [selectedDayIndex, showToast])

  const handleOpenSwap = useCallback((slotKey) => {
    setSwapModalSlot(slotKey)
  }, [])

  const handleConfirmSwap = useCallback((slotKey, newDish) => {
    const updated = swapMealDish(selectedDayIndex, slotKey, newDish)
    if (updated) {
      setMealPlan({ ...updated })
      showToast(`Swapped ${slotKey} with ${newDish.name}`)
    }
    setSwapModalSlot(null)
  }, [selectedDayIndex, showToast])

  const handleFixConflict = useCallback((slotKey) => {
    setSwapModalSlot(slotKey)
  }, [])

  const handleAddDishToPlan = useCallback((dish) => {
    // Add to lunch or dinner slot
    const slot = 'dinner'
    const updated = swapMealDish(selectedDayIndex, slot, dish)
    if (updated) {
      setMealPlan({ ...updated })
      showToast(`Added ${dish.name} to today's dinner plan!`)
    }
  }, [selectedDayIndex, showToast])

  const handlePlanMealClick = useCallback(() => {
    // Scroll smoothly to today's meal plan card
    const el = document.getElementById('today-meals-card')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      navigate('/recipes')
    }
  }, [navigate])

  const handleSaveWeight = useCallback((newWeight) => {
    showToast(`Weight updated to ${newWeight} kg`)
    setIsWeightModalOpen(false)
  }, [showToast])

  // ── Loading Skeleton State ──
  if (familyLoading && members.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#F6F2EA] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1400px] mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="h-44 w-full bg-white/70 rounded-3xl mb-6 border border-[#E2DBD0]" />
        {/* Family Strip Skeleton */}
        <div className="h-28 w-full bg-white/70 rounded-3xl mb-6 border border-[#E2DBD0]" />
        {/* Bento Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-8 h-96 bg-white/70 rounded-3xl border border-[#E2DBD0]" />
          <div className="lg:col-span-4 h-96 bg-white/70 rounded-3xl border border-[#E2DBD0]" />
          <div className="lg:col-span-4 h-64 bg-white/70 rounded-3xl border border-[#E2DBD0]" />
          <div className="lg:col-span-4 h-64 bg-white/70 rounded-3xl border border-[#E2DBD0]" />
          <div className="lg:col-span-4 h-64 bg-white/70 rounded-3xl border border-[#E2DBD0]" />
        </div>
      </div>
    )
  }

  // ── Error State with Retry ──
  if (familyError && members.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-6 bg-[#F6F2EA]">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E2DBD0] text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FEE2E2] text-[#D64545] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#1F2A24] font-['Plus_Jakarta_Sans']">
            Unable to load family dashboard
          </h2>
          <p className="text-sm text-[#6B7A70] mt-2 mb-6">
            {familyError || 'Please verify your network connection and try again.'}
          </p>
          <button
            onClick={() => refreshFamily && refreshFamily()}
            className="w-full h-11 rounded-full bg-[#3F5A3A] hover:bg-[#32492E] text-white font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <RotateCw size={16} />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#F6F2EA] text-[#1F2A24] font-['Plus_Jakarta_Sans',sans-serif] pb-24 lg:pb-12 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1F2A24] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={15} className="text-[#6BBF4E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Bento Grid: 12 columns desktop, 2 columns tablet, 1 column mobile with strict stacking order */}
        <div className="dashboard-bento-grid">
          {/* 1. GREETING HEADER (full width, order-1) */}
          <div className="dashboard-card-greeting">
            <GreetingHeader
              familyName={familyName}
              onAddMember={() => setIsMemberModalOpen(true)}
              onPlanMeal={handlePlanMealClick}
            />
          </div>

          {/* 2. FAMILY STRIP (full width, order-2) */}
          <div className="dashboard-card-family">
            <FamilyStrip
              members={members}
              selectedMemberId={selectedMemberId}
              onSelectMember={setSelectedMemberId}
              onAddMember={() => setIsMemberModalOpen(true)}
            />
          </div>

          {/* 3. TODAY'S MEAL PLAN (8 columns desktop, 12 tablet, order-3 mobile) */}
          <div id="today-meals-card" className="dashboard-card-meals">
            <TodayMeals
              mealPlan={mealPlan}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
              onToggleEaten={handleToggleEaten}
              onOpenSwap={handleOpenSwap}
              familyMembers={members}
            />
          </div>

          {/* 4. HEALTH ALERTS (4 columns desktop, 6 tablet, order-4 mobile) */}
          <div className="dashboard-card-alerts">
            <HealthAlerts
              familyMembers={members}
              mealPlan={mealPlan}
              onFixConflict={handleFixConflict}
            />
          </div>

          {/* 5. NUTRITION TODAY (4 columns desktop, 6 tablet, order-5 mobile) */}
          <div className="dashboard-card-nutrition">
            <NutritionSummary
              mealPlan={mealPlan}
              selectedMember={selectedMember}
              waterGlasses={waterGlasses}
              onUpdateWater={handleUpdateWater}
            />
          </div>

          {/* 6. GROCERY SNAPSHOT (4 columns desktop, 6 tablet, order-6 mobile) */}
          <div className="dashboard-card-grocery">
            <GrocerySnapshot />
          </div>

          {/* 7. TIP OF THE DAY (4 columns desktop, 6 tablet, order-7 mobile) */}
          <div className="dashboard-card-tip">
            <TipOfTheDay selectedMember={selectedMember} />
          </div>

          {/* 8. QUICK ACTIONS (6 columns desktop, 6 tablet, order-8 mobile) */}
          <div className="dashboard-card-actions">
            <QuickActions
              onPlanMeal={handlePlanMealClick}
              onOpenWeightLog={() => setIsWeightModalOpen(true)}
            />
          </div>

          {/* 9. PROGRESS (6 columns desktop, 6 tablet, order-9 mobile) */}
          <div className="dashboard-card-progress">
            <ProgressChart
              selectedMember={selectedMember}
              onOpenWeightLog={() => setIsWeightModalOpen(true)}
            />
          </div>

          {/* 10. RECOMMENDED FOR YOU (full width, order-10 mobile) */}
          <div className="dashboard-card-recommended">
            <RecommendedRecipes onAddDishToPlan={handleAddDishToPlan} />
          </div>
        </div>

        {/* ── SLIM ONE-LINE FOOTER ── */}
        <DashboardFooter />
      </main>

      {/* ── MODALS ── */}
      {isMemberModalOpen && (
        <MemberModal
          member={null}
          onClose={() => setIsMemberModalOpen(false)}
        />
      )}

      {swapModalSlot && (
        <MealSwapModal
          isOpen={Boolean(swapModalSlot)}
          slotKey={swapModalSlot}
          onClose={() => setSwapModalSlot(null)}
          onConfirmSwap={handleConfirmSwap}
        />
      )}

      {isWeightModalOpen && (
        <WeightLogModal
          isOpen={isWeightModalOpen}
          selectedMember={selectedMember || members[0]}
          onClose={() => setIsWeightModalOpen(false)}
          onSaveWeight={handleSaveWeight}
        />
      )}

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <BottomNav />

      {/* ── STYLES FOR BENTO GRID RESPONSIVENESS & PRECISE STACK ORDERING ── */}
      <style>{`
        /* 12-Column Responsive Bento Grid Engine */
        .dashboard-bento-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
          width: 100%;
        }

        /* ── Mobile Stacking Order (360px - 767px) ── */
        .dashboard-card-greeting    { order: 1;  width: 100%; }
        .dashboard-card-family      { order: 2;  width: 100%; }
        .dashboard-card-meals       { order: 3;  width: 100%; }
        .dashboard-card-alerts      { order: 4;  width: 100%; }
        .dashboard-card-nutrition   { order: 5;  width: 100%; }
        .dashboard-card-grocery     { order: 6;  width: 100%; }
        .dashboard-card-tip         { order: 7;  width: 100%; }
        .dashboard-card-actions     { order: 8;  width: 100%; }
        .dashboard-card-progress    { order: 9;  width: 100%; }
        .dashboard-card-recommended { order: 10; width: 100%; }

        /* ── Tablet Stacking Order (768px - 1023px) 2 columns ── */
        @media (min-width: 768px) and (max-width: 1023px) {
          .dashboard-bento-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .dashboard-card-greeting    { grid-column: span 2; order: 1; }
          .dashboard-card-family      { grid-column: span 2; order: 2; }
          .dashboard-card-meals       { grid-column: span 2; order: 3; }
          .dashboard-card-alerts      { grid-column: span 1; order: 4; }
          .dashboard-card-nutrition   { grid-column: span 1; order: 5; }
          .dashboard-card-grocery     { grid-column: span 1; order: 6; }
          .dashboard-card-tip         { grid-column: span 1; order: 7; }
          .dashboard-card-actions     { grid-column: span 1; order: 8; }
          .dashboard-card-progress    { grid-column: span 1; order: 9; }
          .dashboard-card-recommended { grid-column: span 2; order: 10; }
        }

        /* ── Desktop Bento Grid (1024px and up) 12 columns ── */
        @media (min-width: 1024px) {
          .dashboard-bento-grid {
            grid-template-columns: repeat(12, 1fr);
            gap: 24px;
          }
          /* Row 1: Greeting Header full 12 cols */
          .dashboard-card-greeting {
            grid-column: span 12;
            order: 1;
          }

          /* Row 2: Household Family Strip full 12 cols */
          .dashboard-card-family {
            grid-column: span 12;
            order: 2;
          }

          /* Row 3: Today's Meals (8 cols) + Nutrition Today (4 cols) = 12 cols */
          .dashboard-card-meals {
            grid-column: span 8;
            order: 3;
          }
          .dashboard-card-nutrition {
            grid-column: span 4;
            order: 4;
          }

          /* Row 4: Health Alerts (4 cols) + Grocery Snapshot (4 cols) + Tip of the Day (4 cols) = 12 cols */
          .dashboard-card-alerts {
            grid-column: span 4;
            order: 5;
          }
          .dashboard-card-grocery {
            grid-column: span 4;
            order: 6;
          }
          .dashboard-card-tip {
            grid-column: span 4;
            order: 7;
          }

          /* Row 5: Quick Actions (6 cols) + Progress Chart (6 cols) = 12 cols */
          .dashboard-card-actions {
            grid-column: span 6;
            order: 8;
          }
          .dashboard-card-progress {
            grid-column: span 6;
            order: 9;
          }

          /* Row 6: Recommended for You full 12 cols */
          .dashboard-card-recommended {
            grid-column: span 12;
            order: 10;
          }
        }

        /* Soft transitions respecting prefers-reduced-motion */
        @media (prefers-reduced-motion: no-preference) {
          .dashboard-bento-grid > div {
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }
      `}</style>
    </div>
  )
}
