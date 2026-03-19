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
  accessToken?: string;
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

export const authService = {
  register: async (payload: RegistrationPayload): Promise<RegistrationResponse> => {
    try {
      console.log('[authService] Registering user:', payload.email);
      const { data } = await apiClient.post<RegistrationResponse>('Registration/register', payload);
      console.log('[authService] Registration response:', data);
      return data;
    } catch (error: any) {
      console.error('[authService] Registration error:', error.message);
      throw error;
    }
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      console.log('[authService] Logging in user:', payload.email);
      const { data } = await apiClient.post<LoginResponse>('Auth/login', payload);
      console.log('[authService] Login response:', data);
      return data;
    } catch (error: any) {
      console.error('[authService] Login error:', error.message);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      console.log('[authService] Logging out');
      await apiClient.post('Auth/logout');
    } catch (error: any) {
      console.error('[authService] Logout error:', error.message);
      // Don't throw on logout - it's a cleanup operation
    }
  },
};
