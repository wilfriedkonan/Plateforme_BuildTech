import React, { useState } from 'react';
import { X, Clock, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { PosFacture } from '../../services/posService';
import { usePosFactures } from '../../hooks/usePosFactures';

interface POSAttentesProps {
  attentes: PosFacture[];
  loading?: boolean;
  onReprendre: (facture: PosFacture) => void;
  onFermer: () => void;
  onRefresh: () => void;
}

const POSAttentes: React.FC<POSAttentesProps> = ({
  attentes,
  loading,
  onReprendre,
  onFermer,
  onRefresh,
}) => {
  const { cancelFacture } = usePosFactures();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleAnnuler = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande en attente ?')) return;
    setCancellingId(id);
    setCancelError(null);
    try {
      await cancelFacture(id, { motif: 'Annulation caisse' });
      onRefresh();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de l'annulation";
      setCancelError(msg);
    } finally {
      setCancellingId(null);
    }
  };
  const formatHeure = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getResume = (details?: PosFacture['details']) => {
    if (!details || details.length === 0) return 'Aucun article';
    const items = details
      .slice(0, 2)
      .map(d => `${d.designation} × ${d.quantite ?? d.quantite ?? 1}`);
    const plus = details.length > 2 ? ` + ${details.length - 2} autre(s)` : '';
    return items.join(' + ') + plus;
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onFermer} />

      <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Commandes en attente</h3>
              <p className="text-xs text-gray-500">{attentes.length} commande(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Actualiser"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onFermer} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {cancelError && (
            <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cancelError}</span>
              <button onClick={() => setCancelError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-full gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Chargement...</span>
            </div>
          ) : attentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Clock className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-400 text-lg font-medium mb-1">Aucune commande en attente</p>
              <p className="text-gray-400 text-sm">Les commandes mises en attente apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {attentes.map(facture => {
                const nom = facture.designation || facture.numeroFacture || 'Sans nom';
                const total = facture.total_final ?? facture.montant ?? 0;
                const totalArticles = (facture.details || []).reduce(
                  (sum, d) => sum + (d.quantite ?? d.quantite ?? 1),
                  0
                );

                return (
                  <div
                    key={facture.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {nom.toLowerCase().includes('table') ? '📋' : '👤'}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900">{nom}</h4>
                          <p className="text-xs text-gray-500">{formatHeure(facture.dateCreation)}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
                        En attente
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {getResume(facture.details)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{totalArticles} article(s)</p>
                    </div>

                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {total.toLocaleString('fr-FR')} F
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onReprendre(facture)}
                        className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                      >
                        Reprendre
                      </button>
                      <button
                        onClick={() => facture.id && handleAnnuler(facture.id)}
                        disabled={cancellingId === facture.id}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {cancellingId === facture.id && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
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
