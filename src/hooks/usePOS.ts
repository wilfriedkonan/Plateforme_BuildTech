import { useState, useMemo, useEffect } from 'react';
import { useArticles } from './useArticles';
import { Article } from '../services/articleService';
import { PaymentType } from '../services/posService';
import {
  ProduitPOS,
  LigneCommande,
  CommandeEnAttente,
  TransactionPOS,
  ModePaiement,
  mockCommandesAttente,
  mockTransactions,
  calculerTotaux
} from '../components/lib/mock/pos';
import { Client, mockClients } from '../components/lib/mock/clients';

function articleToProduit(article: Article): ProduitPOS {
  return {
    id: article.id || '',
    nom: article.designation || '',
    prix: article.estPromo && article.prixPromo ? article.prixPromo : article.prixVente || 0,
    categorie: article.nomCategorie || 'Autre',
    emoji: '🍽️',
    imageURL: article.imageURL,
    stock: article.stockActuel ?? article.stock ?? 0,
    codeBarre: article.codeBarre ?? undefined,
    tva: article.tauxTva || 0,
    disponible: article.statut !== false && article.etat !== 'inactif',
  };
}

export function usePOS() {
  const { articles, loading: loadingProduits, fetchArticles } = useArticles();
  const [panier, setPanier] = useState<LigneCommande[]>([]);
  const [attentes, setAttentes] = useState<CommandeEnAttente[]>(mockCommandesAttente);
  const [transactions, setTransactions] = useState<TransactionPOS[]>(mockTransactions);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [clientSelectionne, setClientSelectionne] = useState<Client | null>(null);
  const [filtreCategorie, setFiltreCategorie] = useState<string>('Tous');
  const [recherche, setRecherche] = useState('');
  const [remiseGlobale, setRemiseGlobale] = useState(0);
  const [showEncaissement, setShowEncaissement] = useState(false);
  const [showAttentes, setShowAttentes] = useState(false);
  const [ligneRemiseActive, setLigneRemiseActive] = useState<string | null>(null);
  const [factureId, setFactureId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const produits = useMemo(() => articles.map(articleToProduit), [articles]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    produits.forEach(p => { if (p.categorie) cats.add(p.categorie); });
    return ['Tous', ...Array.from(cats)];
  }, [produits]);

  const ajouterAuPanier = (produit: ProduitPOS) => {
    setPanier(prev => {
      const existe = prev.find(l => l.produit.id === produit.id);
      if (existe) {
        return prev.map(l =>
          l.produit.id === produit.id ? { ...l, quantite: l.quantite + 1 } : l
        );
      }
      return [...prev, { produit, quantite: 1, prixUnitaire: produit.prix, remise: 0 }];
    });
  };

  const modifierQuantite = (id: string, delta: number) => {
    setPanier(prev => {
      const ligne = prev.find(l => l.produit.id === id);
      if (!ligne) return prev;
      const nouvelleQuantite = ligne.quantite + delta;
      if (nouvelleQuantite <= 0) return prev.filter(l => l.produit.id !== id);
      return prev.map(l => l.produit.id === id ? { ...l, quantite: nouvelleQuantite } : l);
    });
  };

  const setQuantite = (id: string, quantite: number) => {
    if (quantite <= 0) {
      setPanier(prev => prev.filter(l => l.produit.id !== id));
      return;
    }
    setPanier(prev => prev.map(l => l.produit.id === id ? { ...l, quantite } : l));
  };

  const supprimerLigne = (id: string) => {
    setPanier(prev => prev.filter(l => l.produit.id !== id));
  };

  const viderPanier = () => {
    setPanier([]);
    setRemiseGlobale(0);
    setClientSelectionne(null);
    setFactureId(null);
  };

  const chargerPanier = (lignes: LigneCommande[], id?: string | null) => {
    setPanier(lignes);
    if (id !== undefined) setFactureId(id ?? null);
  };

  const ajouterClient = (client: Omit<Client, 'id' | 'code' | 'createdAt'>) => {
    const nouveauClient: Client = {
      ...client,
      id: `${Date.now()}`,
      code: `CL${String(clients.length + 250012).padStart(6, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [...prev, nouveauClient]);
    setClientSelectionne(nouveauClient);
    return nouveauClient;
  };

  const appliquerRemiseLigne = (id: string, remise: number) => {
    setPanier(prev =>
      prev.map(l => l.produit.id === id ? { ...l, remise: Math.max(0, Math.min(100, remise)) } : l)
    );
    setLigneRemiseActive(null);
  };

  const mettreEnAttente = (nom: string) => {
    if (panier.length === 0) return;
    const nouvelleAttente: CommandeEnAttente = {
      id: `att${Date.now()}`,
      nom,
      createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lignes: [...panier]
    };
    setAttentes(prev => [...prev, nouvelleAttente]);
    viderPanier();
  };

  const reprendreAttente = (id: string) => {
    const attente = attentes.find(a => a.id === id);
    if (!attente) return;
    if (panier.length > 0) {
      if (window.confirm('Mettre le panier actuel en attente avant de reprendre cette commande ?')) {
        mettreEnAttente('Commande précédente');
      } else {
        return;
      }
    }
    setPanier(attente.lignes);
    setAttentes(prev => prev.filter(a => a.id !== id));
    setShowAttentes(false);
  };

  const annulerAttente = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande en attente ?')) {
      setAttentes(prev => prev.filter(a => a.id !== id));
    }
  };

  const confirmerEncaissement = (
    typePaiement: PaymentType,
    montantRecu?: number,
    reference?: string
  ) => {
    if (panier.length === 0) return;
    const totaux = calculerTotaux(panier, remiseGlobale);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0] + ' ' +
      now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const numeroVente = `VTE-${String(transactions.length + 250001).padStart(6, '0')}`;
    const nouvelleTransaction: TransactionPOS = {
      id: `t${Date.now()}`,
      numero: numeroVente,
      date: dateStr,
      lignes: [...panier],
      sousTotal: totaux.sousTotal,
      montantTVA: totaux.montantTVA,
      remiseGlobale,
      total: totaux.total,
      modePaiement: (typePaiement.refe || typePaiement.libelle || 'autre') as ModePaiement,
      montantRecu,
      monnaieRendue: montantRecu ? montantRecu - totaux.total : undefined,
      statut: 'completee',
      caissier: 'Admin',
      clientId: clientSelectionne?.id,
      clientNom: clientSelectionne?.nom
    };
    setTransactions(prev => [...prev, nouvelleTransaction]);
    return nouvelleTransaction;
  };

  const scannerCodeBarre = () => {
    const codesDisponibles = produits.filter(p => p.disponible && p.codeBarre).map(p => p.codeBarre);
    if (codesDisponibles.length === 0) return;
    const codeAleatoire = codesDisponibles[Math.floor(Math.random() * codesDisponibles.length)];
    const produit = produits.find(p => p.codeBarre === codeAleatoire);
    if (produit) { ajouterAuPanier(produit); return produit; }
  };

  const produitsFiltres = useMemo(() => {
    return produits.filter(p => {
      const matchCat = filtreCategorie === 'Tous' || p.categorie === filtreCategorie;
      const matchSearch =
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.codeBarre?.toLowerCase().includes(recherche.toLowerCase());
      return matchCat && matchSearch && p.disponible;
    });
  }, [produits, filtreCategorie, recherche]);

  const totaux = useMemo(() => calculerTotaux(panier, remiseGlobale), [panier, remiseGlobale]);

  const panierCount = useMemo(() => panier.reduce((s, l) => s + l.quantite, 0), [panier]);

  const statsAujourdhui = useMemo(() => {
    const aujourdhui = new Date().toISOString().split('T')[0];
    const ventesJour = transactions.filter(t => t.statut === 'completee' && t.date.startsWith(aujourdhui));
    const nombreVentes = ventesJour.length;
    const ca = ventesJour.reduce((sum, t) => sum + t.total, 0);
    const panierMoyen = nombreVentes > 0 ? ca / nombreVentes : 0;
    return { nombreVentes, ca, panierMoyen };
  }, [transactions]);

  return {
    produits,
    produitsFiltres,
    categories,
    loadingProduits,
    panier,
    attentes,
    transactions,
    clients,
    clientSelectionne,
    setClientSelectionne,
    ajouterClient,
    filtreCategorie,
    setFiltreCategorie,
    recherche,
    setRecherche,
    remiseGlobale,
    setRemiseGlobale,
    totaux,
    panierCount,
    showEncaissement,
    setShowEncaissement,
    showAttentes,
    setShowAttentes,
    ligneRemiseActive,
    setLigneRemiseActive,
    ajouterAuPanier,
    modifierQuantite,
    setQuantite,
    supprimerLigne,
    viderPanier,
    chargerPanier,
    appliquerRemiseLigne,
    mettreEnAttente,
    reprendreAttente,
    annulerAttente,
    confirmerEncaissement,
    scannerCodeBarre,
    statsAujourdhui,
    factureId,
    setFactureId
  };
}
