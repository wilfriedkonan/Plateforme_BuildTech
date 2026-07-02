// ReportsTab.tsx - VERSION RÉVISÉE

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Package, FileText, Plus } from 'lucide-react';
import RapportVentesQuantite from '../rapports/RapportVentesQuantite';
import RapportStock from '../rapports/RapportStock';
import RapportVentes from '../rapports/RapportVentes';

interface ReportsTabProps {
  setShowReportModal?: (show: boolean) => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ setShowReportModal }) => {
  const [selectedReportType, setSelectedReportType] = useState<'ventes' | 'ventes-quantite' | 'stock'>('ventes');
  const [isDownloading, setIsDownloading] = useState(false);

  const reportTypes = [
    {
      id: 'ventes',
      label: 'Rapport Ventes',
      icon: TrendingUp,
      description: 'Analyse détaillée des ventes par date',
      color: 'text-green-600 bg-green-100 hover:bg-green-200'
    },
    {
      id: 'ventes-quantite',
      label: 'Ventes Quantité & Valeur',
      icon: DollarSign,
      description: 'Quantités vendues et montants par article',
      color: 'text-purple-600 bg-purple-100 hover:bg-purple-200'
    },
    {
      id: 'stock',
      label: 'Rapport Stock',
      icon: Package,
      description: 'État actuel des stocks par article',
      color: 'text-orange-600 bg-orange-100 hover:bg-orange-200'
    }
  ];

  const currentReport = reportTypes.find(r => r.id === selectedReportType);
  const CurrentIcon = currentReport?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection de rapport */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Rapports d'activité</h2>
            <p className="text-gray-600">Consultez et téléchargez vos rapports d'analyse</p>
          </div>
          {setShowReportModal && (
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Générer un rapport</span>
            </button>
          )}
        </div>

        {/* Sélecteur de type de rapport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReportType === report.id;

            return (
              <button
                key={report.id}
                onClick={() => setSelectedReportType(report.id as any)}
                className={`"flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all" ${
                  isSelected
                    ? 'border-gray-200 hover:border-gray-400 bg-white hover:shadow-md'
                    : 'border-gray-200 hover:border-gray-400 bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-white text-gray-900' : report.color
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight mb-1">{report.label}</h3>
                    <p className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-600'}`}>
                      {report.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteneur du rapport sélectionné */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* En-tête du rapport */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${currentReport?.color}`}>
              <CurrentIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentReport?.label}</h3>
              <p className="text-sm text-gray-600">{currentReport?.description}</p>
            </div>
          </div>
        </div>

        {/* Contenu du rapport */}
        <div className="p-6">
          {isDownloading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              Téléchargement du rapport en cours...
            </div>
          )}

          {selectedReportType === 'ventes' && (
            <RapportVentes onDownload={setIsDownloading} />
          )}
          {selectedReportType === 'ventes-quantite' && (
            <RapportVentesQuantite onDownload={setIsDownloading} />
          )}
          {selectedReportType === 'stock' && (
            <RapportStock onDownload={setIsDownloading} />
          )}
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Conseils d'utilisation
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Sélectionnez les dates pour filtrer les données de votre rapport</li>
          <li>• Utilisez la pagination pour naviguer entre les pages</li>
          <li>• Cliquez sur "Télécharger PDF" pour exporter le rapport en PDF</li>
          <li>• Les formats de nombre utilisent la convention française (10 000 000 FCFA)</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsTab;