import api from './axiosInstance'

export const createOrgApi       = (data)  => api.post('/organizations', data)
export const getMyOrgApi        = ()      => api.get('/organizations/me')
export const inviteUserApi      = (data)  => api.post('/organizations/invite', data)
export const getInviteInfoApi   = (token) => api.get(`/organizations/invite/info/${token}`)
export const acceptInviteApi    = (token) => api.get(`/organizations/invite/accept/${token}`)
export const removeMemberApi    = (userId) => api.delete(`/organizations/members/${userId}`)
export const getUnassignedUsersApi = (email) => api.get('/organizations/unassigned-users', { params: { email } })
export const addExistingUserApi    = (userId) => api.post('/organizations/members/add-direct', { userId })
