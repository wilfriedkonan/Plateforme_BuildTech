import { apiClient } from './apiClient';

export interface Mouvement {
  id: string;
  dateTransaction: string;
  typeMouvement: 'Entree' | 'Sortie' | 'Ajustement' | 'Retour';
  quantite: number;
  prixUnitaire: number;
  montant: number;
  reference: string;
  commentaire: string;
  idArticle: string;
  idMatierePremiere: string | null;
  idStock: string | null;
  idAutresMag: string | null;
  idEntreprise: string;
  referenceParentMvt: string | null;
  estSupprimer: boolean | null;
  nomArticle: string;
  nomMatiere: string | null;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface MouvementListResponse {
  success: boolean;
  total: number;
  totalEntrees: number;
  totalSorties: number;
  valeurEntrees: number;
  valeurSorties: number;
  soldeQuantite: number;
  soldeValeur: number;
  mouvements: Mouvement[];
  pagination: PaginationInfo;
}

export interface MouvementFilters {
  page?: number;
  pageSize?: number;
  dateDebut?: string;
  dateFin?: string;
  typeMouvement?: string;
  idArticle?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

const mouvementStockService = {
  // GET /api/MouvementStock - Récupérer les mouvements de stock avec filtres
  async getMouvements(filters: MouvementFilters = {}): Promise<MouvementListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);
      if (filters.typeMouvement) params.append('typeMouvement', filters.typeMouvement);
      if (filters.idArticle) params.append('idArticle', filters.idArticle);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);

      const queryString = params.toString();
      const url = `/MouvementStock${queryString ? '?' + queryString : ''}`;
      
      const response = await apiClient.get<MouvementListResponse>(url);
      console.log('[mouvementStockService] Get mouvements response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[mouvementStockService] Error fetching mouvements:', error);
      throw error;
    }
  },

  // GET /api/MouvementStock/{id} - Récupérer le détail d'un mouvement
  async getMouvementById(id: string): Promise<Mouvement | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: Mouvement }>(`/MouvementStock/${id}`);
      console.log('[mouvementStockService] Get mouvement by ID response:', response.data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[mouvementStockService] Error fetching mouvement by ID:', error);
      throw error;
    }
  },

  // POST /api/MouvementStock - Créer un mouvement de stock
  async createMouvement(mouvementData: Partial<Mouvement>): Promise<Mouvement | null> {
    try {
      const response = await apiClient.post<{ success: boolean; data?: Mouvement }>('/MouvementStock', mouvementData);
      console.log('[mouvementStockService] Create mouvement response:', response.data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[mouvementStockService] Error creating mouvement:', error);
      throw error;
    }
  },

  // DELETE /api/MouvementStock/{id} - Supprimer un mouvement
  async deleteMouvement(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<{ success: boolean }>(`/MouvementStock/${id}`);
      console.log('[mouvementStockService] Delete mouvement response:', response.data);
      return response.data.success || false;
    } catch (error: any) {
      console.error('[mouvementStockService] Error deleting mouvement:', error);
      throw error;
    }
  },
};

export default mouvementStockService;
