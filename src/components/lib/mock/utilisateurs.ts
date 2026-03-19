export interface Utilisateur {
  id: string;
  code: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: 'admin' | 'manager' | 'caissier' | 'livreur';
  derniereConnexion: string;
  statut: 'actif' | 'suspendu';
}

export const mockUtilisateurs: Utilisateur[] = [
  {
    id: "1",
    code: "USR001",
    nom: "Willy",
    prenom: "Admin",
    email: "willy@cocoprojects.com",
    telephone: "07 01 02 03 04",
    role: "admin",
    derniereConnexion: "2025-01-28 14:30",
    statut: "actif"
  },
  {
    id: "2",
    code: "USR002",
    nom: "Kouassi",
    prenom: "Jean",
    email: "jean@cocoprojects.com",
    telephone: "05 06 07 08 09",
    role: "manager",
    derniereConnexion: "2025-01-27 09:15",
    statut: "actif"
  },
  {
    id: "3",
    code: "USR003",
    nom: "Yao",
    prenom: "Marie",
    email: "marie@cocoprojects.com",
    telephone: "01 02 03 04 05",
    role: "caissier",
    derniereConnexion: "2025-01-26 18:00",
    statut: "actif"
  },
  {
    id: "4",
    code: "USR004",
    nom: "Brou",
    prenom: "Paul",
    email: "paul@cocoprojects.com",
    telephone: "07 08 09 10 11",
    role: "livreur",
    derniereConnexion: "2025-01-20 12:00",
    statut: "suspendu"
  },
  {
    id: "5",
    code: "USR005",
    nom: "Diallo",
    prenom: "Fatou",
    email: "fatou@cocoprojects.com",
    telephone: "02 03 04 05 06",
    role: "caissier",
    derniereConnexion: "2025-01-28 08:45",
    statut: "actif"
  }
];
