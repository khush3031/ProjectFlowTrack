/**
 * Email Queue — Processor
 *
 * Responsible for the actual SMTP delivery of a single job.
 * Called by the queue engine (emailQueue.config.js) for every dequeued job.
 * Throws on failure so the engine can decide whether to retry.
 */

import { getTransporter } from './emailTransporter.js'

/**
 * Send one email job via nodemailer.
 * @param {{ to: string, subject: string, html: string }} job
 * @throws {Error} if nodemailer rejects (engine will retry)
 */
export async function processEmailJob(job) {
  const transporter = getTransporter()

  const info = await transporter.sendMail({
    from:    process.env.SMTP_FROM || process.env.SMTP_USER,
    to:      job.to,
    subject: job.subject,
    html:    job.html,
  })

  return info
}
