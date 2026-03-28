import { updateIssueApi } from '../../api/issueApi'
import { useForm } from '../../hooks/useForm'
import { updateIssueSchema } from '../../utils/validators/issue.schema'
import { parseApiError } from '../../utils/errorHandler'
import { toast } from '../../components/common/Toast'
import FormField from '../common/FormField'
import FormError from '../common/FormError'
import LoadingButton from '../common/LoadingButton'

export default function EditIssueModal({ issue, projectId, projectMembers = [], onClose, onUpdated }) {
  const { getFieldProps, handleSubmit, loading, apiError, setApiError } = useForm({
    initialValues: {
      title:       issue.title,
      description: issue.description || '',
      status:      issue.status,
      priority:    issue.priority,
      assignee:    issue.assignee?._id || issue.assignee?.id || '',
      dueDate:     issue.dueDate ? issue.dueDate.split('T')[0] : '',
    },
    schema: updateIssueSchema,
    onSubmit: async (values, { setApiError, setFieldErrors }) => {
      try {
        const changedFields = {}
        const originalAssignee = issue.assignee?._id || issue.assignee?.id || ''
        const originalDueDate  = issue.dueDate ? issue.dueDate.split('T')[0] : ''

        if (values.title       !== issue.title)               changedFields.title       = values.title
        if (values.description !== (issue.description || '')) changedFields.description = values.description
        if (values.status      !== issue.status)              changedFields.status      = values.status
        if (values.priority    !== issue.priority)            changedFields.priority    = values.priority
        if (values.assignee    !== originalAssignee)          changedFields.assignee    = values.assignee || null
        if (values.dueDate     !== originalDueDate)           changedFields.dueDate     = values.dueDate || null

        if (Object.keys(changedFields).length > 0) {
          await updateIssueApi(projectId, issue._id, changedFields)
          toast.success('Issue updated successfully')
        }
        onUpdated()
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
          <h2 className="text-lg font-semibold text-[#1a202c]">Edit issue</h2>
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
              {projectMembers.map(m => (
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
              Save changes
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
