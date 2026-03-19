export interface MouvementStock {
  id: string;
  date: string;
  articleId: string;
  type: 'entree' | 'sortie' | 'ajustement' | 'retour';
  quantite: number;
  stockAvant: number;
  stockApres: number;
  motif: string;
  operateur: string;
  reference?: string;
}

export const mockMouvementsStock: MouvementStock[] = [
  {
    id: "1",
    date: "2025-01-10",
    articleId: "1",
    type: "entree",
    quantite: 100,
    stockAvant: 50,
    stockApres: 150,
    motif: "Réception commande",
    operateur: "Willy",
    reference: "CMD-2025-001"
  },
  {
    id: "2",
    date: "2025-01-12",
    articleId: "3",
    type: "sortie",
    quantite: 20,
    stockAvant: 20,
    stockApres: 0,
    motif: "Vente",
    operateur: "Willy",
    reference: "VTE-2025-045"
  },
  {
    id: "3",
    date: "2025-01-15",
    articleId: "2",
    type: "entree",
    quantite: 10,
    stockAvant: 0,
    stockApres: 10,
    motif: "Réception fournisseur",
    operateur: "Willy",
    reference: "FR250002"
  },
  {
    id: "4",
    date: "2025-01-18",
    articleId: "4",
    type: "ajustement",
    quantite: -5,
    stockAvant: 85,
    stockApres: 80,
    motif: "Correction inventaire",
    operateur: "Willy"
  },
  {
    id: "5",
    date: "2025-01-20",
    articleId: "1",
    type: "sortie",
    quantite: 30,
    stockAvant: 150,
    stockApres: 120,
    motif: "Vente chantier",
    operateur: "Willy",
    reference: "VTE-2025-052"
  },
  {
    id: "6",
    date: "2025-01-22",
    articleId: "5",
    type: "retour",
    quantite: 5,
    stockAvant: 30,
    stockApres: 35,
    motif: "Retour client",
    operateur: "Willy",
    reference: "RET-2025-008"
  }
];
