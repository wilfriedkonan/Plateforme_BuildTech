import { useState, useCallback } from 'react';
import categorieService, { Categorie } from '../services/categorieService';

interface UseCategoriesState {
  categories: Categorie[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useCategories = () => {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    loading: false,
    error: null,
    total: 0
  });

  // RÃ©cupÃ©rer toutes les catÃ©gories
  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.getCategories();
      setState({
        categories: response.categories || [],
        loading: false,
        error: null,
        total: response.total || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des catÃ©gories';
      console.error('[useCategories] Error fetching categories:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);


  // CrÃ©er une catÃ©gorie
  const createCategorie = useCallback(async (categorie: Categorie) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.createCategorie(categorie);
      
      if (response.success) {
        // RafraÃ®chir la liste des catÃ©gories
        await fetchCategories();
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la crÃ©ation de la catÃ©gorie');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la crÃ©ation de la catÃ©gorie';
      console.error('[useCategories] Error creating categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchCategories]);

  // Mettre Ã  jour une catÃ©gorie
  const updateCategorie = useCallback(async (id: string, categorie: Partial<Categorie>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.updateCategorie(id, categorie);
      
      if (response.success) {
        // RafraÃ®chir la liste des catÃ©gories
        await fetchCategories();
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la mise Ã  jour de la catÃ©gorie');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise Ã  jour de la catÃ©gorie';
      console.error('[useCategories] Error updating categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchCategories]);

  // Supprimer une catÃ©gorie
  const deleteCategorie = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.deleteCategorie(id);
      
      if (response.success) {
        // RafraÃ®chir la liste des catÃ©gories
        await fetchCategories();
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression de la catÃ©gorie');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression de la catÃ©gorie';
      console.error('[useCategories] Error deleting categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchCategories]);

  return {
    ...state,
    fetchCategories,
    createCategorie,
    updateCategorie,
    deleteCategorie
  };
};
