import { useState, useCallback, useRef, useEffect } from 'react';
import articleService from '../services/articleService';
import type { PublicCategorie, PublicArticle } from '../services/articleService';

export type CatalogueCategory = PublicCategorie;
export type CatalogueArticle = PublicArticle;

export const useCatalogue = () => {
  const [categories, setCategories] = useState<CatalogueCategory[]>([]);
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, CatalogueArticle[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Tracks which categories have been requested (to avoid duplicate fetches)
  const requestedRef = useRef<Set<string>>(new Set());

  const loadCategoryArticles = useCallback(async (idCategorie: string) => {
    if (requestedRef.current.has(idCategorie)) return;
    requestedRef.current.add(idCategorie);
    setLoadingCategoryId(idCategorie);
    try {
      const res = await articleService.getPublicArticlesByCategory(idCategorie, {
        page: 1,
        pageSize: 100,
        orderBy: 'designation',
        orderDirection: 'asc',
      });
      setArticlesByCategory(prev => ({ ...prev, [idCategorie]: res.data || [] }));
    } catch {
      requestedRef.current.delete(idCategorie); // allow retry
    } finally {
      setLoadingCategoryId(prev => (prev === idCategorie ? null : prev));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCategories([]);
    setArticlesByCategory({});
    requestedRef.current = new Set();

    articleService
      .getPublicCategories({ page: 1, pageSize: 100, orderBy: 'ordre', orderDirection: 'asc' })
      .then(res => {
        if (cancelled) return;
        const cats = res.data || [];
        setCategories(cats);
        if (cats.length > 0) {
          loadCategoryArticles(cats[0].idCategorie);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger le catalogue.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [loadCategoryArticles]);

  const isLoadingCategory = (idCategorie: string | null) =>
    idCategorie != null && loadingCategoryId === idCategorie;

  return { categories, articlesByCategory, loading, error, isLoadingCategory, loadCategoryArticles };
};
