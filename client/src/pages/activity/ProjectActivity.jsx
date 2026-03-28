import { useParams, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { getProjectActivityApi } from '../../api/activityApi'
import ActivityFeed from '../../components/activity/ActivityFeed'
import styles from './ProjectActivity.module.css'

export default function ProjectActivity() {
  const { projectId } = useParams()
  const navigate      = useNavigate()

  const fetchFn = useCallback(
    (params) => getProjectActivityApi(projectId, params),
    [projectId]
  )

  return (
    <div className={styles.page}>
      <button
        className={styles.back}
        onClick={() => navigate(`/projects/${projectId}`)}
      >
        ← Back to project
      </button>

      <div className={styles.header}>
        <h1 className={styles.heading}>Project activity</h1>
        <p className={styles.sub}>
          All changes across every issue in this project
        </p>
      </div>

      <div className={styles.feedWrap}>
        <ActivityFeed
          fetchFn={fetchFn}
          showIssueTitle={true}
          title="All activity"
        />
      </div>
    </div>
  )
}
