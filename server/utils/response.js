export const Response = {

  success: (res, data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  },

  created: (res, data = {}, message = 'Created successfully') => {
    return Response.success(res, data, message, 201)
  },

  noContent: (res) => {
    return res.status(204).send()
  },

  error: (res, message, statusCode = 500, code = 'ERROR', errors = null) => {
    const body = {
      success:   false,
      message,
      code,
      timestamp: new Date().toISOString(),
    }
    if (errors) body.errors = errors
    return res.status(statusCode).json(body)
  },

  validationError: (res, message, errors = null) => {
    return Response.error(res, message, 400, 'VALIDATION_ERROR', errors)
  },

  unauthorized: (res, message = 'Authentication required') => {
    return Response.error(res, message, 401, 'UNAUTHORIZED')
  },

  forbidden: (res, message = 'Access denied') => {
    return Response.error(res, message, 403, 'FORBIDDEN')
  },

  notFound: (res, resource = 'Resource') => {
    return Response.error(
      res,
      `${resource} not found`,
      404,
      'NOT_FOUND'
    )
  },

  conflict: (res, message) => {
    return Response.error(res, message, 409, 'CONFLICT')
  },

  serverError: (res, message = 'Internal server error') => {
    return Response.error(res, message, 500, 'INTERNAL_ERROR')
  },
}
