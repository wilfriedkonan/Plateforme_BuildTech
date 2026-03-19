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

interface ActivityData {
  sales: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  inventory: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
}

interface ReportData {
  id: string;
  title: string;
  type: 'sales' | 'inventory' | 'customers' | 'financial';
  date: string;
  status: 'ready' | 'generating' | 'error';
  size: string;
}

interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user, activeTab: propActiveTab, onTabChange: propOnTabChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue'>('overview');
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [salesPeriod, setSalesPeriod] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPOS, setShowPOS] = useState(false);

  const generateSalesChartData = (period: string): SalesChartData[] => {
    const data: SalesChartData[] = [];
    const now = new Date();
    let days = 7;

    switch (period) {
      case '7days':
        days = 7;
        break;
      case '30days':
        days = 30;
        break;
      case '90days':
        days = 90;
        break;
      case '1year':
        days = 365;
        break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const baseValue = 1000 + Math.sin(i / 10) * 200;
      const randomVariation = Math.random() * 400 - 200;
      const sales = Math.max(0, Math.round(baseValue + randomVariation));
      const revenue = sales * (15 + Math.random() * 10);

      data.push({
        date: period === '1year' ? date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }) :
              period === '90days' ? date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) :
              date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        sales,
        revenue: Math.round(revenue)
      });
    }

    return data;
  };

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockData: ActivityData = {
          sales: {
            today: 1250,
            thisWeek: 8750,
            thisMonth: 32500,
            growth: 12.5
          },
          customers: {
            total: 2847,
            new: 156,
            returning: 2691,
            growth: 8.3
          },
          inventory: {
            totalProducts: 1250,
            lowStock: 23,
            outOfStock: 5
          },
          revenue: {
            today: 15750,
            thisWeek: 98250,
            thisMonth: 425000,
            growth: 15.2
          }
        };
        setActivityData(mockData);
        setLoading(false);
      }, 1000);
    };

    const fetchSalesData = () => {
      const chartData = generateSalesChartData(salesPeriod);
      setSalesChartData(chartData);
    };

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

    fetchActivityData();
    fetchSalesData();
    fetchReports();
  }, [salesPeriod]);

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

  const refreshData = () => {
    setLoading(true);
    const chartData = generateSalesChartData(salesPeriod);
    setSalesChartData(chartData);
    setTimeout(() => {
      if (activityData) {
        setActivityData({
          ...activityData,
          sales: {
            ...activityData.sales,
            today: activityData.sales.today + Math.floor(Math.random() * 100)
          }
        });
      }
      setLoading(false);
    }, 1000);
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case '7days': return '7 derniers jours';
      case '30days': return '30 derniers jours';
      case '90days': return '3 derniers mois';
      case '1year': return '12 derniers mois';
      default: return '30 derniers jours';
    }
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

  // Gérer l'overflow du body pour le POS modal
  useEffect(() => {
    document.body.style.overflow = showPOS ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPOS]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenu basé sur l'onglet actif */}
        {displayActiveTab === 'overview' && (
          <OverviewTab
            user={user}
            activityData={activityData}
            loading={loading}
            salesPeriod={salesPeriod}
            setSalesPeriod={setSalesPeriod}
            salesChartData={salesChartData}
            chartType={chartType}
            setChartType={setChartType}
            getPeriodLabel={getPeriodLabel}
            handleDownload={handleDownload}
          />
        )}

        {displayActiveTab === 'reports' && (
          <ReportsTab
            reports={reports}
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
            generateNewReport={generateNewReport}
            handleReportDownload={handleReportDownload}
            setShowReportModal={setShowReportModal}
          />
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
          <POSModal onClose={() => setShowPOS(false)} />
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
