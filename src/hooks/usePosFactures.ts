import { useState, useCallback } from 'react';
import posService, {
  PosFacture,
  PosStatistiquesJour,
  PaymentType,
  CreatePosFactureRequest,
  AddPosDetailRequest,
  PutOnHoldRequest,
  PutOnHoldSmartRequest,
  CancelFactureRequest,
  ConfirmPosPaymentRequest,
} from '../services/posService';

interface UsePosFacturesState {
  factureActive: PosFacture | null;
  facturesEnAttente: PosFacture[];
  paymentTypes: PaymentType[];
  statistiquesJour: PosStatistiquesJour | null;
  loading: boolean;
  error: string | null;
}

export const usePosFactures = () => {
  const [state, setState] = useState<UsePosFacturesState>({
    factureActive: null,
    facturesEnAttente: [],
    paymentTypes: [],
    statistiquesJour: null,
    loading: false,
    error: null,
  });

  // POST /api/Pos/factures â€” CrÃ©er une nouvelle facture
  const createFacture = useCallback(async (request: CreatePosFactureRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.createFacture(request);
      const facture = response.facture || response.data || null;
      setState(prev => ({ ...prev, factureActive: facture, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la crÃ©ation de la facture';
      console.error('[usePosFactures] Error creating facture:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // GET /api/Pos/factures/{id} â€” RÃ©cupÃ©rer une facture par ID
  const getFactureById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const facture = await posService.getFactureById(id);
      setState(prev => ({ ...prev, factureActive: facture, loading: false }));
      return facture;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement de la facture';
      console.error('[usePosFactures] Error fetching facture by ID:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // POST /api/Pos/factures/{idFacture}/details â€” Ajouter un article Ã  la facture
  const addDetail = useCallback(async (idFacture: string, detail: AddPosDetailRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.addDetail(idFacture, detail);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de l\'ajout du dÃ©tail';
      console.error('[usePosFactures] Error adding detail:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // PUT /api/Pos/factures/{idFacture}/put-on-hold â€” Mettre en attente
  const putOnHold = useCallback(async (idFacture: string, request: PutOnHoldRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.putOnHold(idFacture, request);
      setState(prev => ({ ...prev, factureActive: null, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise en attente';
      console.error('[usePosFactures] Error putting on hold:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // PUT /api/Pos/put-on-hold â€” Mettre en attente intelligente (crÃ©e la facture si idFacture est null)
  const putOnHoldSmart = useCallback(async (request: PutOnHoldSmartRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.putOnHoldSmart(request);
      setState(prev => ({ ...prev, factureActive: null, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la mise en attente';
      console.error('[usePosFactures] Error putting on hold smart:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // GET /api/Pos/factures/en-attente â€” RÃ©cupÃ©rer les factures en attente
  const fetchFacturesEnAttente = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const factures = await posService.getFacturesEnAttente();
      setState(prev => ({ ...prev, facturesEnAttente: factures || [], loading: false }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des factures en attente';
      console.error('[usePosFactures] Error fetching factures en attente:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // PUT /api/Pos/factures/{idFacture}/resume â€” Reprendre une facture en attente
  const resumeFacture = useCallback(async (idFacture: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.resumeFacture(idFacture);
      const facture = response.facture || response.data || null;
      setState(prev => ({
        ...prev,
        factureActive: facture,
        facturesEnAttente: prev.facturesEnAttente.filter(f => f.id !== idFacture),
        loading: false,
      }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la reprise de la facture';
      console.error('[usePosFactures] Error resuming facture:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // PUT /api/Pos/factures/{idFacture}/cancel â€” Annuler une facture
  const cancelFacture = useCallback(async (idFacture: string, request: CancelFactureRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.cancelFacture(idFacture, request);
      setState(prev => ({ ...prev, factureActive: null, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de l\'annulation de la facture';
      console.error('[usePosFactures] Error cancelling facture:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  // GET /api/Pos/payment-types â€” Charger les types de paiement
  const fetchPaymentTypes = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const types = await posService.getPaymentTypes();
      setState(prev => ({ ...prev, paymentTypes: types || [], loading: false }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des types de paiement';
      console.error('[usePosFactures] Error fetching payment types:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // GET /api/Pos/statistiques/jour â€” Statistiques de vente du jour
  const fetchStatistiquesJour = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const stats = await posService.getStatistiquesJour();
      setState(prev => ({ ...prev, statistiquesJour: stats, loading: false }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors du chargement des statistiques';
      console.error('[usePosFactures] Error fetching statistiques jour:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // POST /api/Pos/factures/confirm-payment â€” Confirmer le paiement (crÃ©e la facture si idFacture est null)
  const confirmPayment = useCallback(async (request: ConfirmPosPaymentRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await posService.confirmPayment(request);
      setState(prev => ({ ...prev, factureActive: null, loading: false }));
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la confirmation du paiement';
      console.error('[usePosFactures] Error confirming payment:', errorMessage);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  return {
    ...state,
    createFacture,
    getFactureById,
    addDetail,
    putOnHold,
    putOnHoldSmart,
    fetchFacturesEnAttente,
    resumeFacture,
    cancelFacture,
    fetchPaymentTypes,
    fetchStatistiquesJour,
    confirmPayment,
  };
};
