import { createContext, useContext, useState, useEffect } from 'react'
import { getFamily } from '../api/family'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const { user } = useAuth()
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem('familyfit_members')
    const members = saved ? JSON.parse(saved) : []
    return { id: 1, name: 'My Family', members }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeMember, setActiveMember] = useState(null)

  useEffect(() => {
    if (user?.familyId) {
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
