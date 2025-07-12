import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  User, Crown, Download, Calendar, Settings, LogOut, Shield, Zap, 
  TrendingUp, DollarSign, Users, Package, BarChart3, PieChart,
  Activity, FileText, Eye, Filter, RefreshCw, Calendar as CalendarIcon, Plus
} from 'lucide-react';
import { User as UserType } from '../App';
import ReportModal from './ReportModal';

interface DashboardProps {
  user: UserType;
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

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [salesPeriod, setSalesPeriod] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [showReportModal, setShowReportModal] = useState(false);

  const applications = [
    {
      id: 1,
      name: 'Business Manager Pro',
      version: '2.1.4',
      icon: Zap,
      description: 'Gestion d\'entreprise complète',
      size: '45 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Security Suite',
      version: '1.8.2',
      icon: Shield,
      description: 'Protection avancée des données',
      size: '32 MB',
      downloadUrl: '#'
    }
  ];

  // Génération des données de graphique selon la période
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
      
      // Simulation de données avec tendance et variations
      const baseValue = 1000 + Math.sin(i / 10) * 200;
      const randomVariation = Math.random() * 400 - 200;
      const sales = Math.max(0, Math.round(baseValue + randomVariation));
      const revenue = sales * (15 + Math.random() * 10); // Prix moyen entre 15-25€
      
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
  // Simulation d'API pour récupérer les données d'activité
  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      // Simulation d'un appel API
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
    
    // Simulation de génération de rapport
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
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bienvenue, {user.companyName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.isSubscribed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.isSubscribed ? 'Abonnement actif' : 'Aucun abonnement'}
              </div>
              <button 
                onClick={refreshData}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Vue d'ensemble</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Rapports</span>
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Statistiques d'activité */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : activityData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Ventes */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      activityData.sales.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {activityData.sales.growth > 0 ? '+' : ''}{activityData.sales.growth}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {activityData.sales.today.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 text-sm">Ventes aujourd'hui</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {activityData.sales.thisMonth.toLocaleString()} ce mois
                  </p>
                </div>

                {/* Revenus */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      activityData.revenue.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {activityData.revenue.growth > 0 ? '+' : ''}{activityData.revenue.growth}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {activityData.revenue.today.toLocaleString()} €
                  </h3>
                  <p className="text-gray-600 text-sm">Revenus aujourd'hui</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {activityData.revenue.thisMonth.toLocaleString()} € ce mois
                  </p>
                </div>

                {/* Clients */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      activityData.customers.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {activityData.customers.growth > 0 ? '+' : ''}{activityData.customers.growth}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {activityData.customers.total.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 text-sm">Total clients</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {activityData.customers.new} nouveaux ce mois
                  </p>
                </div>

                {/* Inventaire */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      activityData.inventory.outOfStock > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {activityData.inventory.outOfStock} ruptures
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {activityData.inventory.totalProducts.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 text-sm">Produits en stock</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {activityData.inventory.lowStock} en stock faible
                  </p>
                </div>
              </div>
            )}

            {/* Graphique des ventes */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Évolution des ventes</h2>
                  <p className="text-gray-600">Analyse des performances sur {getPeriodLabel(salesPeriod)}</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <select
                      value={salesPeriod}
                      onChange={(e) => setSalesPeriod(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="7days">7 jours</option>
                      <option value="30days">30 jours</option>
                      <option value="90days">3 mois</option>
                      <option value="1year">1 an</option>
                    </select>
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        chartType === 'line'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Ligne
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        chartType === 'bar'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Barres
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: any, name: string) => [
                          name === 'sales' ? `${value} ventes` : `${value}€`,
                          name === 'sales' ? 'Ventes' : 'Revenus'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#f97316" 
                        strokeWidth={3}
                        dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: any, name: string) => [
                          name === 'sales' ? `${value} ventes` : `${value}€`,
                          name === 'sales' ? 'Ventes' : 'Revenus'
                        ]}
                      />
                      <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Légende */}
              <div className="flex items-center justify-center space-x-8 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Nombre de ventes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenus (€)</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Applications disponibles */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Applications disponibles</h2>
                    <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                      {applications.length} applications
                    </span>
                  </div>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
                              <app.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{app.name}</h3>
                              <p className="text-sm text-gray-600">{app.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Version {app.version}</span>
                                <span>•</span>
                                <span>{app.size}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(app.name)}
                            className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Télécharger</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Statut abonnement */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Crown className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Abonnement</h3>
                  </div>
                  {user.isSubscribed ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Plan actuel</p>
                      <p className="font-semibold text-purple-600">{user.subscriptionPlan}</p>
                      <p className="text-xs text-gray-500 mt-2">Expire le 15 février 2024</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Vous n'avez pas d'abonnement actif
                      </p>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-2 px-4 rounded-lg text-sm hover:shadow-lg transition-all duration-300">
                        Choisir un plan
                      </button>
                    </div>
                  )}
                </div>

                {/* Activité récente */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-6 h-6 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Activité récente</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Nouvelle vente</p>
                      <p className="text-gray-500">Il y a 5 minutes</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Stock mis à jour</p>
                      <p className="text-gray-500">Il y a 1 heure</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Nouveau client</p>
                      <p className="text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            {/* Header des rapports */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rapports d'activité</h2>
                  <p className="text-gray-600">Consultez et téléchargez vos rapports d'analyse</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Générer un rapport</span>
                  </button>
                  <select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Tous les rapports</option>
                    <option value="sales">Ventes</option>
                    <option value="inventory">Inventaire</option>
                    <option value="customers">Clientèle</option>
                    <option value="financial">Financier</option>
                  </select>
                </div>
              </div>

              {/* Boutons de génération de rapports */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => generateNewReport('sales')}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Rapport Ventes</span>
                </button>
                <button
                  onClick={() => generateNewReport('inventory')}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Rapport Stock</span>
                </button>
                <button
                  onClick={() => generateNewReport('customers')}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Rapport Clients</span>
                </button>
                <button
                  onClick={() => generateNewReport('financial')}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Rapport Financier</span>
                </button>
              </div>
            </div>

            {/* Liste des rapports */}
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
                                className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
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
        )}
      </div>
      
      {/* Modal de génération de rapports */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          companyName={user.companyName}
        />
      )}
    </div>
  );
};

export default Dashboard;