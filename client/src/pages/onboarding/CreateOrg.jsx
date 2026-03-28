import { useNavigate } from 'react-router-dom'
import { createOrgApi } from '../../api/orgApi'
import { useAuth } from '../../hooks/useAuth'
import { useOrg } from '../../hooks/useOrg'
import { useForm } from '../../hooks/useForm'
import { createOrgSchema } from '../../utils/validators/org.schema'
import { parseApiError } from '../../utils/errorHandler'
import { toast } from '../../components/common/Toast'
import FormField from '../../components/common/FormField'
import FormError from '../../components/common/FormError'
import LoadingButton from '../../components/common/LoadingButton'

export default function CreateOrg() {
  const { fetchMe } = useAuth()
  const { fetchOrg } = useOrg()
  const navigate = useNavigate()

  const {
    getFieldProps,
    handleSubmit,
    loading,
    apiError,
    setApiError,
    setFieldErrors,
  } = useForm({
    initialValues: { name: '' },
    schema: createOrgSchema,
    onSubmit: async (values, { setApiError, setFieldErrors }) => {
      try {
        await createOrgApi(values)
        await fetchMe()
        await fetchOrg()
        toast.success('Organization created successfully')
        navigate('/dashboard')
      } catch (err) {
        const parsed = parseApiError(err)
        if (parsed.fieldErrors) {
          setFieldErrors(parsed.fieldErrors)
        } else {
          setApiError(parsed)
        }
      }
    },
  })

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-white border border-[#e2e8f0] rounded-xl shadow-xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-[#1a202c] text-center mb-4">Create your organization</h2>
        <p className="text-[#4a5568] text-[14px] text-center mb-9 leading-relaxed">
          You are not part of any organization yet.
          Create one to get started, or ask your admin for an invite link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <FormError error={apiError} onDismiss={() => setApiError(null)} />
          
          <FormField
            label="Organization name"
            placeholder="e.g. Acme Corp"
            required
            {...getFieldProps('name')}
          />

          <LoadingButton
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full py-3 font-semibold text-[15px] mt-2"
          >
            Create Organization
          </LoadingButton>
        </form>
      </div>
    </div>
  )
}
