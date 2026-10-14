import React from 'react';
import { Search, Scan, Loader2 } from 'lucide-react';
import { ProduitPOS } from '../lib/mock/pos';
import POSProduitCard from './POSProduitCard';

interface POSCatalogueProps {
  produits: ProduitPOS[];
  categories: string[];
  loading?: boolean;
  recherche: string;
  setRecherche: (value: string) => void;
  filtreCategorie: string;
  setFiltreCategorie: (cat: string) => void;
  onAjouterProduit: (produit: ProduitPOS) => void;
  onScanner: () => void;
}

const POSCatalogue: React.FC<POSCatalogueProps> = ({
  produits,
  categories,
  loading,
  recherche,
  setRecherche,
  filtreCategorie,
  setFiltreCategorie,
  onAjouterProduit,
  onScanner
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={onScanner}
            className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-1.5 whitespace-nowrap text-sm"
          >
            <Scan className="w-4 h-4" />
            <span>Scanner</span>
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltreCategorie(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all duration-200 ${
                filtreCategorie === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
            <span>Chargement des articles...</span>
          </div>
        ) : produits.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Aucun article trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {produits.map(produit => (
              <POSProduitCard
                key={produit.id}
                produit={produit}
                onAjouter={onAjouterProduit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default POSCatalogue;
