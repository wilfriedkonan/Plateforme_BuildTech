import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { purgeLegacyToken } from './lib/authStorage';

// Nettoie l'ancien token Bearer (sessionStorage/localStorage) dès le démarrage
purgeLegacyToken();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
