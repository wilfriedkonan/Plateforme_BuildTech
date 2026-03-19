import { useCallback, useMemo, useState } from 'react';
import { authService, type LoginPayload, type RegistrationPayload } from '../services/authService';

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
      console.log('[useAuth] Registering user...');
      const response = await authService.register(payload);
      console.log('[useAuth] Registration successful:', response);
      
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
      console.log('[useAuth] Logging in user...');
      const response = await authService.login(payload);
      console.log('[useAuth] Login successful:', response);
      
      if (response.success) {
        // Store token if provided
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
        }
        
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
      console.log('[useAuth] Logging out...');
      await authService.logout();
      localStorage.removeItem('authToken');
      setState({
        isLoading: false,
        error: null,
        isAuthenticated: false,
        user: null,
      });
    } catch (e: any) {
      console.error('[useAuth] Logout error:', e.message);
      // Still clear local state even if logout API fails
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
