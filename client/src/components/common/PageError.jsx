import styles from './PageError.module.css'

export default function PageError({
  title   = 'Something went wrong',
  message,
  onRetry,
  onBack,
  backLabel = 'Go back',
  code,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.iconRing}>
        <svg width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-danger)"
          strokeWidth="1.5" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94
                   a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{title}</h2>
          {code && (
            <span className={styles.code}>{code}</span>
          )}
        </div>
        {message && (
          <p className={styles.message}>{message}</p>
        )}
        <div className={styles.actions}>
          {onBack && (
            <button
              className={styles.backBtn}
              onClick={onBack}
            >
              {backLabel}
            </button>
          )}
          {onRetry && (
            <button
              className={styles.retryBtn}
              onClick={onRetry}
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
