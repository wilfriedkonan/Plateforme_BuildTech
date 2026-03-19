export interface TarifLivraison {
  id: string;
  code: string;
  zone: string;
  distanceMax: number;
  tarifBase: number;
  tarifParKm: number;
  statut: 'actif' | 'inactif';
}

export const mockTarifsLivraison: TarifLivraison[] = [
  {
    id: "1",
    code: "TRF001",
    zone: "Plateau / Cocody",
    distanceMax: 10,
    tarifBase: 1500,
    tarifParKm: 300,
    statut: "actif"
  },
  {
    id: "2",
    code: "TRF002",
    zone: "Yopougon",
    distanceMax: 15,
    tarifBase: 2000,
    tarifParKm: 350,
    statut: "actif"
  },
  {
    id: "3",
    code: "TRF003",
    zone: "Abobo / Adjamé",
    distanceMax: 20,
    tarifBase: 2500,
    tarifParKm: 400,
    statut: "actif"
  },
  {
    id: "4",
    code: "TRF004",
    zone: "Bingerville / Bassam",
    distanceMax: 40,
    tarifBase: 5000,
    tarifParKm: 500,
    statut: "inactif"
  },
  {
    id: "5",
    code: "TRF005",
    zone: "Marcory / Treichville",
    distanceMax: 12,
    tarifBase: 1800,
    tarifParKm: 320,
    statut: "actif"
  }
];
