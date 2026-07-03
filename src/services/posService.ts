import { apiClient } from './apiClient';

// â”€â”€â”€ Request types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CreatePosFactureRequest {
  idTable?: string;
  idClient?: string;
  nomClient?: string;
  typeVente?: string;
}

export interface AddPosDetailRequest {
  idArticle: string;
  quantite: number;
  prixUnitaire: number;
  remise?: number;
}

export interface PutOnHoldRequest {
  nom: string;
}

export interface PutOnHoldSmartRequest {
  idFacture?: string | null;
  motif?: string;
  numeroFacture?: string;
  designation?: string;
  message?: string;
  idTable?: string | null;
  idClient?: string | null;
  idUtilisateur?: string | null;
  idEntreprise?: string | null;
  idSession?: string | null;
  caisse?: string;
  serveur?: string;
  articles: ConfirmPaymentArticle[];
}

export interface CancelFactureRequest {
  motif?: string;
}

export interface ConfirmPaymentArticle {
  idArticle: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
  prixVente: number;
  tauxTVA: number;
  valeurRemise: number;
  specificite?: string;
  detailComposent?: string;
  idServeur?: string;
  idCuisinier?: string;
}

export interface ConfirmPosPaymentRequest {
  idFacture?: string | null;
  idPayement: string;
  montantVerser: number;
  monnaieRemis: number;
  remise: number;
  numeroFacture?: string;
  designation?: string;
  message?: string;
  idTable?: string | null;
  idClient?: string | null;
  idUtilisateur?: string | null;
  idEntreprise?: string | null;
  idSession?: string | null;
  caisse?: string;
  serveur?: string;
  articles: ConfirmPaymentArticle[];
}

// â”€â”€â”€ Response / domain types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface PosFacture {
  id?: string;
  numeroFacture?: string;
  designation?: string;
  dateCreation?: string;
  dateModification?: string;
  message?: string | null;
  montant?: number;
  sous_total?: number;
  total_final?: number;
  montantVerser?: number;
  monnaieRemis?: number;
  restApayer?: number;
  remise?: number;
  remise_globale?: number;
  valeurRemise_globale?: number;
  valeurTVA?: number;
  tva?: number;
  beneficeSurFact?: number;
  idTable?: string | null;
  designationTable?: string | null;
  idPayement?: string | null;
  designationPayement?: string | null;
  idUtilisateur?: string | null;
  nomUtilisateur?: string;
  idClient?: string | null;
  nomClient?: string | null;
  idEntreprise?: string | null;
  idSession?: string | null;
  etat?: string;
  statut?: string;
  estAnnuler?: boolean;
  estSupprimer?: boolean;
  estEnattente?: boolean;
  estestCloturer?: boolean;
  caisse?: string;
  serveur?: string | null;
  solder?: boolean;
  details?: PosFactureDetail[];
}

export interface PosFactureDetail {
  id?: string;
  idFacture?: string;
  idArticle?: string;
  designation?: string;
  quantite?: number;
  prixUnitaireHT?: number;
  prixUnitaireTTC?: number;
  prixVente?: number;
  prixTotal?: number;
  sousTotal?: number;
  tauxTVA?: number;
  montantTVA?: number;
  valeurRemise?: number;
  prixUnitaire?: number;
  remise?: number;
  montantLigne?: number;
  tva?: number;
}

export interface PaymentType {
  id?: string;
  designation?: string;
}

export interface PosApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  facture?: PosFacture;
  factures?: PosFacture[];
}

export interface PosStatistiquesJour {
  nombreVentes: number;
  chiffreAffaires: number;
  sousTotal: number;
  totalTVA: number;
  panierMoyen: number;
  totalRemises: number;
  monnaie: string;
  dateStatistique: string;
  messages: string[];
}

