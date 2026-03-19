import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, FileText, Building2, Plus } from 'lucide-react';
import { ModePaiement, TransactionPOS, formaterPrix } from '../lib/mock/pos';
import POSTicket from './POSTicket';

interface POSEncaissementProps {
  total: number;
  onConfirmer: (modePaiement: ModePaiement, montantRecu?: number, reference?: string) => TransactionPOS;
  onFermer: () => void;
  onNouvelleVente: () => void;
}

type Etape = 'mode' | 'confirmation' | 'ticket';

const POSEncaissement: React.FC<POSEncaissementProps> = ({
  total,
  onConfirmer,
  onFermer,
  onNouvelleVente
}) => {
  const [etape, setEtape] = useState<Etape>('mode');
  const [modePaiement, setModePaiement] = useState<ModePaiement | null>(null);
  const [montantRecu, setMontantRecu] = useState('');
  const [paiementRecu, setPaiementRecu] = useState(false);
  const [reference, setReference] = useState('');
  const [transaction, setTransaction] = useState<TransactionPOS | null>(null);

  const modes = [
    { id: 'especes' as ModePaiement, label: 'Espèces', icon: '💵', iconComponent: Banknote },
    { id: 'carte' as ModePaiement, label: 'Carte', icon: '💳', iconComponent: CreditCard },
    { id: 'mobile_money' as ModePaiement, label: 'Mobile Money', icon: '📱', iconComponent: Smartphone },
    { id: 'cheque' as ModePaiement, label: 'Chèque', icon: '📄', iconComponent: FileText },
    { id: 'virement' as ModePaiement, label: 'Virement', icon: '🏦', iconComponent: Building2 },
  ];

  const montantRecuNum = parseFloat(montantRecu) || 0;
  const monnaieRendue = Math.max(0, montantRecuNum - total);
  const montantSuffisant = montantRecuNum >= total;

  const handleSuivant = () => {
    if (modePaiement) {
      setEtape('confirmation');
    }
  };

  const handleConfirmer = () => {
    if (!modePaiement) return;

    if (modePaiement === 'especes' && !montantSuffisant) return;
    if (modePaiement !== 'especes' && !paiementRecu) return;

    const trans = onConfirmer(
      modePaiement,
      modePaiement === 'especes' ? montantRecuNum : undefined,
      reference || undefined
    );

    setTransaction(trans);
    setEtape('ticket');
  };

  const handleNouvelleVente = () => {
    onNouvelleVente();
    onFermer();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {etape === 'mode' && 'Encaisser'}
              {etape === 'confirmation' && 'Confirmation'}
              {etape === 'ticket' && 'Transaction effectuée'}
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formaterPrix(total)}</p>
          </div>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {etape === 'mode' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {modes.map(mode => {
                  const Icon = mode.iconComponent;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setModePaiement(mode.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                        modePaiement === mode.id
                          ? 'border-gray-900 bg-gray-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow'
                      }`}
                    >
                      <Icon className="w-8 h-8 text-gray-700" />
                      <span className="font-medium text-gray-900 text-sm">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSuivant}
                disabled={!modePaiement}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                  modePaiement
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Suivant
              </button>
            </div>
          )}

          {etape === 'confirmation' && modePaiement === 'especes' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
                  <p className="text-3xl font-bold text-gray-900">{formaterPrix(total)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant reçu
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={montantRecu}
                      onChange={(e) => setMontantRecu(e.target.value)}
                      min="0"
                      step="0.01"
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      €
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Monnaie à rendre</p>
                    <p className={`text-2xl font-bold ${
                      montantSuffisant ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formaterPrix(monnaieRendue)}
                    </p>
                  </div>
                  {!montantSuffisant && montantRecuNum > 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Montant insuffisant
                    </p>
                  )}
                  {montantSuffisant && montantRecuNum > 0 && (
                    <div className="mt-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      Montant suffisant
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEtape('mode')}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Retour
                </button>
                <button
                  onClick={handleConfirmer}
                  disabled={!montantSuffisant}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors ${
                    montantSuffisant
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirmer l'encaissement
                </button>
              </div>
            </div>
          )}

          {etape === 'confirmation' && modePaiement !== 'especes' && modePaiement && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
                  <p className="text-3xl font-bold text-gray-900">{formaterPrix(total)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence transaction (optionnel)
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Ex: REF123456"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paiementRecu}
                      onChange={(e) => setPaiementRecu(e.target.checked)}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <span className="font-medium text-gray-900">Paiement reçu et confirmé</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEtape('mode')}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Retour
                </button>
                <button
                  onClick={handleConfirmer}
                  disabled={!paiementRecu}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors ${
                    paiementRecu
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirmer l'encaissement
                </button>
              </div>
            </div>
          )}

          {etape === 'ticket' && transaction && (
            <POSTicket
              transaction={transaction}
              onNouvelleVente={handleNouvelleVente}
              onFermer={onFermer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default POSEncaissement;
