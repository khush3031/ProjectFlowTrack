/**
 * Email Queue — Engine
 *
 * Manages an in-process FIFO queue with concurrency control and retry logic.
 * No external infrastructure (Redis/Bull) needed for this volume.
 *
 * Config:
 *   MAX_CONCURRENCY  — max simultaneous SMTP sends (safe for most providers)
 *   MAX_RETRIES      — attempts per job before permanent failure
 *   RETRY_BASE_MS    — base delay for exponential back-off  (1s → 2s → 4s)
 */

import { processEmailJob } from './emailQueue.processor.js'

export const QUEUE_CONFIG = {
  MAX_CONCURRENCY: 3,
  MAX_RETRIES:     3,
  RETRY_BASE_MS:   1000,
}

let running = 0
const queue  = []

// ─── Logging ──────────────────────────────────────────────────────────────────

export function queueLog(level, msg, detail = '') {
  const ts = new Date().toISOString()
  console[level](`[EmailQueue][${ts}] ${msg}${detail ? ' — ' + detail : ''}`)
}

// ─── Retry wrapper ────────────────────────────────────────────────────────────

async function attemptJob(job, tryNum = 1) {
  try {
    await processEmailJob(job)
    queueLog('log', `Sent ✓  to ${job.to} [type=${job.type}]`)
  } catch (err) {
    if (tryNum < QUEUE_CONFIG.MAX_RETRIES) {
      const wait = QUEUE_CONFIG.RETRY_BASE_MS * Math.pow(2, tryNum - 1)
      queueLog(
        'warn',
        `Failed (attempt ${tryNum}/${QUEUE_CONFIG.MAX_RETRIES}) to ${job.to} [type=${job.type}] — retry in ${wait}ms`,
        err.message,
      )
      await new Promise(r => setTimeout(r, wait))
      return attemptJob(job, tryNum + 1)
    }
    queueLog(
      'error',
      `Permanently failed to ${job.to} [type=${job.type}] after ${QUEUE_CONFIG.MAX_RETRIES} attempts`,
      err.message,
    )
  }
}

// ─── Tick — drain queue up to concurrency limit ───────────────────────────────

function tick() {
  while (queue.length > 0 && running < QUEUE_CONFIG.MAX_CONCURRENCY) {
    const job = queue.shift()
    running++
    attemptJob(job).finally(() => {
      running--
      tick()
    })
  }
}

// ─── Public: add a job to the queue ──────────────────────────────────────────

/**
 * Enqueue a resolved email job (to + subject + html + type already set).
 * Called by the dispatcher — not used directly by application code.
 *
 * @param {{ type: string, to: string, subject: string, html: string }} job
 */
export function addToQueue(job) {
  queue.push(job)
  queueLog('log', `Queued [type=${job.type}] → ${job.to} | pending=${queue.length} | running=${running}`)
  tick()
}
