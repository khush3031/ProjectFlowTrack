import { useState, useEffect } from 'react'
import styles from './NetworkBanner.module.css'

export default function NetworkBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const handleNetworkError = () => setOffline(true)
    const handleOnline = () => setOffline(false)

    window.addEventListener('app:network-error', handleNetworkError)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', () => setOffline(true))

    return () => {
      window.removeEventListener('app:network-error', handleNetworkError)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!offline) return null

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.dot} />
      <span className={styles.text}>
        Connection lost — changes may not save
      </span>
      <button
        className={styles.dismiss}
        onClick={() => setOffline(false)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
