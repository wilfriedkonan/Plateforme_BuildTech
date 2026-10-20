/**
 * authStorage.ts
 * Stockage du token CSRF uniquement — le JWT voyage en cookie HttpOnly (invisible au JS).
 *
 * Le token CSRF est gardé en mémoire (variable module) :
 *   - Il disparaît à chaque rechargement de page → récupéré via GET Auth/csrf ou corps de Auth/login.
 *   - Il n'est jamais écrit dans localStorage / sessionStorage.
 *   - Un attaquant XSS peut le lire depuis la mémoire s'il a déjà exécuté du code, mais
 *     un cookie HttpOnly rend la combinaison JWT + CSRF inutilisable depuis un autre site.
 */

let csrfToken: string | null = null;

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function setCsrfToken(token: string): void {
  csrfToken = token;
}

export function clearCsrfToken(): void {
  csrfToken = null;
}

/**
 * Nettoie les artefacts de l'ancienne authentification par Bearer token.
 * À appeler une seule fois au démarrage de l'app (main.tsx), avant le rendu React.
 */
export function purgeLegacyToken(): void {
  try {
    ['authToken'].forEach(key => {
      try { sessionStorage.removeItem(key); } catch { /* silencieux */ }
      try { localStorage.removeItem(key); } catch { /* silencieux */ }
    });
  } catch {
    // Silencieux en mode privé ou si l'API storage est bloquée
  }
}
