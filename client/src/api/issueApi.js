import api from './axiosInstance'

const base = (projectId) => `/projects/${projectId}/issues`

export const createIssueApi  = (projectId, data) =>
  api.post(base(projectId), data)

export const getIssuesApi    = (projectId, params) =>
  api.get(base(projectId), { params })

export const getIssueByIdApi = (projectId, issueId) =>
  api.get(`${base(projectId)}/${issueId}`)

export const updateIssueApi  = (projectId, issueId, data) =>
  api.patch(`${base(projectId)}/${issueId}`, data)

export const deleteIssueApi  = (projectId, issueId) =>
  api.delete(`${base(projectId)}/${issueId}`)

export const addCommentApi   = (projectId, issueId, data) =>
  api.post(`${base(projectId)}/${issueId}/comments`, data)

export const deleteCommentApi = (projectId, issueId, commentId) =>
  api.delete(`${base(projectId)}/${issueId}/comments/${commentId}`)
