import api from './axiosInstance'

export const registerApi        = (data) => api.post('/auth/register', data)
export const loginApi           = (data) => api.post('/auth/login', data)
export const logoutApi          = ()     => api.post('/auth/logout')
export const getMeApi           = ()     => api.get('/auth/me')
export const forgotPasswordApi  = (data) => api.post('/auth/forgot-password', data)
export const resetPasswordApi   = (data) => api.post('/auth/reset-password', data)
