import axios from 'axios';

const API_KEY = (import.meta as any).env?.VITE_API_KEY ?? 'VotreCléAPISecrète123!';

// In development, use Vite proxy (/api -> http://localhost:5292/api)
// In production, use full URL from env
const isDev = import.meta.env.DEV;
/* const SERVER_URL = isDev 
  ? '/api/' 
  : (import.meta as any).env?.VITE_API_SERVER_URL ?? 'http://localhost:5292/api/'; */

  const SERVER_URL =  'http://localhost:5292/api/';
console.log('[API Client] Configured with:', { SERVER_URL, API_KEY, isDev });

export const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
});

// Only add ApiKey header if not using Vite proxy (in production)
if (!isDev) {
  apiClient.defaults.headers.common['ApiKey'] = API_KEY;
}

apiClient.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    
    console.log('[API Request]', config.method?.toUpperCase(), config.url, {
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.status, response.data);
    return response;
  },
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
