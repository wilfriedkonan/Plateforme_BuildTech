import axios from 'axios';

// En prod, pas de repli sur localhost : l'URL doit être injectée au build (VITE_API_SERVER_URL)
const isDev = import.meta.env.DEV;
const PROD_URL = import.meta.env.VITE_API_SERVER_URL;
if (!isDev && !PROD_URL) {
  throw new Error("VITE_API_SERVER_URL manquant : URL de l'API non définie au build");
}
const BASE_URL = isDev ? 'http://localhost:5292/api/' : PROD_URL;

// Client HTTP sans header d'authentification — pour les endpoints publics
export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});
