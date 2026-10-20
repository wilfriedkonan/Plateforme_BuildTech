import { apiClient } from './apiClient';

// Registration DTOs
export interface RegistrationPayload {
  email: string;
  telephone: string;
  password: string;
  nom: string;
  prenom: string;
  entrepriseName: string;
  contact: string;
  localisation: string;
  pays: string;
  ville: string;
  commune: string;
  idOrganisation?: string;
  organisationName?: string;
  idPlan?: string;
  subscriptionDurationMonths?: number;
  referralCode?: string;
  source?: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  data?: any;
}

// Login DTOs
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  // Mode cookie : plus d'accessToken dans le corps (il est dans un cookie HttpOnly).
  // csrfToken est capturé automatiquement par apiClient.
  csrfToken?: string;
  expiresAt?: string;
  user?: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    nomEntreprise: string;
    telephone?: string;
  };
  data?: any;
}

export interface SessionResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    entrepriseId: string;
    isSuperAdmin: boolean;
    role?: string;
  };
}

export const authService = {
  register: async (payload: RegistrationPayload): Promise<RegistrationResponse> => {
    try {
      const { data } = await apiClient.post<RegistrationResponse>('Registration/register', payload);
      return data;
    } catch (error: any) {
      console.error('[authService] Registration error:', error.message);
      throw error;
    }
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const { data } = await apiClient.post<LoginResponse>('Auth/login', payload);
      return data;
    } catch (error: any) {
      console.error('[authService] Login error:', error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('Auth/logout');
    } catch (error: any) {
      console.error('[authService] Logout error:', error.message);
      // Don't throw on logout - it's a cleanup operation
    }
  },

  /**
   * Vérifie la session au démarrage de l'app (remplace la lecture du token dans sessionStorage).
   * Renvoie null si l'utilisateur n'est pas connecté. Tente un refresh silencieux avant d'abandonner.
   */
  getSession: async (): Promise<SessionResponse['user'] | null> => {
    try {
      const { data } = await apiClient.get<SessionResponse>('Auth/me', { skipAuthRedirect: true });
      return data.success ? data.user : null;
    } catch {
      return null;
    }
  },
};
