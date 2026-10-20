import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  X,
  Plus,
  Minus,
  Check,
  Trash2,
  AlertCircle,
  Sparkles,
  Heart,
  Activity,
  Flame,
  Zap,
  Coffee,
  Shield,
  HelpCircle,
  Apple
} from 'lucide-react'
import { updateMember, addMember, deleteMember } from '../api/family'
import { useFamily } from '../context/FamilyContext'
import MemberAvatar from './MemberAvatar'
import { AVATAR_REGISTRY, AVATAR_KEYS, suggestAvatarKey } from '../config/avatars'

const ROLES = [
  { id: 'FATHER', label: 'Father' },
  { id: 'MOTHER', label: 'Mother' },
  { id: 'SON', label: 'Son' },
  { id: 'DAUGHTER', label: 'Daughter' },
  { id: 'GRANDFATHER', label: 'Grandfather' },
  { id: 'GRANDMOTHER', label: 'Grandmother' },
  { id: 'BABY', label: 'Baby' },
  { id: 'OTHER', label: 'Other' },
]

const GENDERS = [
  { id: 'MALE', label: 'Male' },
  { id: 'FEMALE', label: 'Female' },
  { id: 'OTHER', label: 'Other' },
]

const ACTIVITY_LEVELS = [
  {
    id: 'SEDENTARY',
    label: 'Sedentary',
    sub: 'Desk job, little or no exercise',
    icon: Coffee,
    factor: 1.2,
  },
  {
    id: 'LIGHTLY_ACTIVE',
    label: 'Lightly Active',
    sub: 'Light daily walks or exercise 1-3x/wk',
    icon: Zap,
    factor: 1.375,
  },
  {
    id: 'MODERATELY_ACTIVE',
    label: 'Moderately Active',
    sub: 'Regular movement or exercise 3-5x/wk',
    icon: Activity,
    factor: 1.55,
  },
  {
    id: 'VERY_ACTIVE',
    label: 'Very Active',
    sub: 'Intense exercise or athletic training 6-7x/wk',
    icon: Flame,
    factor: 1.725,
  },
]

const HEALTH_CONDITIONS = [
  { id: 'None', label: 'None', icon: Shield },
  { id: 'Diabetes', label: 'Diabetes', icon: Activity },
  { id: 'High Blood Pressure', label: 'High Blood Pressure', icon: Heart },
  { id: 'High Cholesterol', label: 'High Cholesterol', icon: AlertCircle },
  { id: 'Heart Disease', label: 'Heart Disease', icon: Heart },
  { id: 'Kidney Disease', label: 'Kidney Disease', icon: Shield },
  { id: 'Thyroid', label: 'Thyroid', icon: Sparkles },
]

const ALLERGIES = [
  { id: 'None', label: 'None' },
  { id: 'Milk/Dairy', label: 'Milk / Dairy' },
  { id: 'Eggs', label: 'Eggs' },
  { id: 'Peanuts/Tree Nuts', label: 'Peanuts / Nuts' },
  { id: 'Seafood/Fish', label: 'Seafood / Fish' },
  { id: 'Soy', label: 'Soy' },
  { id: 'Wheat/Gluten', label: 'Wheat / Gluten' },
]

const GOALS = [
  { id: 'MAINTAIN_WEIGHT', label: 'Maintain weight', sub: 'Balanced daily nourishment', delta: 0, color: '#58CC02' },
  { id: 'WEIGHT_LOSS', label: 'Lose weight', sub: 'Gentle caloric deficit', delta: -400, color: '#1CB0F6' },
  { id: 'MUSCLE_GAIN', label: 'Gain muscle', sub: 'Protein-focused strength', delta: 350, color: '#FF9600' },
  { id: 'LOW_SUGAR', label: 'Low sugar', sub: 'Low GI Kerala meals', delta: -150, color: '#CE82FF' },
  { id: 'GROW_HEALTHY', label: 'Grow healthy', sub: 'Optimal growth for kids', delta: 200, color: '#22C55E' },
  { id: 'HEART_CARE', label: 'Heart care', sub: 'Low sodium, heart-healthy', delta: 0, color: '#FF4B4B' },
]

