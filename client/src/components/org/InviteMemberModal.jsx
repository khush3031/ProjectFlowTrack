import { useState } from 'react'
import { inviteUserApi } from '../../api/orgApi'
import { useForm } from '../../hooks/useForm'
import { inviteSchema } from '../../utils/validators/org.schema'
import { parseApiError } from '../../utils/errorHandler'
import { toast } from '../../components/common/Toast'
import FormField from '../common/FormField'
import FormError from '../common/FormError'
import LoadingButton from '../common/LoadingButton'

export default function InviteMemberModal({ onClose }) {
  const [token, setToken] = useState(null)
  const [invitedEmail, setInvitedEmail] = useState('')

  const { getFieldProps, handleSubmit, loading, apiError, setApiError } = useForm({
    initialValues: { email: '' },
    schema: inviteSchema,
    onSubmit: async (values, { setApiError, setFieldErrors }) => {
      try {
        const { data } = await inviteUserApi(values)
        setToken(data.invitation.token)
        setInvitedEmail(values.email)
        toast.success('Invitation created')
      } catch (err) {
        const parsed = parseApiError(err)
        if (parsed.fieldErrors) setFieldErrors(parsed.fieldErrors)
        else setApiError(parsed)
      }
    },
  })

  const inviteLink = `${window.location.origin}/invite/accept/${token}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-[460px] shadow-xl border border-[#e2e8f0] p-8" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#1a202c]">Invite a member</h2>
          <button onClick={onClose} className="text-[#718096] hover:text-[#1a202c] hover:bg-[#edf2f7] rounded p-1.5 transition-colors leading-none text-base">✕</button>
        </div>

        {!token ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <FormError error={apiError} onDismiss={() => setApiError(null)} />

            <FormField
              label="Email address"
              type="email"
              placeholder="colleague@company.com"
              required
              {...getFieldProps('email')}
            />

            <LoadingButton type="submit" loading={loading} variant="primary" className="w-full py-3 mt-1">
              Send Invitation
            </LoadingButton>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#4a5568]">
              Invitation created for <strong className="text-[#1a202c]">{invitedEmail}</strong>
            </p>
            <p className="text-[13px] text-[#718096]">Share this link:</p>
            <div className="flex items-center gap-2.5 bg-[#edf2f7] border border-[#e2e8f0] rounded-sm px-3.5 py-2.5">
              <span className="flex-1 text-[12px] text-[#4a5568] overflow-hidden text-ellipsis whitespace-nowrap">{inviteLink}</span>
              <button
                className="px-3.5 py-1.5 bg-primary text-white text-xs font-medium rounded-sm flex-shrink-0 hover:bg-primary-hover transition-colors"
                onClick={() => { navigator.clipboard.writeText(inviteLink); toast.success('Link copied') }}
              >
                Copy
              </button>
            </div>
            <p className="text-[12px] text-[#a0aec0]">Expires in 48 hours</p>
          </div>
        )}
      </div>
    </div>
  )
}
