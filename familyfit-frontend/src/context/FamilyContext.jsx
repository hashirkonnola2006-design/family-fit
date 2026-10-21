import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getFamily, deleteMember as apiDeleteMember } from '../api/family'
import { useAuth } from './AuthContext'
import { fetchCloudMembers, syncMembersToCloud } from '../utils/cloudSync'

const FamilyContext = createContext(null)

const SAMPLE_MEMBER_NAMES = ['madhavan', 'sarada', 'rajesh', 'deepa', 'rahul', 'ananya']

export function isSampleMember(m) {
  if (!m) return false
  const name = String(m.name || '').trim().toLowerCase()
  return SAMPLE_MEMBER_NAMES.includes(name)
}

const DEFAULT_SEEDED_MEMBERS = []

export function getDeletedMemberIds() {
  try {
    const raw = localStorage.getItem('familyfit_deleted_member_ids')
    const ids = raw ? JSON.parse(raw) : []
    // Ensure sample members are permanently registered as deleted
    SAMPLE_MEMBER_NAMES.forEach((name) => {
      if (!ids.includes(name)) ids.push(name)
    })
    return ids
  } catch {
    return [...SAMPLE_MEMBER_NAMES]
  }
}

export function addDeletedMemberId(id) {
  try {
    const ids = getDeletedMemberIds()
    const strId = String(id).toLowerCase()
    if (!ids.includes(strId)) {
      ids.push(strId)
      localStorage.setItem('familyfit_deleted_member_ids', JSON.stringify(ids))
    }
  } catch {}
}

function isMemberDeleted(m, deletedIds) {
  if (!m) return true
  if (isSampleMember(m)) return true
  const idStr = String(m.id || '').toLowerCase()
  const nameStr = String(m.name || '').toLowerCase()
  return deletedIds.includes(idStr) || deletedIds.includes(nameStr)
}

function getSafeLocalMembers() {
  const deletedIds = getDeletedMemberIds()
  try {
    const saved = localStorage.getItem('familyfit_members')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((m) => !isMemberDeleted(m, deletedIds) && !isSampleMember(m))
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('familyfit_members', JSON.stringify(cleaned))
          syncMembersToCloud(cleaned)
        }
        return cleaned
      }
    }
  } catch (err) {
    console.warn('Could not read familyfit_members from localStorage:', err)
  }
  return []
}

// Smart merger function to ensure no added member is ever lost, while respecting deleted members
function mergeMemberLists(listA = [], listB = []) {
  const deletedIds = getDeletedMemberIds()
  const map = new Map()
  const safeA = (Array.isArray(listA) ? listA : []).filter((m) => !isMemberDeleted(m, deletedIds) && !isSampleMember(m))
  const safeB = (Array.isArray(listB) ? listB : []).filter((m) => !isMemberDeleted(m, deletedIds) && !isSampleMember(m))

  safeA.forEach((m) => {
    if (m && (m.id || m.name)) {
      const key = String(m.id || m.name)
      map.set(key, m)
    }
  })

  safeB.forEach((m) => {
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
    const savedMembers = getSafeLocalMembers()
    return {
      id: user?.familyId || 1,
      name: user?.familyName || 'My Family',
      members: savedMembers,
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeMember, setActiveMember] = useState(() => {
    const savedMembers = getSafeLocalMembers()
    return savedMembers[0] || null
  })

  const fetchFamily = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // 1. Try primary backend API first
      const res = await getFamily(id).catch(() => ({ data: null }))
      if (res?.data && Array.isArray(res.data.members) && res.data.members.length > 0) {
        const localSaved = getSafeLocalMembers()
        const merged = mergeMemberLists(localSaved, res.data.members)
        setFamily({ ...res.data, members: merged })
        try { localStorage.setItem('familyfit_members', JSON.stringify(merged)) } catch {}
        if (!activeMember) setActiveMember(merged[0])
        setLoading(false)
        return
      }

      // 2. Try cross-device Cloud Sync and merge with localStorage
      const cloudMembers = await fetchCloudMembers()
      const localSaved = getSafeLocalMembers()
      const merged = mergeMemberLists(localSaved, cloudMembers || [])

      if (merged.length > 0) {
        setFamily((prev) => ({ ...prev, members: merged }))
        try { localStorage.setItem('familyfit_members', JSON.stringify(merged)) } catch {}
        setActiveMember((prev) => prev || merged[0])
        // Also push merged state to cloud sync to keep both devices in harmony
        syncMembersToCloud(merged)
      } else {
        setFamily((prev) => ({ ...prev, members: [] }))
        try { localStorage.setItem('familyfit_members', JSON.stringify([])) } catch {}
        setActiveMember(null)
        syncMembersToCloud([])
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
        if (cloudMembers && Array.isArray(cloudMembers)) {
          setFamily((prev) => {
            const currentMembers = prev?.members || []
            const merged = mergeMemberLists(currentMembers, cloudMembers)
            localStorage.setItem('familyfit_members', JSON.stringify(merged))
            if (merged.length === 0 && cloudMembers.length > 0) {
              syncMembersToCloud([])
            }
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
    addDeletedMemberId(memberId)
    apiDeleteMember(memberId).catch(() => {})

    setFamily((prev) => {
      const existing = prev?.members || []
      const idStr = String(memberId).toLowerCase()
      const updatedMembers = existing.filter(
        (m) => String(m.id).toLowerCase() !== idStr && String(m.name).toLowerCase() !== idStr
      )

      localStorage.setItem('familyfit_members', JSON.stringify(updatedMembers))
      syncMembersToCloud(updatedMembers)

      if (String(activeMember?.id).toLowerCase() === idStr || String(activeMember?.name).toLowerCase() === idStr) {
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
