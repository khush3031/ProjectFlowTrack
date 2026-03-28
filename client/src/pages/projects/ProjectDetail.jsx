import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getProjectByIdApi,
  deleteProjectApi,
  removeProjectMemberApi
} from '../../api/projectApi'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import { toast } from '../../utils/toast'
import EditProjectModal from '../../components/project/EditProjectModal'
import AddMemberModal from '../../components/project/AddMemberModal'
import Spinner from '../../components/common/Spinner'
import styles from './ProjectDetail.module.css'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, user } = useAuth()
  const { fetchProjects } = useProjects()

  const [project, setProject]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [showEdit, setShowEdit]     = useState(false)
  const [showAdd, setShowAdd]       = useState(false)
  const [deleting, setDeleting]     = useState(false)

  const loadProject = async () => {
    try {
      const { data } = await getProjectByIdApi(id)
      setProject(data.project)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load project')
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProject() }, [id])

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteProjectApi(id)
      toast.success('Project deleted')
      fetchProjects()
      navigate('/projects')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project')
      setDeleting(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the project?')) return
    try {
      await removeProjectMemberApi(id, userId)
      toast.success('Member removed')
      loadProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member')
    }
  }

  if (loading) return <Spinner />
  if (!project) return null

  const createdAt = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className={styles.page}>

      <button className={styles.back} onClick={() => navigate('/projects')}>
        ← Back to projects
      </button>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.name}>{project.name}</h1>
          <p className={styles.meta}>
            Created by {project.createdBy?.name} · {createdAt}
          </p>
          {project.description && (
            <p className={styles.desc}>{project.description}</p>
          )}
        </div>

        {isAdmin && (
          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => setShowEdit(true)}
            >
              Edit
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Members ({project.members?.length ?? 0})
          </h2>
          {isAdmin && (
            <button
              className={styles.addBtn}
              onClick={() => setShowAdd(true)}
            >
              Add member
            </button>
          )}
        </div>

        <div className={styles.memberList}>
          {project.members?.map(m => {
            const isCreator =
              (project.createdBy?._id || project.createdBy) ===
              (m._id || m)
            return (
              <div key={m._id} className={styles.memberRow}>
                <div className={styles.avatar}>
                  {m.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.memberInfo}>
                  <p className={styles.memberName}>
                    {m.name}
                    {isCreator && (
                      <span className={styles.creatorBadge}>Creator</span>
                    )}
                  </p>
                  <p className={styles.memberEmail}>{m.email}</p>
                </div>
                {isAdmin && !isCreator && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveMember(m._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button
        className={styles.issuesBtn}
        onClick={() => navigate(`/projects/${id}/issues`)}
      >
        View issues board
      </button>

      {showEdit && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEdit(false)}
          onUpdated={() => { setShowEdit(false); loadProject(); fetchProjects() }}
        />
      )}

      {showAdd && (
        <AddMemberModal
          projectId={id}
          currentMembers={project.members}
          onClose={() => setShowAdd(false)}
          onAdded={() => { setShowAdd(false); loadProject() }}
        />
      )}
    </div>
  )
}
