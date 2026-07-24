import React from 'react';
import { Loader2, AlertCircle, Clock } from 'lucide-react';
import { usePublicCatalogue } from '../../hooks/usePublicCatalogue';
import type { CatalogueSource } from '../../hooks/usePublicCatalogue';
import PublicCataloguePage from './PublicCataloguePage';

// ─── Écrans intermédiaires ────────────────────────────────────────────────────

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-gray-400">
    <Loader2 className="w-10 h-10 animate-spin text-orange-400" />
    <p className="text-sm font-medium">Chargement du catalogue…</p>
  </div>
);

const ErrorScreen: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6 text-center">
    <AlertCircle className="w-14 h-14 text-red-400" />
    <div>
      <h2 className="text-lg font-black text-gray-900 mb-2">Accès impossible</h2>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry}
        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors">
        Réessayer
      </button>
    )}
  </div>
);

const ComingSoonScreen: React.FC<{ nomBoutique: string }> = ({ nomBoutique }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6 text-center">
    <Clock className="w-14 h-14 text-amber-400" />
    <div>
      <h2 className="text-lg font-black text-gray-900 mb-2">{nomBoutique}</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Le catalogue en ligne de ce type d'établissement sera bientôt disponible.
      </p>
    </div>
  </div>
);

// ─── Page restaurant ──────────────────────────────────────────────────────────

const RestaurantPage: React.FC<{ source: CatalogueSource }> = ({ source }) => {
  const { boutique, categories, mode, permitCommande, loading, error } =
    usePublicCatalogue(source);

  if (loading) return <LoadingScreen />;

  if (error || !boutique) {
    return (
      <ErrorScreen
        message={error ?? 'Boutique introuvable.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Si le type de boutique n'est pas un restaurant, afficher "Bientôt disponible"
  const typeCode = (boutique.codeType ?? boutique.typeBoutique ?? '').toLowerCase();
  if (typeCode && !['restaurant', 'resto', 'food', 'bar', 'café', 'cafe'].includes(typeCode)) {
    return <ComingSoonScreen nomBoutique={boutique.nomBoutique} />;
  }

  return (
    <PublicCataloguePage
      boutique={boutique}
      categories={categories}
      mode={mode}
      permitCommande={permitCommande}
    />
  );
};

export default RestaurantPage;
