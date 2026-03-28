import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = 
      originalRequest.url?.endsWith('/auth/login') || 
      originalRequest.url?.endsWith('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post('/auth/refresh');
        const token = data.data.accessToken;
        
        localStorage.setItem('accessToken', token);
        isRefreshing = false;
        
        processQueue(null, token);
        
        // Update the original request's header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const { status, data } = error.response
      if (status === 403) {
        window.dispatchEvent(new CustomEvent('auth:forbidden', {
          detail: {
            message: data?.message ?? 'Access denied',
            code:    data?.code    ?? 'FORBIDDEN',
          }
        }))
      }
    } else if (!error.response) {
      window.dispatchEvent(new CustomEvent('app:network-error'))
    }

    console.warn(
      `[API] ${error.config?.method?.toUpperCase()} ` +
      `${error.config?.url} → ` +
      `${error.response?.status ?? 'NETWORK'} ` +
      `${error.response?.data?.message ?? error.message}`
    )

    return Promise.reject(error);
  }
);

export default axiosInstance;
