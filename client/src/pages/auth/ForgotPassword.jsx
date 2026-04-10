import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPasswordApi } from '../../api/authApi'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required'); return }

    try {
      setLoading(true)
      await forgotPasswordApi({ email: email.trim() })
      navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-[#1a202c]">Forgot password?</h1>
          <p className="text-[#718096] mt-1.5 text-[13.5px]">
            Enter your email and we'll send you a reset code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#4a5568]">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`bg-[#f7f9fc] border rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-primary transition-colors ${error ? 'border-red-400' : 'border-[#e2e8f0]'}`}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-[15px] font-semibold mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13.5px] text-[#718096]">
          Remember your password?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
