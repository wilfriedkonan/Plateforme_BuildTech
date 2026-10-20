/**
 * commandeAdminApi.ts
 * Gestion des commandes côté POS/admin — [Authorize].
 * Passe par apiClient (cookie HttpOnly + CSRF) — aucun token manipulé ici.
 *
 * Note : useCommandes expose refetch() pour le polling manuel côté POS
 * (setInterval(() => refetch(), 15000)) en attendant l'implémentation SignalR.
 */

import { useState, useEffect, useCallback } from 'react';
import type { PaginationMetadata } from './boutiqueAdminApi';
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

export type EtatCommande =
  | 'EnAttente'
  | 'Confirmee'
  | 'EnPreparation'
  | 'Prete'
  | 'EnLivraison'
  | 'Livree'
  | 'Annulee'
  | 'Terminee';

export interface CommandeDto {
  id: string;
  idEntreprise: string;
  idBoutique: string;
  numeroCommande?: string;
  clientWhatsApp: string;
  livraisonTexte?: string;
  livraisonLat?: number;
  livraisonLng?: number;
  sousTotal: number;
  total: number;
  etat: EtatCommande;
  notificationBoutiqueEnvoyee: boolean;
  notificationClientEnvoyee: boolean;
  idFacture?: string;
  dateCommande: string;
  dateMiseAJour?: string;
}

export interface DetailCommandeDto {
  id: string;
  idArticle: string;
  nomArticle: string;
  prixUnitaire: number;
  quantite: number;
  sousTotalLigne: number;
}

export interface CommandeDetailDto {
  commande: CommandeDto;
  lignes: DetailCommandeDto[];
}

export interface UpdateEtatRequest {
  etat: EtatCommande;
}

// ─── Fonctions fetch (via apiClient — cookie HttpOnly + CSRF automatique) ─────

const ETATS_EXCLUS: EtatCommande[] = ['Annulee', 'Terminee'];

export async function fetchCommandes(
  idBoutique?: string,
  etat?: string,
  page = 1,
  pageSize = 20,
): Promise<ApiListEnvelope<CommandeDto>> {
  const { data } = await apiClient.get<ApiListEnvelope<CommandeDto>>('commandes', {
    params: {
      page,
      pageSize,
      ...(idBoutique ? { idBoutique } : {}),
      ...(etat ? { etat } : {}),
    },
  });
  return data;
}

export async function fetchCommandeDetail(
  id: string,
): Promise<CommandeDetailDto | null> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<CommandeDetailDto>>(`commandes/${id}`);
    return data.success ? (data.data ?? null) : null;
  } catch (e) {
    console.error('[commandeAdminApi] fetchCommandeDetail', e);
    return null;
  }
}

export async function putCommandeEtat(
  id: string,
  etat: EtatCommande,
): Promise<boolean> {
  try {
    const { data } = await apiClient.put<ApiEnvelope<never>>(`commandes/${id}/etat`, { etat } as UpdateEtatRequest);
    if (!data.success) {
      console.error('[commandeAdminApi] putCommandeEtat', data.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[commandeAdminApi] putCommandeEtat', e);
    return false;
  }
}

// ─── Hooks de lecture (query) ─────────────────────────────────────────────────

/**
 * useCommandes — expose refetch() pour le polling POS.
 * Usage côté composant :
 *   const { commandes, refetch } = useCommandes(idBoutique);
 *   useEffect(() => { const t = setInterval(refetch, 15000); return () => clearInterval(t); }, [refetch]);
 */
export function useCommandes(
  idBoutique?: string,
  etat?: string,
  page = 1,
  pageSize = 20,
) {
  const [commandes, setCommandes]   = useState<CommandeDto[]>([]);
  const [total, setTotal]           = useState(0);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  // tick sert de déclencheur pour refetch() sans changer les autres dépendances
  const [tick, setTick]             = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCommandes(idBoutique, etat, page, pageSize)
      .then(envelope => {
        if (cancelled) return;
        if (envelope.success) {
          const data = (envelope.data ?? []).filter(c => !ETATS_EXCLUS.includes(c.etat));
          setCommandes(data);
          setTotal(data.length);
          setPagination(envelope.pagination ?? null);
        } else {
          setError(envelope.message ?? 'Erreur lors du chargement des commandes.');
        }
      })
      .catch(e => {
        if (cancelled) return;
        console.error('[useCommandes]', e);
        setError('Erreur réseau lors du chargement des commandes.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [idBoutique, etat, page, pageSize, tick]);

  // Stable refetch — ne change pas d'une frame à l'autre
  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { commandes, total, pagination, loading, error, refetch };
}

export function useCommandeDetail(id: string | null) {
  const [commande, setCommande] = useState<CommandeDto | null>(null);
  const [lignes, setLignes]     = useState<DetailCommandeDto[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCommande(null);
      setLignes([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCommandeDetail(id)
      .then(detail => {
        if (cancelled) return;
        if (!detail) {
          setError('Commande introuvable.');
        } else {
          setCommande(detail.commande);
          setLignes(detail.lignes);
        }
      })
      .catch(e => {
        if (cancelled) return;
        console.error('[useCommandeDetail]', e);
        setError('Erreur réseau lors du chargement.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  return { commande, lignes, loading, error };
}

// ─── Hook de mutation ─────────────────────────────────────────────────────────

export function useUpdateCommandeEtat() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const updateEtat = async (id: string, etat: EtatCommande): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const ok = await putCommandeEtat(id, etat);
      if (!ok) setError(`Impossible de passer la commande à l'état "${etat}".`);
      return ok;
    } catch (e) {
      console.error('[useUpdateCommandeEtat]', e);
      setError((e as Error)?.message ?? 'Erreur réseau.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateEtat, loading, error };
}
