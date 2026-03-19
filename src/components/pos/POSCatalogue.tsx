import React from 'react';
import { Search, Scan } from 'lucide-react';
import { CategoriePOS, ProduitPOS } from '../lib/mock/pos';
import POSProduitCard from './POSProduitCard';

interface POSCatalogueProps {
  produits: ProduitPOS[];
  recherche: string;
  setRecherche: (value: string) => void;
  filtreCategorie: CategoriePOS;
  setFiltreCategorie: (cat: CategoriePOS) => void;
  onAjouterProduit: (produit: ProduitPOS) => void;
  onScanner: () => void;
}

const categories: CategoriePOS[] = [
  "Tous",
  "Électronique",
  "Alimentation",
  "Boissons",
  "Fournitures",
  "Vêtements"
];

const POSCatalogue: React.FC<POSCatalogueProps> = ({
  produits,
  recherche,
  setRecherche,
  filtreCategorie,
  setFiltreCategorie,
  onAjouterProduit,
  onScanner
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Scanner ou rechercher un produit..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={onScanner}
            className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <Scan className="w-4 h-4" />
            <span>Scanner</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltreCategorie(cat)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
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
        {produits.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Aucun produit trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
