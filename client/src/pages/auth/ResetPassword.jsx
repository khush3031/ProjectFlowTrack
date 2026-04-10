import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordApi, forgotPasswordApi } from '../../api/authApi'

function EyeIcon({ visible }) {
  return visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefillEmail = searchParams.get('email') || ''

  const [email, setEmail]           = useState(prefillEmail)
  const [otp, setOtp]               = useState(['', '', '', '', '', ''])
  const [newPassword, setPassword]  = useState('')
  const [showPassword, setShowPw]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [done, setDone]             = useState(false)
  const [errors, setErrors]         = useState({})
  const [resending, setResending]   = useState(false)
  const [resendCooldown, setCooldown] = useState(0)
  const inputRefs = useRef([])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleResend = async () => {
    if (!email.trim() || resending || resendCooldown > 0) return
    try {
      setResending(true)
      setErrors({})
      await forgotPasswordApi({ email: email.trim() })
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setCooldown(60)
    } catch {
      setErrors({ form: 'Failed to resend OTP — please try again' })
    } finally {
      setResending(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    const lastFilled = Math.min(pasted.length, 5)
    inputRefs.current[lastFilled]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
    const otpStr = otp.join('')
    if (otpStr.length < 6) errs.otp = 'Enter all 6 digits'
    if (!newPassword) errs.newPassword = 'New password is required'
    else if (newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword))
      errs.newPassword = 'Must contain uppercase, lowercase and a number'

    if (Object.keys(errs).length) { setErrors(errs); return }

    try {
      setLoading(true)
      await resetPasswordApi({ email: email.trim(), otp: otpStr, newPassword })
      setDone(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('code')) {
        setErrors({ otp: msg })
      } else {
        setErrors({ form: msg })
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-white border border-[#e2e8f0] rounded-xl shadow-xl p-8 md:p-12 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-4xl">✅</div>
          <div>
            <h2 className="text-xl font-bold text-[#1a202c] mb-2">Password reset!</h2>
            <p className="text-[13.5px] text-[#718096] leading-relaxed">
              Your password has been changed and all active sessions have been signed out.
            </p>
          </div>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="btn-primary w-full py-3 text-[15px] font-semibold"
          >
            Sign in with new password
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white border border-[#e2e8f0] rounded-xl shadow-xl p-8 md:p-12">

        <div className="flex flex-col items-center mb-7">
          <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center font-bold text-lg text-white mb-3 shadow-lg shadow-primary/20">
            TF
          </div>
          <span className="text-xl font-bold text-[#1a202c]">TrackFlow</span>
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-[#1a202c]">Reset password</h1>
          <p className="text-[#718096] mt-1.5 text-[13.5px]">
            Enter the 6-digit code we sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-lg">
              {errors.form}
            </div>
          )}

          {/* Email */}
          {!prefillEmail && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#4a5568]">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`bg-[#f7f9fc] border rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-red-400' : 'border-[#e2e8f0]'}`}
              />
              {errors.email && <p className="text-[12px] text-red-500">{errors.email}</p>}
            </div>
          )}

          {/* OTP boxes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568]">Verification code</label>
            <div className="flex items-center gap-2.5 justify-center" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-colors bg-[#f7f9fc]
                    ${digit ? 'border-primary text-primary' : errors.otp ? 'border-red-400' : 'border-[#e2e8f0]'}
                    focus:border-primary`}
                  style={{ height: '52px' }}
                  autoFocus={i === 0 && !!prefillEmail}
                />
              ))}
            </div>
            {errors.otp && <p className="text-[12px] text-red-500 text-center mt-1">{errors.otp}</p>}
          </div>

          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568]">New password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 chars, upper + lower + number"
                className={`w-full bg-[#f7f9fc] border rounded-lg px-4 py-3 pr-10 text-[14px] focus:outline-none focus:border-primary transition-colors ${errors.newPassword ? 'border-red-400' : 'border-[#e2e8f0]'}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-[#4a5568] transition-colors"
                tabIndex={-1}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            {errors.newPassword && <p className="text-[12px] text-red-500">{errors.newPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[15px] font-semibold mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            className="text-[13px] font-medium disabled:cursor-not-allowed transition-colors
              text-primary hover:underline disabled:text-[#a0aec0] disabled:no-underline"
          >
            {resending
              ? 'Sending...'
              : resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Didn't receive a code? Send again"}
          </button>
          <Link to="/login" className="text-[13px] text-[#718096] hover:text-primary transition-colors">
            Back to sign in
          </Link>
        </div>

      </div>
    </div>
  )
}
