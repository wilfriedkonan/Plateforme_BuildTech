import { useState, useEffect } from 'react';
import boutiqueService from '../services/boutiqueService';
import type { BoutiqueDto } from '../services/boutiqueService';

// ─── Types article / catégorie publics (étendus) ──────────────────────────────
// Les champs optionnels (codeArticle, stock, tauxTva, estStockable, nomCategorie)
// correspondent à l'extension prévue côté backend (GetCatalogueAsync).

export interface PublicCatalogueArticle {
  idArticle: string;
  nomArticle: string;
  descriptionArticle?: string;
  prixVente: number;
  prixPromo?: number | null;
  estPromo: boolean;
  imageURL?: string;
  estEnStock: boolean;
  // Champs étendus (backend extension)
  codeArticle?: string;
  stock?: number;
  tauxTva?: number;
  estStockable?: boolean;
  nomCategorie?: string;
}

export interface PublicCatalogueCategory {
  idCategorie: string;
  nomCategorie: string;
  description?: string;
  imageURL?: string;
  articles: PublicCatalogueArticle[];
}

// ─── Source d'accès ───────────────────────────────────────────────────────────

export type CatalogueSource =
  | { type: 'qr'; code: string }
  | { type: 'direct'; typeBoutique: 'Restaurant'; slug: string }
  // Rétrocompat avec l'ancienne route /catalogue/{slug} (pas de vérif permitCommandeEnLigne)
  | { type: 'legacy'; slug: string };

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UsePublicCatalogueResult {
  boutique: BoutiqueDto | null;
  categories: PublicCatalogueCategory[];
  permitCommande: boolean;
  mode: 'view' | 'shop';
  loading: boolean;
  error: string | null;
}

export const usePublicCatalogue = (source: CatalogueSource): UsePublicCatalogueResult => {
  const [boutique, setBoutique]         = useState<BoutiqueDto | null>(null);
  const [categories, setCategories]     = useState<PublicCatalogueCategory[]>([]);
  const [permitCommande, setPermitCommande] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const mode: 'view' | 'shop' = source.type === 'qr' ? 'view' : 'shop';

  // Clé stable pour ne relancer l'effet que si la source réelle change
  const sourceKey = source.type === 'qr'
    ? `qr:${source.code}`
    : source.type === 'legacy'
      ? `legacy:${source.slug}`
      : `direct:${source.typeBoutique}:${source.slug}`;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setBoutique(null);
      setCategories([]);
      setPermitCommande(false);

      try {
        // ── Étape 1 : résolution de la boutique ──────────────────────────────
        let resolved: BoutiqueDto | null = null;

        if (source.type === 'qr') {
          resolved = await boutiqueService.getBoutiqueByQR(source.code);
        } else if (source.type === 'legacy') {
          resolved = await boutiqueService.getBoutiqueBySlug(source.slug);
        } else {
          resolved = await boutiqueService.getBoutiqueByTypeAndSlug(
            source.typeBoutique,
            source.slug,
          );
        }

        if (cancelled) return;

        if (!resolved) {
          setError('Boutique introuvable.');
          return;
        }
        if (!resolved.estActif) {
          setError('Cette boutique n\'est pas disponible pour le moment.');
          return;
        }
        if (source.type === 'qr' && !resolved.permitAccesQR) {
          setError('L\'accès QR n\'est pas activé pour cette boutique.');
          return;
        }
        if (source.type === 'direct' && !resolved.permitCommandeEnLigne) {
          setError('Les commandes en ligne ne sont pas disponibles pour cette boutique.');
          return;
        }
        // legacy: pas de vérification de permitCommandeEnLigne

        setBoutique(resolved);

        // ── Étape 2 : catalogue (un seul appel, tout inclus) ─────────────────
        const catalogue = await boutiqueService.getCataloguePublic(resolved.idBoutique, mode);

        if (cancelled) return;

        if (!catalogue) {
          setError('Catalogue indisponible.');
          return;
        }

        setCategories(catalogue.categories as unknown as PublicCatalogueCategory[]);
        setPermitCommande(catalogue.permitCommande);

      } catch (err: unknown) {
        if (!cancelled) {
          const status = (err as { response?: { status?: number } })?.response?.status;
          setError(
            status === 404
              ? 'Boutique introuvable.'
              : 'Impossible de charger le catalogue. Veuillez réessayer.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  return { boutique, categories, permitCommande, mode, loading, error };
};
