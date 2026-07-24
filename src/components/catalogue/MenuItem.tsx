import React from 'react';
import { Package, Plus, Tag } from 'lucide-react';
import type { CatalogueArticle } from '../../hooks/useCatalogue';

interface MenuItemProps {
  article: CatalogueArticle;
  onAddToCart?: (article: CatalogueArticle) => void;
}

const fmt = (price: number) => `${price.toLocaleString('fr-FR')} FCFA`;

export const MenuItem: React.FC<MenuItemProps> = ({ article, onAddToCart }) => {
  const hasPromo =
    article.estPromo &&
    article.prixPromo != null &&
    article.prixPromo < article.prixVente;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group/card">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {article.imageURL ? (
          <img
            src={article.imageURL}
            alt={article.nomArticle}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {hasPromo && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Promo
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug mb-1">
          {article.nomArticle}
        </h3>
        {article.descriptionArticle && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-2 flex-1 leading-relaxed">
            {article.descriptionArticle}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="min-w-0">
            {hasPromo ? (
              <div>
                <span className="text-red-600 font-bold text-sm">{fmt(article.prixPromo!)}</span>
                <span className="text-gray-400 text-xs line-through ml-1.5">{fmt(article.prixVente)}</span>
              </div>
            ) : (
              <span className="text-orange-600 font-bold text-sm">{fmt(article.prixVente)}</span>
            )}
          </div>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(article)}
              className="flex-shrink-0 p-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-full transition-all"
              title="Ajouter"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