// â”€â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const posService = {
  // POST /api/Pos/factures â€” CrÃ©er une nouvelle facture POS
  async createFacture(request: CreatePosFactureRequest): Promise<PosApiResponse> {
    try {
      const response = await apiClient.post<PosApiResponse>('/Pos/factures', request);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error creating facture:', error);
      throw error;
    }
  },

  // GET /api/Pos/factures/{id} â€” RÃ©cupÃ©rer une facture par ID
  async getFactureById(id: string): Promise<PosFacture | null> {
    try {
      const response = await apiClient.get<PosApiResponse>(`/Pos/factures/${id}`);
      return response.data.facture || response.data.data || null;
    } catch (error: any) {
      console.error('[posService] Error fetching facture by ID:', error);
      throw error;
    }
  },

  // POST /api/Pos/factures/{idFacture}/details â€” Ajouter un dÃ©tail Ã  une facture
  async addDetail(idFacture: string, detail: AddPosDetailRequest): Promise<PosApiResponse> {
    try {
      const response = await apiClient.post<PosApiResponse>(`/Pos/factures/${idFacture}/details`, detail);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error adding detail:', error);
      throw error;
    }
  },

  // PUT /api/Pos/factures/{idFacture}/put-on-hold â€” Mettre une facture en attente
  async putOnHold(idFacture: string, request: PutOnHoldRequest): Promise<PosApiResponse> {
    try {
      const response = await apiClient.put<PosApiResponse>(`/Pos/factures/${idFacture}/put-on-hold`, request);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error putting facture on hold:', error);
      throw error;
    }
  },

  // PUT /api/Pos/put-on-hold â€” Mettre en attente intelligente (crÃ©e la facture si idFacture est null)
  async putOnHoldSmart(request: PutOnHoldSmartRequest): Promise<PosApiResponse> {
    try {
      const response = await apiClient.put<PosApiResponse>('/Pos/put-on-hold', request);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error putting on hold smart:', error);
      throw error;
    }
  },

  // GET /api/Pos/factures/en-attente â€” RÃ©cupÃ©rer les factures en attente
  async getFacturesEnAttente(): Promise<PosFacture[]> {
    try {
      const response = await apiClient.get<any>('/Pos/factures/en-attente');
      // Response body: { data: { success, factures: [], details: [] } }
      const inner = response.data?.data ?? response.data;
      const factures: PosFacture[] = inner?.factures || [];
      const details: PosFactureDetail[] = inner?.details || [];
      return factures.map(f => ({
        ...f,
        details: details.filter(d => d.idFacture === f.id),
      }));
    } catch (error: any) {
      console.error('[posService] Error fetching factures en attente:', error);
      throw error;
    }
  },

  // PUT /api/Pos/factures/{idFacture}/resume â€” Reprendre une facture en attente
  async resumeFacture(idFacture: string): Promise<PosApiResponse> {
    try {
      const response = await apiClient.put<PosApiResponse>(`/Pos/factures/${idFacture}/resume`);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error resuming facture:', error);
      throw error;
    }
  },

  // PUT /api/Pos/factures/{idFacture}/cancel â€” Annuler une facture
  async cancelFacture(idFacture: string, request: CancelFactureRequest): Promise<PosApiResponse> {
    try {
      const response = await apiClient.put<PosApiResponse>(`/Pos/factures/${idFacture}/cancel`, request);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error cancelling facture:', error);
      throw error;
    }
  },

  // GET /api/Pos/payment-types â€” RÃ©cupÃ©rer les types de paiement disponibles
  async getPaymentTypes(): Promise<PaymentType[]> {
    try {
      const response = await apiClient.get<PosApiResponse>('/Pos/payment-types');
      return response.data.data || [];
    } catch (error: any) {
      console.error('[posService] Error fetching payment types:', error);
      throw error;
    }
  },

  // GET /api/Pos/statistiques/jour â€” Statistiques de vente du jour
  async getStatistiquesJour(): Promise<PosStatistiquesJour | null> {
    try {
      const response = await apiClient.get<any>('/Pos/statistiques/jour');
      return response.data?.data ?? response.data ?? null;
    } catch (error: any) {
      console.error('[posService] Error fetching statistiques jour:', error);
      throw error;
    }
  },

  // POST /api/Pos/factures/confirm-payment â€” Confirmer le paiement (crÃ©e la facture si idFacture est null)
  async confirmPayment(request: ConfirmPosPaymentRequest): Promise<PosApiResponse> {
    try {
      const response = await apiClient.post<PosApiResponse>('/Pos/confirm-payment', request);
      return response.data;
    } catch (error: any) {
      console.error('[posService] Error confirming payment:', error);
      throw error;
    }
  },
};

export default posService;
