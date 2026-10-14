import React from 'react';
import { ProduitPOS } from '../lib/mock/pos';

interface POSProduitCardProps {
  produit: ProduitPOS;
  onAjouter: (produit: ProduitPOS) => void;
}

const POSProduitCard: React.FC<POSProduitCardProps> = ({ produit, onAjouter }) => {
  const getBadgeStock = () => {
    if (!produit.disponible) {
      return { text: 'Indisponible', color: 'bg-gray-100 text-gray-600' };
    }
    if (produit.stock === 0) {
      return { text: 'Rupture', color: 'bg-red-100 text-red-600' };
    }
    if (produit.stock <= 5) {
      return { text: `Stock bas (${produit.stock})`, color: 'bg-orange-100 text-orange-600' };
    }
    return { text: `En stock (${produit.stock})`, color: 'bg-green-100 text-green-600' };
  };

  const badge = getBadgeStock();
 // const isDisabled = !produit.disponible || produit.stock === 0;
const isDisabled = false;
  return (
    <button
      onClick={() => !isDisabled && onAjouter(produit)}
      disabled={isDisabled}
      className={`p-2.5 bg-white border-2 border-gray-200 rounded-xl transition-all duration-200 text-left
        ${isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-gray-400 hover:shadow-md hover:scale-102 active:scale-98 cursor-pointer'
        }`}
    >
      <div className="flex flex-col items-center mb-1.5">
        {produit.imageURL ? (
          <img
            src={produit.imageURL}
            alt={produit.nom}
            className="w-10 h-10 object-cover rounded-lg mb-1"
          />
        ) : (
          <span className="text-2xl mb-1">{produit.emoji}</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 text-xs mb-0.5 line-clamp-2">
        {produit.nom}
      </h3>

      <p className="font-bold text-gray-900 text-sm mb-1">
        {produit.prix.toLocaleString('fr-FR')} F
      </p>

      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    </button>
  );
};

export default POSProduitCard;
