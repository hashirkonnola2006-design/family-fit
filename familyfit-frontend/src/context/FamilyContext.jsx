import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getFamily } from '../api/family'
import { useAuth } from './AuthContext'
import { fetchCloudMembers, syncMembersToCloud } from '../utils/cloudSync'

const FamilyContext = createContext(null)

// Smart merger function to ensure no added member is ever lost
function mergeMemberLists(listA = [], listB = []) {
  const map = new Map()

  listA.forEach((m) => {
    if (m && (m.id || m.name)) {
      const key = String(m.id || m.name)
      map.set(key, m)
    }
  })

  listB.forEach((m) => {
    if (m && (m.id || m.name)) {
      const key = String(m.id || m.name)
      if (map.has(key)) {
        map.set(key, { ...map.get(key), ...m })
      } else {
        map.set(key, m)
      }
    }
  })

  return Array.from(map.values())
}

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
        const localSaved = JSON.parse(localStorage.getItem('familyfit_members') || '[]')
        const merged = mergeMemberLists(localSaved, res.data.members)
        setFamily({ ...res.data, members: merged })
        localStorage.setItem('familyfit_members', JSON.stringify(merged))
        if (!activeMember) setActiveMember(merged[0])
        setLoading(false)
        return
      }

      // 2. Try cross-device Cloud Sync and merge with localStorage
      const cloudMembers = await fetchCloudMembers()
      const localSaved = JSON.parse(localStorage.getItem('familyfit_members') || '[]')
      const merged = mergeMemberLists(localSaved, cloudMembers || [])

      if (merged.length > 0) {
        setFamily((prev) => ({ ...prev, members: merged }))
        localStorage.setItem('familyfit_members', JSON.stringify(merged))
        setActiveMember((prev) => prev || merged[0])
        // Also push merged state to cloud sync to keep both devices in harmony
        syncMembersToCloud(merged)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [activeMember])

  useEffect(() => {
    fetchFamily(user?.familyId || 1)

    // Window focus / poll listener that MERGES instead of overwriting
    const onSyncCheck = () => {
      fetchCloudMembers().then((cloudMembers) => {
        if (cloudMembers && Array.isArray(cloudMembers) && cloudMembers.length > 0) {
          setFamily((prev) => {
            const currentMembers = prev?.members || []
            const merged = mergeMemberLists(currentMembers, cloudMembers)
            localStorage.setItem('familyfit_members', JSON.stringify(merged))
            return { ...prev, members: merged }
          })
        }
      })
    }

    window.addEventListener('focus', onSyncCheck)
    const interval = setInterval(onSyncCheck, 10000)

    return () => {
      window.removeEventListener('focus', onSyncCheck)
      clearInterval(interval)
    }
  }, [user?.familyId, fetchFamily])

  // ─── Local & Cloud Sync Mutations ─

  const addMemberToContext = (newMember) => {
    const memberWithId = { ...newMember, id: newMember.id || Date.now() }
    
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = mergeMemberLists(existing, [memberWithId])

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (!activeMember) setActiveMember(memberWithId)
      return { ...(prev || { id: null, name: 'My Family' }), members: updatedMembers }
    })
  }

  const updateMemberInContext = (updatedMember) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = existing.map((m) =>
        String(m.id) === String(updatedMember.id) ? { ...m, ...updatedMember } : m
      )

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (String(activeMember?.id) === String(updatedMember.id)) {
        setActiveMember({ ...activeMember, ...updatedMember })
      }
      return { ...prev, members: updatedMembers }
    })
  }

  const deleteMemberFromContext = (memberId) => {
    setFamily((prev) => {
      const existing = prev?.members || []
      const updatedMembers = existing.filter((m) => String(m.id) !== String(memberId))

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (String(activeMember?.id) === String(memberId)) {
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
