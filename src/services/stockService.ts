import { apiClient } from './apiClient';

export interface StockItem {
  idEntreprise: string;
  idArticle: string;
  designationArticle: string;
  designationCategorie: string;
  stockActuel: number;
  seuilStock: number;
  statutStock: 'EN STOCK' | 'STOCK FAIBLE' | 'RUPTURE';
  estEnAlerte: boolean;
  estEnRupture: boolean;
  tauxStock: number;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface StockListResponse {
  success: boolean;
  total: number;
  totalEnStock: number;
  totalEnAlerte: number;
  totalEnRupture: number;
  pagination: PaginationInfo;
  data: StockItem[];
}

export interface StockFilters {
  page?: number;
  pageSize?: number;
  statutStock?: 'EN STOCK' | 'STOCK FAIBLE' | 'RUPTURE';
  designationCategorie?: string;
  searchTerm?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

const stockService = {
  // GET /api/Articles/stock/view - Récupérer les stocks avec filtres et pagination
  async getStocks(filters: StockFilters = {}): Promise<StockListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.statutStock) params.append('statutStock', filters.statutStock);
      if (filters.designationCategorie) params.append('designationCategorie', filters.designationCategorie);
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);

      const queryString = params.toString();
      const url = `/Articles/stock/view${queryString ? '?' + queryString : ''}`;
      
      const response = await apiClient.get<StockListResponse>(url);
      console.log('[stockService] Get stocks response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[stockService] Error fetching stocks:', error);
      throw error;
    }
  },

  // GET /api/Articles/stock/view/{id} - Récupérer le détail du stock d'un article
  async getStockById(articleId: string): Promise<StockItem | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: StockItem }>(`/Articles/stock/view/${articleId}`);
      console.log('[stockService] Get stock by ID response:', response.data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[stockService] Error fetching stock by ID:', error);
      throw error;
    }
  },

  // PUT /api/Articles/stock/{id} - Mettre à jour le stock d'un article
  async updateStock(articleId: string, stockData: { stockActuel: number; seuilStock?: number }): Promise<StockItem | null> {
    try {
      const response = await apiClient.put<{ success: boolean; data?: StockItem }>(`/Articles/stock/${articleId}`, stockData);
      console.log('[stockService] Update stock response:', response.data);
      return response.data.data || null;
    } catch (error: any) {
      console.error('[stockService] Error updating stock:', error);
      throw error;
    }
  },
};

export default stockService;
