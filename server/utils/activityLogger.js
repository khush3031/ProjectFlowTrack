import ActivityLog from '../models/ActivityLog.model.js'

export const ACTION_TYPES = {
  ISSUE_CREATED:       'ISSUE_CREATED',
  ISSUE_UPDATED:       'ISSUE_UPDATED',
  ISSUE_DELETED:       'ISSUE_DELETED',
  STATUS_CHANGED:      'STATUS_CHANGED',
  PRIORITY_CHANGED:    'PRIORITY_CHANGED',
  ASSIGNEE_CHANGED:    'ASSIGNEE_CHANGED',
  DUE_DATE_CHANGED:    'DUE_DATE_CHANGED',
  TITLE_CHANGED:       'TITLE_CHANGED',
  DESCRIPTION_CHANGED: 'DESCRIPTION_CHANGED',
  COMMENT_ADDED:       'COMMENT_ADDED',
  COMMENT_EDITED:      'COMMENT_EDITED',
  COMMENT_DELETED:     'COMMENT_DELETED',
}

export const FIELD_TO_ACTION = {
  status:      ACTION_TYPES.STATUS_CHANGED,
  priority:    ACTION_TYPES.PRIORITY_CHANGED,
  assignee:    ACTION_TYPES.ASSIGNEE_CHANGED,
  dueDate:     ACTION_TYPES.DUE_DATE_CHANGED,
  title:       ACTION_TYPES.TITLE_CHANGED,
  description: ACTION_TYPES.DESCRIPTION_CHANGED,
}

export const logActivity = async ({
  action,
  issueId,
  projectId,
  changedBy,
  field        = null,
  previousValue = null,
  newValue      = null,
}) => {
  try {
    await ActivityLog.create({
      action,
      issue: issueId,
      project: projectId,
      changedBy,
      field,
      previousValue: previousValue !== null ? String(previousValue) : null,
      newValue:      newValue      !== null ? String(newValue)      : null,
    })
  } catch (err) {
    console.error('[ActivityLog] Non-fatal write error:', err.message)
  }
}

export const logFieldChanges = async ({
  issue,
  updates,
  userId,
  projectId,
}) => {
  const trackable = Object.keys(FIELD_TO_ACTION)
  for (const field of trackable) {
    if (updates[field] === undefined) continue
    const prev = issue[field]
    const next = updates[field]
    const prevStr = prev !== null && prev !== undefined ? String(prev) : null
    const nextStr = next !== null && next !== undefined ? String(next) : null
    if (prevStr === nextStr) continue
    await logActivity({
      action:        FIELD_TO_ACTION[field],
      issueId:       issue._id,
      projectId,
      changedBy:     userId,
      field,
      previousValue: prevStr,
      newValue:      nextStr,
    })
  }
}
