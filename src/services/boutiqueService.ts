import { apiClient } from './apiClient';
import { publicApiClient } from './publicApiClient';

// ─── Types DTO ────────────────────────────────────────────────────────────────

export interface BoutiqueDto {
  idBoutique: string;
  idEntreprise: string;
  idTypeBoutique: string;
  nomBoutique: string;
  slugBoutique: string;
  codeQR: string;
  emailBoutique?: string;
  telephoneBoutique?: string;
  adresseBoutique?: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
  urlDomainCustom?: string;
  typeBoutique: string;
  codeType?: string;
  iconeType?: string;
  estActif: boolean;
  permitCommandeEnLigne: boolean;
  permitAccesQR: boolean;
  permitLivraison: boolean;
  permitRetrait: boolean;
  nombreArticles: number;
  nombreCategories: number;
  dateCreation?: string;
  dateMiseAJour?: string;
}

export interface TypeBoutiqueDto {
  idTypeBoutique: string;
  nomType: string;
  codeType: string;
  description?: string;
  iconeType?: string;
  permitCommandeParDefaut: boolean;
  permitLivraisonParDefaut: boolean;
  permitRetraitParDefaut: boolean;
  permitReservationParDefaut: boolean;
}

export interface CreateBoutiqueRequest {
  idEntreprise: string;
  typeBoutique: string;
  nomBoutique: string;
  emailBoutique?: string;
  telephoneBoutique?: string;
  adresseBoutique?: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
}

export interface UpdateBoutiqueRequest {
  nomBoutique?: string;
  emailBoutique?: string;
  telephoneBoutique?: string;
  adresseBoutique?: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
  permitCommandeEnLigne?: boolean;
  permitLivraison?: boolean;
  permitRetrait?: boolean;
}

export interface BoutiquePagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface BoutiqueListResponse {
  success: boolean;
  total: number;
  pagination?: BoutiquePagination;
  boutiques: BoutiqueDto[];
}

export interface BoutiqueDetailResponse {
  success: boolean;
  data?: BoutiqueDto;
  boutique?: BoutiqueDto; // fallback si le backend nomme le champ autrement
  message?: string;
}

export interface CatalogueResponse {
  success: boolean;
  data?: CatalogueDto;
  message?: string;
}

export interface BoutiqueListParams {
  page?: number;
  pageSize?: number;
}

