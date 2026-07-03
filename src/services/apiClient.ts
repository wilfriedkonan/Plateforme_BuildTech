import axios from 'axios';

const isDev = import.meta.env.DEV;

// En dev, on passe par le proxy Vite (/api → http://localhost:5292/api)
// En prod, on utilise l'URL complète définie dans .env
const SERVER_URL = isDev
  ? '/api/'
  : (import.meta.env.VITE_API_SERVER_URL ?? 'https://api.buildtch.uk/api/');

const API_KEY = import.meta.env.VITE_API_KEY ?? '';

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
});

// En prod, le proxy Vite n'est pas actif donc on envoie la clé directement
if (!isDev) {
  apiClient.defaults.headers.common['ApiKey'] = API_KEY;
}

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
    return Promise.reject(error);
  }
);
