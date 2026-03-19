export interface Client {
  id: string;
  code: string;
  nom: string;
  telephone: string;
  type: 'Particulier' | 'Entreprise';
  statut: 'actif' | 'inactif';
  createdAt: string;
  lastOrderDate: string;
}

export const mockClients: Client[] = [
  {
    id: "1",
    code: "CL250010",
    nom: "Arthure Kouassi",
    telephone: "02 03 06 04 08",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-10",
    lastOrderDate: "2025-01-10"
  },
  {
    id: "2",
    code: "CL250003",
    nom: "Brovou Yannick",
    telephone: "085642125",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-03",
    lastOrderDate: "2025-01-03"
  },
  {
    id: "3",
    code: "CL250009",
    nom: "Eric Seri",
    telephone: "02 03 06 04 02",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-09",
    lastOrderDate: "2025-01-09"
  },
  {
    id: "4",
    code: "CL250007",
    nom: "Franck Fedon",
    telephone: "03 03 02 02 05",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-07",
    lastOrderDate: "2025-01-07"
  },
  {
    id: "5",
    code: "CL250006",
    nom: "Jocelyn Kouabo",
    telephone: "02 03 65 98 55",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-06",
    lastOrderDate: "2025-01-06"
  },
  {
    id: "6",
    code: "CL250005",
    nom: "Landry Sekongo",
    telephone: "0102030101",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-05",
    lastOrderDate: "2025-01-05"
  },
  {
    id: "7",
    code: "CL250008",
    nom: "Patrick Beugre",
    telephone: "03 01 05 08 09",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-08",
    lastOrderDate: "2025-01-08"
  },
  {
    id: "8",
    code: "CL250011",
    nom: "Serge Koffi",
    telephone: "02 03 03 60 20",
    type: "Particulier",
    statut: "actif",
    createdAt: "2025-01-11",
    lastOrderDate: "2025-01-11"
  },
  {
    id: "9",
    code: "CL250002",
    nom: "Marie Coulibaly",
    telephone: "07 08 09 10 11",
    type: "Entreprise",
    statut: "inactif",
    createdAt: "2025-01-02",
    lastOrderDate: "2025-01-02"
  }
];
