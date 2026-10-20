import { useCallback, useMemo, useState } from 'react';
import { authService, type LoginPayload, type RegistrationPayload } from '../services/authService';
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
    login,
    logout,
    clearError,
  }), [state.isLoading, state.error, state.isAuthenticated, state.user, register, login, logout, clearError]);
};
