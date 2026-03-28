import { Response } from '../utils/response.js'
import { AppError } from '../utils/AppError.js'

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export const globalErrorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development'

  console.error(
    `[${new Date().toISOString()}] ERROR ${req.method} ${req.path}`,
    isDev ? err : err.message
  )

  if (err instanceof AppError) {
    return Response.error(
      res,
      err.message,
      err.statusCode,
      err.code
    )
  }

  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map(e => e.message)
    return Response.validationError(
      res,
      messages.join(', ')
    )
  }

  if (err.name === 'CastError') {
    return Response.error(
      res,
      `Invalid value for field: ${err.path}`,
      400,
      'INVALID_ID'
    )
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field'
    const value = err.keyValue?.[field]
    return Response.conflict(
      res,
      `${field} '${value}' is already taken`
    )
  }

  if (err.name === 'JsonWebTokenError') {
    return Response.unauthorized(res, 'Invalid token')
  }

  if (err.name === 'TokenExpiredError') {
    return Response.unauthorized(res, 'Session expired. Please log in again.')
  }

  if (err.name === 'MulterError') {
    return Response.validationError(res, `File upload error: ${err.message}`)
  }

  if (err.type === 'entity.parse.failed') {
    return Response.validationError(res, 'Invalid JSON in request body')
  }

  return Response.serverError(
    res,
    isDev ? err.message : 'Something went wrong. Please try again.'
  )
}

export const notFoundHandler = (req, res) => {
  return Response.error(
    res,
    `Route ${req.method} ${req.path} not found`,
    404,
    'ROUTE_NOT_FOUND'
  )
}

export const registerProcessHandlers = () => {
  process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled Promise Rejection:', reason)
    process.exit(1)
  })

  process.on('SIGTERM', () => {
    console.log('[SHUTDOWN] SIGTERM received. Closing gracefully.')
    process.exit(0)
  })
}
