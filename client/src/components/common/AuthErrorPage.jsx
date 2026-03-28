import styles from './AuthErrorPage.module.css'

export default function AuthErrorPage({
  code    = 403,
  message = 'You do not have permission to view this page',
  onGoHome,
}) {
  const is401 = code === 401

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.codeBadge}>
          {code}
        </div>
        <h1 className={styles.title}>
          {is401 ? 'Session expired' : 'Access denied'}
        </h1>
        <p className={styles.msg}>{message}</p>
        <div className={styles.actions}>
          {is401 ? (
            <button
              className={styles.primaryBtn}
              onClick={() => window.location.href = '/login'}
            >
              Sign in again
            </button>
          ) : (
            <button
              className={styles.primaryBtn}
              onClick={onGoHome ?? (() => window.history.back())}
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
