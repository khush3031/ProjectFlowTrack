import { createIssueApi } from '../../api/issueApi'
import { useForm } from '../../hooks/useForm'
import { createIssueSchema } from '../../utils/validators/issue.schema'
import { parseApiError } from '../../utils/errorHandler'
import { toast } from '../../components/common/Toast'
import FormField from '../common/FormField'
import FormError from '../common/FormError'
import LoadingButton from '../common/LoadingButton'

export default function CreateIssueModal({ projectId, projectMembers = [], onClose, onCreated }) {
  const { getFieldProps, handleSubmit, loading, apiError, setApiError } = useForm({
    initialValues: { title: '', description: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '' },
    schema: createIssueSchema,
    onSubmit: async (values, { setApiError, setFieldErrors }) => {
      try {
        await createIssueApi(projectId, {
          ...values,
          assignee: values.assignee || null,
          dueDate: values.dueDate || null,
        })
        toast.success('Issue created successfully')
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
      <div className="bg-white rounded-lg w-full max-w-[600px] shadow-xl border border-[#e2e8f0] p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#1a202c]">New issue</h2>
          <button onClick={onClose} className="text-[#718096] hover:text-[#1a202c] hover:bg-[#edf2f7] rounded p-1.5 transition-colors leading-none text-base">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <FormError error={apiError} onDismiss={() => setApiError(null)} />

          <FormField
            label="Title"
            placeholder="What needs to be done?"
            required
            {...getFieldProps('title')}
          />

          <FormField
            as="textarea"
            label="Description"
            placeholder="Add more details..."
            maxLength={2000}
            rows={4}
            {...getFieldProps('description')}
          />

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <FormField as="select" label="Status" {...getFieldProps('status')}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </FormField>

            <FormField as="select" label="Priority" {...getFieldProps('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </FormField>

            <FormField as="select" label="Assignee" {...getFieldProps('assignee')}>
              <option value="">Unassigned</option>
              {projectMembers
                .filter(m => m.role?.name === 'member')
                .map(m => (
                  <option key={m._id || m.id} value={m._id || m.id}>{m.name}</option>
                ))}
            </FormField>

            <FormField type="date" label="Due Date" {...getFieldProps('dueDate')} />
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm border border-[#e2e8f0] rounded-sm text-[#4a5568] hover:border-[#4a5568] hover:text-[#1a202c] transition-colors">
              Cancel
            </button>
            <LoadingButton type="submit" loading={loading} variant="primary">
              Create issue
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
