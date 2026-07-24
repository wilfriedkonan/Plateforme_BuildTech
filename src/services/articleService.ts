import { apiClient } from './apiClient';
import { publicApiClient } from './publicApiClient';

export interface Article {
  id?: string;
  codeArticle?: string;
  designation?: string;
  description?: string;
  codeBarre?: string | null;
  prixAchat?: number;
  prixVente?: number;
  prixExterieur?: number | null;
  estPos?: boolean;
  position?: number | null;
  estExonerer?: boolean | null;
  typeRepas?: string | null;
  etat?: string;
  datePerenption?: string | null;
  estStockable?: boolean;
  estEnStock?: boolean | null;
  estEnPorter?: boolean | null;
  estVisibleCatalogue?: boolean | null;
  stock?: number;
  stockActuel?: number;
  seuilAlerte?: number;
  afficherStockPOS?: boolean | null;
  alerteStock?: boolean;
  idEntreprise?: string;
  idCathegorie?: string;
  idType_Repas?: string | null;
  idStock?: string | null;
  nomCategorie?: string;
  prixPromo?: number | null;
  estPromo?: boolean | null;
  estComposer?: boolean | null;
  estVendableSansComposition?: boolean | null;
  tauxTva?: number;
  imageURL?: string;
  statut?: boolean;
  dateCreate?: string | null;
  idCreateUser?: string | null;
  nomCreateUser?: string | null;
  dateLastUpdate?: string | null;
  idLastUpdateUser?: string | null;
  nomLastUpdateUser?: string | null;
}

export interface CreateArticleRequest {
  codeArticle?: string;
  designation: string;
  description?: string;
  codeBarre?: string;
  prixAchat: number;
  prixVente: number;
  prixExterieur?: number;
  idEntreprise?: string;
  idCathegorie?: string;
  estPos?: boolean;
  estStockable?: boolean;
  etat?: string;
  tauxTva?: number;
  stock?: number;
  seuilAlerte?: number;
  imageURL?: string;
  statut?: boolean;
}

export interface UpdateArticleRequest {
  codeArticle?: string;
  designation?: string;
  description?: string;
  codeBarre?: string;
  prixAchat?: number;
  prixVente?: number;
  prixExterieur?: number;
  idCathegorie?: string;
  estPos?: boolean;
  position?: number;
  estExonerer?: boolean;
  etat?: string;
  estPromo?: boolean;
  prixPromo?: number;
  estComposer?: boolean;
  estVendableSansComposition?: boolean;
  estVisibleCatalogue?: boolean;
  tauxTva?: number;
  stock?: number;
  seuilAlerte?: number;
  imageURL?: string;
  statut?: boolean;
}

// ─── Types catalogue public ────────────────────────────────────────────────

export interface PublicCategorie {
  idCategorie: string;
  nomCategorie: string;
  ordreCategorie: number;
  imageURL?: string;
  description?: string;
  nombreArticles: number;
  nombreArticlesPromo: number;
  prixMin: number;
  prixMax: number;
  prixMoyen: number;
}

export interface PublicArticle {
  idArticle: string;
  codeArticle: string;
  nomArticle: string;
  descriptionArticle?: string;
  codeBarre?: string;
  prixVente: number;
  prixAchat?: number | null;
  prixExterieur?: number | null;
  prixPromo?: number | null;
  estPromo: boolean;
  stock: number;
  seuilAlerte?: number | null;
  estStockable: boolean;
  estPos: boolean;
  afficherStockPOS: boolean;
  imageURL?: string;
  position: number;
  tauxTva: number;
  nomCategorie?: string | null;
  idCategorie: string;
  dateCreate: string;
  dateLastUpdate: string;
}

export interface PublicCatalogueParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PublicCategorieListResponse {
  success: boolean;
  total: number;
  pagination: ArticlePagination;
  data: PublicCategorie[];
}

export interface PublicArticleListResponse {
  success: boolean;
  categoryName?: string;
  total: number;
  pagination: ArticlePagination;
  data: PublicArticle[];
}

