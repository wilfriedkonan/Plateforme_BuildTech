import { useState, useCallback } from 'react';
import boutiqueService, {
  BoutiqueDto,
  TypeBoutiqueDto,
  CatalogueDto,
  CreateBoutiqueRequest,
  UpdateBoutiqueRequest,
  BoutiquePagination,
  BoutiqueListParams,
  BoutiqueSearchParams,
} from '../services/boutiqueService';

interface UseBoutiqueState {
  boutiques: BoutiqueDto[];
  selectedBoutique: BoutiqueDto | null;
  typesBoutique: TypeBoutiqueDto[];
  catalogue: CatalogueDto | null;
  loading: boolean;
  error: string | null;
  total: number;
  pagination: BoutiquePagination | null;
}

export const useBoutique = () => {
  const [state, setState] = useState<UseBoutiqueState>({
    boutiques: [],
    selectedBoutique: null,
    typesBoutique: [],
    catalogue: null,
    loading: false,
    error: null,
    total: 0,
    pagination: null,
  });

  const setLoading = (loading: boolean) =>
    setState(prev => ({ ...prev, loading, error: null }));

  const setError = (message: string) =>
    setState(prev => ({ ...prev, loading: false, error: message }));

  // ── GET /api/Boutique ──────────────────────────────────────────────────────
  const fetchBoutiques = useCallback(async (params?: BoutiqueListParams) => {
    setLoading(true);
    try {
      const res = await boutiqueService.getBoutiques(params);
      setState(prev => ({
        ...prev,
        boutiques: res.boutiques ?? [],
        total: res.total ?? 0,
        pagination: res.pagination ?? null,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors du chargement des boutiques');
    }
  }, []);

  // ── GET /api/Boutique/{id} ─────────────────────────────────────────────────
  const fetchBoutiqueById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const boutique = await boutiqueService.getBoutiqueById(id);
      setState(prev => ({ ...prev, selectedBoutique: boutique, loading: false, error: null }));
      return boutique;
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors du chargement de la boutique');
      return null;
    }
  }, []);

  // ── POST /api/Boutique ─────────────────────────────────────────────────────
  const createBoutique = useCallback(async (data: CreateBoutiqueRequest) => {
    setLoading(true);
    try {
      const res = await boutiqueService.createBoutique(data);
      if (res.success) {
        await fetchBoutiques();
        return res;
      }
      throw new Error(res.message || 'Erreur lors de la création de la boutique');
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la création de la boutique');
      throw error;
    }
  }, [fetchBoutiques]);

  // ── PUT /api/Boutique/{id} ─────────────────────────────────────────────────
  const updateBoutique = useCallback(async (id: string, data: UpdateBoutiqueRequest) => {
    setLoading(true);
    try {
      const res = await boutiqueService.updateBoutique(id, data);
      if (res.success) {
        await fetchBoutiques();
        return res;
      }
      throw new Error(res.message || 'Erreur lors de la mise à jour de la boutique');
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la mise à jour de la boutique');
      throw error;
    }
  }, [fetchBoutiques]);

  // ── DELETE /api/Boutique/{id} ──────────────────────────────────────────────
  const deleteBoutique = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await boutiqueService.deleteBoutique(id);
      if (res.success) {
        await fetchBoutiques();
        return res;
      }
      throw new Error(res.message || 'Erreur lors de la suppression de la boutique');
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la suppression de la boutique');
      throw error;
    }
  }, [fetchBoutiques]);

  // ── GET /api/Boutique/search ───────────────────────────────────────────────
  const searchBoutiques = useCallback(async (params: BoutiqueSearchParams) => {
    setLoading(true);
    try {
      const res = await boutiqueService.searchBoutiques(params);
      setState(prev => ({
        ...prev,
        boutiques: res.boutiques ?? [],
        total: res.total ?? 0,
        pagination: res.pagination ?? null,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors de la recherche');
    }
  }, []);

  // ── GET /api/Boutique/types ────────────────────────────────────────────────
  const fetchTypesBoutique = useCallback(async () => {
    setLoading(true);
    try {
      const types = await boutiqueService.getTypesBoutique();
      setState(prev => ({ ...prev, typesBoutique: types ?? [], loading: false, error: null }));
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors du chargement des types');
    }
  }, []);

  // ── GET /api/public/boutique/slug/{slug} ───────────────────────────────────
  const fetchBoutiqueBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const boutique = await boutiqueService.getBoutiqueBySlug(slug);
      setState(prev => ({ ...prev, selectedBoutique: boutique, loading: false, error: null }));
      return boutique;
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Boutique introuvable');
      return null;
    }
  }, []);

  // ── GET /api/public/boutique/qr/{codeQR} ──────────────────────────────────
  const fetchBoutiqueByQR = useCallback(async (codeQR: string) => {
    setLoading(true);
    try {
      const boutique = await boutiqueService.getBoutiqueByQR(codeQR);
      setState(prev => ({ ...prev, selectedBoutique: boutique, loading: false, error: null }));
      return boutique;
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Boutique introuvable');
      return null;
    }
  }, []);

  // ── GET /api/public/boutique/{idBoutique}/catalogue ────────────────────────
  const fetchCataloguePublic = useCallback(async (idBoutique: string, mode: string = 'shop') => {
    setLoading(true);
    try {
      const cat = await boutiqueService.getCataloguePublic(idBoutique, mode);
      setState(prev => ({ ...prev, catalogue: cat, loading: false, error: null }));
      return cat;
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || 'Erreur lors du chargement du catalogue');
      return null;
    }
  }, []);

  return {
    ...state,
    fetchBoutiques,
    fetchBoutiqueById,
    createBoutique,
    updateBoutique,
    deleteBoutique,
    searchBoutiques,
    fetchTypesBoutique,
    fetchBoutiqueBySlug,
    fetchBoutiqueByQR,
    fetchCataloguePublic,
  };
};
