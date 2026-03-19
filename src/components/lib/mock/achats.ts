export type StatutFournisseur = "actif" | "inactif"
export type StatutFacture = "payee" | "en_attente" | "en_retard" | "annulee"
export type SpecialiteFournisseur =
  | "Alimentaire"
  | "Matériaux"
  | "Informatique"
  | "Logistique"
  | "Fournitures"
  | "Services"
  | "Autre"

export interface Fournisseur {
  id: string
  code: string
  nom: string
  contact: string
  email?: string
  adresse?: string
  specialite: SpecialiteFournisseur
  statut: StatutFournisseur
  createdAt: string
  nbFactures?: number
  totalAchats?: number
}

export interface FactureAchat {
  id: string
  numero: string
  date: string
  dateEcheance?: string
  fournisseurId: string
  designation: string
  montantHT: number
  tva: number
  montantTTC: number
  statut: StatutFacture
  reference?: string
  notes?: string
  createdAt: string
}

export const mockFournisseurs: Fournisseur[] = [
  {
    id: "1", code: "FR250001", nom: "Société AGRO-CI",
    contact: "20 21 22 23 24", email: "agro@agro-ci.com",
    adresse: "Zone Industrielle de Vridi, Abidjan",
    specialite: "Alimentaire", statut: "actif",
    createdAt: "2025-01-05", nbFactures: 4, totalAchats: 1547600
  },
  {
    id: "2", code: "FR250002", nom: "BTP Services SARL",
    contact: "05 06 07 08 09", email: "contact@btp-services.ci",
    adresse: "Marcory, Abidjan",
    specialite: "Matériaux", statut: "actif",
    createdAt: "2025-01-08", nbFactures: 2, totalAchats: 2616000
  },
  {
    id: "3", code: "FR250003", nom: "Tech Solutions CI",
    contact: "07 77 88 99 00", email: "info@techsolutions.ci",
    adresse: "Plateau, Abidjan",
    specialite: "Informatique", statut: "actif",
    createdAt: "2025-01-10", nbFactures: 1, totalAchats: 1003000
  },
  {
    id: "4", code: "FR250004", nom: "Transport Express",
    contact: "01 02 03 04 05", email: "transport@express.ci",
    adresse: "Yopougon, Abidjan",
    specialite: "Logistique", statut: "inactif",
    createdAt: "2025-01-12", nbFactures: 0, totalAchats: 0
  },
  {
    id: "5", code: "FR250005", nom: "Papeterie Centrale",
    contact: "22 33 44 55 66", email: "papeterie@centrale.ci",
    adresse: "Adjamé, Abidjan",
    specialite: "Fournitures", statut: "actif",
    createdAt: "2025-01-15", nbFactures: 1, totalAchats: 112100
  },
]

export const mockFacturesAchat: FactureAchat[] = [
  {
    id: "1", numero: "FA250001", date: "2025-01-05",
    dateEcheance: "2025-02-05", fournisseurId: "1",
    designation: "Livraison marchandises Janvier",
    montantHT: 450000, tva: 18, montantTTC: 531000,
    statut: "payee", reference: "BL-2025-001",
    createdAt: "2025-01-05"
  },
  {
    id: "2", numero: "FA250002", date: "2025-01-12",
    dateEcheance: "2025-02-12", fournisseurId: "2",
    designation: "Matériaux construction - Commande #24",
    montantHT: 1200000, tva: 18, montantTTC: 1416000,
    statut: "en_attente", reference: "BC-2025-024",
    createdAt: "2025-01-12"
  },
  {
    id: "3", numero: "FA250003", date: "2024-12-18",
    dateEcheance: "2025-01-18", fournisseurId: "3",
    designation: "Matériel informatique - Renouvellement parc",
    montantHT: 850000, tva: 18, montantTTC: 1003000,
    statut: "en_retard", reference: "DEV-2024-089",
    createdAt: "2024-12-18"
  },
  {
    id: "4", numero: "FA250004", date: "2025-01-22",
    dateEcheance: "2025-02-22", fournisseurId: "1",
    designation: "Approvisionnement stock alimentaire",
    montantHT: 320000, tva: 10, montantTTC: 352000,
    statut: "payee", reference: "BL-2025-004",
    createdAt: "2025-01-22"
  },
  {
    id: "5", numero: "FA250005", date: "2025-01-28",
    dateEcheance: "2025-02-28", fournisseurId: "5",
    designation: "Fournitures de bureau Q1 2025",
    montantHT: 95000, tva: 18, montantTTC: 112100,
    statut: "en_attente", reference: "PAP-2025-012",
    createdAt: "2025-01-28"
  },
]

export const SPECIALITES: SpecialiteFournisseur[] = [
  "Alimentaire", "Matériaux", "Informatique",
  "Logistique", "Fournitures", "Services", "Autre"
]

export const TVA_OPTIONS = [0, 10, 18, 20]

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA"
}

export function getFournisseurById(id: string): Fournisseur | undefined {
  return mockFournisseurs.find(f => f.id === id)
}

export function getFacturesByFournisseur(fournisseurId: string): FactureAchat[] {
  return mockFacturesAchat.filter(f => f.fournisseurId === fournisseurId)
}
