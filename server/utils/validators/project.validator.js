import Joi from 'joi'

export const createProjectSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min':   'Project name must be at least 2 characters',
    'string.max':   'Project name cannot exceed 100 characters',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().max(500).allow('').optional(),
})

export const updateProjectSchema = createProjectSchema.fork(
  ['name', 'description'],
  (f) => f.optional()
)

export const addMemberSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID',
      'any.required':        'User ID is required',
    }),
})
