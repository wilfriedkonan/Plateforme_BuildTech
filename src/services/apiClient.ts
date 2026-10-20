import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { getCsrfToken, setCsrfToken, clearCsrfToken } from '../lib/authStorage';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Ne pas rediriger vers '/' si la session est définitivement invalide (ex. Auth/me au démarrage). */
    skipAuthRedirect?: boolean;
  }
}

// En dev : API locale directe (CORS : http://localhost:5173 doit être dans AuthCookies:AllowedOrigins)
// En prod : URL complète définie dans .env
const isDev = import.meta.env.DEV;
const SERVER_URL = isDev
  ? 'http://localhost:5292/api/'
  : (import.meta.env.VITE_API_SERVER_URL ?? 'http://localhost:5292/api/');

const BASE_CONFIG: AxiosRequestConfig = {
  baseURL: SERVER_URL,
  timeout: 10000,
  withCredentials: true,                    // envoie / reçoit les cookies HttpOnly
  headers: { 'X-Auth-Mode': 'cookie' },     // active le mode cookie côté API
};

export const apiClient = axios.create(BASE_CONFIG);

// Client sans intercepteurs, réservé à auth/csrf et auth/refresh (évite les boucles)
const bareClient = axios.create(BASE_CONFIG);

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean; _csrfRetry?: boolean };

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
// Insensible à la casse : tes appels utilisent 'Auth/login', 'Auth/logout'...
const AUTH_CALL = /auth\/(login|refresh|logout|csrf)/i;
const LOGIN_OR_LOGOUT = /auth\/(login|logout)/i;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureCsrf(): Promise<string> {
  let token = getCsrfToken();
  if (!token) {
    const { data } = await bareClient.get('auth/csrf');
    token = data.csrfToken as string;
    setCsrfToken(token);
  }
  return token;
}

// Un seul refresh à la fois dans cet onglet
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshPromise ??= (async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await bareClient.post('auth/refresh', null, {
          headers: { 'X-CSRF-Token': await ensureCsrf() },
        });
        if (res.data?.csrfToken) setCsrfToken(res.data.csrfToken);
        return true;
      } catch (e) {
        if ((e as AxiosError).response?.status === 403) clearCsrfToken();
        // Un autre onglet a peut-être renouvelé la session au même instant : 2e essai
        if (attempt === 0) await sleep(400);
      }
    }
    return false;
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

apiClient.interceptors.request.use(
  async (config) => {
    const method = (config.method ?? 'get').toUpperCase();
    if (!SAFE_METHODS.includes(method)) {
      try {
        config.headers['X-CSRF-Token'] = await ensureCsrf();
      } catch {
        // /csrf injoignable : on laisse partir la requête (login, inscription... n'en ont pas besoin)
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // login / refresh / csrf renvoient csrfToken dans le corps : on le garde en mémoire
    if (response.data?.csrfToken) setCsrfToken(response.data.csrfToken);
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';
    const isAuthCall = AUTH_CALL.test(url);

    // Jeton CSRF périmé (cookie perdu ou changé) : on le redemande et on rejoue une fois
    const message = (error.response?.data as { message?: string } | undefined)?.message ?? '';
    if (status === 403 && original && !original._csrfRetry && message.includes('CSRF')) {
      original._csrfRetry = true;
      clearCsrfToken();
      return apiClient(original);
    }

    // Access token expiré : refresh silencieux puis on rejoue la requête
    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      if (await refreshSession()) {
        return apiClient(original);
      }
    }

    console.error('[API Error]', {
      url: original?.url,
      method: original?.method,
      status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });

    // 401 définitif (refresh impossible) : session terminée. Un 401 sur auth/login
    // (mauvais mot de passe) ne doit PAS recharger la page.
    // skipAuthRedirect : pour la vérification de session au démarrage (Auth/me), sinon boucle de rechargement sur '/'
    if (status === 401 && !original?.skipAuthRedirect && !LOGIN_OR_LOGOUT.test(url)) {
      clearCsrfToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
