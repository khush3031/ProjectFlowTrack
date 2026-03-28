import api from './axiosInstance'

export const getIssueActivityApi = (projectId, issueId, params) =>
  api.get(`/activity/projects/${projectId}/issues/${issueId}`, { params })

export const getProjectActivityApi = (projectId, params) =>
  api.get(`/activity/projects/${projectId}`, { params })

export const getMyActivityApi = (params) =>
  api.get('/activity/me', { params })
