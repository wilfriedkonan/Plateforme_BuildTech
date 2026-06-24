import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { LigneCommande, calculerLigne} from '../lib/mock/pos';

interface POSPanierLigneProps {
  ligne: LigneCommande;
  onModifierQuantite: (id: string, delta: number) => void;
  onSetQuantite: (id: string, quantite: number) => void;
  onSupprimer: (id: string) => void;
  onClickNom: (id: string) => void;
}

const POSPanierLigne: React.FC<POSPanierLigneProps> = ({
  ligne,
  onModifierQuantite,
  onSetQuantite,
  onSupprimer,
  onClickNom
}) => {
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [qtyInput, setQtyInput] = useState(String(ligne.quantite));

  const total = calculerLigne(ligne);

  const handleQtyBlur = () => {
    const newQty = parseInt(qtyInput);
    if (!isNaN(newQty) && newQty > 0) {
      onSetQuantite(ligne.produit.id, newQty);
    } else {
      setQtyInput(String(ligne.quantite));
    }
    setIsEditingQty(false);
  };

  const handleQtyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQtyBlur();
    } else if (e.key === 'Escape') {
      setQtyInput(String(ligne.quantite));
      setIsEditingQty(false);
    }
  };

  return (
    <div className="py-3 border-b border-gray-100 last:border-0 animate-in slide-in-from-right duration-200">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{ligne.produit.emoji}</div>

        <div className="flex-1 min-w-0">
          <button
            onClick={() => onClickNom(ligne.produit.id)}
            className="font-medium text-gray-900 text-sm hover:text-gray-700 text-left line-clamp-1"
          >
            {ligne.produit.nom}
          </button>

          <div className="flex items-center gap-2 mt-1">
            {isEditingQty ? (
              <input
                type="number"
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                onBlur={handleQtyBlur}
                onKeyDown={handleQtyKeyDown}
                autoFocus
                min="1"
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
              />
            ) : (
              <button
                onClick={() => {
                  setIsEditingQty(true);
                  setQtyInput(String(ligne.quantite));
                }}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onModifierQuantite(ligne.produit.id, -1);
                  }}
                  className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <span className="text-sm font-semibold text-gray-900 min-w-[1.5rem] text-center">
                  {ligne.quantite}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onModifierQuantite(ligne.produit.id, 1);
                  }}
                  className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </button>
            )}

            <span className="text-xs text-gray-500">
              × {ligne.prixUnitaire} F
            </span>
          </div>

          {ligne.remise > 0 && (
            <div className="mt-1">
              <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                Remise -{ligne.remise}%
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="font-bold text-gray-900 text-sm">
            {total} F
          </span>

          <button
            onClick={() => onSupprimer(ligne.produit.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSPanierLigne;
