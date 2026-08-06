import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { isJwtTokenValid } from '@/utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const readPersistedToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedAuth = window.localStorage.getItem('auth-storage');
    if (!storedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(storedAuth);
    return parsedAuth?.state?.token ?? null;
  } catch {
    return null;
  }
};

const clearSessionAndRedirect = () => {
  useAuthStore.getState().logout();

  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token ?? readPersistedToken();

    if (isJwtTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      useAuthStore.getState().logout();
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url ?? '');
    const token = useAuthStore.getState().token ?? readPersistedToken();
    const isAuthenticationRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');
    const authenticationFailed = status === 401 || (status === 403 && !isJwtTokenValid(token));

    if (!isAuthenticationRequest && authenticationFailed) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  },
);

export default api;
