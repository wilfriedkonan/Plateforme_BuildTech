
import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReports } from '../../hooks/useReports';

interface RapportVentesProps {
  onDownload?: (loading: boolean) => void;
}

const RapportVentes: React.FC<RapportVentesProps> = ({ onDownload }) => {
  const { getRapportVentes, downloadReportPDF, loading, error } = useReports();
  const [rapport, setRapport] = useState<any>(null);
  const [dateDebut, setDateDebut] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [dateFin, setDateFin] = useState<Date>(new Date());
  const [page, setPage] = useState(1);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const chargerRapport = async () => {
    const data = await getRapportVentes(dateDebut, dateFin, page);
    if (data) {
      setRapport(data);
    }
  };

  useEffect(() => {
    chargerRapport();
  }, []);

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    onDownload?.(true);
    await downloadReportPDF('ventes', dateDebut, dateFin, page);
    setDownloadingPDF(false);
    onDownload?.(false);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    const data = await getRapportVentes(dateDebut, dateFin, newPage);
    if (data) setRapport(data);
  };

  const formatNombre = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <input
              type="date"
              value={dateDebut.toISOString().split('T')[0]}
              onChange={(e) => setDateDebut(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input
              type="date"
              value={dateFin.toISOString().split('T')[0]}
              onChange={(e) => setDateFin(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={chargerRapport}
              disabled={loading}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors  disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              Charger
            </button>
          </div>
        </div>
      </div>

      {/* Résumé totaux */}
      {rapport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">Sous-total HT</div>
            <div className="text-2xl font-bold text-gray-900">{formatNombre(rapport.sousTotal)}</div>
            <div className="text-xs text-gray-500">FCFA</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">TVA collectée</div>
            <div className="text-2xl font-bold text-gray-900">{formatNombre(rapport.totalTVA)}</div>
            <div className="text-xs text-gray-500">FCFA</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl shadow p-4 text-white">
            <div className="text-sm opacity-90">TOTAL GÉNÉRAL</div>
            <div className="text-2xl font-bold">{formatNombre(rapport.totalGeneral)}</div>
            <div className="text-xs opacity-75">FCFA</div>
          </div>
        </div>
      )}

      {/* Grid de données */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">
            Factures ({rapport?.totalLignes || 0} total) - Page {rapport?.pageActuelle || 1}/{rapport?.totalPages || 1}
          </h3>
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF || !rapport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger PDF
          </button>
        </div>

        {/* Table responsive */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DATE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">N°FACTURE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DESIGNATION</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">MONTANT</th>
              </tr>
            </thead>
            <tbody>
              {rapport?.lignes.map((ligne: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDate(ligne.date)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ligne.numeroFacture}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ligne.designation}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                    {formatNombre(ligne.montantTotal)} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {rapport && rapport.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: rapport.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 rounded-lg ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === rapport.totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default RapportVentes;