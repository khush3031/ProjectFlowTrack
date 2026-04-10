import Joi from 'joi'

export const createIssueSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().messages({
    'string.min':   'Title must be at least 3 characters',
    'string.max':   'Title cannot exceed 150 characters',
    'any.required': 'Issue title is required',
  }),
  description: Joi.string().max(2000).allow('').optional(),
  status: Joi.string()
    .valid('todo', 'in_progress', 'done')
    .default('todo'),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium'),
  tags: Joi.string().max(50).allow(null, '').optional(),
  assignee: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid assignee ID',
    }),
  dueDate: Joi.date().allow(null).optional(),
})

export const updateIssueSchema = createIssueSchema.fork(
  ['title', 'description', 'status', 'priority',
   'assignee', 'dueDate', 'tags'],
  (f) => f.optional()
)

export const commentSchema = Joi.object({
  body: Joi.string().min(1).max(1000).required().messages({
    'string.min':   'Comment cannot be empty',
    'string.max':   'Comment cannot exceed 1000 characters',
    'any.required': 'Comment body is required',
  }),
})