export interface ArticleListResponse {
  success: boolean;
  total: number;
  totalStockables?: number;
  totalEnAlerte?: number;
  data?: Article[];
  articles?: Article[];
}

export interface ArticlePagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ArticleListPaginatedResponse {
  success: boolean;
  total: number;
  totalStockables?: number;
  totalEnAlerte?: number;
  pagination: ArticlePagination;
  data: Article[];
}

export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  idCategorie?: string;
  estStockable?: boolean;
  estVisibleCatalogue?: boolean;
  estPos?: boolean;
  estPromo?: boolean;
  etat?: string;
  prixVenteMin?: number;
  prixVenteMax?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ArticleDetailResponse {
  success: boolean;
  data?: Article;
  article?: Article;
  message?: string;
}

const articleService = {
  // GET /api/Articles - RÃ©cupÃ©rer tous les articles de l'entreprise (depuis le token)
  async getArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.get<ArticleListResponse>('/Articles');
      return response.data.data || response.data.articles || [];
    } catch (error: any) {
      console.error('[articleService] Error fetching articles:', error);
      throw error;
    }
  },

  // POST /api/Articles - CrÃ©er un nouvel article
  async createArticle(article: CreateArticleRequest): Promise<ArticleDetailResponse> {
    try {
      const response = await apiClient.post<ArticleDetailResponse>('/Articles', article);
      return response.data;
    } catch (error: any) {
      console.error('[articleService] Error creating article:', error);
      throw error;
    }
  },

  // GET /api/Articles/{id} - RÃ©cupÃ©rer un article par ID
  async getArticleById(id: string): Promise<Article | null> {
    try {
      const response = await apiClient.get<ArticleDetailResponse>(`/Articles/${id}`);
      return response.data.data || response.data.article || null;
    } catch (error: any) {
      console.error('[articleService] Error fetching article by ID:', error);
      throw error;
    }
  },

  // PUT /api/Articles/{id} - Mettre Ã  jour un article
  async updateArticle(id: string, article: UpdateArticleRequest): Promise<Article | null> {
    try {
      const response = await apiClient.put<ArticleDetailResponse>(`/Articles/${id}`, article);
      return response.data.data || response.data.article || null;
    } catch (error: any) {
      console.error('[articleService] Error updating article:', error);
      throw error;
    }
  },

  // DELETE /api/Articles/{id} - Supprimer un article
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<ArticleDetailResponse>(`/Articles/${id}`);
      return response.data.success;
    } catch (error: any) {
      console.error('[articleService] Error deleting article:', error);
      throw error;
    }
  },

  // GET /api/Articles/categorie/{idCategorie} - RÃ©cupÃ©rer les articles par catÃ©gorie
  async getArticlesByCategorie(idCategorie: string): Promise<Article[]> {
    try {
      const response = await apiClient.get<ArticleListResponse>(`/Articles/categorie/${idCategorie}`);
      return response.data.data || response.data.articles || [];
    } catch (error: any) {
      console.error('[articleService] Error fetching articles by categorie:', error);
      throw error;
    }
  },

  // GET /api/Articles/pos - RÃ©cupÃ©rer les articles POS
  async getArticlesPOS(): Promise<Article[]> {
    try {
      const response = await apiClient.get<ArticleListResponse>('/Articles/pos');
      return response.data.data || response.data.articles || [];
    } catch (error: any) {
      console.error('[articleService] Error fetching articles POS:', error);
      throw error;
    }
  },

  // GET /api/Articles/promo - RÃ©cupÃ©rer les articles en promotion
  async getArticlesPromo(): Promise<Article[]> {
    try {
      const response = await apiClient.get<ArticleListResponse>('/Articles/promo');
      return response.data.data || response.data.articles || [];
    } catch (error: any) {
      console.error('[articleService] Error fetching articles promo:', error);
      throw error;
    }
  },

  // GET /api/Articles/stock - RÃ©cupÃ©rer les articles en stock
  async getArticlesStock(): Promise<Article[]> {
    try {
      const response = await apiClient.get<ArticleListResponse>('/Articles/stock');
      return response.data.data || response.data.articles || [];
    } catch (error: any) {
      console.error('[articleService] Error fetching articles stock:', error);
      throw error;
    }
  },

  // GET /api/Articles/codebarre/{codeBarre} - Récupérer un article par code barre
  async getArticleByCodeBarre(codeBarre: string): Promise<Article | null> {
    try {
      const response = await apiClient.get<ArticleDetailResponse>(`/Articles/codebarre/${codeBarre}`);
      return response.data.data || response.data.article || null;
    } catch (error: any) {
      console.error('[articleService] Error fetching article by code barre:', error);
      throw error;
    }
  },

  // GET /api/Articles/public/categories — catégories publiques (sans auth)
  async getPublicCategories(params?: PublicCatalogueParams): Promise<PublicCategorieListResponse> {
    try {
      const query: Record<string, string> = {};
      if (params?.page !== undefined)      query.page = String(params.page);
      if (params?.pageSize !== undefined)  query.pageSize = String(params.pageSize);
      if (params?.orderBy)                 query.orderBy = params.orderBy;
      if (params?.orderDirection)          query.orderDirection = params.orderDirection;
      const response = await publicApiClient.get<PublicCategorieListResponse>('/Articles/public/categories', { params: query });
      return response.data;
    } catch (error: any) {
      console.error('[articleService] Error fetching public categories:', error);
      throw error;
    }
  },

  // GET /api/Articles/public/categories/{idCategorie}/articles — articles d'une catégorie publique (sans auth)
  async getPublicArticlesByCategory(idCategorie: string, params?: PublicCatalogueParams): Promise<PublicArticleListResponse> {
    try {
      const query: Record<string, string> = {};
      if (params?.page !== undefined)      query.page = String(params.page);
      if (params?.pageSize !== undefined)  query.pageSize = String(params.pageSize);
      if (params?.orderBy)                 query.orderBy = params.orderBy;
      if (params?.orderDirection)          query.orderDirection = params.orderDirection;
      const response = await publicApiClient.get<PublicArticleListResponse>(
        `/Articles/public/categories/${idCategorie}/articles`,
        { params: query }
      );
      return response.data;
    } catch (error: any) {
      console.error('[articleService] Error fetching public articles by category:', error);
      throw error;
    }
  },

  // GET /api/Articles/list - Liste paginée avec filtres
  async getArticlesList(params?: ArticleListParams): Promise<ArticleListPaginatedResponse> {
    try {
      const query: Record<string, string> = {};
      if (params?.page !== undefined)               query.page = String(params.page);
      if (params?.pageSize !== undefined)           query.pageSize = String(params.pageSize);
      if (params?.searchTerm)                       query.searchTerm = params.searchTerm;
      if (params?.idCategorie)                      query.idCategorie = params.idCategorie;
      if (params?.estStockable !== undefined)       query.estStockable = String(params.estStockable);
      if (params?.estVisibleCatalogue !== undefined) query.estVisibleCatalogue = String(params.estVisibleCatalogue);
      if (params?.estPos !== undefined)             query.estPos = String(params.estPos);
      if (params?.estPromo !== undefined)           query.estPromo = String(params.estPromo);
      if (params?.etat)                             query.etat = params.etat;
      if (params?.prixVenteMin !== undefined)       query.prixVenteMin = String(params.prixVenteMin);
      if (params?.prixVenteMax !== undefined)       query.prixVenteMax = String(params.prixVenteMax);
      if (params?.orderBy)                          query.orderBy = params.orderBy;
      if (params?.orderDirection)                   query.orderDirection = params.orderDirection;

      const response = await apiClient.get<ArticleListPaginatedResponse>('/Articles/list', { params: query });
      return response.data;
    } catch (error: any) {
      console.error('[articleService] Error fetching articles list:', error);
      throw error;
    }
  },
};

export default articleService;
