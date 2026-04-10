import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyIssuesApi } from '../../api/userApi'
import { STATUS_LABELS, PRIORITY_LABELS, formatDueDate } from '../../utils/issueHelpers'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

const priorityColors = {
  low:    'bg-gray-100 text-gray-600',
  medium: 'bg-blue-50 text-blue-600',
  high:   'bg-red-50 text-red-600',
}

const statusColors = {
  todo:        'bg-[#edf2f7] text-[#4a5568]',
  in_progress: 'bg-green-50 text-green-700',
  done:        'bg-purple-50 text-purple-700',
}

export default function MyIssues() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const params = statusFilter ? { status: statusFilter } : {}
      const { data } = await getMyIssuesApi(params)
      setIssues(data.issues || [])
    } catch {
      setIssues([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  // Group by project
  const grouped = issues.reduce((acc, issue) => {
    const pid = issue.project?._id || 'unknown'
    const pname = issue.project?.name || 'Unknown Project'
    if (!acc[pid]) acc[pid] = { name: pname, id: pid, issues: [] }
    acc[pid].issues.push(issue)
    return acc
  }, {})

  const openCount  = issues.filter(i => i.status !== 'done').length
  const overdueCount = issues.filter(i => {
    if (!i.dueDate || i.status === 'done') return false
    return new Date(i.dueDate) < new Date()
  }).length

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">My Issues</h1>
          <p className="text-[13px] text-[#4a5568] mt-1">
            All issues assigned to you across every project
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="font-semibold text-[#1a202c]">{openCount}</span>
            <span className="text-[#718096]">open</span>
            {overdueCount > 0 && (
              <>
                <span className="text-[#cbd5e0]">·</span>
                <span className="font-semibold text-red-500">{overdueCount}</span>
                <span className="text-[#718096]">overdue</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          className="bg-white border border-[#e2e8f0] rounded-sm py-1.5 px-3 text-[13px] focus:border-primary focus:outline-none"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Status: All</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        {statusFilter && (
          <button
            className="text-primary text-[13px] font-semibold hover:underline"
            onClick={() => setStatusFilter('')}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : issues.length === 0 ? (
        <EmptyState
          icon="issue"
          title="No issues assigned to you"
          subtitle={statusFilter ? 'Try clearing the filter' : 'Issues assigned to you will appear here'}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {Object.values(grouped).map(group => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <h2 className="text-[15px] font-bold text-[#1a202c]">{group.name}</h2>
                <span className="text-[11px] font-bold bg-[#e2e8f0] text-[#4a5568] px-2 py-0.5 rounded-full">
                  {group.issues.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {group.issues.map(issue => {
                  const due = formatDueDate(issue.dueDate)
                  const isOverdue = due?.urgency === 'overdue'
                  const isSoon = due?.urgency === 'soon'

                  return (
                    <div
                      key={issue._id}
                      className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-3.5 flex items-center gap-4 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group"
                      onClick={() => navigate(`/projects/${issue.project?._id}/issues/${issue._id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityColors[issue.priority]}`}>
                            {PRIORITY_LABELS[issue.priority]}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[issue.status]}`}>
                            {STATUS_LABELS[issue.status]}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] font-semibold text-[#1a202c] truncate group-hover:text-primary transition-colors">
                          {issue.title}
                        </p>
                      </div>

                      {due && (
                        <span className={`text-[12px] font-medium shrink-0 ${
                          isOverdue ? 'text-red-500' : isSoon ? 'text-amber-500' : 'text-[#718096]'
                        }`}>
                          {isOverdue ? `${Math.abs(due.days)}d overdue` : `Due ${due.formatted}`}
                        </span>
                      )}

                      <span className="text-[#a0aec0] text-[18px] leading-none opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
