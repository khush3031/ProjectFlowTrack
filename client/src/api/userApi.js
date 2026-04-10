import api from './axiosInstance'

export const getMyProfileApi    = ()     => api.get('/users/me')
export const updateMyProfileApi = (data) => api.patch('/users/me', data)
export const getMyIssuesApi     = (params) => api.get('/users/me/issues', { params })
