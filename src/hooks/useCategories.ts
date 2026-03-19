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

  // Récupérer toutes les catégories
  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.getCategories();
      console.log('[useCategories] Fetched categories:', response);
      setState({
        categories: response.categories || [],
        loading: false,
        error: null,
        total: response.total || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des catégories';
      console.error('[useCategories] Error fetching categories:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);


  // Créer une catégorie
  const createCategorie = useCallback(async (categorie: Categorie) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.createCategorie(categorie);
      console.log('[useCategories] Created categorie:', response);
      
      if (response.success) {
        // Rafraîchir la liste des catégories
        await fetchCategories();
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la création de la catégorie');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la création de la catégorie';
      console.error('[useCategories] Error creating categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchCategories]);

  // Mettre à jour une catégorie
  const updateCategorie = useCallback(async (id: string, categorie: Partial<Categorie>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.updateCategorie(id, categorie);
      console.log('[useCategories] Updated categorie:', response);
      
      if (response.success) {
        // Rafraîchir la liste des catégories
        await fetchCategories();
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour de la catégorie');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise à jour de la catégorie';
      console.error('[useCategories] Error updating categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchCategories]);

  // Supprimer une catégorie
  const deleteCategorie = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await categorieService.deleteCategorie(id);
      console.log('[useCategories] Deleted categorie:', response);
      
      if (response.success) {
        // Rafraîchir la liste des catégories
        await fetchCategories();
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression de la catégorie');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression de la catégorie';
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
