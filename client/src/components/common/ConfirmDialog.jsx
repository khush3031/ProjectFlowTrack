export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-[400px] overflow-hidden"
        style={{ animation: 'dialogIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon + Text */}
        <div className="flex flex-col items-center text-center px-8 pt-8 pb-6 gap-3">
          {/* Danger icon */}
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-[17px] font-bold text-[#1a202c]">{title}</h3>
            <p className="text-[13.5px] text-[#718096] leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-7">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium border border-[#e2e8f0] rounded-md text-[#4a5568] hover:bg-[#f7f9fc] hover:border-[#cbd5e0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-sm font-semibold bg-danger text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  )
}
