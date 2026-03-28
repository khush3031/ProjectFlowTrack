import * as yup from 'yup'

export const createProjectSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name cannot exceed 100 characters')
    .required('Project name is required'),
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
})

export const updateProjectSchema = createProjectSchema.partial()
