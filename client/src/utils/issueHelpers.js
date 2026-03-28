export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const STATUS_COLORS = {
  todo:        { bg: '#1e2235', text: '#7c7f9a', border: '#2e3148' },
  in_progress: { bg: '#1e2a1e', text: '#52c97a', border: '#1a4a2e' },
  done:        { bg: '#1a1e35', text: '#6c63ff', border: '#2e2a5e' },
}

export const PRIORITY_COLORS = {
  low:    { bg: '#1a2535', text: '#52a9c9', border: '#1a3a4a' },
  medium: { bg: '#2a2010', text: '#e0a952', border: '#4a3510' },
  high:   { bg: '#2a1010', text: '#e05252', border: '#4a1a1a' },
}

export const formatDueDate = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  const diff = d - now
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  const formatted = d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  let urgency = 'normal'
  if (days < 0)  urgency = 'overdue'
  else if (days <= 2) urgency = 'soon'
  return { formatted, days, urgency }
}

export const formatActivityMessage = (log) => {
  switch (log.action) {
    case 'created':
      return `${log.actor?.name} created this issue`
    case 'commented':
      return `${log.actor?.name} added a comment`
    case 'updated':
      if (log.field === 'status')
        return `${log.actor?.name} changed status from "${log.from}" to "${log.to}"`
      if (log.field === 'priority')
        return `${log.actor?.name} changed priority from "${log.from}" to "${log.to}"`
      if (log.field === 'assignee')
        return `${log.actor?.name} changed assignee`
      if (log.field === 'dueDate')
        return `${log.actor?.name} updated the due date`
      return `${log.actor?.name} updated ${log.field}`
    default:
      return `${log.actor?.name} made a change`
  }
}

export const formatTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
