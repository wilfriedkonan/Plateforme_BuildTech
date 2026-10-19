import React from 'react';
import { X, Smartphone, MapPin, ExternalLink, Printer, Truck } from 'lucide-react';
import { CommandeDto, DetailCommandeDto } from '../../lib/commandeAdminApi';
import { escapeHtml as esc } from '../../lib/escapeHtml';

interface POSBonLivraisonProps {
  commande: CommandeDto;
  lignes: DetailCommandeDto[];
  onClose: () => void;
}

const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

const POSBonLivraison: React.FC<POSBonLivraisonProps> = ({ commande, lignes, onClose }) => {
  const date = new Date(commande.dateCommande).toLocaleString('fr-FR', {
    dateStyle: 'short', timeStyle: 'short',
  });
  const hasGps = commande.livraisonLat != null && commande.livraisonLng != null;
  const mapsUrl = hasGps
    ? `https://www.google.com/maps?q=${commande.livraisonLat},${commande.livraisonLng}`
    : null;

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=320,height=620');
    if (!win) return;
    const lignesHTML = lignes.map(l => `
      <div style="margin-bottom:6px">
        <div style="font-weight:600">${esc(l.nomArticle)}</div>
        <div style="display:flex;justify-content:space-between;color:#555">
          <span>${l.quantite} &times; ${fmt(l.prixUnitaire)} F</span>
          <span style="font-weight:600;color:#111">${fmt(l.sousTotalLigne)} F</span>
        </div>
      </div>`).join('');
    const adresse = commande.livraisonTexte
      ? `<div style="margin-bottom:6px"><div style="font-weight:bold">Adresse&nbsp;:</div><div>${esc(commande.livraisonTexte)}</div></div><hr class="sep"/>`
      : '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Bon livraison</title>
<style>
  @page { size: 58mm auto; margin: 3mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Courier New', monospace; font-size: 11px; width: 52mm; }
  .c { text-align: center; } .b { font-weight: bold; }
  .sep { border: none; border-top: 1px dashed #aaa; margin: 5px 0; }
  .row { display: flex; justify-content: space-between; }
</style></head><body>
<div class="c b" style="font-size:14px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Bon de livraison</div>
<hr class="sep"/>
<div class="c" style="margin-bottom:6px">
  ${commande.numeroCommande ? `<div class="b">N° ${esc(commande.numeroCommande)}</div>` : ''}
  <div>${date}</div>
  <div style="font-weight:600;margin-top:2px">${esc(commande.clientWhatsApp)}</div>
</div>
<hr class="sep"/>
${adresse}
<div style="margin-bottom:6px">${lignesHTML}</div>
<hr class="sep"/>
<div class="row b" style="font-size:13px"><span>TOTAL</span><span>${fmt(commande.total)} F</span></div>
<hr class="sep"/>
<div class="c" style="color:#666;margin-top:4px">Bonne livraison !</div>
</body></html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-5 py-4 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Bon de livraison</h3>
              {commande.numeroCommande && (
                <p className="text-xs text-gray-500">N° {commande.numeroCommande}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <Smartphone className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{commande.clientWhatsApp}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>

        {(commande.livraisonTexte || mapsUrl) && (
          <div className="flex items-start gap-2 px-5 py-3 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              {commande.livraisonTexte && (
                <p className="text-sm text-gray-700">{commande.livraisonTexte}</p>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5">
                  Ouvrir dans Maps <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="px-5 py-3 space-y-2.5 max-h-44 overflow-y-auto border-b border-gray-100">
          {lignes.map(l => (
            <div key={l.id} className="flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{l.nomArticle}</p>
                <p className="text-xs text-gray-500">{l.quantite} × {fmt(l.prixUnitaire)} F</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 shrink-0">{fmt(l.sousTotalLigne)} F</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total commande</span>
          <span className="text-xl font-bold text-gray-900">{commande.total.toLocaleString('fr-FR')} F</span>
        </div>

        <div className="flex gap-3 px-5 py-4">
          <button onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSBonLivraison;
