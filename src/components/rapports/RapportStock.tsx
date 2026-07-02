import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReports } from '../../hooks/useReports';

interface RapportStockProps {
  onDownload?: (loading: boolean) => void;
}

const RapportStock: React.FC<RapportStockProps> = ({ onDownload }) => {
  const { getRapportStock, downloadReportPDF, loading, error } = useReports();
  const [rapport, setRapport] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const chargerRapport = async (pageNum: number = 1) => {
    const data = await getRapportStock(pageNum);
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
    await downloadReportPDF('stock', undefined, undefined, page);
    setDownloadingPDF(false);
    onDownload?.(false);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await chargerRapport(newPage);
  };

  const formatNombre = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-700', label: 'Rupture' };
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-700', label: 'Critique' };
    return { color: 'bg-green-100 text-green-700', label: 'Normal' };
  };

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">
          Articles en stock ({rapport?.totalLignes || 0} total) - Page {rapport?.pageActuelle || 1}/{rapport?.totalPages || 1}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => chargerRapport(page)}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            Actualiser
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF || !rapport}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Télécharger PDF
          </button>
        </div>
      </div>

      {/* Résumé stock */}
      {rapport && (
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90">Stock total d'articles</div>
              <div className="text-3xl font-bold">{formatNombre(rapport.stockTotalArticles)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Nombre d'articles</div>
              <div className="text-3xl font-bold">{rapport.totalLignes}</div>
            </div>
          </div>
          <div className="text-xs opacity-75 mt-2">Dernière mise à jour: {new Date(rapport.dateRapport).toLocaleDateString('fr-FR')}</div>
        </div>
      )}

      {/* Grille responsive d'articles */}
      <div className="space-y-3">
        {rapport?.lignes.map((ligne: any, idx: number) => {
          const status = getStockStatus(ligne.stockActuel);
          return (
            <div key={idx} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{ligne.designation}</h4>
                  <p className="text-sm text-gray-600">Code: {ligne.codeArticle}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">Stock actuel</div>
                    <div className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${status.color}`}>
                      {formatNombre(ligne.stockActuel)} unités
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    ligne.stockActuel === 0
                      ? 'bg-red-500'
                      : ligne.stockActuel < 10
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((ligne.stockActuel / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {rapport && rapport.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow p-4 flex justify-center gap-2">
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
                  ? 'bg-orange-600 text-white'
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default RapportStock;