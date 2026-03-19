export interface CampagneWhatsApp {
  id: string;
  code: string;
  nom: string;
  description?: string;
  segment: ('tous' | 'a_risque' | 'inactifs' | 'nouveaux' | 'vip')[];
  nbDestinataires: number;
  envoyes: number;
  dateEnvoi: string | null;
  statut: 'brouillon' | 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  messageId?: string;
  rapport: {
    delivres: number;
    lus: number;
    reponses: number;
    echecs: number;
  } | null;
}

export const mockCampagnes: CampagneWhatsApp[] = [
  {
    id: "1",
    code: "CPG001",
    nom: "Promo Janvier 2025",
    description: "Lancement des soldes d'hiver",
    segment: ["tous"],
    nbDestinataires: 11,
    envoyes: 11,
    dateEnvoi: "2025-01-15 09:00",
    statut: "terminee",
    messageId: "1",
    rapport: {
      delivres: 10,
      lus: 8,
      reponses: 3,
      echecs: 1
    }
  },
  {
    id: "2",
    code: "CPG002",
    nom: "Relance clients inactifs",
    description: "Réactivation des clients sans achat depuis 3 mois",
    segment: ["inactifs"],
    nbDestinataires: 1,
    envoyes: 0,
    dateEnvoi: "2025-02-01 10:00",
    statut: "planifiee",
    messageId: "2",
    rapport: null
  },
  {
    id: "3",
    code: "CPG003",
    nom: "Offre Saint-Valentin",
    description: "Promotion spéciale pour la Saint-Valentin",
    segment: ["tous", "vip"],
    nbDestinataires: 11,
    envoyes: 0,
    dateEnvoi: null,
    statut: "brouillon",
    messageId: "1",
    rapport: null
  },
  {
    id: "4",
    code: "CPG004",
    nom: "Bienvenue nouveaux clients",
    description: "Message d'accueil pour les nouveaux clients",
    segment: ["nouveaux"],
    nbDestinataires: 3,
    envoyes: 3,
    dateEnvoi: "2025-01-20 14:00",
    statut: "terminee",
    messageId: "4",
    rapport: {
      delivres: 3,
      lus: 3,
      reponses: 1,
      echecs: 0
    }
  }
];
