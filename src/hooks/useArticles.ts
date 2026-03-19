import { useState, useCallback } from 'react';
import articleService, { Article, CreateArticleRequest, UpdateArticleRequest } from '../services/articleService';

interface UseArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useArticles = () => {
  const [state, setState] = useState<UseArticlesState>({
    articles: [],
    loading: false,
    error: null,
    total: 0
  });

  // Récupérer tous les articles
  const fetchArticles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticles();
      console.log('[useArticles] Fetched articles:', articles);
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles';
      console.error('[useArticles] Error fetching articles:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Récupérer un article par ID
  const getArticleById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleById(id);
      console.log('[useArticles] Fetched article by ID:', response);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement de l\'article';
      console.error('[useArticles] Error fetching article by ID:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  // Créer un article
  const createArticle = useCallback(async (article: CreateArticleRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.createArticle(article);
      console.log('[useArticles] Created article:', response);
      
      if (response.success) {
        // Rafraîchir la liste des articles
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la création de l\'article';
      console.error('[useArticles] Error creating article:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchArticles]);

  // Mettre à jour un article
  const updateArticle = useCallback(async (id: string, article: UpdateArticleRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.updateArticle(id, article);
      console.log('[useArticles] Updated article:', response);
      
      if (response) {
        // Rafraîchir la liste des articles
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise à jour de l\'article';
      console.error('[useArticles] Error updating article:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchArticles]);

  // Supprimer un article
  const deleteArticle = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const success = await articleService.deleteArticle(id);
      console.log('[useArticles] Deleted article:', success);
      
      if (success) {
        // Rafraîchir la liste des articles
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression de l\'article';
      console.error('[useArticles] Error deleting article:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchArticles]);

  // Récupérer les articles par catégorie
  const getArticlesByCategorie = useCallback(async (idCategorie: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesByCategorie(idCategorie);
      console.log('[useArticles] Fetched articles by categorie:', articles);
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles par catégorie';
      console.error('[useArticles] Error fetching articles by categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Récupérer les articles POS
  const getArticlesPOS = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesPOS();
      console.log('[useArticles] Fetched articles POS:', articles);
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles POS';
      console.error('[useArticles] Error fetching articles POS:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Récupérer les articles en promotion
  const getArticlesPromo = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesPromo();
      console.log('[useArticles] Fetched articles promo:', articles);
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles en promotion';
      console.error('[useArticles] Error fetching articles promo:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Récupérer les articles en stock
  const getArticlesStock = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesStock();
      console.log('[useArticles] Fetched articles stock:', articles);
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles en stock';
      console.error('[useArticles] Error fetching articles stock:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  // Récupérer un article par code barre
  const getArticleByCodeBarre = useCallback(async (codeBarre: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleByCodeBarre(codeBarre);
      console.log('[useArticles] Fetched article by code barre:', response);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement de l\'article par code barre';
      console.error('[useArticles] Error fetching article by code barre:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticlesByCategorie,
    getArticlesPOS,
    getArticlesPromo,
    getArticlesStock,
    getArticleByCodeBarre
  };
};
