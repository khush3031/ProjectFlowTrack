const DEFAULT_MESSAGE =
  'Something went wrong. Please try again.'

export const parseApiError = (err) => {
  if (!err) {
    return {
      message:     DEFAULT_MESSAGE,
      code:        'UNKNOWN',
      statusCode:  500,
      fieldErrors: null,
    }
  }

  if (!err.response) {
    return {
      message: err.message?.includes('Network Error')
        ? 'Cannot reach the server. Check your connection.'
        : DEFAULT_MESSAGE,
      code:        'NETWORK_ERROR',
      statusCode:  0,
      fieldErrors: null,
    }
  }

  const { status, data } = err.response

  return {
    message:     data?.message    ?? DEFAULT_MESSAGE,
    code:        data?.code       ?? 'ERROR',
    statusCode:  status,
    fieldErrors: data?.errors     ?? null,
  }
}

export const getFieldError = (apiError, fieldName) => {
  if (!apiError?.fieldErrors) return null
  return apiError.fieldErrors[fieldName] ?? null
}

export const isAuthError    = (err) =>
  err?.statusCode === 401 || err?.statusCode === 403

export const isNotFound     = (err) =>
  err?.statusCode === 404

export const isConflict     = (err) =>
  err?.statusCode === 409

export const isNetworkError = (err) =>
  err?.code === 'NETWORK_ERROR'

export const isValidation   = (err) =>
  err?.code === 'VALIDATION_ERROR'

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS:
    'Email or password is incorrect.',
  EMAIL_IN_USE:
    'An account with this email already exists.',
  USER_NOT_FOUND:
    'No account found with this email.',
  UNAUTHORIZED:
    'Your session has expired. Please sign in again.',
  FORBIDDEN:
    'You do not have permission to do this.',
  NOT_FOUND:
    'The requested item could not be found.',
  NETWORK_ERROR:
    'Cannot reach the server. Check your connection.',
  INTERNAL_ERROR:
    'A server error occurred. Please try again shortly.',
}

export const getFriendlyMessage = (apiError) => {
  if (!apiError) return DEFAULT_MESSAGE
  return (
    ERROR_MESSAGES[apiError.code] ??
    apiError.message               ??
    DEFAULT_MESSAGE
  )
}
