import * as yup from 'yup'

export const createIssueSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters')
    .required('Issue title is required'),
  description: yup
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  status: yup
    .string()
    .oneOf(['todo', 'in_progress', 'done'])
    .default('todo'),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high'])
    .default('medium'),
  assignee: yup.string().nullable().optional(),
  dueDate:  yup.date().nullable().optional(),
})

export const updateIssueSchema = createIssueSchema.partial()
