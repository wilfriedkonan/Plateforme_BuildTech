import { useCallback, useMemo, useState } from 'react';
import { authService, type LoginPayload, type RegistrationPayload, type RegistrationForEntreprisePayload } from '../services/authService';
import { clearCsrfToken } from '../lib/authStorage';

type UseAuthState = {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null;
};

export const useAuth = () => {
  const [state, setState] = useState<UseAuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,
  });

  const register = useCallback(async (payload: RegistrationPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.register(payload);

      if (response.success) {
        setState({
          isLoading: false,
          error: null,
          isAuthenticated: true,
          user: response.data || { email: payload.email },
        });
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Erreur lors de l\'inscription';
      console.error('[useAuth] Registration error:', errorMessage);
      setState({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });
      throw e;
    }
  }, []);

  const registerForEntreprise = useCallback(
    async (payload: RegistrationForEntreprisePayload) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await authService.registerForEntreprise(payload);
        if (!response.success) {
          throw Object.assign(new Error(response.message), { response: { status: 400, data: response } });
        }
        // L'opérateur crée le compte d'un autre : sa propre session ne change pas
        setState((prev) => ({ ...prev, isLoading: false, error: null }));
        return response;
      } catch (e: any) {
        const status: number | undefined = e?.response?.status;
        const data = e?.response?.data;
        const apiMessage: string | undefined = data?.message;
        const byCode: Record<string, string> = {
          ENTREPRISE_SUPPRIMEE: 'Cette entreprise a été supprimée de la plateforme.',
          ORGANISATION_INTROUVABLE: 'L\'organisation indiquée est introuvable.',
          PLAN_INVALIDE: 'Plan d\'abonnement invalide.',
          PROPRIETAIRE_EXISTANT: 'Un compte propriétaire existe déjà pour cette entreprise. Le propriétaire doit créer les autres comptes.',
          EMAIL_UTILISE: 'Cet email est déjà utilisé.',
        };
        const errorMessage =
          (data?.errorCode && byCode[data.errorCode]) ||
          ((status === 401 || status === 403) && 'Code opérateur invalide ou accès refusé.') ||
          (status === 429 && 'Trop de tentatives. Réessayez dans quelques minutes.') ||
          apiMessage ||
          'Erreur lors de la création du compte.';
        console.error('[useAuth] RegistrationForEntreprise error:', errorMessage);
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
        throw e;
      }
    },
    []
  );

  const login = useCallback(async (payload: LoginPayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(payload);

      if (response.success) {
        // Mode cookie : pas d'accessToken à stocker — le JWT est dans le cookie HttpOnly.
        // Le csrfToken est capturé automatiquement par l'intercepteur apiClient.
        setState({
          isLoading: false,
          error: null,
          isAuthenticated: true,
          user: response.user || response.data || { email: payload.email },
        });
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Erreur lors de la connexion';
      console.error('[useAuth] Login error:', errorMessage);
      setState({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
    } catch (e: any) {
      console.error('[useAuth] Logout error:', e.message);
    } finally {
      // Efface le token CSRF en mémoire quelle que soit l'issue du logout
      clearCsrfToken();
      setState({
        isLoading: false,
        error: null,
        isAuthenticated: false,
        user: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return useMemo(() => ({
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    register,
    registerForEntreprise,
    login,
    logout,
    clearError,
  }), [state.isLoading, state.error, state.isAuthenticated, state.user, register, registerForEntreprise, login, logout, clearError]);
};
