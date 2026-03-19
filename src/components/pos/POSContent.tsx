import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { usePOS } from '../../hooks/usePOS';
import POSCatalogue from './POSCatalogue';
import POSPanier from './POSPanier';
import POSEncaissement from './POSEncaissement';
import POSAttentes from './POSAttentes';
import POSRemiseLigne from './POSRemiseLigne';
import POSMettreEnAttente from './POSMettreEnAttente';
import POSAjouterClient from './POSAjouterClient';
import POSStats from './POSStats';

const POSContent: React.FC = () => {
  const pos = usePOS();
  const [showMettreEnAttente, setShowMettreEnAttente] = useState(false);
  const [showAjouterClient, setShowAjouterClient] = useState(false);

  const handleScannerProduit = () => {
    const produit = pos.scannerCodeBarre();
    if (produit) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 z-[80] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-in slide-in-from-right duration-200';
      notification.textContent = `✓ ${produit.nom} ajouté au panier`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('animate-out', 'slide-out-to-right');
        setTimeout(() => notification.remove(), 200);
      }, 2000);
    }
  };

  const handleMettreEnAttente = () => {
    if (pos.panier.length === 0) {
      alert('Le panier est vide');
      return;
    }
    setShowMettreEnAttente(true);
  };

  const handleConfirmerMettreEnAttente = (nom: string) => {
    pos.mettreEnAttente(nom);
    setShowMettreEnAttente(false);
  };

  const handleNouvelleVente = () => {
    pos.viderPanier();
    pos.setShowEncaissement(false);
  };

  const ligneRemise = pos.panier.find(l => l.produit.id === pos.ligneRemiseActive);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleNouvelleVente}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle vente</span>
          </button>

          <button
            onClick={() => pos.setShowAttentes(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all duration-200 font-medium relative"
          >
            <Clock className="w-4 h-4" />
            <span>En attente</span>
            {pos.attentes.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {pos.attentes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 h-full overflow-hidden">
            <POSCatalogue
              produits={pos.produitsFiltres}
              recherche={pos.recherche}
              setRecherche={pos.setRecherche}
              filtreCategorie={pos.filtreCategorie}
              setFiltreCategorie={pos.setFiltreCategorie}
              onAjouterProduit={pos.ajouterAuPanier}
              onScanner={handleScannerProduit}
            />
          </div>

          <div className="h-full overflow-hidden">
            <POSPanier
              panier={pos.panier}
              panierCount={pos.panierCount}
              totaux={pos.totaux}
              remiseGlobale={pos.remiseGlobale}
              setRemiseGlobale={pos.setRemiseGlobale}
              clients={pos.clients}
              clientSelectionne={pos.clientSelectionne}
              onSelectionnerClient={pos.setClientSelectionne}
              onAjouterClient={() => setShowAjouterClient(true)}
              onModifierQuantite={pos.modifierQuantite}
              onSetQuantite={pos.setQuantite}
              onSupprimer={pos.supprimerLigne}
              onVider={pos.viderPanier}
              onEncaisser={() => pos.setShowEncaissement(true)}
              onMettreEnAttente={handleMettreEnAttente}
              onClickLigneRemise={pos.setLigneRemiseActive}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <POSStats stats={pos.statsAujourdhui} />
      </div>

      {pos.showEncaissement && pos.panier.length > 0 && (
        <POSEncaissement
          total={pos.totaux.total}
          onConfirmer={pos.confirmerEncaissement}
          onFermer={() => pos.setShowEncaissement(false)}
          onNouvelleVente={handleNouvelleVente}
        />
      )}

      {pos.showAttentes && (
        <POSAttentes
          attentes={pos.attentes}
          onReprendre={pos.reprendreAttente}
          onAnnuler={pos.annulerAttente}
          onFermer={() => pos.setShowAttentes(false)}
        />
      )}

      {ligneRemise && pos.ligneRemiseActive && (
        <POSRemiseLigne
          ligne={ligneRemise}
          onAppliquer={pos.appliquerRemiseLigne}
          onFermer={() => pos.setLigneRemiseActive(null)}
        />
      )}

      {showMettreEnAttente && (
        <POSMettreEnAttente
          onConfirmer={handleConfirmerMettreEnAttente}
          onFermer={() => setShowMettreEnAttente(false)}
        />
      )}

      {showAjouterClient && (
        <POSAjouterClient
          onAjouter={(client) => {
            pos.ajouterClient(client);
            setShowAjouterClient(false);
          }}
          onFermer={() => setShowAjouterClient(false)}
        />
      )}
    </div>
  );
};

export default POSContent;
