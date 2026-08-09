import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getFamily } from '../api/family'
import { useAuth } from './AuthContext'
import { fetchCloudMembers, syncMembersToCloud } from '../utils/cloudSync'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const { user } = useAuth()

  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem('familyfit_members')
    const savedMembers = saved ? JSON.parse(saved) : []
    return {
      id: user?.familyId || 1,
      name: user?.familyName || 'My Family',
      members: savedMembers,
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeMember, setActiveMember] = useState(() => {
    const saved = localStorage.getItem('familyfit_members')
    const savedMembers = saved ? JSON.parse(saved) : []
    return savedMembers[0] || null
  })

  const fetchFamily = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // 1. Try primary backend API first
      const res = await getFamily(id).catch(() => ({ data: null }))
      if (res?.data && Array.isArray(res.data.members) && res.data.members.length > 0) {
        setFamily(res.data)
        localStorage.setItem('familyfit_members', JSON.stringify(res.data.members))
        if (!activeMember) {
          const parent = res.data.members.find((m) => m.role === 'PARENT') || res.data.members[0]
          setActiveMember(parent)
        }
        setLoading(false)
        return
      }

      // 2. Try cross-device Cloud Sync
      const cloudMembers = await fetchCloudMembers()
      if (cloudMembers && Array.isArray(cloudMembers) && cloudMembers.length > 0) {
        setFamily((prev) => ({ ...prev, members: cloudMembers }))
        localStorage.setItem('familyfit_members', JSON.stringify(cloudMembers))
        setActiveMember((prev) => prev || cloudMembers[0])
        setLoading(false)
        return
      }

      // 3. Fallback to localStorage
      const saved = localStorage.getItem('familyfit_members')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) {
          setFamily((prev) => ({ ...prev, members: parsed }))
          if (!activeMember) setActiveMember(parsed[0])
        }
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [activeMember])

  useEffect(() => {
    fetchFamily(user?.familyId || 1)

    // Window focus listener to re-sync members when user switches back to mobile app
    const onFocus = () => {
      fetchCloudMembers().then((cloudMembers) => {
        if (cloudMembers && Array.isArray(cloudMembers) && cloudMembers.length > 0) {
          setFamily((prev) => ({ ...prev, members: cloudMembers }))
          localStorage.setItem('familyfit_members', JSON.stringify(cloudMembers))
        }
      })
    }

    window.addEventListener('focus', onFocus)
    // Periodic light poll every 8 seconds for cross-device synchronization
    const interval = setInterval(onFocus, 8000)

    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(interval)
    }
  }, [user?.familyId, fetchFamily])

  // ─── Cross-device sync mutations ─

  const addMemberToContext = (newMember) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const memberWithId = { ...newMember, id: newMember.id || Date.now() }
      const updatedMembers = [...existing, memberWithId]

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (!activeMember) setActiveMember(memberWithId)
      return { ...(prev || { id: null, name: 'My Family' }), members: updatedMembers }
    })
  }

  const updateMemberInContext = (updatedMember) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = existing.map((m) => (m.id === updatedMember.id ? { ...m, ...updatedMember } : m))

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (activeMember?.id === updatedMember.id) setActiveMember({ ...activeMember, ...updatedMember })
      return { ...prev, members: updatedMembers }
    })
  }

  const deleteMemberFromContext = (memberId) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = existing.filter((m) => m.id !== memberId)

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (activeMember?.id === memberId) {
        setActiveMember(updatedMembers[0] || null)
      }
      return { ...prev, members: updatedMembers }
    })
  }

  const refresh = () => fetchFamily(user?.familyId || 1)

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
