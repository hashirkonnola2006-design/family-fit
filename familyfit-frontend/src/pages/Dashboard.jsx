import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import MemberModal from '../components/MemberModal'

// ── Dashboard Duolingo Components ──
import GreetingHeader from '../components/dashboard/GreetingHeader'
import FamilyStrip from '../components/dashboard/FamilyStrip'
import TodayMeals from '../components/dashboard/TodayMeals'
import HealthAlerts from '../components/dashboard/HealthAlerts'
import GrocerySnapshot from '../components/dashboard/GrocerySnapshot'
import TipOfTheDay from '../components/dashboard/TipOfTheDay'
import QuickActions from '../components/dashboard/QuickActions'
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
} from '../services/dashboardService'

// ── Lucide Icons ──
import { AlertCircle, RotateCw, CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { family, loading: familyLoading, error: familyError, refresh: refreshFamily } = useFamily()

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

  // ── Modals State ──
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [swapModalSlot, setSwapModalSlot] = useState(null)
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)

  // ── Toast Notification Feedback ──
  const [toastMessage, setToastMessage] = useState(null)
  const showToast = useCallback((msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }, [])

  // ── Member Edit / Add Handlers ──
  const handleSelectMember = useCallback((memberId) => {
    setSelectedMemberId(memberId)
  }, [])

  const handleEditMember = useCallback((member) => {
    setSelectedMemberId(member.id)
    setEditingMember(member)
    setIsMemberModalOpen(true)
  }, [])

  const handleAddMember = useCallback(() => {
    setEditingMember(null)
    setIsMemberModalOpen(true)
  }, [])

  const handleMemberSaved = useCallback(() => {
    showToast('Family member saved!')
    if (refreshFamily) refreshFamily()
  }, [refreshFamily, showToast])

  // ── Meal Plan Actions ──
  const handleToggleEaten = useCallback((slotKey, eaten) => {
    const updated = toggleMealEaten(selectedDayIndex, slotKey, eaten)
    if (updated) {
      setMealPlan({ ...updated })
      showToast(eaten ? `Marked ${slotKey} as eaten! Great streak!` : `Unmarked ${slotKey}`)
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
    const slot = 'dinner'
    const updated = swapMealDish(selectedDayIndex, slot, dish)
    if (updated) {
      setMealPlan({ ...updated })
      showToast(`Added ${dish.name} to today's dinner plan!`)
    }
  }, [selectedDayIndex, showToast])

  const handlePlanMealClick = useCallback(() => {
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
      <div className="w-full min-h-screen bg-[#F7F7F7] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1400px] mx-auto animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-40 w-full bg-white rounded-3xl mb-6 border-2 border-[#E5E5E5]" />
        {/* Family Strip Skeleton */}
        <div className="h-48 w-full bg-white rounded-3xl mb-6 border-2 border-[#E5E5E5]" />
        {/* Bento Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="h-44 bg-white rounded-3xl border-2 border-[#E5E5E5]" />
          <div className="h-44 bg-white rounded-3xl border-2 border-[#E5E5E5]" />
          <div className="h-44 bg-white rounded-3xl border-2 border-[#E5E5E5]" />
        </div>
      </div>
    )
  }

  // ── Error State with Retry ──
  if (familyError && members.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-6 bg-[#F7F7F7]">
        <div className="duo-card p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF4B4B]/15 text-[#FF4B4B] flex items-center justify-center mx-auto mb-4 font-black">
            <AlertCircle size={30} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black text-[#4B4B4B]">
            Unable to load family dashboard
          </h2>
          <p className="text-sm font-bold text-[#AFAFAF] mt-2 mb-6">
            {familyError || 'Please verify your network connection and try again.'}
          </p>
          <button
            onClick={() => refreshFamily && refreshFamily()}
            className="duo-btn duo-btn-primary w-full py-3 inline-flex items-center justify-center gap-2"
          >
            <RotateCw size={16} strokeWidth={3} />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="familyfit-dashboard w-full min-h-screen bg-[#F7F7F7] text-[#4B4B4B] pb-24 lg:pb-12 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#4B4B4B] text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xl border-2 border-white/20 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <div className="w-5 h-5 rounded-full bg-[#58CC02] flex items-center justify-center text-white">
            <CheckCircle2 size={13} strokeWidth={3} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
        {/* 1. GREETING BANNER */}
        <GreetingHeader
          familyName={familyName}
          onAddMember={handleAddMember}
          onPlanMeal={handlePlanMealClick}
        />

        {/* 2. "YOUR FAMILY" CARD */}
        <FamilyStrip
          members={members}
          selectedMemberId={selectedMemberId}
          onSelectMember={handleSelectMember}
          onEditMember={handleEditMember}
          onAddMember={handleAddMember}
        />

        {/* 3. ROW OF 3 SMALL CARDS (Allergy Shield, Grocery Snapshot, Tip of the Day) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <HealthAlerts
            familyMembers={members}
            mealPlan={mealPlan}
            onFixConflict={handleFixConflict}
          />
          <GrocerySnapshot />
          <TipOfTheDay selectedMember={selectedMember} />
        </div>

        {/* 4. TODAY'S MEAL PLAN */}
        <div id="today-meals-card" className="w-full">
          <TodayMeals
            mealPlan={mealPlan}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={setSelectedDayIndex}
            onToggleEaten={handleToggleEaten}
            onOpenSwap={handleOpenSwap}
            familyMembers={members}
          />
        </div>

        {/* 5. QUICK ACTIONS */}
        <div className="w-full">
          <QuickActions
            onPlanMeal={handlePlanMealClick}
            onOpenWeightLog={() => setIsWeightModalOpen(true)}
          />
        </div>

        {/* 6. RECOMMENDED FOR YOU */}
        <RecommendedRecipes onAddDishToPlan={handleAddDishToPlan} />

        {/* 7. DASHBOARD FOOTER */}
        <DashboardFooter />
      </main>

      {/* ── MODALS ── */}
      {isMemberModalOpen && (
        <MemberModal
          member={editingMember}
          onClose={() => {
            setIsMemberModalOpen(false)
            setEditingMember(null)
          }}
          onSaved={handleMemberSaved}
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
    </div>
  )
}
