/**
 * Public email utility.
 * Thin wrapper — import this in controllers/services, not the queue internals.
 *
 * @param {{ type: string, to: string, data: object }} options
 *
 * @example
 *   import { sendEmail, EMAIL_TYPES } from '../utils/email/sendEmail.js'
 *   sendEmail({ type: EMAIL_TYPES.OTP, to: user.email, data: { otp, userName } })
 */

import { dispatch, JOB_TYPES } from './emailQueue.dispatcher.js'

export const EMAIL_TYPES = JOB_TYPES  // re-export so callers never import from dispatcher directly

export function sendEmail({ type, to, data }) {
  dispatch({ type, to, data })
}
