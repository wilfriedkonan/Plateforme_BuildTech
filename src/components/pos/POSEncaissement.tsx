import React, { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, Smartphone, FileText, Building2, Coins, Loader2 } from 'lucide-react';
import { TransactionPOS, LigneCommande } from '../lib/mock/pos';
import { PaymentType, PosFacture } from '../../services/posService';
import { usePosFactures } from '../../hooks/usePosFactures';
import POSTicket from './POSTicket';

interface POSEncaissementProps {
  total: number;
  factureId?: string | null;
  remiseGlobale?: number;
  panier: LigneCommande[];
  clientId?: string | null;
  onConfirmer: (typePaiement: PaymentType, montantRecu?: number, reference?: string) => TransactionPOS | undefined;
  onVidePanier: () => void;
  onFermer: () => void;
  onNouvelleVente: () => void;
  onPaymentSuccess?: () => void;
}

type Etape = 'mode' | 'confirmation' | 'ticket';

function getIconConfig(code?: string) {
  const lower = (code || '').toLowerCase();
  if (lower.includes('espece') || lower.includes('cash') || lower.includes('liquide'))
    return { emoji: '💵', Icon: Banknote };
  if (lower.includes('carte') || lower.includes('card') || lower.includes('credit') || lower.includes('debit'))
    return { emoji: '💳', Icon: CreditCard };
  if (lower.includes('mobile') || lower.includes('wave') || lower.includes('orange') || lower.includes('mtn') || lower.includes('momo'))
    return { emoji: '📱', Icon: Smartphone };
  if (lower.includes('cheque') || lower.includes('check'))
    return { emoji: '📄', Icon: FileText };
  if (lower.includes('virement') || lower.includes('transfer') || lower.includes('banque') || lower.includes('bank'))
    return { emoji: '🏦', Icon: Building2 };
  return { emoji: '💰', Icon: Coins };
}

