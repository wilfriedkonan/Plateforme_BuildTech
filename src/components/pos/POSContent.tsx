import React, { useState, useEffect } from 'react';
import { Plus, Clock } from 'lucide-react';
import { usePOS } from '../../hooks/usePOS';
import { usePosFactures } from '../../hooks/usePosFactures';
import { PosFacture } from '../../services/posService';
import { LigneCommande, ProduitPOS } from '../lib/mock/pos';
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
  const { facturesEnAttente, loading: loadingAttentes, fetchFacturesEnAttente } = usePosFactures();
  const [showMettreEnAttente, setShowMettreEnAttente] = useState(false);
  const [showAjouterClient, setShowAjouterClient] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  useEffect(() => {
    fetchFacturesEnAttente();
  }, [fetchFacturesEnAttente]);

  const handleReprendreFacture = (facture: PosFacture) => {
    if (pos.panier.length > 0) {
      if (!window.confirm('Mettre le panier actuel de côté et reprendre cette commande ?')) return;
      pos.viderPanier();
    }
    const lignes: LigneCommande[] = (facture.details || []).map(detail => {
      const produitTrouve = pos.produits.find(p => p.id === detail.idArticle);
      const produit: ProduitPOS = produitTrouve ?? {
        id: detail.idArticle || '',
        nom: detail.designation || 'Article',
        prix: detail.prixVente ?? detail.prixUnitaireHT ?? 0,
        categorie: 'Autre',
        emoji: '🍽️',
        tva: detail.tauxTVA ?? detail.tva ?? 0,
        disponible: true,
        stock: 0,
      };
      return {
        produit,
        quantite: detail.quantité ?? detail.quantite ?? 1,
        prixUnitaire: detail.prixVente ?? detail.prixUnitaireTTC ?? produit.prix,
        remise: detail.valeurRemise ?? detail.remise ?? 0,
      };
    });
    pos.chargerPanier(lignes, facture.id);
    pos.setShowAttentes(false);
  };

  const handleAnnulerAttenteAPI = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande en attente ?')) {
      fetchFacturesEnAttente();
    }
  };

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
            onClick={() => { pos.setShowAttentes(true); fetchFacturesEnAttente(); }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all duration-200 font-medium relative"
          >
            <Clock className="w-4 h-4" />
            <span>En attente</span>
            {facturesEnAttente.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {facturesEnAttente.length}
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
              categories={pos.categories}
              loading={pos.loadingProduits}
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
        <POSStats key={statsRefreshKey} />
      </div>

      {pos.showEncaissement && (
        <POSEncaissement
          total={pos.totaux.total}
          factureId={pos.factureId}
          remiseGlobale={pos.remiseGlobale}
          panier={pos.panier}
          clientId={pos.clientSelectionne?.id ?? null}
          onConfirmer={pos.confirmerEncaissement}
          onVidePanier={pos.viderPanier}
          onFermer={() => pos.setShowEncaissement(false)}
          onNouvelleVente={handleNouvelleVente}
          onPaymentSuccess={() => setStatsRefreshKey(k => k + 1)}
        />
      )}

      {pos.showAttentes && (
        <POSAttentes
          attentes={facturesEnAttente}
          loading={loadingAttentes}
          onReprendre={handleReprendreFacture}
          onAnnuler={handleAnnulerAttenteAPI}
          onFermer={() => pos.setShowAttentes(false)}
          onRefresh={fetchFacturesEnAttente}
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
          panier={pos.panier}
          factureId={pos.factureId}
          clientId={pos.clientSelectionne?.id ?? null}
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
