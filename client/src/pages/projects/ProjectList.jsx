import { useState, useEffect } from 'react'
import { getProjectsApi } from '../../api/projectApi'
import { useAuth } from '../../hooks/useAuth'
import ProjectCard from '../../components/project/ProjectCard'
import CreateProjectModal from '../../components/project/CreateProjectModal'
import SkeletonCard from '../../components/common/SkeletonCard'
import EmptyState from '../../components/common/EmptyState'

export default function ProjectList() {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const { data } = await getProjectsApi()
      setProjects(data.projects)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  if (loading && projects.length === 0) return (
    <div className="w-full">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} lines={4} />)}
      </div>
    </div>
  )

  return (
    <div className="w-full">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-[#4a5568] mt-1">Manage and track your active projects</p>
        </div>
        {isAdmin && (
          <button
            className="btn-primary self-start sm:self-center"
            onClick={() => setShowCreate(true)}
          >
            Create project
          </button>
        )}
      </header>

      {projects.length === 0 ? (
        <EmptyState
          icon="project"
          title="No projects yet"
          subtitle={
            isAdmin
              ? 'Create your first project to get started'
              : 'Ask your admin to add you to a project'
          }
          action={isAdmin ? {
            label: 'Create project',
            onClick: () => setShowCreate(true),
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onDeleted={loadProjects} 
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={loadProjects}
        />
      )}
    </div>
  )
}
