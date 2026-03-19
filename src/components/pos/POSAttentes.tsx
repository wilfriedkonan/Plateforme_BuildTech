import React from 'react';
import { X, Clock } from 'lucide-react';
import { CommandeEnAttente, calculerTotaux, formaterPrix } from '../lib/mock/pos';

interface POSAttentesProps {
  attentes: CommandeEnAttente[];
  onReprendre: (id: string) => void;
  onAnnuler: (id: string) => void;
  onFermer: () => void;
}

const POSAttentes: React.FC<POSAttentesProps> = ({
  attentes,
  onReprendre,
  onAnnuler,
  onFermer
}) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-end">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onFermer}
      />

      <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Commandes en attente</h3>
              <p className="text-xs text-gray-500">{attentes.length} commande(s)</p>
            </div>
          </div>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {attentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Clock className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg font-medium mb-1">Aucune commande en attente</p>
              <p className="text-gray-400 text-sm">Les commandes mises en attente apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attentes.map(attente => {
                const totaux = calculerTotaux(attente.lignes);
                const resumeProduits = attente.lignes
                  .map(l => `${l.produit.nom} × ${l.quantite}`)
                  .slice(0, 2)
                  .join(' + ');
                const plusDeProduits = attente.lignes.length > 2;

                return (
                  <div
                    key={attente.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {attente.nom.toLowerCase().includes('table') ? '📋' : '👤'}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900">{attente.nom}</h4>
                          <p className="text-xs text-gray-500">{attente.createdAt}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
                        En attente
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {resumeProduits}
                        {plusDeProduits && <span className="text-gray-400"> + {attente.lignes.length - 2} autre(s)</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {attente.lignes.reduce((sum, l) => sum + l.quantite, 0)} article(s)
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formaterPrix(totaux.total)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onReprendre(attente.id)}
                        className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                      >
                        Reprendre
                      </button>
                      <button
                        onClick={() => onAnnuler(attente.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POSAttentes;
