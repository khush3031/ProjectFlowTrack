import { useNavigate, Link }  from 'react-router-dom'
import { registerApi }        from '../../api/authApi'
import { useForm }            from '../../hooks/useForm'
import { registerSchema }     from '../../utils/validators/auth.schema'
import { parseApiError, isConflict, getFriendlyMessage } from '../../utils/errorHandler'
import FormField              from '../../components/common/FormField'
import FormError              from '../../components/common/FormError'
import LoadingButton          from '../../components/common/LoadingButton'
import { toast }              from '../../components/common/Toast'

export default function Register() {
  const navigate = useNavigate()

  // Read invite query params
  const params      = new URLSearchParams(window.location.search)
  const inviteEmail = params.get('email') || ''
  const inviteToken = params.get('inviteToken') || ''

  const {
    getFieldProps,
    handleSubmit,
    loading,
    apiError,
    setApiError,
    setFieldError,
  } = useForm({
    initialValues: {
      name: '', email: inviteEmail, password: '', confirmPassword: '',
    },
    schema:  registerSchema,
    onSubmit: async (values, { setApiError, setFieldError }) => {
      try {
        await registerApi(values)
        toast.success('Account created! Completing your invitation…')
        // If this was an invite flow, go back to accept the token
        if (inviteToken) {
          navigate(`/invite/accept/${inviteToken}`, { replace: true })
        } else {
          navigate('/login')
        }
      } catch (err) {
        const parsed = parseApiError(err)
        if (isConflict(parsed)) {
          setFieldError('email', parsed.message)
        } else if (parsed.fieldErrors) {
          Object.entries(parsed.fieldErrors).forEach(
            ([f, m]) => setFieldError(f, m)
          )
        } else {
          setApiError(parsed)
          toast.error(getFriendlyMessage(parsed))
        }
      }
    },
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[460px] bg-white border border-[#e2e8f0] rounded-xl shadow-xl p-8 md:p-10">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1a202c]">Create your account</h1>
          <p className="text-[#718096] mt-1.5 text-[13.5px]">
            {inviteToken
              ? 'Complete your registration to accept the invitation'
              : 'Join TrackFlow and start tracking your work'}
          </p>
        </div>

        {/* Invite banner */}
        {inviteEmail && (
          <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/20 rounded-md px-4 py-3 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <p className="text-[13px] text-[#4a5568]">
              You've been invited — registering as <span className="font-semibold text-primary">{inviteEmail}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <FormError error={apiError} onDismiss={() => setApiError(null)} />

          <FormField
            label="Full name"
            placeholder="Alex Johnson"
            required
            {...getFieldProps('name')}
          />

          <FormField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
            disabled={Boolean(inviteEmail)}
            {...getFieldProps('email')}
          />

          <FormField
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            required
            hint="Must include uppercase, lowercase and a number"
            {...getFieldProps('password')}
          />

          <FormField
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            required
            {...getFieldProps('confirmPassword')}
          />

          <LoadingButton
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full py-3 font-semibold text-[15px] mt-2"
          >
            {inviteToken ? 'Create account & join' : 'Create account'}
          </LoadingButton>
        </form>

        <p className="mt-4 text-center text-[13.5px] text-[#718096]">
          Already have an account?{' '}
          <Link
            to={inviteToken ? `/login?inviteToken=${inviteToken}` : '/login'}
            className="text-primary font-bold hover:underline ml-1"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
