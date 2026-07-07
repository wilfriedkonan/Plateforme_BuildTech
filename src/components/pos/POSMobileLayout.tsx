import React, { useState, useEffect, useRef } from 'react';
import { Plus, Clock, Package, ShoppingBag, TrendingUp } from 'lucide-react';
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

const POSMobileLayout: React.FC = () => {
  const pos = usePOS();
  const { facturesEnAttente, loading: loadingAttentes, fetchFacturesEnAttente } = usePosFactures();
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');
  const [showMettreEnAttente, setShowMettreEnAttente] = useState(false);
  const [showAjouterClient, setShowAjouterClient] = useState(false);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showStats) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (statsRef.current && !statsRef.current.contains(e.target as Node)) {
        setShowStats(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStats]);

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
        quantite: detail.quantite ?? 1,
        prixUnitaire: detail.prixVente ?? detail.prixUnitaireTTC ?? produit.prix,
        remise: detail.valeurRemise ?? detail.remise ?? 0,
      };
    });
    pos.chargerPanier(lignes, facture.id);
    pos.setShowAttentes(false);
  };

  const handleScannerProduit = () => {
    const produit = pos.scannerCodeBarre();
    if (produit) {
      const notification = document.createElement('div');
      notification.className =
        'fixed top-20 right-4 z-[80] bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm animate-in slide-in-from-right duration-200';
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
    fetchFacturesEnAttente();
  };

  const handleNouvelleVente = () => {
    pos.viderPanier();
    pos.setShowEncaissement(false);
    setActiveTab('products');
  };

  const ligneRemise = pos.panier.find(l => l.produit.id === pos.ligneRemiseActive);

  return (
    <div className="h-full flex flex-col bg-gray-50">

      {/* Barre d'actions */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between">
        <button
          onClick={handleNouvelleVente}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouvelle vente
        </button>
        <button
          onClick={() => { pos.setShowAttentes(true); fetchFacturesEnAttente(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium relative"
        >
          <Clock className="w-3.5 h-3.5" />
          En attente
          {facturesEnAttente.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
              {facturesEnAttente.length}
            </span>
          )}
        </button>
      </div>

      {/* Onglets */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Produits
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center justify-center gap-2 px-4 py-3 font-medium text-sm transition-all relative ${
              activeTab === 'cart'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Panier
            {pos.panierCount > 0 && (
              <span className="absolute top-1.5 right-6 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pos.panierCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-hidden">
        <div className={`h-full ${activeTab === 'products' ? 'block' : 'hidden'}`}>
          <POSCatalogue
            produits={pos.produitsFiltres}
            categories={pos.categories}
            loading={pos.loadingProduits}
            recherche={pos.recherche}
            setRecherche={pos.setRecherche}
            filtreCategorie={pos.filtreCategorie}
            setFiltreCategorie={pos.setFiltreCategorie}
            onAjouterProduit={(produit) => {
              pos.ajouterAuPanier(produit);
              setActiveTab('cart');
            }}
            onScanner={handleScannerProduit}
          />
        </div>

        <div className={`h-full ${activeTab === 'cart' ? 'block' : 'hidden'}`}>
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

      {/* Bouton flottant Stats */}
      <div ref={statsRef} className="fixed bottom-6 left-4 z-40 flex flex-col items-start gap-2">
        {showStats && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 w-72 animate-in slide-in-from-bottom-2 duration-200">
            <POSStats key={statsRefreshKey} />
          </div>
        )}
        <button
          onClick={() => setShowStats(v => !v)}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
            showStats
              ? 'bg-gray-900 text-white scale-110'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
        </button>
      </div>

      {/* Modales */}
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

      {/* {showAjouterClient && (
        <POSAjouterClient
          onAjouter={(client) => {
            pos.ajouterClient(client);
            setShowAjouterClient(false);
          }}
          onFermer={() => setShowAjouterClient(false)}
        />
      )} */}
    </div>
  );
};

export default POSMobileLayout;
