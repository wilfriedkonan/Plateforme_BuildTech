import { useState, useCallback } from 'react';
import fournisseurService, { Fournisseur, CreateFournisseurRequest, UpdateFournisseurRequest, FournisseurFilters } from '../services/fournisseurService';

interface UseFournisseurState {
  fournisseurs: Fournisseur[];
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
    totalActifs: number;
    totalInactifs: number;
  };
}

export const useFournisseur = () => {
  const [state, setState] = useState<UseFournisseurState>({
    fournisseurs: [],
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
      totalActifs: 0,
      totalInactifs: 0,
    },
  });

  // RÃ©cupÃ©rer la liste des fournisseurs
  const fetchFournisseurs = useCallback(async (filters: FournisseurFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fournisseurService.getFournisseurs(filters);
      setState({
        fournisseurs: response.data || [],
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
          totalActifs: response.totalActifs || 0,
          totalInactifs: response.totalInactifs || 0,
        },
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des fournisseurs';
      console.error('[useFournisseur] Error fetching fournisseurs:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // RÃ©cupÃ©rer un fournisseur par ID
  const getFournisseurById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const fournisseur = await fournisseurService.getFournisseurById(id);
      setState(prev => ({ ...prev, loading: false }));
      return fournisseur;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement du fournisseur';
      console.error('[useFournisseur] Error fetching fournisseur by ID:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // CrÃ©er un fournisseur
  const createFournisseur = useCallback(async (fournisseurData: CreateFournisseurRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const fournisseur = await fournisseurService.createFournisseur(fournisseurData);
      setState(prev => ({ ...prev, loading: false }));
      return fournisseur;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la crÃ©ation du fournisseur';
      console.error('[useFournisseur] Error creating fournisseur:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Mettre Ã  jour un fournisseur
  const updateFournisseur = useCallback(async (id: string, fournisseurData: UpdateFournisseurRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const fournisseur = await fournisseurService.updateFournisseur(id, fournisseurData);
      setState(prev => ({ ...prev, loading: false }));
      return fournisseur;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise Ã  jour du fournisseur';
      console.error('[useFournisseur] Error updating fournisseur:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Supprimer un fournisseur
  const deleteFournisseur = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const success = await fournisseurService.deleteFournisseur(id);
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression du fournisseur';
      console.error('[useFournisseur] Error deleting fournisseur:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Changer l'Ã©tat d'un fournisseur
  const changeFournisseurEtat = useCallback(async (id: string, etat: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const fournisseur = await fournisseurService.changeFournisseurEtat(id, etat);
      setState(prev => ({ ...prev, loading: false }));
      return fournisseur;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du changement d\'Ã©tat du fournisseur';
      console.error('[useFournisseur] Error changing fournisseur etat:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  return {
    fournisseurs: state.fournisseurs,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    totals: state.totals,
    fetchFournisseurs,
    getFournisseurById,
    createFournisseur,
    updateFournisseur,
    deleteFournisseur,
    changeFournisseurEtat,
  };
};
