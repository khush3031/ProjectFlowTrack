import { useState, useEffect, useCallback } from 'react'
import styles from './Toast.module.css'

let _addToast = null

export const registerToastAdder = (fn) => { _addToast = fn }

export const toast = {
  success: (msg) => _addToast?.({ msg, type: 'success' }),
  error:   (msg) => _addToast?.({ msg, type: 'error' }),
  info:    (msg) => _addToast?.({ msg, type: 'info' }),
  warning: (msg) => _addToast?.({ msg, type: 'warning' }),
}

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6"  y1="6" x2="18" y2="18"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8"  x2="12.01" y2="8"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9"  x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
}

const DURATION = 4000

function ToastItem({ item, onRemove }) {
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onRemove(item.id), 250)
  }, [item.id, onRemove])

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION)
    return () => clearTimeout(t)
  }, [dismiss])

  return (
    <div
      className={`${styles.toast} ${styles[item.type]} ${
        exiting ? styles.exit : styles.enter
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.iconCircle} aria-hidden>
        {ICONS[item.type]}
      </div>
      <p className={styles.msg}>{item.msg}</p>
      <button
        className={styles.close}
        onClick={dismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
      <div
        className={styles.progress}
        style={{ animationDuration: `${DURATION}ms` }}
      />
    </div>
  )
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((t) => {
    const id = `toast_${Date.now()}_${Math.random()}`
    setToasts(prev => [...prev.slice(-3), { ...t, id }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    registerToastAdder(addToast)
  }, [addToast])

  return (
    <div className={styles.container} aria-label="Notifications">
      {toasts.map(t => (
        <ToastItem key={t.id} item={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
