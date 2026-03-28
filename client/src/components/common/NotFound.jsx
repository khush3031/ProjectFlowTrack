import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.number}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.msg}>
          The page you are looking for does not exist
          or has been moved.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate('/dashboard')}
          >
            Back to dashboard
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
