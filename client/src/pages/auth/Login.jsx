import { useNavigate, Link }  from 'react-router-dom'
import { loginApi }           from '../../api/authApi'
import { useAuth }            from '../../hooks/useAuth'
import { useForm }            from '../../hooks/useForm'
import { loginSchema }        from '../../utils/validators/auth.schema'
import { parseApiError, getFriendlyMessage } from '../../utils/errorHandler'
import FormField              from '../../components/common/FormField'
import FormError              from '../../components/common/FormError'
import LoadingButton          from '../../components/common/LoadingButton'
import { toast }              from '../../components/common/Toast'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const inviteToken = new URLSearchParams(window.location.search).get('inviteToken') || ''

  const {
    getFieldProps,
    handleSubmit,
    loading,
    apiError,
    setApiError,
  } = useForm({
    initialValues: { email: '', password: '' },
    schema:        loginSchema,
    onSubmit: async (values, { setApiError }) => {
      try {
        const { data } = await loginApi(values)
        login(data.data.accessToken, data.data.user)
        toast.success(`Welcome back, ${data.data.user.name}`)
        if (inviteToken) {
          navigate(`/invite/accept/${inviteToken}`, { replace: true })
        } else if (!data.data.user.organization) {
          navigate('/onboarding')
        } else {
          navigate('/dashboard')
        }
      } catch (err) {
        const parsed = parseApiError(err)
        setApiError(parsed)
        toast.error(getFriendlyMessage(parsed))
      }
    },
  })

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
          <h1 className="text-2xl font-bold text-[#1a202c]">Welcome back</h1>
          <p className="text-[#718096] mt-1.5 text-[13.5px]">
            Sign in to your account to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
          noValidate
        >
          <FormError
            error={apiError}
            onDismiss={() => setApiError(null)}
          />

          <FormField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
            {...getFieldProps('email')}
          />

          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            {...getFieldProps('password')}
          />

          <LoadingButton
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full py-3 font-semibold text-[15px] mt-3"
          >
            Sign in
          </LoadingButton>
        </form>

        <p className="mt-5 text-center text-[13.5px] text-[#718096]">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline ml-1">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
