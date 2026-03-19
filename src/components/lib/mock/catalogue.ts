export interface Categorie {
  id: string;
  nom: string;
  couleur: string;
  visibleDansCatalogue?: boolean;
}

export interface Article {
  id: string;
  nom: string;
  description: string;
  prix: number;
  unite: string;
  categorieId: string;
  disponible: boolean;
  visibleDansCatalogue?: boolean;
  image: string | null;
}

export const mockCategories: Categorie[] = [
  { id: "1", nom: "Entrées", couleur: "#F59E0B", visibleDansCatalogue: true },
  { id: "2", nom: "Plats principaux", couleur: "#3B82F6", visibleDansCatalogue: true },
  { id: "3", nom: "Desserts", couleur: "#EC4899", visibleDansCatalogue: true },
  { id: "4", nom: "Boissons", couleur: "#10B981", visibleDansCatalogue: true },
];

export const mockArticles: Article[] = [
  {
    id: "1",
    nom: "Salade César",
    description: "Salade fraîche, croûtons, parmesan",
    prix: 8500,
    unite: "portion",
    categorieId: "1",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
  {
    id: "2",
    nom: "Poulet Yassa",
    description: "Poulet mariné aux oignons et citron",
    prix: 15000,
    unite: "portion",
    categorieId: "2",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
  {
    id: "3",
    nom: "Thiéboudienne",
    description: "Riz au poisson à la sénégalaise",
    prix: 18000,
    unite: "portion",
    categorieId: "2",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
  {
    id: "4",
    nom: "Fondant au chocolat",
    description: "Servi tiède avec glace vanille",
    prix: 6000,
    unite: "portion",
    categorieId: "3",
    disponible: false,
    visibleDansCatalogue: false,
    image: null
  },
  {
    id: "5",
    nom: "Jus de bissap",
    description: "Jus d'hibiscus naturel",
    prix: 2500,
    unite: "verre",
    categorieId: "4",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
  {
    id: "6",
    nom: "Soupe du jour",
    description: "Soupe maison selon arrivage",
    prix: 4500,
    unite: "bol",
    categorieId: "1",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
  {
    id: "7",
    nom: "Mafé de bœuf",
    description: "Ragoût de bœuf à la sauce d'arachide",
    prix: 16000,
    unite: "portion",
    categorieId: "2",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
  {
    id: "8",
    nom: "Tarte citron meringuée",
    description: "Pâte sablée, crème citron, meringue",
    prix: 5500,
    unite: "part",
    categorieId: "3",
    disponible: true,
    visibleDansCatalogue: true,
    image: null
  },
];
