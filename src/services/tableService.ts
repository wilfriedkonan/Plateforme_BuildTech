import { apiClient } from './apiClient';

export interface Table {
  id?: string;
  designation?: string;
  disponible?: boolean;
  etat?: string;
  idEntreprise?: string;
  statue?: string | null;
  ordre?: number | null;
  serveurAffecte?: string | null;
}

export interface CreateTableRequest {
  designation?: string;
  disponible: boolean;
  etat?: string;
  idEntreprise?: string;
  statue?: string;
  ordre?: number;
}

export interface UpdateTableRequest {
  designation?: string;
  disponible?: boolean;
  etat?: string;
  statue?: string;
  ordre?: number;
  serveurAffecte?: string;
}

export interface AffecterServeurRequest {
  idUtilisateur: string;
  serveurAffecte?: string;
}

export interface TableListResponse {
  success: boolean;
  total: number;
  tables: Table[];
}

export interface TableDetailResponse {
  success: boolean;
  data?: Table;
  table?: Table;
  message?: string;
}

const tableService = {
  // GET /api/Table - RÃ©cupÃ©rer toutes les tables
  async getTables(): Promise<Table[]> {
    try {
      const response = await apiClient.get<TableListResponse>('/Table');
      return response.data.tables || [];
    } catch (error: any) {
      console.error('[tableService] Error fetching tables:', error);
      throw error;
    }
  },

  // GET /api/Table/disponibles - RÃ©cupÃ©rer les tables disponibles
  async getTablesDisponibles(): Promise<Table[]> {
    try {
      const response = await apiClient.get<TableListResponse>('/Table/disponibles');
      return response.data.tables || [];
    } catch (error: any) {
      console.error('[tableService] Error fetching tables disponibles:', error);
      throw error;
    }
  },

  // GET /api/Table/{id} - RÃ©cupÃ©rer une table par ID
  async getTableById(id: string): Promise<Table | null> {
    try {
      const response = await apiClient.get<TableDetailResponse>(`/Table/${id}`);
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error fetching table by ID:', error);
      throw error;
    }
  },

  // POST /api/Table - CrÃ©er une nouvelle table
  async createTable(table: CreateTableRequest): Promise<TableDetailResponse> {
    try {
      const response = await apiClient.post<TableDetailResponse>('/Table', table);
      return response.data;
    } catch (error: any) {
      console.error('[tableService] Error creating table:', error);
      throw error;
    }
  },

  // PUT /api/Table/{id} - Mettre Ã  jour une table
  async updateTable(id: string, table: UpdateTableRequest): Promise<Table | null> {
    try {
      const response = await apiClient.put<TableDetailResponse>(`/Table/${id}`, table);
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error updating table:', error);
      throw error;
    }
  },

  // DELETE /api/Table/{id} - Supprimer une table
  async deleteTable(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<TableDetailResponse>(`/Table/${id}`);
      return response.data.success;
    } catch (error: any) {
      console.error('[tableService] Error deleting table:', error);
      throw error;
    }
  },

  // PUT /api/Table/{id}/affecter - Affecter un serveur Ã  une table
  async affecterServeur(id: string, request: AffecterServeurRequest): Promise<Table | null> {
    try {
      const response = await apiClient.put<TableDetailResponse>(`/Table/${id}/affecter`, request);
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error affecting serveur to table:', error);
      throw error;
    }
  },

  // PUT /api/Table/{id}/liberer - LibÃ©rer une table
  async libererTable(id: string): Promise<Table | null> {
    try {
      const response = await apiClient.put<TableDetailResponse>(`/Table/${id}/liberer`, {});
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error liberating table:', error);
      throw error;
    }
  },
};

export default tableService;
