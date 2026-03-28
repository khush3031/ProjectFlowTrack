import { useCallback } from 'react'
import { getMyActivityApi } from '../../api/activityApi'
import { useAuth } from '../../hooks/useAuth'
import ActivityFeed from '../../components/activity/ActivityFeed'
import styles from './MyActivity.module.css'

export default function MyActivity() {
  const { user } = useAuth()

  const fetchFn = useCallback(
    (params) => getMyActivityApi(params),
    []
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Your activity</h1>
        <p className={styles.sub}>
          Everything you have done across all projects
        </p>
      </div>

      <div className={styles.feedWrap}>
        <ActivityFeed
          fetchFn={fetchFn}
          showIssueTitle={true}
          title={`Activity for ${user?.name ?? 'you'}`}
        />
      </div>
    </div>
  )
}
