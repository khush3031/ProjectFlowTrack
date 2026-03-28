import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { deleteProjectApi } from '../../api/projectApi'
import { toast } from '../common/Toast'
import ConfirmDialog from '../common/ConfirmDialog'

export default function ProjectCard({ project, onDeleted }) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setShowConfirm(false)
    try {
      await deleteProjectApi(project._id)
      toast.success('Project deleted')
      onDeleted?.()
    } catch (err) {
      toast.error('Failed to delete project')
    }
  }

  const createdAt = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <>
      <div
        className="bg-white border border-[#e2e8f0] rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer flex flex-col group relative h-full"
        onClick={() => navigate(`/projects/${project._id}/issues`)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && navigate(`/projects/${project._id}/issues`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[12px] text-[#4a5568] font-medium">
              {project.members?.length ?? 0} member
              {project.members?.length !== 1 ? 's' : ''}
            </span>
          </div>
          {isAdmin && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-300 hover:text-danger hover:bg-danger/5 rounded-sm"
              onClick={handleDeleteClick}
              title="Delete project"
            >
              ✕
            </button>
          )}
        </div>

        <h3 className="text-[17px] font-bold text-[#1a202c] mb-2">{project.name}</h3>

        <div className="flex-1">
          {project.description ? (
            <p className="text-[14px] text-[#4a5568] line-clamp-2 md:line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          ) : (
            <p className="text-[14px] text-[#a0aec0] italic">No description provided</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 text-[12px]">
          <span className="font-semibold text-primary">{project.createdBy?.name || 'Unknown'}</span>
          <span className="text-[#a0aec0]">{createdAt}</span>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete project"
          message={`"${project.name}" and all its issues will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete project"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
