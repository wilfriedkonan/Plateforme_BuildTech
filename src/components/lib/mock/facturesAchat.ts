export interface FactureAchat {
  id: string;
  numero: string;
  date: string;
  fournisseurId: string;
  designation: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  statut: 'payee' | 'en_attente' | 'en_retard';
}

export const mockFacturesAchat: FactureAchat[] = [
  {
    id: "1",
    numero: "FA250001",
    date: "2025-01-05",
    fournisseurId: "1",
    designation: "Livraison marchandises Jan",
    montantHT: 450000,
    tva: 81000,
    montantTTC: 531000,
    statut: "payee"
  },
  {
    id: "2",
    numero: "FA250002",
    date: "2025-01-12",
    fournisseurId: "2",
    designation: "Matériaux construction",
    montantHT: 1200000,
    tva: 216000,
    montantTTC: 1416000,
    statut: "en_attente"
  },
  {
    id: "3",
    numero: "FA250003",
    date: "2025-01-18",
    fournisseurId: "3",
    designation: "Matériel informatique",
    montantHT: 850000,
    tva: 153000,
    montantTTC: 1003000,
    statut: "en_retard"
  },
  {
    id: "4",
    numero: "FA250004",
    date: "2025-01-22",
    fournisseurId: "1",
    designation: "Approvisionnement stock",
    montantHT: 320000,
    tva: 57600,
    montantTTC: 377600,
    statut: "payee"
  },
  {
    id: "5",
    numero: "FA250005",
    date: "2025-01-28",
    fournisseurId: "5",
    designation: "Fournitures bureau",
    montantHT: 95000,
    tva: 17100,
    montantTTC: 112100,
    statut: "en_attente"
  }
];
