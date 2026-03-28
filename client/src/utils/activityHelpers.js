export const ACTION_META = {
  ISSUE_CREATED: {
    label:  'Issue created',
    icon:   'plus',
    color:  '#52c97a',
    bg:     '#0d2e1a',
    border: '#1a4a2e',
  },
  ISSUE_UPDATED: {
    label:  'Issue updated',
    icon:   'edit',
    color:  '#6c63ff',
    bg:     '#1a1835',
    border: '#2e2a5e',
  },
  ISSUE_DELETED: {
    label:  'Issue deleted',
    icon:   'trash',
    color:  '#e05252',
    bg:     '#2a1010',
    border: '#4a1a1a',
  },
  STATUS_CHANGED: {
    label:  'Status changed',
    icon:   'status',
    color:  '#6c63ff',
    bg:     '#1a1835',
    border: '#2e2a5e',
  },
  PRIORITY_CHANGED: {
    label:  'Priority changed',
    icon:   'priority',
    color:  '#e0a952',
    bg:     '#2a2010',
    border: '#4a3510',
  },
  ASSIGNEE_CHANGED: {
    label:  'Assignee changed',
    icon:   'user',
    color:  '#52a9c9',
    bg:     '#0d2030',
    border: '#1a3a50',
  },
  DUE_DATE_CHANGED: {
    label:  'Due date changed',
    icon:   'calendar',
    color:  '#e0a952',
    bg:     '#2a2010',
    border: '#4a3510',
  },
  TITLE_CHANGED: {
    label:  'Title changed',
    icon:   'edit',
    color:  '#7c7f9a',
    bg:     '#1e2235',
    border: '#2e3148',
  },
  DESCRIPTION_CHANGED: {
    label:  'Description updated',
    icon:   'text',
    color:  '#7c7f9a',
    bg:     '#1e2235',
    border: '#2e3148',
  },
  COMMENT_ADDED: {
    label:  'Comment added',
    icon:   'comment',
    color:  '#52c97a',
    bg:     '#0d2e1a',
    border: '#1a4a2e',
  },
  COMMENT_DELETED: {
    label:  'Comment deleted',
    icon:   'trash',
    color:  '#e05252',
    bg:     '#2a1010',
    border: '#4a1a1a',
  },
}

export const STATUS_DISPLAY = {
  todo:        'To Do',
  in_progress: 'In Progress',
  done:        'Done',
}

export const PRIORITY_DISPLAY = {
  low:    'Low',
  medium: 'Medium',
  high:   'High',
}

export const formatLogMessage = (log) => {
  const who = log.changedBy?.name ?? 'Someone'
  const prev = log.previousValue
  const next = log.newValue

  switch (log.action) {
    case 'ISSUE_CREATED':
      return {
        summary: `${who} created this issue`,
        detail:  null,
      }
    case 'ISSUE_DELETED':
      return {
        summary: `${who} deleted issue "${next ?? 'unknown'}"`,
        detail:  null,
      }
    case 'STATUS_CHANGED':
      return {
        summary: `${who} changed the status`,
        detail: {
          from: STATUS_DISPLAY[prev] ?? prev,
          to:   STATUS_DISPLAY[next] ?? next,
          type: 'transition',
        },
      }
    case 'PRIORITY_CHANGED':
      return {
        summary: `${who} changed the priority`,
        detail: {
          from: PRIORITY_DISPLAY[prev] ?? prev,
          to:   PRIORITY_DISPLAY[next] ?? next,
          type: 'transition',
        },
      }
    case 'ASSIGNEE_CHANGED':
      return {
        summary: `${who} changed the assignee`,
        detail: {
          from: prev ? `@${prev}` : 'Unassigned',
          to:   next ? `@${next}` : 'Unassigned',
          type: 'transition',
        },
      }
    case 'DUE_DATE_CHANGED':
      return {
        summary: `${who} updated the due date`,
        detail: {
          from: prev
            ? new Date(prev).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })
            : 'None',
          to: next
            ? new Date(next).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })
            : 'None',
          type: 'transition',
        },
      }
    case 'TITLE_CHANGED':
      return {
        summary: `${who} renamed the issue`,
        detail: {
          from: prev,
          to:   next,
          type: 'text',
        },
      }
    case 'DESCRIPTION_CHANGED':
      return {
        summary: `${who} updated the description`,
        detail:  null,
      }
    case 'COMMENT_ADDED':
      return {
        summary: `${who} left a comment`,
        detail:  next
          ? { text: next.length > 80 ? next.slice(0, 80) + '…' : next,
              type: 'quote' }
          : null,
      }
    case 'COMMENT_DELETED':
      return {
        summary: `${who} deleted a comment`,
        detail:  null,
      }
    default:
      return {
        summary: `${who} made a change`,
        detail:  null,
      }
  }
}

export const formatTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr)
  const secs = Math.floor(diff / 1000)
  if (secs < 60)   return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60)   return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)    return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)    return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

export const formatFullDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

export const groupLogsByDate = (logs) => {
  const groups = {}
  for (const log of logs) {
    const d = new Date(log.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    let label
    if (d.toDateString() === today.toDateString())
      label = 'Today'
    else if (d.toDateString() === yesterday.toDateString())
      label = 'Yesterday'
    else
      label = d.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
      })
    if (!groups[label]) groups[label] = []
    groups[label].push(log)
  }
  return Object.entries(groups)
}

export const ACTION_FILTER_OPTIONS = [
  { value: '',                  label: 'All activity' },
  { value: 'ISSUE_CREATED',    label: 'Issue created' },
  { value: 'STATUS_CHANGED',   label: 'Status changes' },
  { value: 'PRIORITY_CHANGED', label: 'Priority changes' },
  { value: 'ASSIGNEE_CHANGED', label: 'Assignee changes' },
  { value: 'DUE_DATE_CHANGED', label: 'Due date changes' },
  { value: 'COMMENT_ADDED',    label: 'Comments added' },
  { value: 'COMMENT_DELETED',  label: 'Comments deleted' },
  { value: 'TITLE_CHANGED',    label: 'Title changes' },
]
