import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { LigneCommande } from '../lib/mock/pos';
import { usePosFactures } from '../../hooks/usePosFactures';

interface POSMettreEnAttenteProps {
  panier: LigneCommande[];
  factureId?: string | null;
  clientId?: string | null;
  onConfirmer: (nom: string) => void;
  onFermer: () => void;
}

const POSMettreEnAttente: React.FC<POSMettreEnAttenteProps> = ({
  panier,
  factureId,
  clientId,
  onConfirmer,
  onFermer,
}) => {
  const { putOnHoldSmart } = usePosFactures();
  const [nom, setNom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleConfirmer = async () => {
    if (!nom.trim()) return;

    setIsLoading(true);
    setApiError(null);

    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userId: string | null = session?.user?.id ?? null;
    const nomCaisse: string = session?.user?.nomEntreprise ?? '';

    const articles = panier.map(ligne => ({
      idArticle: ligne.produit.id,
      designation: ligne.produit.nom,
      quantité: ligne.quantite,
      prixUnitaireHT: ligne.produit.tva > 0
        ? ligne.prixUnitaire / (1 + ligne.produit.tva / 100)
        : ligne.prixUnitaire,
      prixVente: ligne.prixUnitaire,
      tauxTVA: ligne.produit.tva,
      valeurRemise: ligne.remise,
    }));

    try {
      await putOnHoldSmart({
        idFacture: factureId ?? null,
        motif: nom.trim(),
        designation: nom.trim(),
        idClient: clientId ?? null,
        idUtilisateur: userId,
        caisse: nomCaisse,
        articles,
      });
      onConfirmer(nom.trim());
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erreur lors de la mise en attente';
      setApiError(msg);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && nom.trim() && !isLoading) {
      handleConfirmer();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Nommer cette commande</h3>
          <button
            onClick={onFermer}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Table 3, Client Kouassi..."
            autoFocus
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-2">
            Donnez un nom à cette commande pour la retrouver facilement
          </p>
          {apiError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-3">{apiError}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onFermer}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirmer}
            disabled={!nom.trim() || isLoading}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              nom.trim() && !isLoading
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Mise en attente...' : 'Mettre en attente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSMettreEnAttente;
