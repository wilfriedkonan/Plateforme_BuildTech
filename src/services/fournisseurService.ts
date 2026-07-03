import { apiClient } from './apiClient';

export interface Fournisseur {
  id: string;
  code: string;
  nom: string;
  specialite: string;
  contact: string;
  email: string;
  nrc: string;
  idEntreprise: string;
  etat: string;
  adresse: string;
  statut: number;
  dateCreate: string;
  idCreateUser: string;
  nomCreateUser: string;
  dateLastUpdate: string;
  idLastUpdateUser: string;
  nomLastUpdateUser: string;
}

export interface CreateFournisseurRequest {
  request?: string;
  code: string;
  nom: string;
  specialite: string;
  contact: string;
  email: string;
  nrc?: string;
  adresse?: string;
  statut?: boolean;
}

export interface UpdateFournisseurRequest extends Partial<CreateFournisseurRequest> {}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface FournisseurListResponse {
  success: boolean;
  total: number;
  totalActifs: number;
  totalInactifs: number;
  pagination: PaginationInfo;
  data: Fournisseur[];
}

export interface FournisseurDetailResponse {
  success: boolean;
  data?: Fournisseur;
}

export interface FournisseurFilters {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  etat?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

const fournisseurService = {
  // GET /api/Fournisseurs - RÃ©cupÃ©rer la liste des fournisseurs
  async getFournisseurs(filters: FournisseurFilters = {}): Promise<FournisseurListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.etat) params.append('etat', filters.etat);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);

      const queryString = params.toString();
      const url = `/Fournisseurs${queryString ? '?' + queryString : ''}`;
      
      const response = await apiClient.get<FournisseurListResponse>(url);
      return response.data;
    } catch (error: any) {
      console.error('[fournisseurService] Error fetching fournisseurs:', error);
      throw error;
    }
  },

  // GET /api/Fournisseurs/{id} - RÃ©cupÃ©rer un fournisseur par ID
  async getFournisseurById(id: string): Promise<Fournisseur | null> {
    try {
      const response = await apiClient.get<FournisseurDetailResponse>(`/Fournisseurs/${id}`);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[fournisseurService] Error fetching fournisseur by ID:', error);
      throw error;
    }
  },

  // POST /api/Fournisseurs - CrÃ©er un fournisseur
  async createFournisseur(fournisseurData: CreateFournisseurRequest): Promise<Fournisseur | null> {
    try {
      const response = await apiClient.post<FournisseurDetailResponse>('/Fournisseurs', fournisseurData);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[fournisseurService] Error creating fournisseur:', error);
      throw error;
    }
  },

  // PUT /api/Fournisseurs/{id} - Mettre Ã  jour un fournisseur
  async updateFournisseur(id: string, fournisseurData: UpdateFournisseurRequest): Promise<Fournisseur | null> {
    try {
      const response = await apiClient.put<FournisseurDetailResponse>(`/Fournisseurs/${id}`, fournisseurData);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[fournisseurService] Error updating fournisseur:', error);
      throw error;
    }
  },

  // DELETE /api/Fournisseurs/{id} - Supprimer un fournisseur
  async deleteFournisseur(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<{ success: boolean }>(`/Fournisseurs/${id}`);
      return response.data.success || false;
    } catch (error: any) {
      console.error('[fournisseurService] Error deleting fournisseur:', error);
      throw error;
    }
  },

  // PATCH /api/Fournisseurs/{id}/etat - Changer l'Ã©tat d'un fournisseur
  async changeFournisseurEtat(id: string, etat: string): Promise<Fournisseur | null> {
    try {
      const response = await apiClient.patch<FournisseurDetailResponse>(`/Fournisseurs/${id}/etat`, { etat });
      return response.data.data || null;
    } catch (error: any) {
      console.error('[fournisseurService] Error changing fournisseur etat:', error);
      throw error;
    }
  },
};

export default fournisseurService;
