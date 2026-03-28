import { useNavigate } from 'react-router-dom'
import { PRIORITY_LABELS } from '../../utils/issueHelpers'

export default function IssueCard({ issue, projectId, isPending, onStatusChange }) {
  const navigate = useNavigate()

  const handleStatusClick = (e, newStatus) => {
    e.stopPropagation()
    onStatusChange(newStatus)
  }

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-50 text-blue-600',
    high: 'bg-red-50 text-red-600',
  }

  return (
    <div
      className={`
        bg-white border border-[#e2e8f0] rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative group
        ${isPending ? 'opacity-70 grayscale' : ''}
      `}
      onClick={() => navigate(`/projects/${projectId}/issues/${issue._id}`)}
    >
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 z-10 backdrop-blur-[1px]">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityColors[issue.priority] || priorityColors.medium}`}>
          {PRIORITY_LABELS[issue.priority]}
        </span>
      </div>

      <h3 className="text-[14px] font-semibold text-[#1a202c] mb-4 line-clamp-2 leading-snug">
        {issue.title}
      </h3>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
          {issue.assignee ? issue.assignee.name.charAt(0) : '?'}
        </div>
        
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {issue.status !== 'todo' && (
            <button
              className="text-[10px] font-medium text-[#4a5568] hover:text-primary"
              onClick={(e) => handleStatusClick(e, 'todo')}
            >
              Todo
            </button>
          )}
          {issue.status !== 'in_progress' && (
            <button
              className="text-[10px] font-medium text-[#4a5568] hover:text-primary"
              onClick={(e) => handleStatusClick(e, 'in_progress')}
            >
              Doing
            </button>
          )}
          {issue.status !== 'done' && (
            <button
              className="text-[10px] font-medium text-[#4a5568] hover:text-primary"
              onClick={(e) => handleStatusClick(e, 'done')}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
