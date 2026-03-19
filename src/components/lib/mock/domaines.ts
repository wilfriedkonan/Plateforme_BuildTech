export interface Domaine {
  id: string;
  code: string;
  nom: string;
  description: string;
  actif: boolean;
  logo?: string;
}

export const mockDomaines: Domaine[] = [
  {
    id: "1",
    code: "DOM001",
    nom: "Restauration",
    description: "Gestion restaurant et café",
    actif: true
  },
  {
    id: "2",
    code: "DOM002",
    nom: "Commerce",
    description: "Vente de marchandises",
    actif: false
  },
  {
    id: "3",
    code: "DOM003",
    nom: "BTP",
    description: "Bâtiment et travaux publics",
    actif: false
  },
  {
    id: "4",
    code: "DOM004",
    nom: "Services",
    description: "Prestations de services",
    actif: false
  }
];
