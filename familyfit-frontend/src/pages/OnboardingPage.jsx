import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFamily } from '../context/FamilyContext'
import { addMember as apiAddMember } from '../api/family'
import MemberAvatar from '../components/MemberAvatar'

const HEALTH_CONDITION_OPTIONS = [
  'None',
  'Diabetes',
  'High Blood Pressure',
  'High Cholesterol',
  'Heart Disease',
  'Kidney Disease',
  'Thyroid',
]

const ALLERGY_OPTIONS = [
  'None',
  'Milk/Dairy',
  'Eggs',
  'Peanuts/Tree Nuts',
  'Seafood/Fish',
  'Soy',
  'Wheat/Gluten',
]

const DIET_PREFERENCES = [
  { id: 'NO_PREFERENCE', label: 'No Preference' },
  { id: 'NON_VEGETARIAN', label: 'Non-Vegetarian' },
  { id: 'VEGETARIAN', label: 'Vegetarian' },
  { id: 'EGGETARIAN', label: 'Eggetarian' },
  { id: 'VEGAN', label: 'Vegan' },
]

const FITNESS_GOALS = [
  { id: 'MAINTAIN_WEIGHT', label: 'Maintain Weight' },
  { id: 'WEIGHT_LOSS', label: 'Weight Loss' },
  { id: 'WEIGHT_GAIN', label: 'Weight Gain' },
  { id: 'MUSCLE_GAIN', label: 'Muscle Gain' },
  { id: 'MANAGE_CONDITION', label: 'Manage a Condition' },
]

const ACTIVITY_LEVELS = [
  { id: 'SEDENTARY', label: 'Sedentary (Little or no exercise)' },
  { id: 'LIGHTLY_ACTIVE', label: 'Lightly Active (1-3 days/week)' },
  { id: 'MODERATELY_ACTIVE', label: 'Moderately Active (3-5 days/week)' },
  { id: 'VERY_ACTIVE', label: 'Very Active (6-7 days/week)' },
]

const INITIAL_MEMBER_FORM = {
  name: '',
  role: 'PARENT',
  gender: 'FEMALE',
  age: 30,
  heightCm: 165,
  weightKg: 65,
  activityLevel: 'MODERATELY_ACTIVE',
  healthConditions: [],
  allergies: [],
  otherAllergy: '',
  dietPreference: 'NO_PREFERENCE',
  fitnessGoal: 'MAINTAIN_WEIGHT',
  likes: '',
  dislikes: '',

  // Demographic specific flags
  isPregnantOrBreastfeeding: false,
  hasChewingDifficulty: false,

  // Dynamic question states
  weaningIntolerance: false,
  weaningNotes: '',
  pediatricConcerns: false,
  pediatricNotes: '',
  ironDeficiency: false,
  rapidGrowth: false,
  menopauseSymptoms: false,
  familyHistoryDisease: false,
  longTermMedication: false,
}