export interface BoutiqueSearchParams {
  nom?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

// ─── Types catalogue public ───────────────────────────────────────────────────

export interface CataloguePublicArticleDto {
  idArticle: string;
  nomArticle: string;
  descriptionArticle?: string;
  prixVente: number;
  prixPromo?: number;
  estPromo: boolean;
  imageURL?: string;
  estEnStock: boolean;
}

export interface CataloguePublicCategoryDto {
  idCategorie: string;
  nomCategorie: string;
  description?: string;
  imageURL?: string;
  articles: CataloguePublicArticleDto[];
}

export interface CatalogueDto {
  idBoutique: string;
  nomBoutique: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
  typeBoutique: string;
  codeType?: string;
  iconeType?: string;
  mode: string;
  permitCommande: boolean;
  categories: CataloguePublicCategoryDto[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

const boutiqueService = {
  // GET /api/Boutique
  async getBoutiques(params?: BoutiqueListParams): Promise<BoutiqueListResponse> {
    try {
      const query: Record<string, string> = {};
      if (params?.page !== undefined)     query.page     = String(params.page);
      if (params?.pageSize !== undefined) query.pageSize = String(params.pageSize);
      const response = await apiClient.get<BoutiqueListResponse>('/Boutique', { params: query });
      return response.data;
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching boutiques:', error);
      throw error;
    }
  },

  // POST /api/Boutique
  async createBoutique(data: CreateBoutiqueRequest): Promise<BoutiqueDetailResponse> {
    try {
      const response = await apiClient.post<BoutiqueDetailResponse>('/Boutique', data);
      return response.data;
    } catch (error: any) {
      console.error('[boutiqueService] Error creating boutique:', error);
      throw error;
    }
  },

  // GET /api/Boutique/search
  async searchBoutiques(params?: BoutiqueSearchParams): Promise<BoutiqueListResponse> {
    try {
      const query: Record<string, string> = {};
      if (params?.nom)                    query.nom      = params.nom;
      if (params?.type)                   query.type     = params.type;
      if (params?.page !== undefined)     query.page     = String(params.page);
      if (params?.pageSize !== undefined) query.pageSize = String(params.pageSize);
      const response = await apiClient.get<BoutiqueListResponse>('/Boutique/search', { params: query });
      return response.data;
    } catch (error: any) {
      console.error('[boutiqueService] Error searching boutiques:', error);
      throw error;
    }
  },

  // GET /api/Boutique/types
  async getTypesBoutique(): Promise<TypeBoutiqueDto[]> {
    try {
      const response = await apiClient.get<TypeBoutiqueDto[]>('/Boutique/types');
      return response.data;
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching boutique types:', error);
      throw error;
    }
  },

  // GET /api/Boutique/{id}
  async getBoutiqueById(id: string): Promise<BoutiqueDto | null> {
    try {
      const response = await apiClient.get<BoutiqueDetailResponse>(`/Boutique/${id}`);
      return response.data.data ?? response.data.boutique ?? null;
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching boutique by id:', error);
      throw error;
    }
  },

  // PUT /api/Boutique/{id}
  async updateBoutique(id: string, data: UpdateBoutiqueRequest): Promise<BoutiqueDetailResponse> {
    try {
      const response = await apiClient.put<BoutiqueDetailResponse>(`/Boutique/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('[boutiqueService] Error updating boutique:', error);
      throw error;
    }
  },

  // DELETE /api/Boutique/{id}
  async deleteBoutique(id: string): Promise<BoutiqueDetailResponse> {
    try {
      const response = await apiClient.delete<BoutiqueDetailResponse>(`/Boutique/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('[boutiqueService] Error deleting boutique:', error);
      throw error;
    }
  },

  // GET /api/public/boutique/slug/{slug}
  async getBoutiqueBySlug(slug: string): Promise<BoutiqueDto | null> {
    try {
      const response = await publicApiClient.get<BoutiqueDetailResponse>(`/public/boutique/slug/${slug}`);
      return response.data.data ?? response.data.boutique ?? null;
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching boutique by slug:', error);
      throw error;
    }
  },

  // GET /api/public/boutique/qr/{codeQR}
  async getBoutiqueByQR(codeQR: string): Promise<BoutiqueDto | null> {
    try {
      const response = await publicApiClient.get<BoutiqueDetailResponse>(`/public/boutique/qr/${codeQR}`);
      return response.data.data ?? response.data.boutique ?? null;
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching boutique by QR:', error);
      throw error;
    }
  },

  // GET /api/public/boutique/{typeBoutique}/{slug}
  async getBoutiqueByTypeAndSlug(typeBoutique: string, slug: string): Promise<BoutiqueDto | null> {
    try {
      const response = await publicApiClient.get<BoutiqueDetailResponse>(`/public/boutique/${typeBoutique}/${slug}`);
      return response.data.data ?? response.data.boutique ?? null;
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching boutique by type+slug:', error);
      throw error;
    }
  },

  // GET /api/public/boutique/{idBoutique}/catalogue
  async getCataloguePublic(idBoutique: string, mode: string = 'shop'): Promise<CatalogueDto | null> {
    try {
      const response = await publicApiClient.get<CatalogueResponse>(`/public/boutique/${idBoutique}/catalogue`, {
        params: { mode },
      });
      // Supporte { success, data: CatalogueDto } ou directement CatalogueDto
      const raw = response.data as any;
      return raw.data ?? (raw.success !== undefined ? null : raw);
    } catch (error: any) {
      console.error('[boutiqueService] Error fetching catalogue:', error);
      throw error;
    }
  },
};

export default boutiqueService;
