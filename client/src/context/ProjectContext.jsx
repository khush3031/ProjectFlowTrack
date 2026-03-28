import { createContext, useState, useEffect, useCallback } from 'react'
import { getProjectsApi } from '../api/projectApi'
import { useAuth } from '../hooks/useAuth'

export const ProjectContext = createContext(null)

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth()
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!user) { setLoading(false); return }
    try {
      const { data } = await getProjectsApi()
      setProjects(data.projects)
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  return (
    <ProjectContext.Provider value={{ projects, loading, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  )
}
