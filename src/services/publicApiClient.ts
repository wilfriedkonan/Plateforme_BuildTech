import axios from 'axios';

const isDev = import.meta.env.DEV;
const BASE_URL = isDev
  ? 'http://localhost:5292/api/'
  : (import.meta.env.VITE_API_SERVER_URL ?? 'http://localhost:5292/api/');

// Client HTTP sans header d'authentification — pour les endpoints publics
export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});
