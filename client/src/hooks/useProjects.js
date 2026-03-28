import { useContext } from 'react'
import { ProjectContext } from '../context/ProjectContext'
export const useProjects = () => useContext(ProjectContext)
