import { useState, useCallback } from 'react'
import { updateIssueApi } from '../api/issueApi'
import { toast } from '../utils/toast'
import { STATUS_LABELS } from '../utils/issueHelpers'

export const useOptimisticIssue = (initialIssues = []) => {
  const [issues, setIssues] = useState(initialIssues)
  const [pending, setPending] = useState({})

  const syncIssues = useCallback((newIssues) => {
    setIssues(newIssues)
  }, [])

  const optimisticStatusChange = useCallback(
    async (issueId, newStatus, projectId) => {
      const original = issues.find(i => i._id === issueId)
      if (!original || original.status === newStatus) return

      setPending(p => ({ ...p, [issueId]: true }))

      setIssues(prev =>
        prev.map(i =>
          i._id === issueId ? { ...i, status: newStatus } : i
        )
      )

      try {
        await updateIssueApi(projectId, issueId, { status: newStatus })
        toast.success(
          `Moved to ${STATUS_LABELS[newStatus]}`
        )
      } catch (err) {
        setIssues(prev =>
          prev.map(i =>
            i._id === issueId ? original : i
          )
        )
        toast.error(
          err.response?.data?.message || 'Failed to update status'
        )
      } finally {
        setPending(p => {
          const next = { ...p }
          delete next[issueId]
          return next
        })
      }
    },
    [issues]
  )

  return {
    issues,
    pending,
    syncIssues,
    optimisticStatusChange,
  }
}
