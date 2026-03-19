import { useState, useCallback } from 'react';
import mouvementStockService, { Mouvement, MouvementFilters } from '../services/mouvementStockService';

interface UseMouvementStockState {
  mouvements: Mouvement[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
  totals: {
    total: number;
    totalEntrees: number;
    totalSorties: number;
    valeurEntrees: number;
    valeurSorties: number;
    soldeQuantite: number;
    soldeValeur: number;
  };
}

export const useMouvementStock = () => {
  const [state, setState] = useState<UseMouvementStockState>({
    mouvements: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,
      totalRecords: 0,
      hasPrevious: false,
      hasNext: false,
    },
    totals: {
      total: 0,
      totalEntrees: 0,
      totalSorties: 0,
      valeurEntrees: 0,
      valeurSorties: 0,
      soldeQuantite: 0,
      soldeValeur: 0,
    },
  });

  // Récupérer les mouvements avec filtres
  const fetchMouvements = useCallback(async (filters: MouvementFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await mouvementStockService.getMouvements(filters);
      console.log('[useMouvementStock] Fetched mouvements:', response);
      setState({
        mouvements: response.mouvements || [],
        loading: false,
        error: null,
        pagination: response.pagination || {
          currentPage: 1,
          pageSize: 20,
          totalPages: 1,
          totalRecords: 0,
          hasPrevious: false,
          hasNext: false,
        },
        totals: {
          total: response.total || 0,
          totalEntrees: response.totalEntrees || 0,
          totalSorties: response.totalSorties || 0,
          valeurEntrees: response.valeurEntrees || 0,
          valeurSorties: response.valeurSorties || 0,
          soldeQuantite: response.soldeQuantite || 0,
          soldeValeur: response.soldeValeur || 0,
        },
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des mouvements';
      console.error('[useMouvementStock] Error fetching mouvements:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Récupérer un mouvement par ID
  const getMouvementById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const mouvement = await mouvementStockService.getMouvementById(id);
      console.log('[useMouvementStock] Fetched mouvement by ID:', mouvement);
      setState(prev => ({ ...prev, loading: false }));
      return mouvement;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement du mouvement';
      console.error('[useMouvementStock] Error fetching mouvement by ID:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Créer un mouvement
  const createMouvement = useCallback(async (mouvementData: Partial<Mouvement>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const mouvement = await mouvementStockService.createMouvement(mouvementData);
      console.log('[useMouvementStock] Created mouvement:', mouvement);
      setState(prev => ({ ...prev, loading: false }));
      return mouvement;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la création du mouvement';
      console.error('[useMouvementStock] Error creating mouvement:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Supprimer un mouvement
  const deleteMouvement = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const success = await mouvementStockService.deleteMouvement(id);
      console.log('[useMouvementStock] Deleted mouvement:', success);
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression du mouvement';
      console.error('[useMouvementStock] Error deleting mouvement:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  return {
    mouvements: state.mouvements,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    totals: state.totals,
    fetchMouvements,
    getMouvementById,
    createMouvement,
    deleteMouvement,
  };
};
