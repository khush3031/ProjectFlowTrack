export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str
  return str
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export const sanitizeIssueData = (data) => {
  const clean = { ...data }
  if (clean.title)       clean.title       = sanitizeString(clean.title)
  if (clean.description) clean.description = sanitizeString(clean.description)
  return clean
}

export const sanitizeCommentBody = (body) =>
  sanitizeString(body)
