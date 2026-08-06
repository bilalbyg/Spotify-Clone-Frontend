import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const readPersistedToken = () => {
  if (typeof window === 'undefined') return null;

  const directToken =
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('accessToken') ||
    window.localStorage.getItem('authToken');

  if (directToken) return directToken;

  try {
    const storedAuth = window.localStorage.getItem('auth-storage');
    if (!storedAuth) return null;

    const parsedAuth = JSON.parse(storedAuth);
    return parsedAuth?.state?.token || parsedAuth?.state?.accessToken || null;
  } catch {
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState().token ||
      readPersistedToken() ||
      import.meta.env.VITE_API_BEARER_TOKEN;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally if needed
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
