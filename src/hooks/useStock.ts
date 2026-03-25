import { useState, useCallback } from 'react';
import stockService, { StockItem, StockFilters } from '../services/stockService';

interface UseStockState {
  stocks: StockItem[];
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
    totalEnStock: number;
    totalEnAlerte: number;
    totalEnRupture: number;
    valeurStockTotal: number;
  };
}

export const useStock = () => {
  const [state, setState] = useState<UseStockState>({
    stocks: [],
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
      totalEnStock: 0,
      totalEnAlerte: 0,
      totalEnRupture: 0,
      valeurStockTotal: 0,
    },
  });

  // Récupérer les stocks avec filtres
  const fetchStocks = useCallback(async (filters: StockFilters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await stockService.getStocks(filters);
      console.log('[useStock] Fetched stocks:', response);
      setState({
        stocks: response.data || [],
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
          totalEnStock: response.totalEnStock || 0,
          totalEnAlerte: response.totalEnAlerte || 0,
          totalEnRupture: response.totalEnRupture || 0,
          valeurStockTotal: response.valeurStockTotal || 0,
        },
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des stocks';
      console.error('[useStock] Error fetching stocks:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Récupérer le stock d'un article
  const getStockById = useCallback(async (articleId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const stock = await stockService.getStockById(articleId);
      console.log('[useStock] Fetched stock by ID:', stock);
      setState(prev => ({ ...prev, loading: false }));
      return stock;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement du stock';
      console.error('[useStock] Error fetching stock by ID:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Mettre à jour le stock d'un article
  const updateStock = useCallback(async (articleId: string, stockData: { stockActuel: number; seuilStock?: number }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedStock = await stockService.updateStock(articleId, stockData);
      console.log('[useStock] Updated stock:', updatedStock);
      setState(prev => ({ ...prev, loading: false }));
      return updatedStock;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise à jour du stock';
      console.error('[useStock] Error updating stock:', errorMessage);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  return {
    stocks: state.stocks,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    totals: state.totals,
    fetchStocks,
    getStockById,
    updateStock,
  };
};
