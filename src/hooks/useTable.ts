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

  // RÃ©cupÃ©rer toutes les tables
  const fetchTables = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tables = await tableService.getTables();
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

  // RÃ©cupÃ©rer les tables disponibles
  const fetchTablesDisponibles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tables = await tableService.getTablesDisponibles();
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

  // RÃ©cupÃ©rer une table par ID
  const getTableById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.getTableById(id);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement de la table';
      console.error('[useTable] Error fetching table by ID:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // CrÃ©er une table
  const createTable = useCallback(async (table: CreateTableRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.createTable(table);
      if (response.success) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la crÃ©ation de la table';
      console.error('[useTable] Error creating table:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchTables]);

  // Mettre Ã  jour une table
  const updateTable = useCallback(async (id: string, table: UpdateTableRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.updateTable(id, table);
      if (response) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise Ã  jour de la table';
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

  // Affecter un serveur Ã  une table
  const affecterServeur = useCallback(async (id: string, request: AffecterServeurRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.affecterServeur(id, request);
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

  // LibÃ©rer une table
  const libererTable = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await tableService.libererTable(id);
      if (response) {
        await fetchTables();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la libÃ©ration de la table';
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