const POSEncaissement: React.FC<POSEncaissementProps> = ({
  total,
  factureId,
  remiseGlobale = 0,
  panier,
  clientId,
  onConfirmer,
  onVidePanier,
  onFermer,
  onNouvelleVente,
  onPaymentSuccess,
}) => {
  const { paymentTypes, loading: loadingTypes, fetchPaymentTypes, confirmPayment } = usePosFactures();
  const [etape, setEtape] = useState<Etape>('mode');
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [montantRecu, setMontantRecu] = useState('');
  const [paiementRecu, setPaiementRecu] = useState(false);
  const [reference, setReference] = useState('');
  const [transaction, setTransaction] = useState<TransactionPOS | null>(null);
  const [factureRetour, setFactureRetour] = useState<PosFacture | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  const montantRecuNum = parseFloat(montantRecu) || 0;
  const monnaieRendue = Math.max(0, montantRecuNum - total);
  const montantSuffisant = montantRecuNum >= total;

  const isEspeces = (selectedType?.designation || '').toLowerCase().includes('espece') ||
    (selectedType?.designation || '').toLowerCase().includes('cash');

  const handleSuivant = () => {
    if (selectedType) setEtape('confirmation');
  };

  const handleConfirmer = async () => {
    if (!selectedType) return;
    if (isEspeces && !montantSuffisant) return;
    if (!isEspeces && !paiementRecu) return;

    setIsConfirming(true);
    setApiError(null);

    // Infos session depuis localStorage
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userId: string | null = session?.user?.id ?? null;
    const nomCaisse: string = session?.user?.nomEntreprise ?? '';

    // Construire les articles depuis le panier
    const articles = panier.map(ligne => ({
      idArticle: ligne.produit.id,
      designation: ligne.produit.nom,
      quantite: ligne.quantite,
      prixUnitaireHT: ligne.produit.tva > 0
        ? ligne.prixUnitaire / (1 + ligne.produit.tva / 100)
        : ligne.prixUnitaire,
      prixVente: ligne.prixUnitaire,
      tauxTVA: ligne.produit.tva,
      valeurRemise: ligne.remise,
    }));

    // Appel API — backend crée la facture si idFacture est null, encaisse si elle existe
    let factureAPI: PosFacture | null = null;
    try {
      const response = await confirmPayment({
        idFacture: factureId ?? null,
        idPayement: selectedType.id!,
        montantVerser: isEspeces ? montantRecuNum : total,
        monnaieRemis: isEspeces ? monnaieRendue : 0,
        remise: remiseGlobale,
        idClient: clientId ?? null,
        idUtilisateur: userId,
        caisse: nomCaisse,
        articles,
      });
      factureAPI = response?.facture ?? response?.data?.facture ?? null;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erreur lors de la confirmation du paiement';
      setApiError(msg);
      setIsConfirming(false);
      return;
    }

    // Mise à jour locale de l'état POS
    const trans = onConfirmer(
      selectedType,
      isEspeces ? montantRecuNum : undefined,
      reference || undefined
    );

    setIsConfirming(false);

    if (trans) {
      onVidePanier();
      setTransaction(trans);
      setFactureRetour(factureAPI);
      setEtape('ticket');
      onPaymentSuccess?.();
    }
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
            <p className="text-2xl font-bold text-gray-900 mt-1">{(total.toLocaleString('fr-FR'))} F</p>
          </div>
          <button onClick={onFermer} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {etape === 'mode' && (
            <div className="space-y-6">
              {loadingTypes ? (
                <div className="flex items-center justify-center h-40 gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Chargement des modes de paiement...</span>
                </div>
              ) : paymentTypes.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  Aucun mode de paiement disponible
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {paymentTypes.map(type => {
                    const { emoji, Icon } = getIconConfig(type.designation);
                    const isSelected = selectedType?.id === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type)}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow'
                        }`}
                      >
                        <Icon className="w-8 h-8 text-gray-700" />
                        <span className="font-medium text-gray-900 text-sm text-center leading-tight">
                          {type.designation || emoji}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleSuivant}
                disabled={!selectedType}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                  selectedType
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Suivant
              </button>
            </div>
          )}

          {etape === 'confirmation' && isEspeces && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
                  <p className="text-3xl font-bold text-gray-900">{total.toLocaleString('fr-FR')} F</p>
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
                      step="1"
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg font-medium"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">F</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Monnaie à rendre</p>
                    <p className={`text-2xl font-bold ${montantSuffisant ? 'text-green-600' : 'text-red-600'}`}>
                      {monnaieRendue.toLocaleString('fr-FR')} F
                    </p>
                  </div>
                  {!montantSuffisant && montantRecuNum > 0 && (
                    <p className="text-sm text-red-600 mt-2">Montant insuffisant</p>
                  )}
                  {montantSuffisant && montantRecuNum > 0 && (
                    <div className="mt-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      Montant suffisant
                    </div>
                  )}
                </div>
              </div>

              {apiError && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{apiError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setEtape('mode')}
                  disabled={isConfirming}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Retour
                </button>
                <button
                  onClick={handleConfirmer}
                  disabled={!montantSuffisant || isConfirming}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                    montantSuffisant && !isConfirming
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isConfirming && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isConfirming ? 'Traitement...' : "Confirmer l'encaissement"}
                </button>
              </div>
            </div>
          )}

          {etape === 'confirmation' && !isEspeces && selectedType && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
                  <p className="text-3xl font-bold text-gray-900">{total.toLocaleString('fr-FR')} F</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Mode de paiement</p>
                  <p className="font-semibold text-gray-900">{selectedType.designation}</p>
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

              {apiError && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{apiError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setEtape('mode')}
                  disabled={isConfirming}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Retour
                </button>
                <button
                  onClick={handleConfirmer}
                  disabled={!paiementRecu || isConfirming}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                    paiementRecu && !isConfirming
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isConfirming && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isConfirming ? 'Traitement...' : "Confirmer l'encaissement"}
                </button>
              </div>
            </div>
          )}

          {etape === 'ticket' && transaction && (
            <POSTicket
              transaction={transaction}
              facture={factureRetour}
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
