import React, { useState } from 'react';
import { X, Calendar, FileText, Download, Filter, Loader } from 'lucide-react';
import { generatePDFReport, generateExcelReport, generateMockData, ReportFilters } from '../utils/reportGenerator';

interface ReportModalProps {
  onClose: () => void;
  companyName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, companyName }) => {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'sales'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const reportTypes = [
    { value: 'sales', label: 'Rapport des Ventes', icon: '📊', description: 'Analyse détaillée des ventes et transactions' },
    { value: 'customers', label: 'Rapport Clientèle', icon: '👥', description: 'Données clients et comportements d\'achat' },
    { value: 'inventory', label: 'Rapport Inventaire', icon: '📦', description: 'État des stocks et gestion des produits' },
    { value: 'financial', label: 'Rapport Financier', icon: '💰', description: 'Analyse financière et rentabilité' }
  ];

  const periodPresets = [
    { label: '7 derniers jours', days: 7 },
    { label: '30 derniers jours', days: 30 },
    { label: '3 derniers mois', days: 90 },
    { label: '6 derniers mois', days: 180 },
    { label: '1 an', days: 365 }
  ];

  const handleFilterChange = (field: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPreviewData(null);
  };

  const setPeriodPreset = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
    setPreviewData(null);
  };

  const generatePreview = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const data = generateMockData(filters);
      setPreviewData(data);
      setIsGenerating(false);
    }, 1000);
  };

  const exportToPDF = () => {
    const data = previewData || generateMockData(filters);
    generatePDFReport(data, filters, companyName);
  };

  const exportToExcel = () => {
    const data = previewData || generateMockData(filters);
    generateExcelReport(data, filters, companyName);
  };

  const getPreviewStats = () => {
    if (!previewData) return null;

    switch (filters.type) {
      case 'sales':
        return {
          title: 'Aperçu des Ventes',
          stats: [
            { label: 'Total des ventes', value: `${previewData.sales.reduce((sum: number, sale: any) => sum + sale.total, 0).toLocaleString('fr-FR')} €` },
            { label: 'Nombre de transactions', value: previewData.sales.length },
            { label: 'Articles vendus', value: previewData.sales.reduce((sum: number, sale: any) => sum + sale.quantity, 0) }
          ]
        };
      case 'customers':
        return {
          title: 'Aperçu Clientèle',
          stats: [
            { label: 'Total clients', value: previewData.customers.length },
            { label: 'Clients actifs', value: previewData.customers.filter((c: any) => c.status === 'active').length },
            { label: 'Valeur totale', value: `${previewData.customers.reduce((sum: number, c: any) => sum + c.totalPurchases, 0).toLocaleString('fr-FR')} €` }
          ]
        };
      case 'inventory':
        return {
          title: 'Aperçu Inventaire',
          stats: [
            { label: 'Total produits', value: previewData.inventory.length },
            { label: 'En stock', value: previewData.inventory.filter((i: any) => i.status === 'in_stock').length },
            { label: 'Stock faible', value: previewData.inventory.filter((i: any) => i.status === 'low_stock').length }
          ]
        };
      case 'financial':
        return {
          title: 'Aperçu Financier',
          stats: [
            { label: 'Chiffre d\'affaires', value: `${previewData.financial.revenue.toLocaleString('fr-FR')} €` },
            { label: 'Bénéfice', value: `${previewData.financial.profit.toLocaleString('fr-FR')} €` },
            { label: 'Marge', value: `${((previewData.financial.profit / previewData.financial.revenue) * 100).toFixed(1)}%` }
          ]
        };
      default:
        return null;
    }
  };

  const selectedReportType = reportTypes.find(type => type.value === filters.type);
  const previewStats = getPreviewStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Générateur de Rapports</h2>
            <p className="text-gray-600">Créez et exportez vos rapports d'activité personnalisés</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Configuration du rapport */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Type de rapport */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Type de rapport
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {reportTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      filters.type === type.value
                        ? 'border-gray-500 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={filters.type === type.value}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Période */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Période d'analyse
              </h3>
              
              {/* Presets de période */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Périodes prédéfinies</p>
                <div className="flex flex-wrap gap-2">
                  {periodPresets.map((preset) => (
                    <button
                      key={preset.days}
                      onClick={() => setPeriodPreset(preset.days)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates personnalisées */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu du rapport */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Aperçu du rapport</h3>
              <button
                onClick={generatePreview}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
                <span>{isGenerating ? 'Génération...' : 'Générer l\'aperçu'}</span>
              </button>
            </div>

            {selectedReportType && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{selectedReportType.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedReportType.label}</h4>
                    <p className="text-sm text-gray-600">
                      Du {new Date(filters.startDate).toLocaleDateString('fr-FR')} au {new Date(filters.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {previewStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {previewStats.stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {!previewData && !isGenerating && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cliquez sur "Générer l'aperçu" pour voir les statistiques</p>
              </div>
            )}
          </div>

          {/* Actions d'export */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={exportToPDF}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Exporter en PDF</span>
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Exporter en Excel</span>
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Les rapports incluent toutes les données de la période sélectionnée avec des graphiques et analyses détaillées.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;