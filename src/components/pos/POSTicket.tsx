import React from 'react';
import { Printer } from 'lucide-react';
import { TransactionPOS, formaterPrix } from '../lib/mock/pos';

interface POSTicketProps {
  transaction: TransactionPOS;
  onNouvelleVente: () => void;
  onFermer: () => void;
}

const POSTicket: React.FC<POSTicketProps> = ({ transaction, onNouvelleVente, onFermer }) => {
  const handleImprimer = () => {
    window.print();
  };

  const modePaiementLabel = {
    especes: 'Espèces',
    carte: 'Carte bancaire',
    mobile_money: 'Mobile Money',
    cheque: 'Chèque',
    virement: 'Virement'
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm">
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">🏪</div>
          <h3 className="font-bold text-lg">COCOPROJECTS</h3>
        </div>

        <div className="border-t border-b border-gray-300 py-3 mb-3 text-center space-y-1">
          <p className="font-bold">N° {transaction.numero}</p>
          <p>{transaction.date}</p>
          <p>Caissier : {transaction.caissier}</p>
          {transaction.clientNom && (
            <p>Client : {transaction.clientNom}</p>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {transaction.lignes.map((ligne, idx) => (
            <div key={idx} className="flex justify-between">
              <div className="flex-1">
                <p>{ligne.produit.nom}</p>
                <p className="text-xs text-gray-600">
                  {ligne.quantite} × {formaterPrix(ligne.prixUnitaire)}
                  {ligne.remise > 0 && ` (-${ligne.remise}%)`}
                </p>
              </div>
              <p className="font-medium">{formaterPrix(ligne.prixUnitaire * ligne.quantite * (1 - ligne.remise / 100))}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-3 space-y-1">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{formaterPrix(transaction.sousTotal)}</span>
          </div>

          {transaction.remiseGlobale > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Remise (-{transaction.remiseGlobale}%)</span>
              <span>-{formaterPrix(transaction.sousTotal * transaction.remiseGlobale / 100)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-gray-600">
            <span>TVA (incluse)</span>
            <span>{formaterPrix(transaction.montantTVA)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
            <span>TOTAL</span>
            <span>{formaterPrix(transaction.total)}</span>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-3 pt-3 text-center">
          <p className="font-medium">Payé par : {modePaiementLabel[transaction.modePaiement]}</p>
          {transaction.montantRecu && (
            <>
              <p className="text-xs text-gray-600 mt-1">
                Montant reçu : {formaterPrix(transaction.montantRecu)}
              </p>
              <p className="text-xs text-gray-600">
                Monnaie rendue : {formaterPrix(transaction.monnaieRendue || 0)}
              </p>
            </>
          )}
        </div>

        <div className="border-t border-gray-300 mt-4 pt-3 text-center text-xs">
          <p>Merci de votre visite !</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleImprimer}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Imprimer
        </button>
        <button
          onClick={onNouvelleVente}
          className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Nouvelle vente
        </button>
        <button
          onClick={onFermer}
          className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default POSTicket;
