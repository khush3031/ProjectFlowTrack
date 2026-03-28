import { useState, useEffect } from 'react'
import { getFriendlyMessage } from '../../utils/errorHandler'

export default function FormError({ error, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(Boolean(error))
  }, [error])

  if (!error || !visible) return null

  const message = getFriendlyMessage(error)

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div
      className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-md mb-4"
      role="alert"
      aria-live="assertive"
    >
      <span className="text-danger flex-shrink-0 mt-0.5" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </span>
      <p className="flex-1 text-[13px] font-medium text-danger leading-snug">{message}</p>
      <button
        type="button"
        className="text-danger/60 hover:text-danger text-[13px] flex-shrink-0 leading-none px-0.5 transition-colors"
        onClick={handleDismiss}
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  )
}
