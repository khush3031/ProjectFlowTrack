import Joi from 'joi'

export const createOrgSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min':   'Organization name must be at least 2 characters',
    'any.required': 'Organization name is required',
  }),
})

export const inviteSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Enter a valid email address',
    'any.required': 'Email is required',
  }),
})

export const addDirectMemberSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID',
      'any.required':        'User ID is required',
    }),
})

export const assignRoleSchema = Joi.object({
  role: Joi.string()
    .valid('admin', 'member')
    .required()
    .messages({
      'any.only':     'Role must be admin or member',
      'any.required': 'Role is required',
    }),
})
