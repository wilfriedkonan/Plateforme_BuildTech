import React from 'react';
import { TrendingUp, DollarSign, Users, Package, FileText, Eye, Download, Plus, RefreshCw } from 'lucide-react';

interface ReportsTabProps {
  reports: ReportData[];
  selectedReportType: string;
  setSelectedReportType: (type: string) => void;
  generateNewReport: (type: string) => void;
  handleReportDownload: (reportId: string) => void;
  setShowReportModal: (show: boolean) => void;
}

interface ReportData {
  id: string;
  title: string;
  type: 'sales' | 'inventory' | 'customers' | 'financial';
  date: string;
  status: 'ready' | 'generating' | 'error';
  size: string;
}

const ReportsTab: React.FC<ReportsTabProps> = ({
  reports,
  selectedReportType,
  setSelectedReportType,
  generateNewReport,
  handleReportDownload,
  setShowReportModal
}) => {
  const filteredReports = selectedReportType === 'all'
    ? reports
    : reports.filter(r => r.type === selectedReportType);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales': return TrendingUp;
      case 'inventory': return Package;
      case 'customers': return Users;
      case 'financial': return DollarSign;
      default: return FileText;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'sales': return 'text-green-600 bg-green-100';
      case 'inventory': return 'text-blue-600 bg-blue-100';
      case 'customers': return 'text-purple-600 bg-purple-100';
      case 'financial': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rapports d'activité</h2>
            <p className="text-gray-600">Consultez et téléchargez vos rapports d'analyse</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Générer un rapport</span>
            </button>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="all">Tous les rapports</option>
              <option value="sales">Ventes</option>
              <option value="inventory">Inventaire</option>
              <option value="customers">Clientèle</option>
              <option value="financial">Financier</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => generateNewReport('sales')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
          >
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Rapport Ventes</span>
          </button>
          <button
            onClick={() => generateNewReport('inventory')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
          >
            <Package className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Rapport Stock</span>
          </button>
          <button
            onClick={() => generateNewReport('customers')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
          >
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Rapport Clients</span>
          </button>
          <button
            onClick={() => generateNewReport('financial')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
          >
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Rapport Financier</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rapports disponibles</h3>
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const IconComponent = getReportIcon(report.type);
            return (
              <div key={report.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getReportColor(report.type)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-600">Généré le {new Date(report.date).toLocaleDateString()}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="capitalize">{report.type}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {report.status === 'generating' && (
                      <div className="flex items-center space-x-2 text-orange-600">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Génération...</span>
                      </div>
                    )}
                    {report.status === 'ready' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReportDownload(report.id)}
                          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                      </>
                    )}
                    {report.status === 'error' && (
                      <span className="text-red-600 text-sm">Erreur</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport disponible</h3>
            <p className="text-gray-600">Générez votre premier rapport en utilisant les boutons ci-dessus</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
