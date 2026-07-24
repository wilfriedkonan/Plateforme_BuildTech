import React, { useState } from 'react';
import { ShoppingCart, Trash2, ChevronDown, ChevronUp, Truck, Package, X, Loader2 } from 'lucide-react';
import { LigneCommande } from '../lib/mock/pos';
import { Client } from '../lib/mock/clients';
import { CommandeDto } from '../../lib/commandeAdminApi';
import POSPanierLigne from './POSPanierLigne';

// Badge config compact pour le panneau panier
const ETAT_BADGE: Partial<Record<string, { label: string; cls: string }>> = {
  EnAttente:     { label: 'En attente',   cls: 'bg-orange-100 text-orange-700' },
  Confirmee:     { label: 'Confirmée',    cls: 'bg-blue-100 text-blue-700'     },
  EnPreparation: { label: 'En prépa.',    cls: 'bg-indigo-100 text-indigo-700' },
  Prete:         { label: 'Prête',        cls: 'bg-teal-100 text-teal-700'     },
  EnLivraison:   { label: 'En livraison', cls: 'bg-amber-100 text-amber-700'   },
};

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
  // Commande en ligne liée
  commandeEnLigne?: CommandeDto | null;
  commandeEnLigneBusy?: boolean;
  onMettreEnPreparation?: () => void;
  onMettreEnLivraison?: () => void;
  onDelierCommande?: () => void;
}

const POSPanier: React.FC<POSPanierProps> = ({
  panier,
  panierCount,
  totaux,
  remiseGlobale,
  setRemiseGlobale,
  clients: _clients,
  clientSelectionne: _clientSelectionne,
  onSelectionnerClient: _onSelectionnerClient,
  onAjouterClient: _onAjouterClient,
  onModifierQuantite,
  onSetQuantite,
  onSupprimer,
  onVider,
  onEncaisser,
  onMettreEnAttente,
  onClickLigneRemise,
  commandeEnLigne,
  commandeEnLigneBusy = false,
  onMettreEnPreparation,
  onMettreEnLivraison,
  onDelierCommande,
}) => {
  const [showRemiseGlobale, setShowRemiseGlobale] = useState(false);

  const handleVider = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) onVider();
  };

  const etat = commandeEnLigne?.etat;
  const badge = etat ? ETAT_BADGE[etat] : null;

  const canPrepa    = etat === 'EnAttente'     || etat === 'Confirmee';
  const canLivrer   = etat === 'EnAttente'     || etat === 'Confirmee' || etat === 'EnPreparation' || etat === 'Prete';
  const canEncaisser = etat === 'EnLivraison';

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm">

      {/* Header */}
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
            <button onClick={handleVider}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
              title="Vider le panier">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bandeau commande en ligne liée */}
        {commandeEnLigne && (
          <div className="flex items-center justify-between mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">📱</span>
              <p className="text-xs font-semibold text-blue-900 truncate">{commandeEnLigne.clientWhatsApp}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
              <button onClick={onDelierCommande} title="Délier la commande"
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lignes */}
      <div className="flex-1 overflow-auto p-4">
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

      {/* Footer totaux + actions */}
      {panier.length > 0 && (
        <div className="p-4 border-t border-gray-100 space-y-4">

          {/* Remise globale */}
          <div>
            <button onClick={() => setShowRemiseGlobale(!showRemiseGlobale)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
              <span>Remise globale</span>
              {showRemiseGlobale ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showRemiseGlobale && (
              <div className="flex items-center gap-2 animate-in slide-in-from-top duration-200">
                <input type="number" value={remiseGlobale}
                  onChange={e => setRemiseGlobale(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  min="0" max="100" step="1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  placeholder="0" />
                <span className="text-sm font-medium text-gray-700">%</span>
              </div>
            )}
          </div>

          {/* Totaux */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{totaux.sousTotal.toLocaleString('fr-FR')} F</span>
            </div>
            {remiseGlobale > 0 && (
              <div className="flex justify-between text-sm text-red-600 font-medium">
                <span>Remise (-{remiseGlobale}%)</span>
                <span>-{(totaux.sousTotal - totaux.apresRemise).toLocaleString('fr-FR')} F</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{totaux.total.toLocaleString('fr-FR')} F</span>
              </div>
            </div>
          </div>

          {/* ── Boutons d'action ── */}
          <div className="space-y-2 pt-2">
            {commandeEnLigne ? (
              <>
                {/* Mode commande en ligne */}
                {canPrepa && (
                  <button onClick={onMettreEnPreparation} disabled={commandeEnLigneBusy}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all font-bold text-sm disabled:opacity-50">
                    {commandeEnLigneBusy
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Package className="w-4 h-4" />}
                    Mettre en préparation
                  </button>
                )}
                {canLivrer && (
                  <button onClick={onMettreEnLivraison} disabled={commandeEnLigneBusy}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-all font-bold text-sm disabled:opacity-50">
                    {commandeEnLigneBusy
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Truck className="w-4 h-4" />}
                    Mettre en livraison
                  </button>
                )}
                {canEncaisser && (
                  <button onClick={onEncaisser}
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all font-bold text-sm shadow-lg hover:shadow-xl">
                    Encaisser
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Mode vente normale */}
                <button onClick={onEncaisser}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all font-bold text-sm shadow-lg hover:shadow-xl">
                  Encaisser
                </button>
                <button onClick={onMettreEnAttente}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
                  Mettre en attente
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPanier;
