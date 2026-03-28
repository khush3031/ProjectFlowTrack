import ActivityIcon from './ActivityIcon'
import {
  ACTION_META,
  formatLogMessage,
  formatTimeAgo,
  formatFullDate,
} from '../../utils/activityHelpers'
import styles from './ActivityEntry.module.css'

export default function ActivityEntry({ log, showIssueTitle = false }) {
  const meta    = ACTION_META[log.action] ?? ACTION_META.ISSUE_UPDATED
  const message = formatLogMessage(log)

  return (
    <div className={styles.entry}>

      <div
        className={styles.iconWrap}
        style={{
          background: meta.bg,
          border: `1px solid ${meta.border}`,
        }}
      >
        <ActivityIcon icon={meta.icon} color={meta.color} size={14} />
      </div>

      <div className={styles.body}>
        {showIssueTitle && log.issue?.title && (
          <p className={styles.issueRef}>
            {log.issue.title}
          </p>
        )}

        <p className={styles.summary}>{message.summary}</p>

        {message.detail && (
          <div className={styles.detail}>

            {message.detail.type === 'transition' && (
              <div className={styles.transition}>
                <span className={styles.fromPill}>
                  {message.detail.from}
                </span>
                <span className={styles.arrow}>→</span>
                <span className={styles.toPill}>
                  {message.detail.to}
                </span>
              </div>
            )}

            {message.detail.type === 'text' && (
              <div className={styles.textDiff}>
                {message.detail.from && (
                  <span className={styles.oldText}>
                    {message.detail.from}
                  </span>
                )}
                {message.detail.to && (
                  <span className={styles.newText}>
                    {message.detail.to}
                  </span>
                )}
              </div>
            )}

            {message.detail.type === 'quote' && (
              <div className={styles.quote}>
                {message.detail.text}
              </div>
            )}

          </div>
        )}
      </div>

      <div className={styles.time}>
        <span
          title={formatFullDate(log.createdAt)}
          className={styles.timeLabel}
        >
          {formatTimeAgo(log.createdAt)}
        </span>
      </div>

    </div>
  )
}
