export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode  = statusCode
    this.code        = code
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export const Errors = {
  // Auth
  invalidCredentials: () =>
    new AppError(
      'Email or password is incorrect',
      401,
      'INVALID_CREDENTIALS'
    ),
  userNotFound: () =>
    new AppError('User not found', 404, 'USER_NOT_FOUND'),
  emailInUse: () =>
    new AppError(
      'An account with this email already exists',
      409,
      'EMAIL_IN_USE'
    ),
  unauthorized: (msg = 'Authentication required') =>
    new AppError(msg, 401, 'UNAUTHORIZED'),
  forbidden: (msg = 'You do not have permission') =>
    new AppError(msg, 403, 'FORBIDDEN'),

  // Resources
  notFound: (resource = 'Resource') =>
    new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
  alreadyExists: (resource = 'Resource') =>
    new AppError(`${resource} already exists`, 409, 'ALREADY_EXISTS'),

  // Validation
  validation: (msg) =>
    new AppError(msg, 400, 'VALIDATION_ERROR'),
  invalidId: (field = 'ID') =>
    new AppError(`Invalid ${field} format`, 400, 'INVALID_ID'),

  // Org / Project
  crossOrgAccess: () =>
    new AppError(
      'You cannot access data from another organization',
      403,
      'CROSS_ORG_ACCESS'
    ),
  notProjectMember: () =>
    new AppError(
      'You are not a member of this project',
      403,
      'NOT_PROJECT_MEMBER'
    ),
  assigneeNotMember: () =>
    new AppError(
      'Assignee must be a member of this project',
      400,
      'ASSIGNEE_NOT_MEMBER'
    ),

  // Comments
  commentNotOwner: () =>
    new AppError(
      'You can only edit your own comments',
      403,
      'COMMENT_NOT_OWNER'
    ),
  commentDeleteForbidden: () =>
    new AppError(
      'You can only delete your own comments',
      403,
      'COMMENT_DELETE_FORBIDDEN'
    ),

  // Server
  internal: (msg = 'An unexpected error occurred') =>
    new AppError(msg, 500, 'INTERNAL_ERROR'),
}
