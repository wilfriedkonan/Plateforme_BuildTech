export interface Article {
  id: string;
  code: string;
  nom: string;
  categorieId: string;
  prixHT: number;
  tva: number;
  prixTTC: number;
  unite: string;
  stock: number;
  seuilAlerte: number;
  statut: 'actif' | 'inactif';
  description?: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    code: "ART001",
    nom: "Ciment Portland 50kg",
    categorieId: "1",
    prixHT: 12000,
    tva: 18,
    prixTTC: 14160,
    unite: "sac",
    stock: 150,
    seuilAlerte: 20,
    statut: "actif",
    description: "Ciment de haute qualité pour construction"
  },
  {
    id: "2",
    code: "ART002",
    nom: "Fer à béton 12mm",
    categorieId: "1",
    prixHT: 8500,
    tva: 18,
    prixTTC: 10030,
    unite: "barre",
    stock: 5,
    seuilAlerte: 10,
    statut: "actif",
    description: "Fer à béton standard 12mm"
  },
  {
    id: "3",
    code: "ART003",
    nom: "Stylo Bille Bleu",
    categorieId: "2",
    prixHT: 500,
    tva: 0,
    prixTTC: 500,
    unite: "pièce",
    stock: 0,
    seuilAlerte: 50,
    statut: "actif",
    description: "Stylo bille encre bleue"
  },
  {
    id: "4",
    code: "ART004",
    nom: "Ramette A4 80g",
    categorieId: "2",
    prixHT: 3500,
    tva: 18,
    prixTTC: 4130,
    unite: "ramette",
    stock: 80,
    seuilAlerte: 15,
    statut: "actif",
    description: "Ramette 500 feuilles A4 80g"
  },
  {
    id: "5",
    code: "ART005",
    nom: "Huile de palme 5L",
    categorieId: "3",
    prixHT: 6000,
    tva: 10,
    prixTTC: 6600,
    unite: "bidon",
    stock: 30,
    seuilAlerte: 10,
    statut: "inactif",
    description: "Huile de palme naturelle 5L"
  }
];
