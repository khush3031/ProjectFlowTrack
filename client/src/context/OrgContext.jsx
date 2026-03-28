import { createContext, useState, useEffect, useCallback } from 'react'
import { getMyOrgApi } from '../api/orgApi'
import { useAuth } from '../hooks/useAuth'

export const OrgContext = createContext(null)

export const OrgProvider = ({ children }) => {
  const { user } = useAuth()
  const [org, setOrg]           = useState(null)
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchOrg = useCallback(async () => {
    if (!user) { setLoading(false); return }
    try {
      const { data } = await getMyOrgApi()
      setOrg(data.organization)
      setMembers(data.members)
    } catch {
      setOrg(null)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchOrg() }, [fetchOrg])

  return (
    <OrgContext.Provider value={{ org, members, loading, fetchOrg }}>
      {children}
    </OrgContext.Provider>
  )
}
