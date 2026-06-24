import { useState, useCallback } from 'react';
import tableService, { Table, CreateTableRequest, UpdateTableRequest, AffecterServeurRequest } from '../services/tableService';

interface UseTableState {
  tables: Table[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useTable = () => {
  const [state, setState] = useState<UseTableState>({
    tables: [],
    loading: false,
    error: null,
    total: 0,
  });

  // Récupérer toutes les tables
  const fetchTables = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tables = await tableService.getTables();
      console.log('[useTable] Fetched tables:', tables);
      setState({
        tables: tables || [],
        loading: false,
        error: null,
        total: tables?.length || 0,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des tables';
      console.error('[useTable] Error fetching tables:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // Récupérer les tables disponibles
  const fetchTablesDisponibles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tables = await tableService.getTablesDisponibles();
      console.log('[useTable] Fetched tables disponibles:', tables);
      setState({
        tables: tables || [],
        loading: false,
        error: null,
        total: tables?.length || 0,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des tables disponibles';
      console.error('[useTable] Error fetching tables disponibles:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // Récupérer une table par ID
  const getTableById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.getTableById(id);
      console.log('[useTable] Fetched table by ID:', response);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement de la table';
      console.error('[useTable] Error fetching table by ID:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // Créer une table
  const createTable = useCallback(async (table: CreateTableRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.createTable(table);
      console.log('[useTable] Created table:', response);
      if (response.success) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la création de la table';
      console.error('[useTable] Error creating table:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchTables]);

  // Mettre à jour une table
  const updateTable = useCallback(async (id: string, table: UpdateTableRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.updateTable(id, table);
      console.log('[useTable] Updated table:', response);
      if (response) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise à jour de la table';
      console.error('[useTable] Error updating table:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchTables]);

  // Supprimer une table
  const deleteTable = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const success = await tableService.deleteTable(id);
      console.log('[useTable] Deleted table:', success);
      if (success) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression de la table';
      console.error('[useTable] Error deleting table:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchTables]);

  // Affecter un serveur à une table
  const affecterServeur = useCallback(async (id: string, request: AffecterServeurRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.affecterServeur(id, request);
      console.log('[useTable] Affected serveur to table:', response);
      if (response) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erreur lors de l'affectation du serveur";
      console.error('[useTable] Error affecting serveur:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchTables]);

  // Libérer une table
  const libererTable = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.libererTable(id);
      console.log('[useTable] Liberated table:', response);
      if (response) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la libération de la table';
      console.error('[useTable] Error liberating table:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchTables]);

  return {
    ...state,
    fetchTables,
    fetchTablesDisponibles,
    getTableById,
    createTable,
    updateTable,
    deleteTable,
    affecterServeur,
    libererTable,
  };
};
