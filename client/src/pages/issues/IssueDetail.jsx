import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getIssueByIdApi, updateIssueApi, deleteIssueApi } from '../../api/issueApi'
import { getIssueActivityApi } from '../../api/activityApi'
import { useAuth } from '../../hooks/useAuth'
import { STATUS_LABELS, PRIORITY_LABELS, formatDate } from '../../utils/issueHelpers'
import { toast } from '../../utils/toast'
import Spinner from '../../components/common/Spinner'
import ActivityFeed from '../../components/activity/ActivityFeed'
import CommentList from '../../components/comments/CommentList'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import styles from './IssueDetail.module.css'

export default function IssueDetail() {
  const { projectId, issueId } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const [issue, setIssue]         = useState(null)
  const [comments, setComments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState('comments')
  const [showConfirm, setShowConfirm] = useState(false)

  const loadIssue = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await getIssueByIdApi(projectId, issueId)
      setIssue(data.issue)
      setComments(data.comments)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load issue')
      navigate(`/projects/${projectId}/issues`)
    } finally {
      setLoading(false)
    }
  }, [projectId, issueId, navigate])

  useEffect(() => {
    loadIssue()
  }, [loadIssue])

  const handleUpdate = async (updates) => {
    try {
      const { data } = await updateIssueApi(projectId, issueId, updates)
      setIssue(data.issue)
      toast.success('Issue updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update issue')
    }
  }

  const handleDelete = async () => {
    setShowConfirm(false)
    try {
      await deleteIssueApi(projectId, issueId)
      toast.success('Issue deleted')
      navigate(`/projects/${projectId}/issues`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete issue')
    }
  }

  const activityFetchFn = useCallback(
    (params) => getIssueActivityApi(projectId, issueId, params),
    [projectId, issueId]
  )

  if (loading) return <div className="page-center"><Spinner /></div>
  if (!issue) return null

  return (
    <div className={styles.issuePage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate(`/projects/${projectId}/issues`)}>
            ← Issues
          </button>
          <span className={styles.issueId}>ISSUE-{issueId.slice(-4).toUpperCase()}</span>
        </div>
        <div className={styles.headerRight}>
          {(isAdmin || user?._id === issue.createdBy?._id) && (
            <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)}>Delete</button>
          )}
        </div>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.content}>
          <h1 className={styles.title}>{issue.title}</h1>
          <div className={styles.descriptionWrap}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>
              {issue.description || <span className={styles.faint}>No description provided.</span>}
            </p>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'comments' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'activity' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'comments' && (
              <CommentList
                projectId={projectId}
                issueId={issue._id}
                initialComments={comments}
              />
            )}
            {activeTab === 'activity' && (
              <ActivityFeed fetchFn={activityFetchFn} title="Issue History" />
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <label className={styles.label}>Status</label>
            <select
              className={`${styles.select} ${styles[`status_${issue.status}`]}`}
              value={issue.status}
              onChange={(e) => handleUpdate({ status: e.target.value })}
            >
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.sidebarSection}>
            <label className={styles.label}>Priority</label>
            <select
              className={styles.select}
              value={issue.priority}
              onChange={(e) => handleUpdate({ priority: e.target.value })}
            >
              {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.sidebarSection}>
            <label className={styles.label}>Assignee</label>
            <div className={styles.assignee}>
              {issue.assignee ? (
                <>
                  <div className={styles.avatar}>{issue.assignee.name.charAt(0)}</div>
                  <span className={styles.assigneeName}>{issue.assignee.name}</span>
                </>
              ) : (
                <span className={styles.faint}>Unassigned</span>
              )}
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            <p className={styles.footerInfo}>Created by <strong>{issue.createdBy?.name}</strong></p>
            <p className={styles.footerInfo}>on {formatDate(issue.createdAt)}</p>
          </div>
        </aside>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete issue"
          message="This issue will be permanently deleted. This action cannot be undone."
          confirmLabel="Delete issue"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
