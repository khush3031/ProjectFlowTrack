import styles from './Spinner.module.css'

export default function Spinner({ fullscreen = false }) {
  if (fullscreen) {
    return (
      <div className={styles.fullscreen}>
        <div className={styles.ring} />
      </div>
    )
  }
  return <div className={styles.ring} />
}