const DIET_PREFS = [
  { id: 'NO_PREFERENCE', label: 'All Foods' },
  { id: 'NON_VEGETARIAN', label: 'Non-Veg' },
  { id: 'VEGETARIAN', label: 'Vegetarian' },
  { id: 'EGGETARIAN', label: 'Eggetarian' },
]

const STEPS = [
  { id: 1, title: 'Basics' },
  { id: 2, title: 'Health' },
  { id: 3, title: 'Allergies' },
  { id: 4, title: 'Goals' },
]

export default function MemberModal({ member, onClose, onSaved }) {
  const { family, addMemberToContext, updateMemberInContext, deleteMemberFromContext, setActiveMember } = useFamily()
  const isEdit = Boolean(member && (member.id || member._id))

  const [step, setStep] = useState(1)
  const [isDirty, setIsDirty] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Form state
  const [name, setName] = useState(member?.name || '')
  const [role, setRole] = useState(member?.role || 'FATHER')
  const [gender, setGender] = useState(member?.gender || 'MALE')
  const [age, setAge] = useState(Number(member?.age) || 32)
  const [heightCm, setHeightCm] = useState(Number(member?.heightCm) || 168)
  const [weightKg, setWeightKg] = useState(Number(member?.weightKg) || 68)
  const [activityLevel, setActivityLevel] = useState(member?.activityLevel || 'MODERATELY_ACTIVE')
  const [isPregnantOrBreastfeeding, setIsPregnantOrBreastfeeding] = useState(Boolean(member?.isPregnantOrBreastfeeding))
  
  // Custom or auto avatar
  const [avatarKey, setAvatarKey] = useState(() => {
    return member?.avatarKey || suggestAvatarKey(member?.role || 'FATHER', member?.gender || 'MALE', member?.age || 32)
  })
  const [avatarOverridden, setAvatarOverridden] = useState(Boolean(member?.avatarKey))

  // Health and Allergies
  const [healthConditions, setHealthConditions] = useState(member?.healthConditions || ['None'])
  const [allergies, setAllergies] = useState(member?.allergies || ['None'])
  const [otherAllergyText, setOtherAllergyText] = useState('')
  const [showOtherAllergyInput, setShowOtherAllergyInput] = useState(false)

  // Goal and Preferences
  const [fitnessGoal, setFitnessGoal] = useState(member?.fitnessGoal || 'MAINTAIN_WEIGHT')
  const [dietPreference, setDietPreference] = useState(member?.dietPreference || 'NO_PREFERENCE')
  const [dislikes, setDislikes] = useState(
    Array.isArray(member?.dislikes) ? member.dislikes.join(', ') : (member?.dislikes || '')
  )

  // Auto-suggest avatar when role/gender/age change if user hasn't explicitly clicked a custom avatar
  useEffect(() => {
    if (!avatarOverridden) {
      setAvatarKey(suggestAvatarKey(role, gender, age))
    }
  }, [role, gender, age, avatarOverridden])

  // Track user edits for unsaved-changes alert
  const markDirty = () => setIsDirty(true)

  // Computed live Calorie Target (Mifflin-St Jeor Formula)
  const computedCalories = useMemo(() => {
    const w = Number(weightKg) || 65
    const h = Number(heightCm) || 165
    const a = Number(age) || 30
    let bmr = 10 * w + 6.25 * h - 5 * a
    if (gender === 'MALE') bmr += 5
    else if (gender === 'FEMALE') bmr -= 161
    else bmr -= 78

    const activity = ACTIVITY_LEVELS.find((al) => al.id === activityLevel) || ACTIVITY_LEVELS[2]
    const tdee = bmr * activity.factor
    const goal = GOALS.find((g) => g.id === fitnessGoal) || GOALS[0]
    let target = Math.round(tdee + goal.delta)

    if (a < 5) target = Math.max(900, target)
    else target = Math.max(1200, target)
    return target
  }, [weightKg, heightCm, age, gender, activityLevel, fitnessGoal])

  // Member object mock for live avatar preview
  const liveMemberPreview = useMemo(() => ({
    name: name || 'Preview',
    role,
    gender,
    age,
    avatarKey,
  }), [name, role, gender, age, avatarKey])

  // Validation
  const validateForm = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required.'
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'

    const numAge = Number(age)
    if (isNaN(numAge) || numAge < 0 || numAge > 120) {
      errs.age = 'Age must be between 0 and 120.'
    }

    const numH = Number(heightCm)
    if (isNaN(numH) || numH < 30 || numH > 250) {
      errs.height = 'Height must be between 30 and 250 cm.'
    }

    const numW = Number(weightKg)
    if (isNaN(numW) || numW < 2 || numW > 300) {
      errs.weight = 'Weight must be between 2 and 300 kg.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Handle Close with dirty check
  const handleAttemptClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Discard and exit?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  // Keyboard navigation / escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleAttemptClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDirty])

  // Health conditions toggle (Exclusive None logic)
  const toggleCondition = (condId) => {
    markDirty()
    if (condId === 'None') {
      setHealthConditions(['None'])
      return
    }
    setHealthConditions((prev) => {
      const withoutNone = prev.filter((c) => c !== 'None')
      if (withoutNone.includes(condId)) {
        const next = withoutNone.filter((c) => c !== condId)
        return next.length === 0 ? ['None'] : next
      } else {
        return [...withoutNone, condId]
      }
    })
  }

  // Allergy toggle (Exclusive None logic)
  const toggleAllergy = (allergyId) => {
    markDirty()
    if (allergyId === 'None') {
      setAllergies(['None'])
      return
    }
    setAllergies((prev) => {
      const withoutNone = prev.filter((a) => a !== 'None')
      if (withoutNone.includes(allergyId)) {
        const next = withoutNone.filter((a) => a !== allergyId)
        return next.length === 0 ? ['None'] : next
      } else {
        return [...withoutNone, allergyId]
      }
    })
  }

  const handleAddOtherAllergy = () => {
    const trimmed = otherAllergyText.trim()
    if (!trimmed) return
    markDirty()
    setAllergies((prev) => {
      const withoutNone = prev.filter((a) => a !== 'None')
      return withoutNone.includes(trimmed) ? withoutNone : [...withoutNone, trimmed]
    })
    setOtherAllergyText('')
    setShowOtherAllergyInput(false)
  }

  // Save member
  const handleSave = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      setStep(1)
      return
    }

    setLoading(true)
    const cleanedDislikes = dislikes
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)

    const avatarTheme = AVATAR_REGISTRY[avatarKey] || AVATAR_REGISTRY.other

    const payload = {
      ...(member || {}),
      id: member?.id || member?._id || Date.now(),
      name: name.trim(),
      role,
      gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      activityLevel,
      isPregnantOrBreastfeeding: gender === 'FEMALE' && Number(age) >= 15 ? isPregnantOrBreastfeeding : false,
      avatarKey,
      themeColor: avatarTheme.themeColor,
      healthConditions: healthConditions.includes('None') && healthConditions.length === 1 ? [] : healthConditions,
      allergies: allergies.includes('None') && allergies.length === 1 ? [] : allergies,
      fitnessGoal,
      dietPreference,
      dislikes: cleanedDislikes,
      calorieTarget: computedCalories,
    }

    try {
      if (isEdit) {
        updateMemberInContext(payload)
        setActiveMember(payload)
        await updateMember(payload.id, payload).catch((err) => {
          console.warn('Backend update failed, saved locally:', err.message)
        })
      } else {
        const familyId = family?.id || 1
        addMemberToContext(payload)
        setActiveMember(payload)
        await addMember(familyId, payload).catch((err) => {
          console.warn('Backend add failed, saved locally:', err.message)
        })
      }

      if (onSaved) onSaved(payload)
      onClose()
    } catch (err) {
      console.error('Save member error:', err)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  // Delete member
  const handleDelete = async () => {
    if (!member?.id) return
    setLoading(true)
    try {
      deleteMemberFromContext(member.id)
      await deleteMember(member.id).catch(() => {})
      onClose()
    } catch (err) {
      console.error('Delete member error:', err)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const isFemaleAge15Plus = gender === 'FEMALE' && Number(age) >= 15

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
      className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleAttemptClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 border-b-[#D8D8D8] shadow-2xl flex flex-col overflow-hidden font-['Nunito',sans-serif] text-[#4B4B4B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── STICKY HEADER ── */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b-2 border-[#E5E5E5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Live Avatar Preview */}
            <div className="relative group">
              <MemberAvatar
                member={liveMemberPreview}
                size={58}
                showBorder
                className="shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#58CC02] border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black">
                ✓
              </span>
            </div>

            <div>
              <h2 id="member-modal-title" className="text-xl sm:text-2xl font-black text-[#1F2A24] tracking-tight">
                {isEdit ? `Edit ${member?.name || 'Member'}` : 'Add Family Member'}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#777777]">
                {STEPS.find((s) => s.id === step)?.title} &bull; Step {step} of 4
              </p>
            </div>
          </div>

          <button
            onClick={handleAttemptClose}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 text-[#777777] hover:text-[#1F2A24] flex items-center justify-center font-black transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── PROGRESS STEPPER ── */}
        <div className="px-6 pt-3 pb-2 bg-[#FAFAF8] border-b border-[#EBEBEB] shrink-0">
          {/* 16px Chunky Progress Bar with Glossy Highlight */}
          <div className="duo-progress-track mb-3">
            <div
              className="duo-progress-fill bg-[#58CC02]"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {STEPS.map((s) => {
              const isCurrent = step === s.id
              const isComplete = step > s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`py-2 px-1 text-center font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#58CC02] text-white shadow-sm'
                      : isComplete
                      ? 'bg-[#EAF9DE] text-[#58A700] hover:bg-[#DCF5CA]'
                      : 'bg-white text-[#8A8A8A] hover:bg-[#F5F5F5] border border-[#E5E5E5]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black bg-black/10">
                    {isComplete ? '✓' : s.id}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── SCROLLABLE MODAL BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* ════════ STEP 1: BASICS ════════ */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Avatar Selector Carousel */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-2.5">
                  Choose Character Bust
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {AVATAR_KEYS.map((key) => {
                    const isSelected = avatarKey === key
                    const meta = AVATAR_REGISTRY[key]
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setAvatarKey(key)
                          setAvatarOverridden(true)
                          markDirty()
                        }}
                        className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all cursor-pointer shrink-0 ${
                          isSelected
                            ? 'border-[#58CC02] border-b-4 border-b-[#58A700] bg-[#EAF9DE] scale-105 shadow-sm'
                            : 'border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] bg-white hover:bg-[#F9F9F9]'
                        }`}
                        style={{ width: '84px' }}
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-white mb-1.5 shadow-xs">
                          <img src={meta.src} alt={meta.label} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-[11px] font-extrabold text-center leading-tight ${isSelected ? 'text-[#3E7D00]' : 'text-[#666666]'}`}>
                          {meta.label.split('/')[0]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Full Name Input */}
              <div>
                <label htmlFor="member-name-input" className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-1.5">
                  Full Name <span className="text-[#FF4B4B]">*</span>
                </label>
                <input
                  id="member-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    markDirty()
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. Anand, Meera, Priya"
                  className={`w-full h-12 px-4 rounded-xl border-2 text-base font-bold bg-[#FAF9F5] focus:bg-white outline-none transition-all ${
                    errors.name
                      ? 'border-[#FF4B4B] ring-2 ring-[#FF4B4B]/20'
                      : 'border-[#E5E5E5] focus:border-[#58CC02] focus:ring-4 focus:ring-[#58CC02]/20'
                  }`}
                />
                {errors.name && (
                  <p role="alert" className="mt-1 text-xs font-bold text-[#FF4B4B] flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Role Chip Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-2">
                  Family Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => {
                    const isSelected = role === r.id
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRole(r.id)
                          markDirty()
                        }}
                        className={`duo-chip ${
                          isSelected
                            ? 'bg-[#58CC02] border-[#58A700] text-white shadow-xs'
                            : 'bg-white border-[#E5E5E5] border-b-[#D0D0D0] text-[#4B4B4B] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        {r.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Gender Segmented Control */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F0F0F0] rounded-2xl border-2 border-[#E5E5E5]">
                  {GENDERS.map((g) => {
                    const isSelected = gender === g.id
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setGender(g.id)
                          markDirty()
                        }}
                        className={`py-2 text-center text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-[#1F2A24] shadow-xs border-2 border-[#E5E5E5] border-b-4 border-b-[#CCCCCC]'
                            : 'text-[#777777] hover:text-[#1F2A24]'
                        }`}
                      >
                        {g.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Age, Height, Weight Stepper Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Age */}
                <div className="p-3.5 bg-[#FAFAF8] rounded-2xl border-2 border-[#E5E5E5]">
                  <label htmlFor="member-age-input" className="block text-[11px] font-black uppercase tracking-wider text-[#777777] mb-1">
                    Age (Years)
                  </label>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => { setAge((a) => Math.max(0, a - 1)); markDirty() }}
                      className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] active:translate-y-[1px] active:border-b-2 font-black flex items-center justify-center text-[#58CC02] cursor-pointer"
                    >
                      <Minus size={15} />
                    </button>
                    <input
                      id="member-age-input"
                      type="number"
                      value={age}
                      onChange={(e) => { setAge(Math.max(0, parseInt(e.target.value) || 0)); markDirty() }}
                      className="w-16 text-center text-lg font-black bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => { setAge((a) => Math.min(120, a + 1)); markDirty() }}
                      className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] active:translate-y-[1px] active:border-b-2 font-black flex items-center justify-center text-[#58CC02] cursor-pointer"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  {errors.age && <p className="text-[10px] text-[#FF4B4B] mt-1 font-bold">{errors.age}</p>}
                </div>

                {/* Height */}
                <div className="p-3.5 bg-[#FAFAF8] rounded-2xl border-2 border-[#E5E5E5]">
                  <label htmlFor="member-height-input" className="block text-[11px] font-black uppercase tracking-wider text-[#777777] mb-1">
                    Height (cm)
                  </label>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => { setHeightCm((h) => Math.max(30, h - 1)); markDirty() }}
                      className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] active:translate-y-[1px] active:border-b-2 font-black flex items-center justify-center text-[#1CB0F6] cursor-pointer"
                    >
                      <Minus size={15} />
                    </button>
                    <input
                      id="member-height-input"
                      type="number"
                      value={heightCm}
                      onChange={(e) => { setHeightCm(parseInt(e.target.value) || 160); markDirty() }}
                      className="w-16 text-center text-lg font-black bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => { setHeightCm((h) => Math.min(250, h + 1)); markDirty() }}
                      className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] active:translate-y-[1px] active:border-b-2 font-black flex items-center justify-center text-[#1CB0F6] cursor-pointer"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  {errors.height && <p className="text-[10px] text-[#FF4B4B] mt-1 font-bold">{errors.height}</p>}
                </div>

                {/* Weight */}
                <div className="p-3.5 bg-[#FAFAF8] rounded-2xl border-2 border-[#E5E5E5]">
                  <label htmlFor="member-weight-input" className="block text-[11px] font-black uppercase tracking-wider text-[#777777] mb-1">
                    Weight (kg)
                  </label>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => { setWeightKg((w) => Math.max(2, w - 1)); markDirty() }}
                      className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] active:translate-y-[1px] active:border-b-2 font-black flex items-center justify-center text-[#FF9600] cursor-pointer"
                    >
                      <Minus size={15} />
                    </button>
                    <input
                      id="member-weight-input"
                      type="number"
                      value={weightKg}
                      onChange={(e) => { setWeightKg(parseInt(e.target.value) || 60); markDirty() }}
                      className="w-16 text-center text-lg font-black bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => { setWeightKg((w) => Math.min(300, w + 1)); markDirty() }}
                      className="w-9 h-9 rounded-xl bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#D0D0D0] active:translate-y-[1px] active:border-b-2 font-black flex items-center justify-center text-[#FF9600] cursor-pointer"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  {errors.weight && <p className="text-[10px] text-[#FF4B4B] mt-1 font-bold">{errors.weight}</p>}
                </div>
              </div>

              {/* Activity Level Cards */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-2.5">
                  Daily Physical Activity Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTIVITY_LEVELS.map((lvl) => {
                    const isSelected = activityLevel === lvl.id
                    const Icon = lvl.icon
                    return (
                      <div
                        key={lvl.id}
                        onClick={() => { setActivityLevel(lvl.id); markDirty() }}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-[#58CC02] border-b-4 border-b-[#58A700] bg-[#EAF9DE]'
                            : 'border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] bg-white hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#58CC02] text-white' : 'bg-[#F0F0F0] text-[#777777]'
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-[#1F2A24]">{lvl.label}</div>
                          <div className="text-xs font-semibold text-[#777777]">{lvl.sub}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pregnant/Breastfeeding Toggle (Female 15+ only) */}
              {isFemaleAge15Plus && (
                <div className="p-4 bg-[#FDF2F8] rounded-2xl border-2 border-[#FBCFE8] border-b-4 border-b-[#F472B6] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-[#9D174D]">Currently Pregnant or Breastfeeding?</div>
                    <div className="text-xs text-[#BE185D]">Enables Kerala post-partum &amp; lactating nourishment rules.</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setIsPregnantOrBreastfeeding(true); markDirty() }}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 transition-all cursor-pointer ${
                        isPregnantOrBreastfeeding
                          ? 'bg-[#DB2777] text-white border-[#BE185D] border-b-4 border-b-[#9D174D]'
                          : 'bg-white text-[#9D174D] border-[#FBCFE8]'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsPregnantOrBreastfeeding(false); markDirty() }}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 transition-all cursor-pointer ${
                        !isPregnantOrBreastfeeding
                          ? 'bg-white text-[#4B4B4B] border-[#D0D0D0] border-b-4 border-b-[#AFAFAF]'
                          : 'bg-white text-[#9D174D] border-[#FBCFE8]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════ STEP 2: HEALTH CONDITIONS ════════ */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] border-b-4 border-b-[#93C5FD] p-4 rounded-2xl">
                <h4 className="text-sm font-extrabold text-[#1E40AF] flex items-center gap-1.5">
                  <Shield size={16} />
                  Personalized Health Safeguards
                </h4>
                <p className="text-xs text-[#3B82F6] font-semibold mt-0.5">
                  Select any diagnosed medical conditions. FamilyFit will dynamically adjust sodium, carbs, and cholesterol rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {HEALTH_CONDITIONS.map((cond) => {
                  const isSelected = healthConditions.includes(cond.id)
                  const Icon = cond.icon
                  const isNone = cond.id === 'None'

                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => toggleCondition(cond.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                        isSelected
                          ? isNone
                            ? 'bg-[#EAF9DE] border-[#58CC02] border-b-4 border-b-[#58A700] text-[#1F2A24]'
                            : 'bg-[#FEF3C7] border-[#F59E0B] border-b-4 border-b-[#D97706] text-[#78350F]'
                          : 'bg-white border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] text-[#4B4B4B] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? isNone
                                ? 'bg-[#58CC02] text-white'
                                : 'bg-[#F59E0B] text-white'
                              : 'bg-[#F0F0F0] text-[#777777]'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="text-sm font-extrabold">{cond.label}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                          isSelected
                            ? isNone
                              ? 'bg-[#58CC02] border-[#58A700] text-white'
                              : 'bg-[#F59E0B] border-[#D97706] text-white'
                            : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ════════ STEP 3: ALLERGIES ════════ */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#FEF2F2] border-2 border-[#FECACA] border-b-4 border-b-[#F87171] p-4 rounded-2xl">
                <h4 className="text-sm font-extrabold text-[#991B1B] flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  Household Allergy Screening
                </h4>
                <p className="text-xs text-[#DC2626] font-semibold mt-0.5">
                  Any conflicting ingredients will be prominently marked in red and excluded from daily meal suggestions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ALLERGIES.map((alg) => {
                  const isSelected = allergies.includes(alg.id)
                  const isNone = alg.id === 'None'

                  return (
                    <button
                      key={alg.id}
                      type="button"
                      onClick={() => toggleAllergy(alg.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-left ${
                        isSelected
                          ? isNone
                            ? 'bg-[#EAF9DE] border-[#58CC02] border-b-4 border-b-[#58A700] text-[#1F2A24]'
                            : 'bg-[#FEE2E2] border-[#EF4444] border-b-4 border-b-[#DC2626] text-[#991B1B]'
                          : 'bg-white border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] text-[#4B4B4B] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? isNone
                                ? 'bg-[#58CC02] text-white'
                                : 'bg-[#EF4444] text-white'
                              : 'bg-[#F0F0F0] text-[#777777]'
                          }`}
                        >
                          <AlertCircle size={17} />
                        </div>
                        <span className="text-sm font-extrabold">{alg.label}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                          isSelected
                            ? isNone
                              ? 'bg-[#58CC02] border-[#58A700] text-white'
                              : 'bg-[#EF4444] border-[#DC2626] text-white'
                            : 'border-[#CCCCCC] bg-white'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Custom Other Allergies List & Input */}
              <div className="pt-2">
                {allergies.filter((a) => a !== 'None' && !ALLERGIES.some((item) => item.id === a)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {allergies
                      .filter((a) => a !== 'None' && !ALLERGIES.some((item) => item.id === a))
                      .map((custom) => (
                        <span
                          key={custom}
                          className="px-3 py-1.5 rounded-xl bg-[#FEE2E2] border border-[#EF4444] text-[#991B1B] text-xs font-black flex items-center gap-2"
                        >
                          {custom}
                          <button
                            type="button"
                            onClick={() => toggleAllergy(custom)}
                            className="hover:text-red-900 cursor-pointer font-bold"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                  </div>
                )}

                {showOtherAllergyInput ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otherAllergyText}
                      onChange={(e) => setOtherAllergyText(e.target.value)}
                      placeholder="e.g. Sesame, Mustard, Brinjal"
                      className="flex-1 h-11 px-3 rounded-xl border-2 border-[#E5E5E5] focus:border-[#58CC02] outline-none text-sm font-bold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddOtherAllergy()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddOtherAllergy}
                      className="duo-btn duo-btn-primary px-4 py-2 text-xs"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOtherAllergyInput(false)}
                      className="duo-btn duo-btn-secondary px-3 py-2 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowOtherAllergyInput(true)}
                    className="duo-chip bg-white border-[#E5E5E5] border-b-[#CCCCCC] text-[#58CC02] hover:bg-[#F9F9F9]"
                  >
                    <Plus size={14} />
                    <span>Add other allergy / intolerance</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ════════ STEP 4: GOAL & PREFERENCES ════════ */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Computed Calorie Target Banner */}
              <div className="p-4 bg-[#F0FDF4] border-2 border-[#86EFAC] border-b-4 border-b-[#4ADE80] rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center font-black text-xl shadow-xs">
                    🔥
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#166534]">
                      Computed Calorie Target
                    </span>
                    <div className="text-2xl font-black text-[#14532D]">
                      {computedCalories} <span className="text-sm font-bold text-[#166534]">kcal / day</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#166534] bg-white px-3 py-1.5 rounded-xl border border-[#BBF7D0]">
                  Based on {age} yrs &bull; {heightCm} cm &bull; {weightKg} kg
                </div>
              </div>

              {/* Goal Cards */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-2.5">
                  Nutritional Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOALS.map((g) => {
                    const isSelected = fitnessGoal === g.id
                    return (
                      <div
                        key={g.id}
                        onClick={() => { setFitnessGoal(g.id); markDirty() }}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#58CC02] border-b-4 border-b-[#58A700] bg-[#EAF9DE]'
                            : 'border-[#E5E5E5] border-b-4 border-b-[#D8D8D8] bg-white hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-extrabold text-[#1F2A24]">{g.label}</div>
                          <div className="text-xs font-semibold text-[#777777]">{g.sub}</div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                            isSelected ? 'bg-[#58CC02] border-[#58A700] text-white' : 'border-[#CCCCCC] bg-white'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Dietary Preference Chips */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-2">
                  Dietary Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIET_PREFS.map((dp) => {
                    const isSelected = dietPreference === dp.id
                    return (
                      <button
                        key={dp.id}
                        type="button"
                        onClick={() => { setDietPreference(dp.id); markDirty() }}
                        className={`duo-chip ${
                          isSelected
                            ? 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-xs'
                            : 'bg-white border-[#E5E5E5] border-b-[#D0D0D0] text-[#4B4B4B] hover:bg-[#F7F7F7]'
                        }`}
                      >
                        {dp.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Food Dislikes */}
              <div>
                <label htmlFor="member-dislikes-input" className="block text-xs font-black uppercase tracking-wider text-[#777777] mb-1.5">
                  Food Dislikes (Comma-separated)
                </label>
                <input
                  id="member-dislikes-input"
                  type="text"
                  value={dislikes}
                  onChange={(e) => { setDislikes(e.target.value); markDirty() }}
                  placeholder="e.g. Bitter gourd (Pavakka), Snake gourd, Okra"
                  className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E5E5E5] focus:border-[#58CC02] focus:ring-4 focus:ring-[#58CC02]/20 outline-none text-sm font-bold bg-[#FAF9F5] focus:bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── STICKY FOOTER WITH 3D BUTTONS ── */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t-2 border-[#E5E5E5] flex items-center justify-between shrink-0 flex-wrap gap-3">
          <div>
            {isEdit && !showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="duo-btn duo-btn-danger text-xs px-3.5 py-2.5"
              >
                <Trash2 size={15} />
                <span>Remove</span>
              </button>
            )}

            {isEdit && showDeleteConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#DC2626]">Sure?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="duo-btn duo-btn-danger text-xs px-3 py-1.5"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="duo-btn duo-btn-secondary text-xs px-2.5 py-1.5"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="duo-btn duo-btn-secondary text-xs px-4 py-2.5"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !validateForm()) return
                  setStep((s) => Math.min(4, s + 1))
                }}
                className="duo-btn duo-btn-primary px-6 py-2.5"
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || (name.trim().length === 0)}
                className="duo-btn duo-btn-primary px-8 py-2.5"
              >
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Member'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