export default function OnboardingPage() {
  const { user } = useAuth()
  const { family, addMemberToContext } = useFamily()
  const navigate = useNavigate()

  // Step state: 'welcome' | 'form' | 'summary'
  const [step, setStep] = useState('welcome')
  const [form, setForm] = useState(INITIAL_MEMBER_FORM)
  const [saving, setSaving] = useState(false)

  const familyName = family?.name || user?.familyName || 'Your Family'
  const membersAdded = family?.members || []

  const markOnboardingDone = () => {
    if (user?.familyId) {
      localStorage.setItem(`familyfit_onboarding_done_${user.familyId}`, 'true')
    }
    navigate('/')
  }

  const handleSkip = () => {
    markOnboardingDone()
  }

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCheck = (field, option) => {
    setForm((prev) => {
      let current = [...(prev[field] || [])]
      if (option === 'None') {
        current = current.includes('None') ? [] : ['None']
      } else {
        current = current.filter((item) => item !== 'None')
        if (current.includes(option)) {
          current = current.filter((item) => item !== option)
        } else {
          current.push(option)
        }
      }
      return { ...prev, [field]: current }
    })
  }

  const handleSaveMember = async (e) => {
    e.preventDefault()
    setSaving(true)

    // Parse allergies
    const finalAllergies = form.allergies.filter((a) => a !== 'None')
    if (form.otherAllergy.trim()) {
      form.otherAllergy
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((a) => {
          if (!finalAllergies.includes(a)) finalAllergies.push(a)
        })
    }

    const finalHealth = form.healthConditions.filter((h) => h !== 'None')

    // Demographic dietary flags
    const ageNum = Number(form.age)
    const isFemale = form.gender === 'FEMALE'
    const dietaryFlags = []

    if (ageNum >= 0 && ageNum <= 3 && form.weaningIntolerance) {
      dietaryFlags.push(
        form.weaningNotes.trim()
          ? `Weaning Intolerances: ${form.weaningNotes.trim()}`
          : 'Weaning Intolerances'
      )
    }
    if (ageNum >= 4 && ageNum <= 12 && form.pediatricConcerns) {
      dietaryFlags.push(
        form.pediatricNotes.trim()
          ? `Pediatric Concerns: ${form.pediatricNotes.trim()}`
          : 'Pediatric Concerns'
      )
    }
    if (ageNum >= 13 && ageNum <= 19) {
      if (isFemale && form.ironDeficiency) dietaryFlags.push('Iron-deficiency symptoms')
      if (form.rapidGrowth) dietaryFlags.push('Rapid growth / appetite changes')
    }
    if (ageNum >= 41 && ageNum <= 60) {
      if (isFemale && form.menopauseSymptoms) dietaryFlags.push('Menopause symptoms')
      if (form.familyHistoryDisease) dietaryFlags.push('Family history: heart/diabetes')
    }
    if (ageNum >= 60 && form.longTermMedication) {
      dietaryFlags.push('Diet-affecting long-term medication')
    }

    const payload = {
      name: form.name.trim(),
      role: form.role,
      gender: form.gender,
      age: ageNum,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      activityLevel: form.activityLevel,
      healthConditions: finalHealth,
      allergies: finalAllergies,
      dietPreference: form.dietPreference,
      fitnessGoal: form.fitnessGoal,
      likes: typeof form.likes === 'string' ? form.likes.split(',').map((s) => s.trim()).filter(Boolean) : form.likes,
      dislikes: typeof form.dislikes === 'string' ? form.dislikes.split(',').map((s) => s.trim()).filter(Boolean) : form.dislikes,
      isPregnantOrBreastfeeding: ageNum >= 20 && ageNum <= 40 && isFemale ? form.isPregnantOrBreastfeeding : false,
      hasChewingDifficulty: ageNum >= 60 ? form.hasChewingDifficulty : false,
      dietaryFlags,
    }

    try {
      // Persist to backend — use the authenticated family's ID from context
      const familyId = family?.id || user?.familyId || Number(localStorage.getItem('familyId'))
      if (!familyId) {
        throw new Error('No authenticated family account found. Please log in again.')
      }
      const res = await apiAddMember(familyId, payload)
      const saved = res?.data?.id ? res.data : { ...payload, id: Date.now() }
      addMemberToContext(saved)
      setForm(INITIAL_MEMBER_FORM)
      setStep('summary')
    } catch (err) {
      console.error('Onboarding: member save error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save family member to server. Please try again.'
      alert(`Error adding family member: ${errorMsg}`)
    } finally {
      setSaving(false)
    }
  }

  // Dynamic question visibility check
  const ageNum = Number(form.age)
  const isFemale = form.gender === 'FEMALE'
  const hasDynamicQuestions =
    (ageNum >= 0 && ageNum <= 3) ||
    (ageNum >= 4 && ageNum <= 12) ||
    (ageNum >= 13 && ageNum <= 19) ||
    (ageNum >= 20 && ageNum <= 40 && isFemale) ||
    (ageNum >= 41 && ageNum <= 60) ||
    ageNum >= 60

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        background: '#fcfaf7',
        fontFamily: "'Inter', sans-serif",
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: '0 0 40px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── STEP 1: WELCOME CARD ── */}
      {step === 'welcome' && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '32px 24px 40px',
            background: 'linear-gradient(180deg, #f3f8e8 0%, #fcfaf7 40%)',
          }}
        >
          {/* Top Hero Image Container */}
          <div>
            <div
              style={{
                width: '100%',
                height: 260,
                borderRadius: 28,
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 12px 30px rgba(94, 132, 4, 0.18)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 24,
                boxSizing: 'border-box',
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 16px',
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>🌿</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#2e5b12' }}>Welcome to Family Fit</span>
              </div>
            </div>

            {/* Headline & Subtext */}
            <div style={{ textAlign: 'center', padding: '0 8px' }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                Add Your Family
              </h1>
              <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                Let's personalize meal plans for everyone at home.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
            <button
              onClick={() => setStep('form')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(224, 72, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'transform 0.15s ease',
              }}
            >
              <span>👨‍👩‍👧‍👦</span>
              <span>Add Family Member</span>
            </button>

            <button
              onClick={handleSkip}
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: 'none',
                padding: '12px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline',
                textUnderlineOffset: 4,
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: ADD MEMBER FORM ── */}
      {step === 'form' && (
        <div style={{ padding: '24px 20px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#5e8404', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Onboarding Step 2
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '2px 0 0 0' }}>
                Add Family Member
              </h2>
            </div>
            {membersAdded.length > 0 && (
              <button
                type="button"
                onClick={() => setStep('summary')}
                style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#374151' }}
              >
                Back to Summary ({membersAdded.length})
              </button>
            )}
          </div>

          <form onSubmit={handleSaveMember} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Basic Info Box */}
            <div style={{ background: 'white', padding: 18, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#2e5b12', marginBottom: 14 }}>
                1. Basic Demographic Info
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                  Full Name / Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah or Alex"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1.5px solid #e5e7eb',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => handleFieldChange('role', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1.5px solid #e5e7eb', fontSize: 14, background: 'white' }}
                  >
                    <option value="PARENT">Parent</option>
                    <option value="CHILD">Child</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1.5px solid #e5e7eb', fontSize: 14, background: 'white' }}
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Age (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={form.age}
                    onChange={(e) => handleFieldChange('age', e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Height (cm)</label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={form.heightCm}
                    onChange={(e) => handleFieldChange('heightCm', e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="300"
                    value={form.weightKg}
                    onChange={(e) => handleFieldChange('weightKg', e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Activity Level</label>
                <select
                  value={form.activityLevel}
                  onChange={(e) => handleFieldChange('activityLevel', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1.5px solid #e5e7eb', fontSize: 13, background: 'white' }}
                >
                  {ACTIVITY_LEVELS.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DYNAMIC AGE & GENDER FOLLOW-UP QUESTIONS */}
            {hasDynamicQuestions && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #eef7e2 0%, #e2f0d9 100%)',
                  border: '1.5px solid #b8e086',
                  padding: 18,
                  borderRadius: 20,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13, color: '#2e5b12', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💡 Demographic Health Questions ({form.age} yrs • {form.gender})</span>
                </div>

                {/* Infants/Toddlers (0-3) */}
                {ageNum >= 0 && ageNum <= 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                      Any known food intolerances during weaning?
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('weaningIntolerance', true)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: form.weaningIntolerance ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.weaningIntolerance ? '#5e8404' : 'white', color: form.weaningIntolerance ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('weaningIntolerance', false)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: !form.weaningIntolerance ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.weaningIntolerance ? '#5e8404' : 'white', color: !form.weaningIntolerance ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                      >
                        No
                      </button>
                    </div>
                    {form.weaningIntolerance && (
                      <input
                        type="text"
                        placeholder="Specify intolerances (e.g. cow's milk, soy)"
                        value={form.weaningNotes}
                        onChange={(e) => handleFieldChange('weaningNotes', e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px solid #a3e635', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    )}
                  </div>
                )}

                {/* Children (4-12) */}
                {ageNum >= 4 && ageNum <= 12 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                      Any growth or nutrition concerns flagged by a pediatrician?
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('pediatricConcerns', true)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: form.pediatricConcerns ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.pediatricConcerns ? '#5e8404' : 'white', color: form.pediatricConcerns ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('pediatricConcerns', false)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: !form.pediatricConcerns ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.pediatricConcerns ? '#5e8404' : 'white', color: !form.pediatricConcerns ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                      >
                        No
                      </button>
                    </div>
                    {form.pediatricConcerns && (
                      <input
                        type="text"
                        placeholder="Specify pediatrician concerns (e.g. low iron, weight pick-up)"
                        value={form.pediatricNotes}
                        onChange={(e) => handleFieldChange('pediatricNotes', e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px solid #a3e635', fontSize: 13, boxSizing: 'border-box' }}
                      />
                    )}
                  </div>
                )}

                {/* Teens (13-19) */}
                {ageNum >= 13 && ageNum <= 19 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {isFemale && (
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                          Do you experience iron-deficiency symptoms (fatigue, dizziness)?
                        </label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('ironDeficiency', true)}
                            style={{ flex: 1, padding: '8px', borderRadius: 10, border: form.ironDeficiency ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.ironDeficiency ? '#5e8404' : 'white', color: form.ironDeficiency ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('ironDeficiency', false)}
                            style={{ flex: 1, padding: '8px', borderRadius: 10, border: !form.ironDeficiency ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.ironDeficiency ? '#5e8404' : 'white', color: !form.ironDeficiency ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                        Any concerns with rapid growth or appetite changes?
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('rapidGrowth', true)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: form.rapidGrowth ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.rapidGrowth ? '#5e8404' : 'white', color: form.rapidGrowth ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('rapidGrowth', false)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: !form.rapidGrowth ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.rapidGrowth ? '#5e8404' : 'white', color: !form.rapidGrowth ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Adults (20-40, Female) */}
                {ageNum >= 20 && ageNum <= 40 && isFemale && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                      Are you currently pregnant or breastfeeding?
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('isPregnantOrBreastfeeding', true)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: form.isPregnantOrBreastfeeding ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.isPregnantOrBreastfeeding ? '#5e8404' : 'white', color: form.isPregnantOrBreastfeeding ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('isPregnantOrBreastfeeding', false)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, border: !form.isPregnantOrBreastfeeding ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.isPregnantOrBreastfeeding ? '#5e8404' : 'white', color: !form.isPregnantOrBreastfeeding ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Midlife (41-60) */}
                {ageNum >= 41 && ageNum <= 60 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {isFemale && (
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                          Are you experiencing menopause-related symptoms?
                        </label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('menopauseSymptoms', true)}
                            style={{ flex: 1, padding: '8px', borderRadius: 10, border: form.menopauseSymptoms ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.menopauseSymptoms ? '#5e8404' : 'white', color: form.menopauseSymptoms ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('menopauseSymptoms', false)}
                            style={{ flex: 1, padding: '8px', borderRadius: 10, border: !form.menopauseSymptoms ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.menopauseSymptoms ? '#5e8404' : 'white', color: !form.menopauseSymptoms ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                        Family history of heart disease or diabetes?
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('familyHistoryDisease', true)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: form.familyHistoryDisease ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.familyHistoryDisease ? '#5e8404' : 'white', color: form.familyHistoryDisease ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('familyHistoryDisease', false)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: !form.familyHistoryDisease ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.familyHistoryDisease ? '#5e8404' : 'white', color: !form.familyHistoryDisease ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Older Adults (60+) */}
                {ageNum >= 60 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                        Any difficulty chewing or swallowing?
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('hasChewingDifficulty', true)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: form.hasChewingDifficulty ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.hasChewingDifficulty ? '#5e8404' : 'white', color: form.hasChewingDifficulty ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('hasChewingDifficulty', false)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: !form.hasChewingDifficulty ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.hasChewingDifficulty ? '#5e8404' : 'white', color: !form.hasChewingDifficulty ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 6 }}>
                        On long-term medication that affects diet?
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('longTermMedication', true)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: form.longTermMedication ? '2px solid #5e8404' : '1px solid #d1d5db', background: form.longTermMedication ? '#5e8404' : 'white', color: form.longTermMedication ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('longTermMedication', false)}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, border: !form.longTermMedication ? '2px solid #5e8404' : '1px solid #d1d5db', background: !form.longTermMedication ? '#5e8404' : 'white', color: !form.longTermMedication ? 'white' : '#374151', fontWeight: 700, cursor: 'pointer' }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Health Conditions */}
            <div style={{ background: 'white', padding: 18, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#2e5b12', marginBottom: 12 }}>
                2. Health Conditions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {HEALTH_CONDITION_OPTIONS.map((opt) => {
                  const checked = form.healthConditions.includes(opt)
                  return (
                    <label
                      key={opt}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        cursor: 'pointer',
                        background: checked ? '#e2f0d9' : '#f9fafb',
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: checked ? '1px solid #5e8404' : '1px solid #e5e7eb',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheck('healthConditions', opt)}
                        style={{ accentColor: '#2e5b12' }}
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Allergies & Restrictions */}
            <div style={{ background: 'white', padding: 18, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#dc2626', marginBottom: 12 }}>
                3. Allergies & Restrictions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {ALLERGY_OPTIONS.map((opt) => {
                  const checked = form.allergies.includes(opt)
                  return (
                    <label
                      key={opt}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        cursor: 'pointer',
                        background: checked ? '#fee2e2' : '#f9fafb',
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: checked ? '1px solid #fca5a5' : '1px solid #e5e7eb',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheck('allergies', opt)}
                        style={{ accentColor: '#dc2626' }}
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
                  Other Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sesame, Mustard, Sulfites"
                  value={form.otherAllergy}
                  onChange={(e) => handleFieldChange('otherAllergy', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Diet Preference & Goals */}
            <div style={{ background: 'white', padding: 18, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#2e5b12', marginBottom: 12 }}>
                4. Diet Preference & Goals
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Diet Preference</label>
                <select
                  value={form.dietPreference}
                  onChange={(e) => handleFieldChange('dietPreference', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1.5px solid #e5e7eb', fontSize: 13, background: 'white' }}
                >
                  {DIET_PREFERENCES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Fitness Goal</label>
                <select
                  value={form.fitnessGoal}
                  onChange={(e) => handleFieldChange('fitnessGoal', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1.5px solid #e5e7eb', fontSize: 13, background: 'white' }}
                >
                  {FITNESS_GOALS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Likes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Salmon, Quinoa"
                    value={form.likes}
                    onChange={(e) => handleFieldChange('likes', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>Dislikes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Tofu, Red Meat"
                    value={form.dislikes}
                    onChange={(e) => handleFieldChange('dislikes', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid #e5e7eb', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Save Member Submit */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(224, 72, 0, 0.35)',
              }}
            >
              {saving ? 'Saving...' : 'Save Family Member'}
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 3: SUMMARY SCREEN ── */}
      {step === 'summary' && (
        <div style={{ padding: '32px 24px 40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111827', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                {familyName}
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, fontWeight: 500 }}>
                {membersAdded.length} family member{membersAdded.length === 1 ? '' : 's'} added so far.
              </p>
            </div>

            {/* Added members list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {membersAdded.map((m) => {
                const allergies = Array.isArray(m.allergies) ? m.allergies : []
                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'white',
                      borderRadius: 20,
                      padding: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #f0ede8',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <MemberAvatar member={m} size={44} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginTop: 2 }}>
                          {m.role} • {m.age} yrs • {m.weightKg || '—'} kg
                        </div>
                      </div>
                    </div>

                    <div>
                      {allergies.length > 0 ? (
                        <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 12 }}>
                          ⚠️ {allergies.length} allerg{allergies.length === 1 ? 'y' : 'ies'}
                        </span>
                      ) : (
                        <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 12 }}>
                          ✔ Healthy
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons: Add Another & Done */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            <button
              onClick={() => setStep('form')}
              style={{
                width: '100%',
                background: 'white',
                color: '#2e5b12',
                border: '2px solid #2e5b12',
                padding: '14px',
                borderRadius: 18,
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>+</span>
              <span>Add Another Member</span>
            </button>

            <button
              onClick={markOnboardingDone}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ff5e14 0%, #e04800 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: 20,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(224, 72, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>Done (Go to App)</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
