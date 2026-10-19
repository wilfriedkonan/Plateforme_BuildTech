import axios from 'axios';
import { getToken, clearToken } from '../lib/authStorage';

// En dev, on passe par le proxy Vite (/api → http://localhost:5292/api)
// En prod, on utilise l'URL complète définie dans .env
const isDev = import.meta.env.DEV;
const SERVER_URL = isDev
  ? 'http://localhost:5292/api/'
  : (import.meta.env.VITE_API_SERVER_URL ?? 'http://localhost:5292/api/');

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    // 401 : token expiré ou invalide — on efface la session et on redirige
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
