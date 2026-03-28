import { createProjectApi } from '../../api/projectApi'
import { useForm } from '../../hooks/useForm'
import { createProjectSchema } from '../../utils/validators/project.schema'
import { parseApiError } from '../../utils/errorHandler'
import { toast } from '../../components/common/Toast'
import FormField from '../common/FormField'
import FormError from '../common/FormError'
import LoadingButton from '../common/LoadingButton'

export default function CreateProjectModal({ onClose, onCreated }) {
  const { getFieldProps, handleSubmit, loading, apiError, setApiError } = useForm({
    initialValues: { name: '', description: '' },
    schema: createProjectSchema,
    onSubmit: async (values, { setApiError, setFieldErrors }) => {
      try {
        await createProjectApi(values)
        toast.success('Project created successfully')
        onCreated()
        onClose()
      } catch (err) {
        const parsed = parseApiError(err)
        if (parsed.fieldErrors) setFieldErrors(parsed.fieldErrors)
        else setApiError(parsed)
      }
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-[500px] shadow-xl border border-[#e2e8f0] p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#1a202c]">New project</h2>
          <button onClick={onClose} className="text-[#718096] hover:text-[#1a202c] hover:bg-[#edf2f7] rounded p-1.5 transition-colors leading-none text-base">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <FormError error={apiError} onDismiss={() => setApiError(null)} />

          <FormField
            label="Project name"
            placeholder="e.g. Website Redesign"
            required
            {...getFieldProps('name')}
          />

          <FormField
            as="textarea"
            label="Description"
            placeholder="What is this project about?"
            maxLength={500}
            rows={4}
            {...getFieldProps('description')}
          />

          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm border border-[#e2e8f0] rounded-sm text-[#4a5568] hover:border-[#4a5568] hover:text-[#1a202c] transition-colors">
              Cancel
            </button>
            <LoadingButton type="submit" loading={loading} variant="primary">
              Create project
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
