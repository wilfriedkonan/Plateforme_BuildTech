/**
 * commandePublicApi.ts
 * Endpoint public — soumission commande WhatsApp.
 * Aucun token d'auth : côté client non authentifié.
 */

import { useState } from 'react';

// ─── Base URL ─────────────────────────────────────────────────────────────────

const API_ORIGIN = (import.meta.env.VITE_API_SERVER_URL as string | undefined)
  ?.replace(/\/api\/?$/, '')
  ?? 'http://localhost:5292';

// ─── Enveloppe générique ──────────────────────────────────────────────────────

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LigneCommandeRequest {
  idArticle: string;
  nomArticle: string;
  prixUnitaire: number;
  quantite: number;
}

export interface CommandeWhatsAppRequest {
  clientWhatsApp: string;
  livraisonLat?: number;
  livraisonLng?: number;
  livraisonTexte?: string;
  lignes: LigneCommandeRequest[];
  total: number;
}

// Ce endpoint renvoie ses champs au même niveau que success/message
// (pas dans un sous-objet data).
export interface CommandeWhatsAppResponse {
  success: boolean;
  message: string;
  idCommande?: string;
  boutiqueNotifiee?: boolean;
  clientNotifie?: boolean;
}

// ─── Fonction fetch ───────────────────────────────────────────────────────────

export async function submitCommandeWhatsApp(
  idBoutique: string,
  payload: CommandeWhatsAppRequest,
): Promise<CommandeWhatsAppResponse | null> {
  const url = `${API_ORIGIN}/api/public/boutique/${idBoutique}/commande/whatsapp`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // Lire le corps même en cas d'erreur HTTP (le backend inclut souvent un message)
  const json: ApiEnvelope<never> & Partial<CommandeWhatsAppResponse> =
    await res.json().catch(() => ({ success: false, message: 'Réponse invalide' }));

  if (!res.ok) {
    console.error('[commandePublicApi] submitCommandeWhatsApp HTTP', res.status, json);
    return {
      success: false,
      message: json.message ?? `Erreur ${res.status}`,
    };
  }

  // Champs à plat (success, message, idCommande, …), pas dans json.data
  return json as CommandeWhatsAppResponse;
}

// ─── Hook de mutation ─────────────────────────────────────────────────────────

export function useSubmitCommandeWhatsApp(idBoutique: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const submit = async (
    payload: CommandeWhatsAppRequest,
  ): Promise<CommandeWhatsAppResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitCommandeWhatsApp(idBoutique, payload);
      if (!result || !result.success) {
        const msg = result?.message ?? 'Échec de la soumission.';
        setError(msg);
        return result ?? null;
      }
      return result;
    } catch (e) {
      const msg = (e as Error)?.message ?? 'Erreur réseau.';
      console.error('[useSubmitCommandeWhatsApp]', e);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
