import { useState } from 'react'

export default function FormField({
  label,
  name,
  type       = 'text',
  value      = '',
  onChange,
  onBlur,
  error      = '',
  placeholder,
  required   = false,
  disabled   = false,
  rows,
  maxLength,
  hint,
  children,
  as         = 'input',
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword && showPassword ? 'text' : type

  const hasError  = Boolean(error)
  const showCount = maxLength !== undefined
  const charCount = String(value).length
  const hasFooter = hasError || (!hasError && hint) || showCount

  const baseInput = [
    'w-full px-4 py-3 text-[14.5px] leading-tight',
    'bg-[#f1f4f8] border-[1.5px] rounded-md outline-none transition-all duration-150',
    'placeholder:text-[#b0bac4] text-[#1a202c] font-normal',
    hasError
      ? 'border-danger bg-red-50 focus:border-danger focus:bg-white focus:shadow-[0_0_0_3px_rgba(224,82,82,0.10)]'
      : 'border-transparent focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(108,99,255,0.10)]',
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
  ].filter(Boolean).join(' ')

  const inputProps = {
    id:   name,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    maxLength,
    'aria-invalid':     hasError,
    'aria-describedby': hasError ? `${name}-error` : undefined,
    className: baseInput,
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-[13px] font-semibold text-[#4a5568] flex items-center gap-1 select-none">
          {label}
          {required && <span className="text-danger" aria-hidden>*</span>}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          {...inputProps}
          rows={rows ?? 4}
          className={`${inputProps.className} resize-y min-h-[96px]`}
        />
      ) : as === 'select' ? (
        <select {...inputProps} className={`${inputProps.className} cursor-pointer appearance-none`}>
          {children}
        </select>
      ) : (
        <div className={isPassword ? 'relative flex items-center' : ''}>
          <input
            {...inputProps}
            type={inputType}
            className={isPassword ? `${inputProps.className} pr-11` : inputProps.className}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 text-[#b0bac4] hover:text-[#4a5568] p-1 rounded transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex="-1"
            >
              {showPassword ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {hasFooter && (
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {hasError && (
              <p
                id={`${name}-error`}
                className="flex items-center gap-1.5 text-[12px] font-medium text-danger"
                role="alert"
                aria-live="polite"
              >
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-danger text-white text-[9px] font-extrabold flex-shrink-0">!</span>
                {error}
              </p>
            )}
            {!hasError && hint && (
              <p className="text-[12px] text-[#a0aec0] leading-snug">{hint}</p>
            )}
          </div>
          {showCount && (
            <span className={`text-[11px] flex-shrink-0 tabular-nums ${charCount >= maxLength * 0.9 ? 'text-warning font-medium' : 'text-[#a0aec0]'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
