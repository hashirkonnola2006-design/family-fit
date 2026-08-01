import { createContext, useContext, useState, useEffect } from 'react'
import { getFamily } from '../api/family'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

export function FamilyProvider({ children }) {
  const { user } = useAuth()
  const [family, setFamily]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [activeMember, setActiveMember] = useState(null)

  useEffect(() => {
    if (user?.familyId) {
      fetchFamily(user.familyId)
    } else {
      setFamily(null)
      setActiveMember(null)
    }
  }, [user])

  const fetchFamily = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getFamily(id)
      setFamily(data)
      // Default active member to first parent
      if (data.members?.length > 0 && !activeMember) {
        const parent = data.members.find(m => m.role === 'PARENT') || data.members[0]
        setActiveMember(parent)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => user?.familyId && fetchFamily(user.familyId)

  return (
    <FamilyContext.Provider value={{ family, loading, error, activeMember, setActiveMember, refresh }}>
      {children}
    </FamilyContext.Provider>
  )
}

export const useFamily = () => useContext(FamilyContext)
