export interface Table {
  id: string;
  code: string;
  nom: string;
  capacite: number;
  zone: string;
  statut: 'disponible' | 'occupee' | 'reservee';
}

export const mockTables: Table[] = [
  {
    id: "1",
    code: "TBL001",
    nom: "Table 1",
    capacite: 4,
    zone: "Salle principale",
    statut: "disponible"
  },
  {
    id: "2",
    code: "TBL002",
    nom: "Table 2",
    capacite: 2,
    zone: "Terrasse",
    statut: "occupee"
  },
  {
    id: "3",
    code: "TBL003",
    nom: "Table VIP",
    capacite: 8,
    zone: "Salon privé",
    statut: "reservee"
  },
  {
    id: "4",
    code: "TBL004",
    nom: "Table 4",
    capacite: 4,
    zone: "Salle principale",
    statut: "disponible"
  },
  {
    id: "5",
    code: "TBL005",
    nom: "Table 5",
    capacite: 6,
    zone: "Terrasse",
    statut: "disponible"
  },
  {
    id: "6",
    code: "TBL006",
    nom: "Table Bar",
    capacite: 3,
    zone: "Bar",
    statut: "occupee"
  }
];
