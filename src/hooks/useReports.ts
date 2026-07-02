import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

// ─── Types de réponse ─────────────────────────────────────────────────────────

interface RapportVentes {
  titre: string;
  nomEntreprise: string;
  dateDebut: string;
  dateFin: string;
  pageActuelle: number;
  totalPages: number;
  totalLignes: number;
  sousTotal: number;
  totalTVA: number;
  totalGeneral: number;
  devise: string;
  lignes: Array<{
    date: string;
    numeroFacture: string;
    designation: string;
    montantTotal: number;
  }>;
}

interface RapportVentesQuantite {
  titre: string;
  nomEntreprise: string;
  dateDebut: string;
  dateFin: string;
  pageActuelle: number;
  totalPages: number;
  totalLignes: number;
  quantiteTotalVendue: number;
  montantTotalVendu: number;
  devise: string;
  lignes: Array<{
    designation: string;
    quantite: number;
    montantTotal: number;
  }>;
}

interface RapportStock {
  titre: string;
  nomEntreprise: string;
  dateRapport: string;
  pageActuelle: number;
  totalPages: number;
  totalLignes: number;
  stockTotalArticles: number;
  lignes: Array<{
    designation: string;
    codeArticle: string;
    stockActuel: number;
  }>;
}

type ReportType = 'ventes' | 'ventes-quantite' | 'stock';

// ─── Helper ───────────────────────────────────────────────────────────────────

const toDateParam = (d: Date) => d.toISOString().split('T')[0];

const unwrap = (data: any) => data?.data ?? data;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any, fallback: string) => {
    const msg = err?.response?.data?.message || err?.message || fallback;
    setError(msg);
  };

  // GET /api/pos/rapports/ventes
  const getRapportVentes = useCallback(
    async (dateDebut?: Date, dateFin?: Date, page = 1): Promise<RapportVentes | null> => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = { page: String(page), downloadPDF: 'false' };
        if (dateDebut) params.dateDebut = toDateParam(dateDebut);
        if (dateFin) params.dateFin = toDateParam(dateFin);

        const response = await apiClient.get('/pos/rapports/ventes', { params });
        return unwrap(response.data);
      } catch (err: any) {
        handleError(err, 'Erreur lors du chargement du rapport ventes');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // GET /api/pos/rapports/ventes-quantite
  const getRapportVentesQuantite = useCallback(
    async (dateDebut?: Date, dateFin?: Date, page = 1): Promise<RapportVentesQuantite | null> => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = { page: String(page), downloadPDF: 'false' };
        if (dateDebut) params.dateDebut = toDateParam(dateDebut);
        if (dateFin) params.dateFin = toDateParam(dateFin);

        const response = await apiClient.get('/pos/rapports/ventes-quantite', { params });
        return unwrap(response.data);
      } catch (err: any) {
        handleError(err, 'Erreur lors du chargement du rapport ventes-quantité');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // GET /api/pos/rapports/stock
  const getRapportStock = useCallback(
    async (page = 1): Promise<RapportStock | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/pos/rapports/stock', {
          params: { page: String(page), downloadPDF: 'false' },
        });
        return unwrap(response.data);
      } catch (err: any) {
        handleError(err, 'Erreur lors du chargement du rapport stock');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // GET /api/pos/rapports/{type}?downloadPDF=true → blob PDF
  const downloadReportPDF = useCallback(
    async (reportType: ReportType, dateDebut?: Date, dateFin?: Date, page = 1) => {
      try {
        const params: Record<string, string> = { downloadPDF: 'true', page: String(page) };
        if (dateDebut) params.dateDebut = toDateParam(dateDebut);
        if (dateFin) params.dateFin = toDateParam(dateFin);

        const response = await apiClient.get(`/pos/rapports/${reportType}`, {
          params,
          responseType: 'blob',
        });

        const blobUrl = window.URL.createObjectURL(response.data as Blob);
        const link = document.createElement('a');
        link.href = blobUrl;

        const dateStr = new Date().toISOString().split('T')[0];
        const fileNames: Record<ReportType, string> = {
          ventes: `Rapport_Ventes_${dateStr}.pdf`,
          'ventes-quantite': `Rapport_Ventes_Quantite_${dateStr}.pdf`,
          stock: `Rapport_Stock_${dateStr}.pdf`,
        };
        link.download = fileNames[reportType];
        link.click();
        window.URL.revokeObjectURL(blobUrl);

        return true;
      } catch (err: any) {
        handleError(err, 'Erreur lors du téléchargement du PDF');
        return false;
      }
    },
    []
  );

  return {
    loading,
    error,
    getRapportVentes,
    getRapportVentesQuantite,
    getRapportStock,
    downloadReportPDF,
    setError,
  };
};
