import React, { useState, useEffect } from 'react';
import { User as UserType } from '../App';
import ReportModal from './ReportModal';
import CatalogueManager from './catalogue/CatalogueManager';
import OverviewTab from './tabs/OverviewTab';
import ReportsTab from './tabs/ReportsTab';
import InventoryTab from './tabs/InventoryTab';
import AdministrationTab from './tabs/AdministrationTab';
import POSModal from './pos/POSModal';
import ClientManager from './client/ClientManager';
import AchatManager from './achat/AchatManager';

interface DashboardProps {
  user: UserType;
  activeTab?: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue';
  onTabChange?: (tab: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue') => void;
}

interface ReportData {
  id: string;
  title: string;
  type: 'sales' | 'inventory' | 'customers' | 'financial';
  date: string;
  status: 'ready' | 'generating' | 'error';
  size: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, activeTab: propActiveTab, onTabChange: propOnTabChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue'>('overview');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPOS, setShowPOS] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      const mockReports: ReportData[] = [
        {
          id: '1',
          title: 'Rapport des ventes - Janvier 2024',
          type: 'sales',
          date: '2024-01-31',
          status: 'ready',
          size: '2.3 MB'
        },
        {
          id: '2',
          title: 'Analyse des stocks - Janvier 2024',
          type: 'inventory',
          date: '2024-01-31',
          status: 'ready',
          size: '1.8 MB'
        },
        {
          id: '3',
          title: 'Rapport clientèle - Janvier 2024',
          type: 'customers',
          date: '2024-01-31',
          status: 'ready',
          size: '1.2 MB'
        },
        {
          id: '4',
          title: 'Bilan financier - Janvier 2024',
          type: 'financial',
          date: '2024-01-31',
          status: 'generating',
          size: '-'
        }
      ];
      setReports(mockReports);
    };

    fetchReports();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showPOS ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPOS]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPOS) {
        setShowPOS(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showPOS]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPOS(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleDownload = (appName: string) => {
    alert(`Téléchargement de ${appName} en cours...`);
  };

  const handleReportDownload = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report && report.status === 'ready') {
      alert(`Téléchargement du rapport: ${report.title}`);
    }
  };

  const generateNewReport = (type: string) => {
    const newReport: ReportData = {
      id: Date.now().toString(),
      title: `Nouveau rapport ${type} - ${new Date().toLocaleDateString()}`,
      type: type as any,
      date: new Date().toISOString().split('T')[0],
      status: 'generating',
      size: '-'
    };
    setReports(prev => [newReport, ...prev]);

    setTimeout(() => {
      setReports(prev => prev.map(r =>
        r.id === newReport.id
          ? { ...r, status: 'ready' as const, size: '1.5 MB' }
          : r
      ));
    }, 3000);
  };

  // Utiliser les props activeTab et onTabChange si fournis, sinon utiliser l'état local
  const displayActiveTab = propActiveTab || activeTab;
  const handleTabChangeLocal = (tab: typeof activeTab) => {
    if (propOnTabChange) {
      propOnTabChange(tab);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenu basé sur l'onglet actif */}
        {displayActiveTab === 'overview' && (
          <OverviewTab
            user={user}
            handleDownload={handleDownload}
          />
        )}

        {displayActiveTab === 'reports' && (
          // Cast props to any to match ReportsTab prop expectations in consuming module
          (() => {
            const reportsTabProps = {
              reports,
              selectedReportType,
              setSelectedReportType,
              generateNewReport,
              handleReportDownload,
              setShowReportModal,
            } as any;
            return <ReportsTab {...reportsTabProps} />;
          })()
        )}

        {displayActiveTab === 'articles' && (
          <div className="space-y-6">
            <InventoryTab />
          </div>
        )}

        {displayActiveTab === 'administration' && <AdministrationTab />}

        {displayActiveTab === 'achat' && <AchatManager />}

        {displayActiveTab === 'client' && <ClientManager />}

        {displayActiveTab === 'catalogue' && <CatalogueManager />}
        
        {displayActiveTab === 'pos' && (
          <POSModal onClose={() => handleTabChangeLocal('overview')} />
        )}
      </div>

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          companyName={user.nomEntreprise}
        />
      )}

      {showPOS && (
        <POSModal onClose={() => setShowPOS(false)} />
      )}
    </div>
  );
};

export default Dashboard;
