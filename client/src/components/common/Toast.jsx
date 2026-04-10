import { useState, useEffect, useCallback } from 'react'

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

const TYPE_CLASSES = {
  success: 'bg-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.25)]',
  error:   'bg-red-500 shadow-[0_8px_20px_rgba(239,68,68,0.25)]',
  info:    'bg-blue-500 shadow-[0_8px_20px_rgba(59,130,246,0.25)]',
  warning: 'bg-amber-500 shadow-[0_8px_20px_rgba(245,158,11,0.25)]',
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
      className={[
        'flex items-center gap-3 p-4 rounded-md',
        'border border-white/10 pointer-events-auto',
        'relative overflow-hidden backdrop-blur-sm text-white',
        'shadow-[0_10px_30px_rgba(0,0,0,0.12)]',
        TYPE_CLASSES[item.type],
        exiting ? 'animate-toast-out' : 'animate-toast-in',
      ].join(' ')}
      role="alert"
      aria-live="polite"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20 text-white"
        aria-hidden
      >
        {ICONS[item.type]}
      </div>

      <p className="flex-1 text-sm font-medium leading-snug text-white">
        {item.msg}
      </p>

      <button
        className="bg-transparent border-0 text-white/60 text-sm cursor-pointer p-1 rounded-sm flex-shrink-0 leading-none transition-all duration-150 hover:bg-white/10 hover:text-white"
        onClick={dismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>

      <div
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-white/40 animate-progress-shrink"
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
    <div
      className="fixed top-6 right-6 flex flex-col gap-3 z-[9999] pointer-events-none max-w-[380px] w-[calc(100vw-48px)]"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} item={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
