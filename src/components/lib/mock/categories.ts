import { Categorie } from '../../../services/categorieService';

export const mockCategories: Categorie[] = [
  {
    id: "1",
    code: "CAT001",
    designation: "Matériaux BTP",
    couleur: "#F59E0B",
    idEntreprise: "ENT001",
    idDomaine: "DOM001",
    etat: "actif",
    ordre: 1,
    estRestaurant: false,
    estEmporte: false,
    statut: true
  },
  {
    id: "2",
    code: "CAT002",
    designation: "Fournitures Bureau",
    couleur: "#3B82F6",
    idEntreprise: "ENT001",
    idDomaine: "DOM001",
    etat: "actif",
    ordre: 2,
    estRestaurant: false,
    estEmporte: false,
    statut: true
  },
  {
    id: "3",
    code: "CAT003",
    designation: "Alimentation",
    couleur: "#10B981",
    idEntreprise: "ENT001",
    idDomaine: "DOM001",
    etat: "actif",
    ordre: 3,
    estRestaurant: false,
    estEmporte: false,
    statut: true
  },
  {
    id: "4",
    code: "CAT004",
    designation: "Informatique",
    couleur: "#8B5CF6",
    idEntreprise: "ENT001",
    idDomaine: "DOM001",
    etat: "actif",
    ordre: 4,
    estRestaurant: false,
    estEmporte: false,
    statut: true
  }
];
