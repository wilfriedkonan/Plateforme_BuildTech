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
  // GET /api/Table - Récupérer toutes les tables
  async getTables(): Promise<Table[]> {
    try {
      const response = await apiClient.get<TableListResponse>('/Table');
      console.log('[tableService] Get tables response:', response.data);
      return response.data.tables || [];
    } catch (error: any) {
      console.error('[tableService] Error fetching tables:', error);
      throw error;
    }
  },

  // GET /api/Table/disponibles - Récupérer les tables disponibles
  async getTablesDisponibles(): Promise<Table[]> {
    try {
      const response = await apiClient.get<TableListResponse>('/Table/disponibles');
      console.log('[tableService] Get tables disponibles response:', response.data);
      return response.data.tables || [];
    } catch (error: any) {
      console.error('[tableService] Error fetching tables disponibles:', error);
      throw error;
    }
  },

  // GET /api/Table/{id} - Récupérer une table par ID
  async getTableById(id: string): Promise<Table | null> {
    try {
      const response = await apiClient.get<TableDetailResponse>(`/Table/${id}`);
      console.log('[tableService] Get table by ID response:', response.data);
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error fetching table by ID:', error);
      throw error;
    }
  },

  // POST /api/Table - Créer une nouvelle table
  async createTable(table: CreateTableRequest): Promise<TableDetailResponse> {
    try {
      const response = await apiClient.post<TableDetailResponse>('/Table', table);
      console.log('[tableService] Create table response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[tableService] Error creating table:', error);
      throw error;
    }
  },

  // PUT /api/Table/{id} - Mettre à jour une table
  async updateTable(id: string, table: UpdateTableRequest): Promise<Table | null> {
    try {
      const response = await apiClient.put<TableDetailResponse>(`/Table/${id}`, table);
      console.log('[tableService] Update table response:', response.data);
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
      console.log('[tableService] Delete table response:', response.data);
      return response.data.success;
    } catch (error: any) {
      console.error('[tableService] Error deleting table:', error);
      throw error;
    }
  },

  // PUT /api/Table/{id}/affecter - Affecter un serveur à une table
  async affecterServeur(id: string, request: AffecterServeurRequest): Promise<Table | null> {
    try {
      const response = await apiClient.put<TableDetailResponse>(`/Table/${id}/affecter`, request);
      console.log('[tableService] Affecter serveur response:', response.data);
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error affecting serveur to table:', error);
      throw error;
    }
  },

  // PUT /api/Table/{id}/liberer - Libérer une table
  async libererTable(id: string): Promise<Table | null> {
    try {
      const response = await apiClient.put<TableDetailResponse>(`/Table/${id}/liberer`, {});
      console.log('[tableService] Liberer table response:', response.data);
      return response.data.data || response.data.table || null;
    } catch (error: any) {
      console.error('[tableService] Error liberating table:', error);
      throw error;
    }
  },
};

export default tableService;
