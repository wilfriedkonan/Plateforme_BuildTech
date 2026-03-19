import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Crown, Download, Shield, Zap, TrendingUp, DollarSign, Users, Package, Activity, Calendar as CalendarIcon } from 'lucide-react';
import { User as UserType } from '../../App';

interface OverviewTabProps {
  user: UserType;
  activityData: ActivityData | null;
  loading: boolean;
  salesPeriod: '7days' | '30days' | '90days' | '1year';
  setSalesPeriod: (period: '7days' | '30days' | '90days' | '1year') => void;
  salesChartData: SalesChartData[];
  chartType: 'line' | 'bar';
  setChartType: (type: 'line' | 'bar') => void;
  getPeriodLabel: (period: string) => string;
  handleDownload: (appName: string) => void;
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

interface SalesChartData {
  date: string;
  sales: number;
  revenue: number;
}

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

const OverviewTab: React.FC<OverviewTabProps> = ({
  user,
  activityData,
  loading,
  salesPeriod,
  setSalesPeriod,
  salesChartData,
  chartType,
  setChartType,
  getPeriodLabel,
  handleDownload
}) => {
  return (
    <>
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
                  stroke="#64748b"
                  strokeWidth={3}
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#64748b', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  dot={{ fill: '#94a3b8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#94a3b8', strokeWidth: 2 }}
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
                <Bar dataKey="sales" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center space-x-8 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Nombre de ventes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Revenus (€)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <app.icon className="w-6 h-6 text-gray-700" />
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
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
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

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-6 h-6 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Abonnement</h3>
            </div>
            {user.isSubscribed ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">Plan actuel</p>
                <p className="font-semibold text-gray-800">{user.subscriptionPlan}</p>
                <p className="text-xs text-gray-500 mt-2">Expire le 15 février 2024</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Vous n'avez pas d'abonnement actif
                </p>
                <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg text-sm hover:shadow-lg transition-all duration-300">
                  Choisir un plan
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-gray-700" />
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
  );
};

export default OverviewTab;
