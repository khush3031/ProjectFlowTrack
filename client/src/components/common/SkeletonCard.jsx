import styles from './SkeletonCard.module.css'

export default function SkeletonCard({
  lines  = 3,
  height = 'auto',
  width  = '100%',
}) {
  const lineWidths = ['80%', '60%', '40%', '70%', '50%']

  return (
    <div className={styles.card} style={{ height, width }}>
      <div className={styles.header}>
        <div className={styles.avatarSkeleton} />
        <div className={styles.headerLines}>
          <div className={styles.line} style={{width:'45%'}}/>
          <div className={styles.line} style={{width:'30%'}}/>
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.line}
          style={{ width: lineWidths[i % lineWidths.length] }}
        />
      ))}
    </div>
  )
}
