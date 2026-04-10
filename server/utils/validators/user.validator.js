import Joi from 'joi'

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(80).optional().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 80 characters',
  }),
  currentPassword: Joi.string().optional().allow(''),
  newPassword: Joi.string().min(6).max(100).optional().messages({
    'string.min': 'New password must be at least 6 characters',
  }),
}).min(1)
