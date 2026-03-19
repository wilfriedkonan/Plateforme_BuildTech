export interface Livreur {
  id: string;
  code: string;
  nom: string;
  telephone: string;
  zone: string;
  vehicule: 'Moto' | 'Vélo' | 'Voiture';
  statut: 'disponible' | 'en_livraison' | 'inactif';
}

export const mockLivreurs: Livreur[] = [
  {
    id: "1",
    code: "LIV001",
    nom: "Konan Serge",
    telephone: "07 01 02 03 04",
    zone: "Plateau / Cocody",
    vehicule: "Moto",
    statut: "disponible"
  },
  {
    id: "2",
    code: "LIV002",
    nom: "Diallo Moussa",
    telephone: "05 06 07 08 09",
    zone: "Yopougon",
    vehicule: "Moto",
    statut: "en_livraison"
  },
  {
    id: "3",
    code: "LIV003",
    nom: "Bamba Issouf",
    telephone: "01 02 03 04 05",
    zone: "Abobo / Adjamé",
    vehicule: "Vélo",
    statut: "inactif"
  },
  {
    id: "4",
    code: "LIV004",
    nom: "Kouadio Patrick",
    telephone: "07 08 09 10 11",
    zone: "Marcory / Treichville",
    vehicule: "Moto",
    statut: "disponible"
  },
  {
    id: "5",
    code: "LIV005",
    nom: "Traoré Ibrahim",
    telephone: "02 03 04 05 06",
    zone: "Plateau / Cocody",
    vehicule: "Voiture",
    statut: "disponible"
  }
];
