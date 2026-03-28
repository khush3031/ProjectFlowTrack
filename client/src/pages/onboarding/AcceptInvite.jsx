import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInviteInfoApi, acceptInviteApi } from '../../api/orgApi'
import { useAuth } from '../../hooks/useAuth'
import { toast } from '../../utils/toast'
import Spinner from '../../components/common/Spinner'

export default function AcceptInvite() {
  const { token }             = useParams()
  const { user, fetchMe }     = useAuth()
  const navigate              = useNavigate()
  const [status, setStatus]   = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        // Step 1: peek at the invite — get email + org name without consuming the token
        const { data: info } = await getInviteInfoApi(token)
        const { email, orgName } = info

        if (!user) {
          // Not logged in → send to register with email pre-filled and token stored
          sessionStorage.setItem('pendingInviteToken', token)
          navigate(`/register?email=${encodeURIComponent(email)}&inviteToken=${token}`, { replace: true })
          return
        }

        // Already logged in → accept immediately
        const { data } = await acceptInviteApi(token)
        setMessage(data.message || `You've joined ${orgName}!`)
        setStatus('success')
        await fetchMe()
        setTimeout(() => navigate('/dashboard'), 2500)

      } catch (err) {
        setMessage(err.response?.data?.message || 'Invalid or expired invitation')
        setStatus('error')
      }
    }
    run()
  }, [token])

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">

      {/* Brand */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-primary/20 mb-3">
          TF
        </div>
        <span className="text-xl font-bold text-[#1a202c]">TrackFlow</span>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-xl w-full max-w-[420px] p-10 flex flex-col items-center text-center">

        {status === 'loading' && (
          <>
            <div className="mb-5"><Spinner /></div>
            <p className="text-[15px] font-semibold text-[#1a202c] mb-1">Verifying invitation</p>
            <p className="text-[13px] text-[#718096]">Please wait while we validate your invite link…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[16px] font-bold text-[#1a202c] mb-2">{message}</p>
            <p className="text-[13px] text-[#718096]">Redirecting to dashboard…</p>
            <div className="mt-5 w-full bg-[#edf2f7] rounded-full h-1 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ animation: 'progress 2.5s linear forwards' }} />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[16px] font-bold text-[#1a202c] mb-2">Invitation failed</p>
            <p className="text-[13.5px] text-[#718096] leading-relaxed">{message}</p>
            <button
              className="mt-7 w-full py-3 bg-primary text-white text-[14px] font-semibold rounded-md hover:bg-primary-hover transition-colors"
              onClick={() => navigate('/login')}
            >
              Go to login
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}
