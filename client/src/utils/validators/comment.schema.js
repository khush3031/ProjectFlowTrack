import * as yup from 'yup'

export const commentSchema = yup.object({
  body: yup
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .required('Comment is required'),
})
