import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getIssuesApi } from '../../api/issueApi'
import { getProjectByIdApi } from '../../api/projectApi'
import { useAuth } from '../../hooks/useAuth'
import { useOptimisticIssue } from '../../hooks/useOptimisticIssue'
import { useIssueFilters } from '../../hooks/useIssueFilters'
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/issueHelpers'
import PageError from '../../components/common/PageError'
import EmptyState from '../../components/common/EmptyState'
import SkeletonCard from '../../components/common/SkeletonCard'
import CreateIssueModal from '../../components/issue/CreateIssueModal'
import ManageMembersModal from '../../components/project/ManageMembersModal'
import IssueCard from '../../components/issue/IssueCard'

export default function IssueList() {
  const { projectId } = useParams()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [projectMembers, setProjectMembers] = useState([])
  const [project, setProject] = useState(null)

  const {
    issues,
    pending,
    syncIssues,
    optimisticStatusChange,
  } = useOptimisticIssue([])

  const {
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
    queryParams,
  } = useIssueFilters()

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [issueRes, projectRes] = await Promise.all([
        getIssuesApi(projectId, queryParams),
        getProjectByIdApi(projectId)
      ])
      
      syncIssues(issueRes.data.issues)
      setProjectMembers(projectRes.data.project.members || [])
      setProject(projectRes.data.project)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load issues')
    } finally {
      setLoading(false)
    }
  }, [projectId, queryParams, syncIssues])

  useEffect(() => {
    loadData()
  }, [loadData])

  const renderColumn = (status) => {
    const colIssues = issues.filter(i => i.status === status)
    return (
      <div className="bg-[#edf2f7]/50 rounded-lg p-5 flex flex-col min-h-[500px]">
        <div className="flex items-center gap-2.5 mb-5 px-1">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#4a5568]">
            {STATUS_LABELS[status]}
          </span>
          <span className="text-[11px] font-bold bg-[#e2e8f0] text-[#4a5568] px-2 py-0.5 rounded-full">
            {colIssues.length}
          </span>
        </div>
        
        <div className="flex flex-col gap-4">
          {colIssues.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-[#e2e8f0] rounded-lg">
              <EmptyState
                icon="issue"
                title="No issues"
                subtitle={`Nothing in ${STATUS_LABELS[status]} yet`}
              />
            </div>
          ) : (
            colIssues.map(issue => (
              <IssueCard
                key={issue._id}
                issue={issue}
                projectId={projectId}
                isPending={!!pending[issue._id]}
                onStatusChange={(newStat) => optimisticStatusChange(issue._id, newStat, projectId)}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  if (loading && issues.length === 0) return (
    <div className="w-full space-y-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1a202c]">Board</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#edf2f7]/50 rounded-lg p-5">
            <div className="flex flex-col gap-4">
              {[1, 2].map(j => <SkeletonCard key={j} lines={3} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#1a202c]">Board</h1>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button 
                className="btn-secondary" 
                onClick={() => setShowManageMembers(true)}
              >
                Manage members
              </button>
            )}
            <button className="btn-primary" onClick={() => setShowCreate(true)}>Create issue</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              className="bg-white border-[#e2e8f0] rounded-sm py-1.5 px-3 text-[13px] border focus:border-primary w-auto"
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
            >
              <option value="">Status: All</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <select
              className="bg-white border-[#e2e8f0] rounded-sm py-1.5 px-3 text-[13px] border focus:border-primary w-auto"
              value={filters.priority}
              onChange={(e) => setFilter('priority', e.target.value)}
            >
              <option value="">Priority: All</option>
              {Object.entries(PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {activeFilterCount > 0 && (
            <button 
              className="text-primary text-[13px] font-medium hover:underline self-start font-bold" 
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      </header>

      {error ? (
        <PageError
          title="Failed to load issues"
          message={error}
          code="LOAD_ERROR"
          onRetry={loadData}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {renderColumn('todo')}
          {renderColumn('in_progress')}
          {renderColumn('done')}
        </div>
      )}

      {showCreate && (
        <CreateIssueModal
          projectId={projectId}
          projectMembers={projectMembers}
          onClose={() => setShowCreate(false)}
          onCreated={loadData}
        />
      )}
      
      {showManageMembers && project && (
        <ManageMembersModal
          projectId={projectId}
          currentMembers={projectMembers}
          creatorId={project.createdBy?._id || project.createdBy}
          onClose={() => setShowManageMembers(false)}
          onUpdate={loadData}
        />
      )}
    </div>
  )
}
