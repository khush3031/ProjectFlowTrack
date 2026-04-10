/**
 * Email Queue — Dispatcher
 *
 * Single entry point for all outgoing emails.
 * Decides which template to render based on job type, then hands the
 * resolved job (to + subject + html) to the queue engine.
 *
 * To add a new email type:
 *   1. Add a key to JOB_TYPES
 *   2. Add a case in buildJob() that returns { subject, html }
 *   3. Call dispatch({ type: JOB_TYPES.YOUR_TYPE, to, data }) from anywhere
 */

import { addToQueue, queueLog } from './emailQueue.config.js'
import { otpEmailTemplate }     from './emailTemplates.js'

// ─── Job type registry ────────────────────────────────────────────────────────

export const JOB_TYPES = Object.freeze({
  OTP: 'OTP',
  // Add future types here, e.g.:
  // WELCOME:       'WELCOME',
  // INVITE:        'INVITE',
  // PASSWORD_CHANGED: 'PASSWORD_CHANGED',
})

// ─── Template builder ─────────────────────────────────────────────────────────

/**
 * Map a job type + data to { subject, html }.
 * Throws if the type is unrecognised so misconfigured callers fail loudly.
 *
 * @param {string} type   - one of JOB_TYPES
 * @param {object} data   - payload specific to that job type
 * @returns {{ subject: string, html: string }}
 */
function buildJob(type, data) {
  switch (type) {

    case JOB_TYPES.OTP:
      return otpEmailTemplate({
        otp:            data.otp,
        userName:       data.userName,
        expiryMinutes:  data.expiryMinutes ?? 10,
      })

    // ── Add more cases here ──────────────────────────────────────────────
    // case JOB_TYPES.WELCOME:
    //   return welcomeEmailTemplate({ userName: data.userName })

    default:
      throw new Error(`[EmailDispatcher] Unknown job type: "${type}"`)
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Dispatch an email job.
 *
 * @param {{ type: string, to: string, data: object }} options
 *   type  — one of JOB_TYPES
 *   to    — recipient email address
 *   data  — template-specific payload
 *
 * @example
 *   dispatch({ type: JOB_TYPES.OTP, to: user.email, data: { otp, userName, expiryMinutes } })
 */
export function dispatch({ type, to, data = {} }) {
  if (!type || !to) {
    throw new Error('[EmailDispatcher] type and to are required')
  }

  const { subject, html } = buildJob(type, data)
  addToQueue({ type, to, subject, html })
  queueLog('log', `Dispatched [type=${type}] → ${to}`)
}
