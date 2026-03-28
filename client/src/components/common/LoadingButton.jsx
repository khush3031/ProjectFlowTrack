export default function LoadingButton({
  loading   = false,
  disabled  = false,
  onClick,
  type      = 'button',
  children,
  variant   = 'primary',
  className = '',
}) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold border-none cursor-pointer transition-all min-w-[100px] disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-hover',
    danger:    'bg-danger text-white hover:opacity-85',
    secondary: 'bg-transparent border border-[#e2e8f0] text-[#4a5568] hover:border-[#4a5568] hover:text-[#1a202c]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0"
          style={variant === 'secondary' ? { borderColor: 'rgba(74,85,104,0.25)', borderTopColor: '#4a5568' } : {}}
        />
      )}
      <span className={loading ? 'opacity-85' : ''}>{children}</span>
    </button>
  )
}
