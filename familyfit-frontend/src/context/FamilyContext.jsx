import { createContext, useContext, useState, useEffect } from 'react'
import { getFamily } from '../api/family'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

const DEFAULT_MEMBERS = [
  {
    id: 1,
    name: 'Hashir',
    role: 'PARENT',
    gender: 'MALE',
    age: 24,
    heightCm: 175,
    weightKg: 70,
    dailyKcalTarget: 1980,
    activityLevel: 'MODERATELY_ACTIVE',
    healthConditions: [],
    allergies: [],
    fitnessGoal: 'MAINTAIN_WEIGHT',
    dietPreference: 'NO_PREFERENCE',
  },
  {
    id: 2,
    name: 'Mom',
    role: 'PARENT',
    gender: 'FEMALE',
    age: 48,
    heightCm: 160,
    weightKg: 62,
    dailyKcalTarget: 1760,
    activityLevel: 'MODERATELY_ACTIVE',
    healthConditions: [],
    allergies: ['Milk/Dairy'],
    fitnessGoal: 'WEIGHT_LOSS',
    dietPreference: 'VEGETARIAN',
  },
  {
    id: 3,
    name: 'Dad',
    role: 'PARENT',
    gender: 'MALE',
    age: 52,
    heightCm: 172,
    weightKg: 78,
    dailyKcalTarget: 2240,
    activityLevel: 'VERY_ACTIVE',
    healthConditions: [],
    allergies: [],
    fitnessGoal: 'MUSCLE_GAIN',
    dietPreference: 'HIGH_PROTEIN',
  },
  {
    id: 4,
    name: 'Anya',
    role: 'CHILD',
    gender: 'FEMALE',
    age: 8,
    heightCm: 128,
    weightKg: 26,
    dailyKcalTarget: 1480,
    activityLevel: 'MODERATELY_ACTIVE',
    healthConditions: [],
    allergies: ['Peanuts/Tree Nuts'],
    fitnessGoal: 'MAINTAIN_WEIGHT',
    dietPreference: 'NO_PREFERENCE',
  },
]

export function FamilyProvider({ children }) {
  const { user } = useAuth()
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem('familyfit_members')
    const members = saved ? JSON.parse(saved) : DEFAULT_MEMBERS
    return { id: 1, name: 'Hashir Family', members }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeMember, setActiveMember] = useState(null)

  useEffect(() => {
    if (user?.familyId) {
      if (user.familyName) {
        setFamily((prev) => ({
          ...prev,
          id: user.familyId,
          name: user.familyName,
        }))
      }
      fetchFamily(user.familyId)
    }
  }, [user])

  const fetchFamily = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getFamily(id).catch(() => ({ data: null }))
      if (res?.data && Array.isArray(res.data.members)) {
        setFamily(res.data)
        localStorage.setItem('familyfit_members', JSON.stringify(res.data.members))
        if (res.data.members.length > 0 && !activeMember) {
          const parent = res.data.members.find((m) => m.role === 'PARENT') || res.data.members[0]
          setActiveMember(parent)
        }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const addMemberToContext = (newMember) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const memberWithId = { ...newMember, id: newMember.id || Date.now() }
      const updatedMembers = [...existing, memberWithId]
      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      if (!activeMember) setActiveMember(memberWithId)
      return { ...(prev || { id: 1, name: 'My Family' }), members: updatedMembers }
    })
  }

  const updateMemberInContext = (updatedMember) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = existing.map((m) => (m.id === updatedMember.id ? { ...m, ...updatedMember } : m))
      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      if (activeMember?.id === updatedMember.id) setActiveMember({ ...activeMember, ...updatedMember })
      return { ...prev, members: updatedMembers }
    })
  }

  const deleteMemberFromContext = (memberId) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = existing.filter((m) => m.id !== memberId)
      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      if (activeMember?.id === memberId) {
        setActiveMember(updatedMembers[0] || null)
      }
      return { ...prev, members: updatedMembers }
    })
  }

  const refresh = () => user?.familyId && fetchFamily(user.familyId)

  return (
    <FamilyContext.Provider
      value={{
        family,
        loading,
        error,
        activeMember,
        setActiveMember,
        refresh,
        addMemberToContext,
        updateMemberInContext,
        deleteMemberFromContext,
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}

export const useFamily = () => useContext(FamilyContext)
