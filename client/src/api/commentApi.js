import api from './axiosInstance'

const base = (projectId, issueId) =>
  `/projects/${projectId}/issues/${issueId}/comments`

export const addCommentApi    = (projectId, issueId, data) =>
  api.post(base(projectId, issueId), data)

export const editCommentApi   = (projectId, issueId, commentId, data) =>
  api.patch(`${base(projectId, issueId)}/${commentId}`, data)

export const deleteCommentApi = (projectId, issueId, commentId) =>
  api.delete(`${base(projectId, issueId)}/${commentId}`)

export const getStatsApi      = (projectId) =>
  api.get(`/projects/${projectId}/issues/stats`)
