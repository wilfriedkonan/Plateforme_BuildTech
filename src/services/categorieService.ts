import { apiClient } from './apiClient';

export interface Categorie {
  id?: string;
  designation: string;
  code: string;
  couleur: string;
  idEntreprise: string;
  idDomaine: string;
  etat: string;
  ordre: number;
  estRestaurant: boolean;
  estEmporte: boolean;
  statut: boolean;
}

export interface CategorieResponse {
  success: boolean;
  total: number;
  categories: Categorie[];
}

export interface CategorieDetailResponse {
  success: boolean;
  categorie?: Categorie;
  message?: string;
}

const categorieService = {
  // Récupérer toutes les catégories de l'entreprise (depuis le token)
  async getCategories(): Promise<CategorieResponse> {
    try {
      const response = await apiClient.get<CategorieResponse>('/Categorie');
      console.log('[categorieService] Get categories response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[categorieService] Error fetching categories:', error);
      throw error;
    }
  },

  // Créer une nouvelle catégorie
  async createCategorie(categorie: Categorie): Promise<CategorieDetailResponse> {
    try {
      const response = await apiClient.post<CategorieDetailResponse>('/Categorie', categorie);
      console.log('[categorieService] Create categorie response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[categorieService] Error creating categorie:', error);
      throw error;
    }
  },

  // Mettre à jour une catégorie
  async updateCategorie(id: string, categorie: Partial<Categorie>): Promise<CategorieDetailResponse> {
    try {
      const response = await apiClient.put<CategorieDetailResponse>(`/Categorie/${id}`, categorie);
      console.log('[categorieService] Update categorie response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[categorieService] Error updating categorie:', error);
      throw error;
    }
  },

  // Supprimer une catégorie
  async deleteCategorie(id: string): Promise<CategorieDetailResponse> {
    try {
      const response = await apiClient.delete<CategorieDetailResponse>(`/Categorie/${id}`);
      console.log('[categorieService] Delete categorie response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[categorieService] Error deleting categorie:', error);
      throw error;
    }
  }
};

export default categorieService;
