export type CategoriePOS = string;

export interface ProduitPOS {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  emoji: string;
  imageURL?: string;
  stock: number;
  codeBarre?: string;
  tva: number;
  disponible: boolean;
}

export interface LigneCommande {
  produit: ProduitPOS;
  quantite: number;
  prixUnitaire: number;
  remise: number;
}

export interface CommandeEnAttente {
  id: string;
  lignes: LigneCommande[];
  nom: string;
  createdAt: string;
}

export interface TransactionPOS {
  id: string;
  numero: string;
  date: string;
  lignes: LigneCommande[];
  sousTotal: number;
  montantTVA: number;
  remiseGlobale: number;
  total: number;
  modePaiement: ModePaiement;
  montantRecu?: number;
  monnaieRendue?: number;
  statut: "completee" | "annulee" | "attente";
  caissier: string;
  clientId?: string;
  clientNom?: string;
}

export type ModePaiement =
  | "especes" | "carte" | "mobile_money" | "cheque" | "virement";

export const mockProduits: ProduitPOS[] = [
  { id: "1", nom: "MacBook Pro", prix: 2499, categorie: "Électronique", emoji: "💻", stock: 8, codeBarre: "MAC001", tva: 20, disponible: true },
  { id: "2", nom: "iPhone 15", prix: 1299, categorie: "Électronique", emoji: "📱", stock: 15, codeBarre: "IPH001", tva: 20, disponible: true },
  { id: "3", nom: "AirPods Pro", prix: 279, categorie: "Électronique", emoji: "🎧", stock: 20, codeBarre: "AIR001", tva: 20, disponible: true },
  { id: "4", nom: "iPad Air", prix: 699, categorie: "Électronique", emoji: "📲", stock: 10, codeBarre: "IPD001", tva: 20, disponible: true },
  { id: "5", nom: "Apple Watch", prix: 449, categorie: "Électronique", emoji: "⌚", stock: 12, codeBarre: "AWH001", tva: 20, disponible: true },
  { id: "6", nom: "Magic Mouse", prix: 89, categorie: "Électronique", emoji: "🖱️", stock: 25, codeBarre: "MGM001", tva: 20, disponible: true },
  { id: "7", nom: "Café Expresso", prix: 2.5, categorie: "Alimentation", emoji: "☕", stock: 200, codeBarre: "CAF001", tva: 10, disponible: true },
  { id: "8", nom: "Sandwich Club", prix: 8.5, categorie: "Alimentation", emoji: "🥪", stock: 30, codeBarre: "SAN001", tva: 10, disponible: true },
  { id: "9", nom: "Salade César", prix: 12, categorie: "Alimentation", emoji: "🥗", stock: 20, codeBarre: "SAL001", tva: 10, disponible: true },
  { id: "10", nom: "Eau minérale", prix: 1.5, categorie: "Boissons", emoji: "💧", stock: 100, codeBarre: "EAU001", tva: 10, disponible: true },
  { id: "11", nom: "Jus d'orange", prix: 3.5, categorie: "Boissons", emoji: "🍊", stock: 50, codeBarre: "JUS001", tva: 10, disponible: true },
  { id: "12", nom: "Stylos Bille x5", prix: 4.5, categorie: "Fournitures", emoji: "✏️", stock: 80, codeBarre: "STY001", tva: 20, disponible: true },
  { id: "13", nom: "Ramette A4", prix: 7, categorie: "Fournitures", emoji: "📄", stock: 60, codeBarre: "RAM001", tva: 20, disponible: true },
  { id: "14", nom: "T-Shirt Premium", prix: 29, categorie: "Vêtements", emoji: "👕", stock: 40, codeBarre: "TSH001", tva: 20, disponible: true },
  { id: "15", nom: "Casquette Logo", prix: 19, categorie: "Vêtements", emoji: "🧢", stock: 35, codeBarre: "CAS001", tva: 20, disponible: false },
];

export const mockCommandesAttente: CommandeEnAttente[] = [
  {
    id: "att1",
    nom: "Table 3",
    createdAt: "14:22",
    lignes: [
      { produit: mockProduits[0], quantite: 1, prixUnitaire: 2499, remise: 0 },
      { produit: mockProduits[2], quantite: 2, prixUnitaire: 279, remise: 0 },
    ]
  },
  {
    id: "att2",
    nom: "Client Kouassi",
    createdAt: "14:45",
    lignes: [
      { produit: mockProduits[6], quantite: 2, prixUnitaire: 2.5, remise: 10 },
      { produit: mockProduits[9], quantite: 3, prixUnitaire: 1.5, remise: 0 },
    ]
  },
];

export const mockTransactions: TransactionPOS[] = [
  {
    id: "t1",
    numero: "VTE-250001",
    date: "2025-01-28 09:15",
    lignes: [
      { produit: mockProduits[1], quantite: 1, prixUnitaire: 1299, remise: 0 },
      { produit: mockProduits[2], quantite: 1, prixUnitaire: 279, remise: 0 }
    ],
    sousTotal: 1578,
    montantTVA: 315.6,
    remiseGlobale: 0,
    total: 1893.6,
    modePaiement: "carte",
    statut: "completee",
    caissier: "Willy"
  },
  {
    id: "t2",
    numero: "VTE-250002",
    date: "2025-01-28 10:30",
    lignes: [
      { produit: mockProduits[0], quantite: 1, prixUnitaire: 2499, remise: 5 }
    ],
    sousTotal: 2499,
    montantTVA: 499.8,
    remiseGlobale: 5,
    total: 2374.05,
    modePaiement: "especes",
    montantRecu: 2500,
    monnaieRendue: 125.95,
    statut: "completee",
    caissier: "Willy"
  },
  {
    id: "t3",
    numero: "VTE-250003",
    date: "2025-01-28 11:00",
    lignes: [
      { produit: mockProduits[6], quantite: 3, prixUnitaire: 2.5, remise: 0 },
      { produit: mockProduits[7], quantite: 2, prixUnitaire: 8.5, remise: 0 }
    ],
    sousTotal: 24.5,
    montantTVA: 2.45,
    remiseGlobale: 0,
    total: 26.95,
    modePaiement: "mobile_money",
    statut: "completee",
    caissier: "Marie"
  },
];

export function calculerLigne(ligne: LigneCommande): number {
  const base = ligne.prixUnitaire * ligne.quantite;
  return base * (1 - ligne.remise / 100);
}

export function calculerTotaux(lignes: LigneCommande[], remiseGlobale = 0) {
  const sousTotal = lignes.reduce((s, l) => s + calculerLigne(l), 0);
  const apresRemise = sousTotal * (1 - remiseGlobale / 100);
  const montantTVA = lignes.reduce((s, l) => {
    const base = calculerLigne(l) * (1 - remiseGlobale / 100);
    return s + (base * l.produit.tva) / (100 + l.produit.tva);
  }, 0);
  return { sousTotal, apresRemise, montantTVA, total: apresRemise };
}

export function formaterPrix(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(montant);
}
