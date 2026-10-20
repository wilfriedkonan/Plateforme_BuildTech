/**
 * boutiqueAdminApi.ts
 * CRUD boutique côté admin — tous les endpoints [Authorize].
 * Passe par apiClient (cookie HttpOnly + CSRF) — aucun token manipulé ici.
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

// ─── Enveloppes ───────────────────────────────────────────────────────────────

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface ApiListEnvelope<T> {
  success: boolean;
  data?: T[];
  total: number;
  pagination?: PaginationMetadata;
  message?: string;
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface BoutiqueAdminDto {
  idBoutique: string;
  idEntreprise: string;
  idTypeBoutique: string;
  nomBoutique: string;
  slugBoutique: string;
  codeQR: string;
  emailBoutique?: string;
  telephoneBoutique?: string;
  adresseBoutique?: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
  urlDomainCustom?: string;
  typeBoutique: 'Restaurant' | 'Magasin';
  codeType?: string;
  iconeType?: string;
  estActif: boolean;
  permitCommandeEnLigne: boolean;
  permitAccesQR: boolean;
  permitLivraison: boolean;
  permitRetrait: boolean;
  nombreArticles: number;
  nombreCategories: number;
  dateCreation?: string;
  dateMiseAJour?: string;
}

export interface TypeBoutiqueDto {
  idTypeBoutique: string;
  nomType: string;
  codeType: string;
  description?: string;
  iconeType?: string;
  permitCommandeParDefaut: boolean;
  permitLivraisonParDefaut: boolean;
  permitRetraitParDefaut: boolean;
  permitReservationParDefaut: boolean;
}

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface CreateBoutiqueRequest {
  idEntreprise: string;
  typeBoutique: 'Restaurant' | 'Magasin';
  nomBoutique: string;
  emailBoutique?: string;
  telephoneBoutique?: string;
  adresseBoutique?: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
}

export interface UpdateBoutiqueRequest {
  nomBoutique?: string;
  emailBoutique?: string;
  telephoneBoutique?: string;
  adresseBoutique?: string;
  logoBoutique?: string;
  descriptionBoutique?: string;
  permitCommandeEnLigne?: boolean;
  permitLivraison?: boolean;
  permitRetrait?: boolean;
}

// ─── Fonctions fetch (via apiClient — cookie HttpOnly + CSRF automatique) ─────

export async function fetchBoutiques(page = 1, pageSize = 20): Promise<ApiListEnvelope<BoutiqueAdminDto>> {
  const { data } = await apiClient.get<ApiListEnvelope<BoutiqueAdminDto>>('Boutique', {
    params: { page, pageSize },
  });
  return data;
}

export async function fetchBoutiqueSearch(
  nom?: string, type?: string, page = 1, pageSize = 20,
): Promise<ApiListEnvelope<BoutiqueAdminDto>> {
  const { data } = await apiClient.get<ApiListEnvelope<BoutiqueAdminDto>>('Boutique/search', {
    params: { page, pageSize, ...(nom ? { nom } : {}), ...(type ? { type } : {}) },
  });
  return data;
}

export async function fetchBoutiqueTypes(): Promise<TypeBoutiqueDto[]> {
  try {
    const { data } = await apiClient.get<TypeBoutiqueDto[] | ApiEnvelope<TypeBoutiqueDto[]>>('Boutique/types');
    // Peut retourner directement un tableau ou une enveloppe selon le backend
    return Array.isArray(data) ? data : ((data as ApiEnvelope<TypeBoutiqueDto[]>).data ?? []);
  } catch (e) {
    console.error('[boutiqueAdminApi] fetchBoutiqueTypes', e);
    return [];
  }
}

export async function fetchBoutiqueById(id: string): Promise<BoutiqueAdminDto | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<BoutiqueAdminDto>>(`Boutique/${id}`);
    return data.success ? (data.data ?? null) : null;
  } catch {
    return null;
  }
}

export async function createBoutique(
  payload: CreateBoutiqueRequest,
): Promise<BoutiqueAdminDto | null> {
  try {
    const { data } = await apiClient.post<ApiEnvelope<BoutiqueAdminDto>>('Boutique', payload);
    if (!data.success) {
      console.error('[boutiqueAdminApi] createBoutique', data.message);
      return null;
    }
    return data.data ?? null;
  } catch (e) {
    console.error('[boutiqueAdminApi] createBoutique', e);
    return null;
  }
}

export async function updateBoutique(
  id: string,
  payload: UpdateBoutiqueRequest,
): Promise<BoutiqueAdminDto | null> {
  try {
    const { data } = await apiClient.put<ApiEnvelope<BoutiqueAdminDto>>(`Boutique/${id}`, payload);
    if (!data.success) {
      console.error('[boutiqueAdminApi] updateBoutique', data.message);
      return null;
    }
    return data.data ?? null;
  } catch (e) {
    console.error('[boutiqueAdminApi] updateBoutique', e);
    return null;
  }
}

export async function deleteBoutique(id: string): Promise<boolean> {
  try {
    const { data } = await apiClient.delete<ApiEnvelope<never>>(`Boutique/${id}`);
    if (!data.success) {
      console.error('[boutiqueAdminApi] deleteBoutique', data.message);
      return false;
  }
    return true;
  } catch (e) {
    console.error('[boutiqueAdminApi] deleteBoutique', e);
    return false;
  }
}

// ─── Hooks de lecture (query) ─────────────────────────────────────────────────

export function useBoutiques(page = 1, pageSize = 20) {
  const [boutiques, setBoutiques]   = useState<BoutiqueAdminDto[]>([]);
  const [total, setTotal]           = useState(0);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBoutiques(page, pageSize)
      .then(envelope => {
        if (cancelled) return;
        if (envelope.success) {
          setBoutiques(envelope.data ?? []);
          setTotal(envelope.total);
          setPagination(envelope.pagination ?? null);
        } else {
          setError(envelope.message ?? 'Erreur lors du chargement des boutiques.');
        }
      })
      .catch(e => {
        if (cancelled) return;
        console.error('[useBoutiques]', e);
        setError('Erreur réseau lors du chargement des boutiques.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page, pageSize]);

  return { boutiques, total, pagination, loading, error };
}

export function useBoutiqueSearch(
  nom?: string, type?: string, page = 1, pageSize = 20,
) {
  const [boutiques, setBoutiques]   = useState<BoutiqueAdminDto[]>([]);
  const [total, setTotal]           = useState(0);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBoutiqueSearch(nom, type, page, pageSize)
      .then(envelope => {
        if (cancelled) return;
        if (envelope.success) {
          setBoutiques(envelope.data ?? []);
          setTotal(envelope.total);
          setPagination(envelope.pagination ?? null);
        } else {
          setError(envelope.message ?? 'Erreur lors de la recherche.');
        }
      })
      .catch(e => {
        if (cancelled) return;
        console.error('[useBoutiqueSearch]', e);
        setError('Erreur réseau lors de la recherche.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [nom, type, page, pageSize]);

  return { boutiques, total, pagination, loading, error };
}

export function useBoutiqueTypes() {
  const [types, setTypes]   = useState<TypeBoutiqueDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBoutiqueTypes()
      .then(data => {
        if (cancelled) return;
        setTypes(data);
      })
      .catch(e => {
        if (cancelled) return;
        console.error('[useBoutiqueTypes]', e);
        setError('Erreur réseau lors du chargement des types.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { types, loading, error };
}

export function useBoutiqueAdmin(id: string | null) {
  const [boutique, setBoutique] = useState<BoutiqueAdminDto | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setBoutique(null); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBoutiqueById(id)
      .then(data => {
        if (cancelled) return;
        if (!data) setError('Boutique introuvable.');
        else       setBoutique(data);
      })
      .catch(e => {
        if (cancelled) return;
        console.error('[useBoutiqueAdmin]', e);
        setError('Erreur réseau lors du chargement.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  return { boutique, loading, error };
}

// ─── Hooks de mutation ────────────────────────────────────────────────────────

export function useCreateBoutique() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<BoutiqueAdminDto | null>(null);

  const create = async (payload: CreateBoutiqueRequest): Promise<BoutiqueAdminDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBoutique(payload);
      setData(result);
      if (!result) setError('Échec de la création.');
      return result;
    } catch (e) {
      console.error('[useCreateBoutique]', e);
      setError((e as Error)?.message ?? 'Erreur réseau.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, data };
}

export function useUpdateBoutique() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<BoutiqueAdminDto | null>(null);

  const update = async (
    id: string,
    payload: UpdateBoutiqueRequest,
  ): Promise<BoutiqueAdminDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateBoutique(id, payload);
      setData(result);
      if (!result) setError('Échec de la mise à jour.');
      return result;
    } catch (e) {
      console.error('[useUpdateBoutique]', e);
      setError((e as Error)?.message ?? 'Erreur réseau.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error, data };
}

export function useDeleteBoutique() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const remove = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const ok = await deleteBoutique(id);
      if (!ok) setError('Échec de la suppression.');
      return ok;
    } catch (e) {
      console.error('[useDeleteBoutique]', e);
      setError((e as Error)?.message ?? 'Erreur réseau.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
