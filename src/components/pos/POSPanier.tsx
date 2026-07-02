import React, { useState } from 'react';
import { ShoppingCart, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { LigneCommande, } from '../lib/mock/pos';
import { Client } from '../lib/mock/clients';
import POSPanierLigne from './POSPanierLigne';
import POSClientSelector from './POSClientSelector';

interface POSPanierProps {
  panier: LigneCommande[];
  panierCount: number;
  totaux: {
    sousTotal: number;
    apresRemise: number;
    montantTVA: number;
    total: number;
  };
  remiseGlobale: number;
  setRemiseGlobale: (remise: number) => void;
  clients: Client[];
  clientSelectionne: Client | null;
  onSelectionnerClient: (client: Client | null) => void;
  onAjouterClient: () => void;
  onModifierQuantite: (id: string, delta: number) => void;
  onSetQuantite: (id: string, quantite: number) => void;
  onSupprimer: (id: string) => void;
  onVider: () => void;
  onEncaisser: () => void;
  onMettreEnAttente: () => void;
  onClickLigneRemise: (id: string) => void;
}

const POSPanier: React.FC<POSPanierProps> = ({
  panier,
  panierCount,
  totaux,
  remiseGlobale,
  setRemiseGlobale,
  clients,
  clientSelectionne,
  onSelectionnerClient,
  onAjouterClient,
  onModifierQuantite,
  onSetQuantite,
  onSupprimer,
  onVider,
  onEncaisser,
  onMettreEnAttente,
  onClickLigneRemise
}) => {
  const [showRemiseGlobale, setShowRemiseGlobale] = useState(false);

  const handleVider = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      onVider();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-base">Panier actuel</h3>
            {panierCount > 0 && (
              <span className="px-2 py-0.5 bg-gray-900 text-white rounded-full text-xs font-bold">
                {panierCount}
              </span>
            )}
          </div>
          {panier.length > 0 && (
            <button
              onClick={handleVider}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
              title="Vider le panier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
    {/*     <div className="mb-4">
          <POSClientSelector
            clients={clients}
            clientSelectionne={clientSelectionne}
            onSelectionner={onSelectionnerClient}
            onAjouterClient={onAjouterClient}
          />
        </div> */}

        {panier.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-400 text-lg font-medium mb-1">Panier vide</p>
            <p className="text-gray-400 text-sm">Ajoutez des produits pour commencer</p>
          </div>
        ) : (
          <div className="space-y-2">
            {panier.map(ligne => (
              <POSPanierLigne
                key={ligne.produit.id}
                ligne={ligne}
                onModifierQuantite={onModifierQuantite}
                onSetQuantite={onSetQuantite}
                onSupprimer={onSupprimer}
                onClickNom={onClickLigneRemise}
              />
            ))}
          </div>
        )}
      </div>

      {panier.length > 0 && (
        <div className="p-4 border-t border-gray-100 space-y-4">
          <div>
            <button
              onClick={() => setShowRemiseGlobale(!showRemiseGlobale)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
            >
              <span>Remise globale</span>
              {showRemiseGlobale ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showRemiseGlobale && (
              <div className="flex items-center gap-2 animate-in slide-in-from-top duration-200">
                <input
                  type="number"
                  value={remiseGlobale}
                  onChange={(e) => setRemiseGlobale(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  min="0"
                  max="100"
                  step="1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  placeholder="0"
                />
                <span className="text-sm font-medium text-gray-700">%</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{totaux.sousTotal}F</span>
            </div>

            {remiseGlobale > 0 && (
              <div className="flex justify-between text-sm text-red-600 font-medium">
                <span>Remise (-{remiseGlobale}%)</span>
                <span>-{totaux.sousTotal - totaux.apresRemise} F</span>
              </div>
            )}

          {/*   <div className="flex justify-between text-sm text-gray-600">
              <span>TVA (incluse)</span>
              <span>{formaterPrix(totaux.montantTVA)}</span>
            </div> */}

            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{totaux.total.toLocaleString('fr-FR')}F</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onEncaisser}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-xl"
            >
              Encaisser
            </button>
            <button
              onClick={onMettreEnAttente}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
            >
              Mettre en attente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPanier;
