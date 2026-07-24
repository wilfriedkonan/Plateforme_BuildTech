import { useState, useCallback } from 'react';
import articleService, {
  Article,
  ArticleListParams,
  ArticlePagination,
  CreateArticleRequest,
  UpdateArticleRequest,
  PublicCatalogueParams,
} from '../services/articleService';

interface UseArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  total: number;
  pagination: ArticlePagination | null;
}

export const useArticles = () => {
  const [state, setState] = useState<UseArticlesState>({
    articles: [],
    loading: false,
    error: null,
    total: 0,
    pagination: null,
  });

  const fetchArticles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticles();
      setState({
        articles: articles || [],
        loading: false,
        error: null,
        total: articles?.length || 0,
        pagination: null,
      });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles';
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  // GET /api/Articles/list — liste paginée avec filtres
  const fetchArticlesList = useCallback(async (params?: ArticleListParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticlesList(params);
      setState({
        articles: response.data || [],
        loading: false,
        error: null,
        total: response.total,
        pagination: response.pagination ?? null,
      });
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement de la liste des articles';
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, []);

  const getArticleById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleById(id);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Erreur lors du chargement de l'article";
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, []);

  const createArticle = useCallback(async (article: CreateArticleRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.createArticle(article);
      if (response.success) {
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Erreur lors de la création de l'article";
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, [fetchArticles]);

  const updateArticle = useCallback(async (id: string, article: UpdateArticleRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.updateArticle(id, article);
      if (response) {
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Erreur lors de la mise à jour de l'article";
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, [fetchArticles]);

  const deleteArticle = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const success = await articleService.deleteArticle(id);
      if (success) {
        await fetchArticles();
      }
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Erreur lors de la suppression de l'article";
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, [fetchArticles]);

  const getArticlesByCategorie = useCallback(async (idCategorie: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesByCategorie(idCategorie);
      setState({ articles: articles || [], loading: false, error: null, total: articles?.length || 0, pagination: null });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles par catégorie';
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  const getArticlesPOS = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesPOS();
      setState({ articles: articles || [], loading: false, error: null, total: articles?.length || 0, pagination: null });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles POS';
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  const getArticlesPromo = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesPromo();
      setState({ articles: articles || [], loading: false, error: null, total: articles?.length || 0, pagination: null });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles en promotion';
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  const getArticlesStock = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const articles = await articleService.getArticlesStock();
      setState({ articles: articles || [], loading: false, error: null, total: articles?.length || 0, pagination: null });
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles en stock';
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  const getArticleByCodeBarre = useCallback(async (codeBarre: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getArticleByCodeBarre(codeBarre);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Erreur lors du chargement de l'article par code barre";
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, []);

  // GET /api/Articles/public/categories — sans auth
  const fetchPublicCategories = useCallback(async (params?: PublicCatalogueParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getPublicCategories(params);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des catégories publiques';
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, []);

  // GET /api/Articles/public/categories/{id}/articles — sans auth
  const fetchPublicArticlesByCategory = useCallback(async (idCategorie: string, params?: PublicCatalogueParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await articleService.getPublicArticlesByCategory(idCategorie, params);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des articles publics';
      setState(prev => ({ ...prev, loading: false, error: msg }));
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchArticles,
    fetchArticlesList,
    fetchPublicCategories,
    fetchPublicArticlesByCategory,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticlesByCategorie,
    getArticlesPOS,
    getArticlesPromo,
    getArticlesStock,
    getArticleByCodeBarre,
  };
};
