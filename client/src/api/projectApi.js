import api from './axiosInstance'

export const createProjectApi    = (data)         => api.post('/projects', data)
export const getProjectsApi = () => api.get('/projects')
export const getProjectByIdApi   = (id)           => api.get(`/projects/${id}`)
export const updateProjectApi    = (id, data)     => api.patch(`/projects/${id}`, data)
export const deleteProjectApi    = (id)           => api.delete(`/projects/${id}`)
export const addProjectMemberApi    = (id, data)  => api.post(`/projects/${id}/members`, data)
export const removeProjectMemberApi = (id, userId)=> api.delete(`/projects/${id}/members/${userId}`)
