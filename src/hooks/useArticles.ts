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

  // RÃ©cupÃ©rer tous les articles
  const fetchArticles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticles();
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

  // RÃ©cupÃ©rer un article par ID
  const getArticleById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleById(id);
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

  // CrÃ©er un article
  const createArticle = useCallback(async (article: CreateArticleRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.createArticle(article);
      
      if (response.success) {
        // RafraÃ®chir la liste des articles
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la crÃ©ation de l\'article';
      console.error('[useArticles] Error creating article:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [fetchArticles]);

  // Mettre Ã  jour un article
  const updateArticle = useCallback(async (id: string, article: UpdateArticleRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.updateArticle(id, article);
      
      if (response) {
        // RafraÃ®chir la liste des articles
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise Ã  jour de l\'article';
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
      
      if (success) {
        // RafraÃ®chir la liste des articles
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

  // RÃ©cupÃ©rer les articles par catÃ©gorie
  const getArticlesByCategorie = useCallback(async (idCategorie: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesByCategorie(idCategorie);
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles par catÃ©gorie';
      console.error('[useArticles] Error fetching articles by categorie:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  // RÃ©cupÃ©rer les articles POS
  const getArticlesPOS = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesPOS();
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

  // RÃ©cupÃ©rer les articles en promotion
  const getArticlesPromo = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesPromo();
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

  // RÃ©cupÃ©rer les articles en stock
  const getArticlesStock = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesStock();
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

  // RÃ©cupÃ©rer un article par code barre
  const getArticleByCodeBarre = useCallback(async (codeBarre: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleByCodeBarre(codeBarre);
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
