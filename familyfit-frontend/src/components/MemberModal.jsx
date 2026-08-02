import { useState, useEffect } from 'react'
import { updateMember, addMember, deleteMember } from '../api/family'
import { useFamily } from '../context/FamilyContext'

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

const GENDERS = [
  { id: 'MALE', label: 'Male' },
  { id: 'FEMALE', label: 'Female' },
  { id: 'OTHER', label: 'Other' },
]

export default function MemberModal({ member, onClose }) {
  const { family, refresh, addMemberToContext, updateMemberInContext, deleteMemberFromContext } = useFamily()
  const isEdit = Boolean(member && member.id)

  const [form, setForm] = useState({
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

    // Dynamic question state
    weaningIntolerance: false,
    weaningNotes: '',
    pediatricConcerns: false,
    pediatricNotes: '',
    ironDeficiency: false,
    rapidGrowth: false,
    menopauseSymptoms: false,
    familyHistoryDisease: false,
    longTermMedication: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (member) {
      const existingAllergies = member.allergies || []
      const knownAllergies = existingAllergies.filter((a) => ALLERGY_OPTIONS.includes(a))
      const otherAllergies = existingAllergies.filter((a) => !ALLERGY_OPTIONS.includes(a)).join(', ')
      const flags = member.dietaryFlags || []

      const weaningFlag = flags.find((f) => f.startsWith('Weaning Intolerances'))
      const pediaFlag = flags.find((f) => f.startsWith('Pediatric Concerns'))

      setForm({
        name: member.name || '',
        role: member.role || 'PARENT',
        gender: member.gender || 'FEMALE',
        age: member.age ?? 30,
        heightCm: member.heightCm || 165,
        weightKg: member.weightKg || 65,
        activityLevel: member.activityLevel || 'MODERATELY_ACTIVE',
        healthConditions: member.healthConditions || [],
        allergies: knownAllergies,
        otherAllergy: otherAllergies,
        dietPreference: member.dietPreference || 'NO_PREFERENCE',
        fitnessGoal: member.fitnessGoal || 'MAINTAIN_WEIGHT',
        likes: Array.isArray(member.likes) ? member.likes.join(', ') : (member.likes || ''),
        dislikes: Array.isArray(member.dislikes) ? member.dislikes.join(', ') : (member.dislikes || ''),

        isPregnantOrBreastfeeding: Boolean(member.isPregnantOrBreastfeeding),
        hasChewingDifficulty: Boolean(member.hasChewingDifficulty),

        weaningIntolerance: Boolean(weaningFlag),
        weaningNotes: weaningFlag ? weaningFlag.replace('Weaning Intolerances: ', '').trim() : '',
        pediatricConcerns: Boolean(pediaFlag),
        pediatricNotes: pediaFlag ? pediaFlag.replace('Pediatric Concerns: ', '').trim() : '',
        ironDeficiency: flags.includes('Iron-deficiency symptoms'),
        rapidGrowth: flags.includes('Rapid growth / appetite changes'),
        menopauseSymptoms: flags.includes('Menopause symptoms'),
        familyHistoryDisease: flags.includes('Family history: heart/diabetes'),
        longTermMedication: flags.includes('Diet-affecting long-term medication'),
      })
    }
  }, [member])

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const toggleCheck = (field, option) => {
    setForm((f) => {
      let current = [...(f[field] || [])]
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
      return { ...f, [field]: current }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Combine standard allergies and free text other allergy
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

    // Build dynamic dietary flags based on age & gender bracket
    const age = Number(form.age)
    const isFemale = form.gender === 'FEMALE'
    const dietaryFlags = []

    if (age >= 0 && age <= 3 && form.weaningIntolerance) {
      dietaryFlags.push(
        form.weaningNotes.trim()
          ? `Weaning Intolerances: ${form.weaningNotes.trim()}`
          : 'Weaning Intolerances'
      )
    }
    if (age >= 4 && age <= 12 && form.pediatricConcerns) {
      dietaryFlags.push(
        form.pediatricNotes.trim()
          ? `Pediatric Concerns: ${form.pediatricNotes.trim()}`
          : 'Pediatric Concerns'
      )
    }
    if (age >= 13 && age <= 19) {
      if (isFemale && form.ironDeficiency) dietaryFlags.push('Iron-deficiency symptoms')
      if (form.rapidGrowth) dietaryFlags.push('Rapid growth / appetite changes')
    }
    if (age >= 41 && age <= 60) {
      if (isFemale && form.menopauseSymptoms) dietaryFlags.push('Menopause symptoms')
      if (form.familyHistoryDisease) dietaryFlags.push('Family history: heart/diabetes')
    }
    if (age >= 60 && form.longTermMedication) {
      dietaryFlags.push('Diet-affecting long-term medication')
    }

    const payload = {
      name: form.name,
      role: form.role,
      gender: form.gender,
      age,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      activityLevel: form.activityLevel,
      healthConditions: finalHealth,
      allergies: finalAllergies,
      dietPreference: form.dietPreference,
      fitnessGoal: form.fitnessGoal,
      likes: typeof form.likes === 'string' ? form.likes.split(',').map(s => s.trim()).filter(Boolean) : form.likes,
      dislikes: typeof form.dislikes === 'string' ? form.dislikes.split(',').map(s => s.trim()).filter(Boolean) : form.dislikes,

      // Bracket specific fields
      isPregnantOrBreastfeeding: age >= 20 && age <= 40 && isFemale ? form.isPregnantOrBreastfeeding : false,
      hasChewingDifficulty: age >= 60 ? form.hasChewingDifficulty : false,
      dietaryFlags,
    }

    try {
      if (isEdit) {
        await updateMember(member.id, payload).catch((err) => console.warn('API updateMember failed, using local:', err))
        updateMemberInContext({ ...payload, id: member.id })
      } else {
        const familyId = family?.id || Number(localStorage.getItem('familyId')) || 1
        const res = await addMember(familyId, payload).catch((err) => console.warn('API addMember failed, using local:', err))
        const created = res?.data && typeof res.data === 'object' && res.data.id ? res.data : { ...payload, id: Date.now() }
        addMemberToContext(created)
      }
      onClose()
    } catch (err) {
      if (isEdit) {
        updateMemberInContext({ ...payload, id: member.id })
      } else {
        addMemberToContext({ ...payload, id: Date.now() })
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove ${member.name}?`)) return
    setLoading(true)
    try {
      await deleteMember(member.id).catch((err) => console.warn('API deleteMember failed, deleting locally:', err))
      deleteMemberFromContext(member.id)
      onClose()
    } catch (err) {
      deleteMemberFromContext(member.id)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  // Render dynamic questions based on current age & gender
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
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-header" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ fontSize: 19 }}>
            {isEdit ? `Edit Profile — ${member.name}` : 'Add Family Member'}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4, borderRadius: '50%' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* SECTION 1: Basic Info */}
          <div style={{ background: 'var(--color-surface-2)', padding: 16, borderRadius: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary)', marginBottom: 12 }}>
              1. Basic Info
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="input"
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Sarah"
                required
              />
            </div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <option value="PARENT">Parent</option>
                  <option value="CHILD">Child</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="input"
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  {GENDERS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Age (years)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  className="input"
                  type="number"
                  min="30"
                  max="300"
                  value={form.heightCm}
                  onChange={(e) => handleChange('heightCm', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                className="input"
                type="number"
                step="0.1"
                min="1"
                max="500"
                value={form.weightKg}
                onChange={(e) => handleChange('weightKg', e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Activity Level</label>
              <select
                className="input"
                value={form.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
              >
                {ACTIVITY_LEVELS.map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DYNAMIC DEMOGRAPHIC FOLLOW-UP QUESTIONS (Reactive based on Age + Gender) */}
          {hasDynamicQuestions && (
            <div
              style={{
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f0ede8 100%)',
                border: '1.5px solid var(--color-primary-light)',
                padding: 16,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--color-primary-dark)',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>💡 Demographic Health Questions</span>
              </div>

              {/* Infants/Toddlers (0-3) */}
              {ageNum >= 0 && ageNum <= 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label className="form-label" style={{ fontSize: 13 }}>
                    Any known food intolerances during weaning?
                  </label>
                  <div className="toggle-tabs">
                    <button
                      type="button"
                      className={`toggle-tab ${form.weaningIntolerance ? 'active' : ''}`}
                      onClick={() => handleChange('weaningIntolerance', true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`toggle-tab ${!form.weaningIntolerance ? 'active' : ''}`}
                      onClick={() => handleChange('weaningIntolerance', false)}
                    >
                      No
                    </button>
                  </div>
                  {form.weaningIntolerance && (
                    <input
                      className="input"
                      type="text"
                      placeholder="Specify intolerances (e.g. cow's milk, soy)"
                      value={form.weaningNotes}
                      onChange={(e) => handleChange('weaningNotes', e.target.value)}
                    />
                  )}
                </div>
              )}

              {/* Children (4-12) */}
              {ageNum >= 4 && ageNum <= 12 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label className="form-label" style={{ fontSize: 13 }}>
                    Any growth or nutrition concerns flagged by a pediatrician?
                  </label>
                  <div className="toggle-tabs">
                    <button
                      type="button"
                      className={`toggle-tab ${form.pediatricConcerns ? 'active' : ''}`}
                      onClick={() => handleChange('pediatricConcerns', true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`toggle-tab ${!form.pediatricConcerns ? 'active' : ''}`}
                      onClick={() => handleChange('pediatricConcerns', false)}
                    >
                      No
                    </button>
                  </div>
                  {form.pediatricConcerns && (
                    <input
                      className="input"
                      type="text"
                      placeholder="Specify pediatrician concerns (e.g. low iron, weight pick-up)"
                      value={form.pediatricNotes}
                      onChange={(e) => handleChange('pediatricNotes', e.target.value)}
                    />
                  )}
                </div>
              )}

              {/* Teens (13-19) */}
              {ageNum >= 13 && ageNum <= 19 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {isFemale && (
                    <div>
                      <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                        Do you experience iron-deficiency symptoms (fatigue, dizziness)?
                      </label>
                      <div className="toggle-tabs">
                        <button
                          type="button"
                          className={`toggle-tab ${form.ironDeficiency ? 'active' : ''}`}
                          onClick={() => handleChange('ironDeficiency', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`toggle-tab ${!form.ironDeficiency ? 'active' : ''}`}
                          onClick={() => handleChange('ironDeficiency', false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                      Any concerns with rapid growth or appetite changes?
                    </label>
                    <div className="toggle-tabs">
                      <button
                        type="button"
                        className={`toggle-tab ${form.rapidGrowth ? 'active' : ''}`}
                        onClick={() => handleChange('rapidGrowth', true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`toggle-tab ${!form.rapidGrowth ? 'active' : ''}`}
                        onClick={() => handleChange('rapidGrowth', false)}
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
                  <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                    Are you currently pregnant or breastfeeding?
                  </label>
                  <div className="toggle-tabs">
                    <button
                      type="button"
                      className={`toggle-tab ${form.isPregnantOrBreastfeeding ? 'active' : ''}`}
                      onClick={() => handleChange('isPregnantOrBreastfeeding', true)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`toggle-tab ${!form.isPregnantOrBreastfeeding ? 'active' : ''}`}
                      onClick={() => handleChange('isPregnantOrBreastfeeding', false)}
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
                      <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                        Are you experiencing menopause-related symptoms?
                      </label>
                      <div className="toggle-tabs">
                        <button
                          type="button"
                          className={`toggle-tab ${form.menopauseSymptoms ? 'active' : ''}`}
                          onClick={() => handleChange('menopauseSymptoms', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`toggle-tab ${!form.menopauseSymptoms ? 'active' : ''}`}
                          onClick={() => handleChange('menopauseSymptoms', false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                      Family history of heart disease or diabetes?
                    </label>
                    <div className="toggle-tabs">
                      <button
                        type="button"
                        className={`toggle-tab ${form.familyHistoryDisease ? 'active' : ''}`}
                        onClick={() => handleChange('familyHistoryDisease', true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`toggle-tab ${!form.familyHistoryDisease ? 'active' : ''}`}
                        onClick={() => handleChange('familyHistoryDisease', false)}
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
                    <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                      Any difficulty chewing or swallowing?
                    </label>
                    <div className="toggle-tabs">
                      <button
                        type="button"
                        className={`toggle-tab ${form.hasChewingDifficulty ? 'active' : ''}`}
                        onClick={() => handleChange('hasChewingDifficulty', true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`toggle-tab ${!form.hasChewingDifficulty ? 'active' : ''}`}
                        onClick={() => handleChange('hasChewingDifficulty', false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 13, marginBottom: 6 }}>
                      Are you on any long-term medication that affects diet (e.g. blood thinners, diuretics)?
                    </label>
                    <div className="toggle-tabs">
                      <button
                        type="button"
                        className={`toggle-tab ${form.longTermMedication ? 'active' : ''}`}
                        onClick={() => handleChange('longTermMedication', true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`toggle-tab ${!form.longTermMedication ? 'active' : ''}`}
                        onClick={() => handleChange('longTermMedication', false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: Health Conditions */}
          <div style={{ background: 'var(--color-surface-2)', padding: 16, borderRadius: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary)', marginBottom: 12 }}>
              2. Health Conditions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
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
                      background: checked ? 'var(--color-accent-light)' : 'white',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck('healthConditions', opt)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* SECTION 3: Allergies */}
          <div style={{ background: 'var(--color-surface-2)', padding: 16, borderRadius: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary)', marginBottom: 12 }}>
              3. Allergies
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
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
                      background: checked ? '#fde8e8' : 'white',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck('allergies', opt)}
                      style={{ accentColor: 'var(--color-error)' }}
                    />
                    <span>{opt}</span>
                  </label>
                )
              })}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 12 }}>Other Allergies (comma-separated)</label>
              <input
                className="input"
                type="text"
                value={form.otherAllergy}
                onChange={(e) => handleChange('otherAllergy', e.target.value)}
                placeholder="e.g. Sesame, Mustard, Sulfites"
              />
            </div>
          </div>

          {/* SECTION 4: Diet & Goals */}
          <div style={{ background: 'var(--color-surface-2)', padding: 16, borderRadius: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary)', marginBottom: 12 }}>
              4. Diet Preference & Fitness Goal
            </div>

            <div className="form-group">
              <label className="form-label">Diet Preference</label>
              <select
                className="input"
                value={form.dietPreference}
                onChange={(e) => handleChange('dietPreference', e.target.value)}
              >
                {DIET_PREFERENCES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              <select
                className="input"
                value={form.fitnessGoal}
                onChange={(e) => handleChange('fitnessGoal', e.target.value)}
              >
                {FITNESS_GOALS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12 }}>Food Likes (comma-separated)</label>
              <input
                className="input"
                type="text"
                value={form.likes}
                onChange={(e) => handleChange('likes', e.target.value)}
                placeholder="e.g. Salmon, Quinoa, Avocados, Berries"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 12 }}>Food Dislikes (comma-separated)</label>
              <input
                className="input"
                type="text"
                value={form.dislikes}
                onChange={(e) => handleChange('dislikes', e.target.value)}
                placeholder="e.g. Mushrooms, Red Meat, Tofu"
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                background: '#fde8e8',
                color: 'var(--color-error)',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {isEdit && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: 'var(--color-error)' }}
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, padding: 14 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
