import { useEffect, useState, useCallback } from 'react'
import ActivityEntry from './ActivityEntry'
import {
  groupLogsByDate,
  ACTION_FILTER_OPTIONS,
} from '../../utils/activityHelpers'
import styles from './ActivityFeed.module.css'

export default function ActivityFeed({
  fetchFn,
  showIssueTitle = false,
  title = 'Activity',
  compact = false,
}) {
  const [logs, setLogs]           = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]         = useState('')
  const [page, setPage]           = useState(1)
  const [actionFilter, setActionFilter] = useState('')

  const load = useCallback(async (pageNum, filter, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)
    setError('')
    try {
      const { data } = await fetchFn({
        page: pageNum,
        limit: 20,
        ...(filter && { action: filter }),
      })
      setLogs(prev => append ? [...prev, ...data.logs] : data.logs)
      setPagination(data.pagination)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load activity. Please try again.'
      )
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [fetchFn])

  useEffect(() => {
    setPage(1)
    setLogs([])
    load(1, actionFilter, false)
  }, [actionFilter, load])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    load(next, actionFilter, true)
  }

  const grouped = groupLogsByDate(logs)

  return (
    <div className={`${styles.feed} ${compact ? styles.compact : ''}`}>

      <div className={styles.feedHeader}>
        <h3 className={styles.feedTitle}>{title}</h3>
        <select
          className={styles.actionFilter}
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
        >
          {ACTION_FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className={styles.skeletonList}>
          {[1,2,3].map(i => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonIcon} />
              <div className={styles.skeletonLines}>
                <div className={styles.skeletonLine} style={{width:'60%'}}/>
                <div className={styles.skeletonLine} style={{width:'40%'}}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>!</div>
          <p className={styles.errorMsg}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => load(1, actionFilter, false)}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-text-faint)"
              strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12" y2="16"/>
            </svg>
          </div>
          <p className={styles.emptyTitle}>No activity yet</p>
          <p className={styles.emptySub}>
            Actions will appear here as changes are made
          </p>
        </div>
      )}

      {!loading && !error && grouped.map(([dateLabel, entries]) => (
        <div key={dateLabel} className={styles.group}>
          <div className={styles.dateLabel}>
            <span>{dateLabel}</span>
          </div>
          <div className={styles.entries}>
            {entries.map(log => (
              <ActivityEntry
                key={log._id}
                log={log}
                showIssueTitle={showIssueTitle}
              />
            ))}
          </div>
        </div>
      ))}

      {!loading && pagination?.hasNext && (
        <button
          className={styles.loadMoreBtn}
          onClick={handleLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <span className={styles.loadingDots}>
              Loading<span>.</span><span>.</span><span>.</span>
            </span>
          ) : (
            `Load more  (${pagination.total - logs.length} remaining)`
          )}
        </button>
      )}

    </div>
  )
}
