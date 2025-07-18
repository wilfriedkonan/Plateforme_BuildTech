import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, CreditCard, Download, TrendingUp, Eye, Calendar,
  UserPlus, DollarSign, Activity, RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalDownloads: number;
  monthlyRevenue: number;
  newUsersToday: number;
  otpAttempts: number;
  conversionRate: number;
  avgSessionTime: string;
}

interface ChartData {
  date: string;
  users: number;
  downloads: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('30days');

  // Données pour le graphique en secteurs des plans
  const planData = [
    { name: 'Découverte', value: 45, color: '#94a3b8' },
    { name: 'Standard', value: 35, color: '#64748b' },
    { name: 'Pro', value: 20, color: '#475569' }
  ];

  // Simulation de récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulation d'appel API
      setTimeout(() => {
        const mockStats: DashboardStats = {
          totalUsers: 1247,
          activeSubscriptions: 892,
          totalDownloads: 3456,
          monthlyRevenue: 45780,
          newUsersToday: 23,
          otpAttempts: 156,
          conversionRate: 68.5,
          avgSessionTime: '4m 32s'
        };

        // Génération des données de graphique
        const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
        const mockChartData: ChartData[] = Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          
          return {
            date: date.toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'short' 
            }),
            users: Math.floor(Math.random() * 50) + 10,
            downloads: Math.floor(Math.random() * 100) + 20,
            revenue: Math.floor(Math.random() * 2000) + 500
          };
        });

        setStats(mockStats);
        setChartData(mockChartData);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [period]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      if (stats) {
        setStats({
          ...stats,
          newUsersToday: stats.newUsersToday + Math.floor(Math.random() * 5),
          totalDownloads: stats.totalDownloads + Math.floor(Math.random() * 10)
        });
      }
      setLoading(false);
    }, 500);
  };

  if (loading && !stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble de votre plateforme Build Tech Solutions</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
          </select>
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +{stats.newUsersToday} aujourd'hui
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalUsers.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Utilisateurs inscrits</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {stats.conversionRate}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.activeSubscriptions.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Abonnements actifs</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                +12% ce mois
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalDownloads.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-sm">Téléchargements</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +8.5% ce mois
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats.monthlyRevenue.toLocaleString()} €
            </h3>
            <p className="text-gray-600 text-sm">Revenus mensuels</p>
          </div>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique principal */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Évolution des métriques</h2>
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

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#64748b" strokeWidth={3} />
                  <Line type="monotone" dataKey="downloads" stroke="#94a3b8" strokeWidth={3} />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="users" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="downloads" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-8 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Téléchargements</span>
            </div>
          </div>
        </div>

        {/* Répartition des plans */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Répartition des plans</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {planData.map((plan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: plan.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{plan.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{plan.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métriques supplémentaires */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tentatives OTP</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.otpAttempts}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Aujourd'hui</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Taux de conversion</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Ce mois</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Temps de session</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.avgSessionTime}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Moyenne</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nouveaux leads</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Aujourd'hui</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;