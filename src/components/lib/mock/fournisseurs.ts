export interface Fournisseur {
  id: string;
  code: string;
  nom: string;
  contact: string;
  specialite: string;
  statut: 'actif' | 'inactif';
}

export const mockFournisseurs: Fournisseur[] = [
  {
    id: "1",
    code: "FR250001",
    nom: "Société AGRO-CI",
    contact: "20 21 22 23 24",
    specialite: "Alimentaire",
    statut: "actif"
  },
  {
    id: "2",
    code: "FR250002",
    nom: "BTP Services SARL",
    contact: "05 06 07 08 09",
    specialite: "Matériaux",
    statut: "actif"
  },
  {
    id: "3",
    code: "FR250003",
    nom: "Tech Solutions CI",
    contact: "07 77 88 99 00",
    specialite: "Informatique",
    statut: "actif"
  },
  {
    id: "4",
    code: "FR250004",
    nom: "Transport Express",
    contact: "01 02 03 04 05",
    specialite: "Logistique",
    statut: "inactif"
  },
  {
    id: "5",
    code: "FR250005",
    nom: "Papeterie Centrale",
    contact: "22 33 44 55 66",
    specialite: "Fournitures",
    statut: "actif"
  }
];
