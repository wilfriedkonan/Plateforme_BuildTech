import { apiClient } from './apiClient';

export interface PlanDto {
  id?: string;
  applicationKey?: string;
  applicationName?: string;
  applicationDescription?: string;
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  popular?: boolean;
  color?: string;
}

export interface ApplicationPlansDto {
  key: string;
  name: string;
  description: string;
  color?: string;
  plans: PlanDto[];
}

export type CreatePlanDto = Omit<PlanDto, 'id'>;
export type UpdatePlanDto = Partial<Omit<PlanDto, 'id'>>;

// API Response types
export interface ApiPlanResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  maxUsers: number;
  maxInvoicesPerMonth: number;
  maxStorageMB: number;
  isActive: boolean;
  hasUnlimitedUsers: boolean;
  hasUnlimitedInvoices: boolean;
  hasUnlimitedStorage: boolean;
  formattedPrice: string;
  formattedStorage: string;
  formattedInvoices: string;
  formattedUsers: string;
}

export interface ApiPlansListResponse {
  success: boolean;
  total: number;
  totalActifs: number;
  plans: ApiPlanResponse[];
}

const transformApiPlansToDto = (apiResponse: ApiPlansListResponse): ApplicationPlansDto[] => {
  const plans = apiResponse.plans || [];
  
  return [{
    key: 'business-manager',
    name: 'Business Manager Pro',
    description: 'Plans de gestion d\'entreprise',
    color: 'from-purple-600 to-orange-500',
    plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.formattedPrice,
      period: 'par mois',
      features: [
        plan.description,
        `${plan.formattedUsers}`,
        `${plan.formattedInvoices} factures`,
        `${plan.formattedStorage} stockage`,
      ],
      cta: 'Choisir ce plan',
      popular: plan.name === 'Professional',
      color: 'from-gray-600 to-gray-700',
    })),
  }];
};

export const plansService = {
  list: async (): Promise<ApplicationPlansDto[] | PlanDto[]> => {
    try {
      console.log('[plansService] Fetching plans from API...');
      
      // Try with Axios first
      try {
        const { data } = await apiClient.get<ApiPlansListResponse>('plans');
        console.log('[plansService] Axios success:', data);
        
        if (data.success && data.plans) {
          const transformed = transformApiPlansToDto(data);
          console.log('[plansService] Transformed response:', transformed);
          return transformed;
        }
      } catch (axiosError: any) {
        console.warn('[plansService] Axios failed with status', axiosError.response?.status);
        
        // Fallback: try with fetch API (like the browser does)
        console.log('[plansService] Trying with fetch API...');
        const response = await fetch('http://localhost:5292/api/plans', {
          method: 'GET',
          headers: {
            'ApiKey': 'VotreCléAPISecrète123!',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        
        const data = await response.json() as ApiPlansListResponse;
        console.log('[plansService] Fetch success:', data);
        
        if (data.success && data.plans) {
          const transformed = transformApiPlansToDto(data);
          console.log('[plansService] Transformed response:', transformed);
          return transformed;
        }
      }
      
      throw new Error('API response missing success or plans');
    } catch (error: any) {
      console.error('[plansService] Error fetching plans:', error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<PlanDto> => {
    const { data } = await apiClient.get(`plans/${encodeURIComponent(id)}`);
    return data;
  },

  create: async (payload: CreatePlanDto): Promise<PlanDto> => {
    const { data } = await apiClient.post('plans', payload);
    return data;
  },

  update: async (id: string, payload: UpdatePlanDto): Promise<PlanDto> => {
    const { data } = await apiClient.put(`plans/${encodeURIComponent(id)}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`plans/${encodeURIComponent(id)}`);
  },
};
