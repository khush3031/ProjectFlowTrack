import Joi from 'joi'
import { Response } from '../utils/response.js'

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly:      false,
    stripUnknown:    true,
    allowUnknown:    false,
  })

  if (error) {
    const fieldErrors = error.details.reduce((acc, d) => {
      const field = d.path.join('.')
      acc[field]  = d.message.replace(/['"]/g, '')
      return acc
    }, {})

    return Response.validationError(
      res,
      'Please fix the errors below',
      fieldErrors
    )
  }

  req.body = value
  next()
}
