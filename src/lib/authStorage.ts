/**
 * authStorage.ts
 * Point d'accès unique au token JWT.
 *
 * Utilise sessionStorage (durée de vie = onglet) pour limiter la surface
 * d'attaque par rapport à localStorage (persistant entre onglets et sessions).
 * Un XSS peut toujours lire sessionStorage, mais la fenêtre d'exposition est
 * réduite : le token disparaît à la fermeture de l'onglet.
 *
 * ── Migration future vers cookie HttpOnly (Étape B) ──────────────────────────
 * Pour éliminer complètement la lisibilité JS du token, le backend .NET devra :
 *   1. Renvoyer le JWT dans un Set-Cookie: HttpOnly; Secure; SameSite=Strict
 *      au lieu du corps JSON, et l'accepter depuis ce cookie.
 *   2. Implémenter un endpoint POST /api/auth/refresh pour le renouvellement
 *      silencieux (refresh token en cookie HttpOnly séparé).
 *   3. Ajouter une protection CSRF : soit un header custom (X-Requested-With)
 *      vérifié côté serveur, soit un token CSRF double-submit cookie.
 * Côté frontend, il suffira alors de :
 *   - Retirer setToken / getToken / clearToken (plus besoin de stocker le token en JS)
 *   - Passer credentials: "include" sur tous les fetch / axios
 *   - Retirer l'en-tête Authorization des requêtes (le cookie est envoyé automatiquement)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const TOKEN_KEY = 'authToken';

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // sessionStorage indisponible (mode privé bloqué, quota dépassé) : silencieux
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // silencieux
  }
}
