import React from 'react';
import { Printer, CheckCircle } from 'lucide-react';
import { TransactionPOS } from '../lib/mock/pos';
import { PosFacture } from '../../services/posService';

interface POSTicketProps {
  transaction: TransactionPOS;
  facture?: PosFacture | null;
  onNouvelleVente: () => void;
  onFermer: () => void;
}

const SEP = '─'.repeat(30);

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? 'font-bold' : ''}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const POSTicket: React.FC<POSTicketProps> = ({ transaction, facture, onNouvelleVente, onFermer }) => {
  const titre = facture?.caisse?.trim() || 'CAISSE POS';

  const numero = facture?.numeroFacture || transaction.numero;

  const date = facture?.dateCreation
    ? new Date(facture.dateCreation).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
    : transaction.date;

  const caissier = facture?.nomUtilisateur || transaction.caissier || '';
  const clientNom = facture?.nomClient || transaction.clientNom;

  const sousTotal = facture?.sous_total ?? transaction.sousTotal;
  const montantTVA = facture?.valeurTVA ?? transaction.montantTVA;
  const remiseGlobale = facture?.remise_globale ?? transaction.remiseGlobale;
  const valeurRemise = facture?.valeurRemise_globale ?? (sousTotal * remiseGlobale / 100);
  const total = facture?.total_final ?? transaction.total;

  const modePaiement = facture?.designationPayement || transaction.modePaiement || '';
  const montantVerser = facture?.montantVerser ?? transaction.montantRecu;
  const monnaieRemis = facture?.monnaieRemis ?? transaction.monnaieRendue ?? 0;

  // Articles : préférer les détails API, sinon les lignes locales
  const articles = facture?.details && facture.details.length > 0
    ? facture.details.map(d => ({
        nom: d.designation || '',
        quantite: d.quantite ?? 1,
        prixUnitaire: d.prixVente ?? d.prixUnitaireTTC ?? 0,
        remise: d.valeurRemise ?? 0,
        montantLigne: d.sousTotal ?? d.prixTotal ?? (d.prixVente ?? 0) * (d.quantite ?? 1),
      }))
    : transaction.lignes.map(l => ({
        nom: l.produit.nom,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
        remise: l.remise,
        montantLigne: l.prixUnitaire * l.quantite * (1 - l.remise / 100),
      }));

  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  const handleImprimer = () => {
    const win = window.open('', '_blank', 'width=320,height=700');
    if (!win) return;

    const lignesHTML = articles.map(a => `
      <div style="margin-bottom:5px">
        <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.nom}</div>
        <div style="display:flex;justify-content:space-between;color:#555">
          <span>${a.quantite} &times; ${fmt(a.prixUnitaire)} F${a.remise > 0 ? ` (-${a.remise}%)` : ''}</span>
          <span style="font-weight:600;color:#111">${fmt(a.montantLigne)} F</span>
        </div>
      </div>`).join('');

    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<title>Ticket ${numero}</title>
<style>
  @page { size: 58mm auto; margin: 3mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', Courier, monospace; font-size: 11px; width: 52mm; }
  .sep { border: none; border-top: 1px dashed #aaa; margin: 5px 0; }
  .c { text-align: center; }
  .row { display: flex; justify-content: space-between; }
  .b { font-weight: bold; }
  .g { color: #666; }
  .total { border-top: 1px solid #333; padding-top: 3px; margin-top: 3px; }
</style>
</head><body>
<div class="c" style="margin-bottom:8px">
  <div class="b" style="font-size:13px;text-transform:uppercase;letter-spacing:1px">${titre}</div>
  <div class="g">Point de vente</div>
</div>
<hr class="sep"/>
<div class="c" style="margin-bottom:6px">
  <div class="b">N° ${numero}</div>
  <div>${date}</div>
  <div>Caissier : ${caissier}</div>
  ${clientNom ? `<div>Client : ${clientNom}</div>` : ''}
</div>
<hr class="sep"/>
<div style="margin-bottom:6px">${lignesHTML}</div>
<hr class="sep"/>
<div style="margin-bottom:6px">
  <div class="row"><span>Sous-total</span><span>${fmt(sousTotal)} F</span></div>
  ${remiseGlobale > 0 ? `<div class="row" style="color:#c00"><span>Remise (-${remiseGlobale}%)</span><span>-${fmt(valeurRemise)} F</span></div>` : ''}
  <div class="row g"><span>TVA</span><span>${fmt(montantTVA)} F</span></div>
  <div class="row b total"><span>TOTAL</span><span>${fmt(total)} F</span></div>
</div>
<hr class="sep"/>
<div class="c" style="margin-bottom:6px">
  <div>Payé par : <strong>${modePaiement}</strong></div>
  ${montantVerser != null && montantVerser > 0 ? `
    <div>Reçu : ${fmt(montantVerser)} F</div>
    <div>Rendu : ${fmt(monnaieRemis)} F</div>` : ''}
</div>
<hr class="sep"/>
<div class="c g">Merci de votre visite !</div>
</body></html>`;

    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div className="space-y-4">
      {/* Confirmation */}
      <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
        <CheckCircle className="w-5 h-5" />
        <span>Paiement validé avec succès</span>
      </div>

      {/* Ticket 58mm */}
      <div
        id="pos-ticket-print"
        className="mx-auto bg-white border border-gray-200 rounded-lg font-mono text-xs leading-relaxed shadow-sm"
        style={{ width: 260, padding: '16px 12px' }}
      >
        {/* En-tête */}
        <div className="text-center mb-3">
          <p className="font-bold text-sm uppercase tracking-wider">{titre}</p>
          <p className="text-gray-500">Point de vente</p>
        </div>

        <p className="text-gray-300 mb-2">{SEP}</p>

        <div className="text-center space-y-0.5 mb-2">
          <p className="font-bold">N° {numero}</p>
          <p>{date}</p>
          <p>Caissier : {caissier}</p>
          {clientNom && <p>Client : {clientNom}</p>}
        </div>

        <p className="text-gray-300 mb-2">{SEP}</p>

        {/* Articles */}
        <div className="space-y-1.5 mb-2">
          {articles.map((a, idx) => (
            <div key={idx}>
              <p className="truncate font-medium">{a.nom}</p>
              <div className="flex justify-between text-gray-500">
                <span>
                  {a.quantite} × {fmt(a.prixUnitaire)} F
                  {a.remise > 0 && ` (-${a.remise}%)`}
                </span>
                <span className="font-medium text-gray-800">{fmt(a.montantLigne)} F</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-300 mb-2">{SEP}</p>

        {/* Totaux */}
        <div className="space-y-0.5 mb-2">
          <Row label="Sous-total" value={`${fmt(sousTotal)} F`} />
          {remiseGlobale > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Remise (-{remiseGlobale}%)</span>
              <span>-{fmt(valeurRemise)} F</span>
            </div>
          )}
          <Row label="TVA" value={`${fmt(montantTVA)} F`} />
          <div className="border-t border-gray-300 pt-1 mt-1">
            <Row label="TOTAL" value={`${fmt(total)} F`} bold />
          </div>
        </div>

        <p className="text-gray-300 mb-2">{SEP}</p>

        {/* Paiement */}
        <div className="text-center space-y-0.5 mb-2">
          <p>Payé par : <span className="font-medium">{modePaiement}</span></p>
          {montantVerser != null && montantVerser > 0 && (
            <>
              <p>Reçu : {fmt(montantVerser)} F</p>
              <p>Rendu : {fmt(monnaieRemis)} F</p>
            </>
          )}
        </div>

        <p className="text-gray-300 mb-2">{SEP}</p>

        <p className="text-center text-gray-400">Merci de votre visite !</p>
      </div>

      {/* Actions */}
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
