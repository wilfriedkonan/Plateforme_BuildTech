import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Filter, Download, Eye, Check, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Subscription {
  id: string;
  companyName: string;
  email: string;
  plan: 'Découverte' | 'Standard' | 'Pro';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  amount: number;
  paymentMethod: string;
  autoRenewal: boolean;
}

const SubscriptionsSection: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Simulation de récupération des données
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      
      setTimeout(() => {
        const companies = [
          'TechCorp Solutions', 'Digital Innovations', 'Smart Business', 'Future Systems',
          'Creative Agency', 'Data Analytics Pro', 'Cloud Services', 'Mobile First',
          'AI Solutions', 'Cyber Security Plus', 'Web Development Co', 'Marketing Digital'
        ];
        
        const plans: ('Découverte' | 'Standard' | 'Pro')[] = ['Découverte', 'Standard', 'Pro'];
        const statuses: ('active' | 'expired' | 'cancelled')[] = ['active', 'expired', 'cancelled'];
        const paymentMethods = ['Carte bancaire', 'Orange Money', 'Wave', 'Virement'];
        
        const mockSubscriptions: Subscription[] = Array.from({ length: 40 }, (_, i) => {
          const plan = plans[Math.floor(Math.random() * plans.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 180));
          
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          
          const amounts = {
            'Découverte': 0,
            'Standard': 39,
            'Pro': 89
          };
          
          return {
            id: `SUB${String(i + 1).padStart(4, '0')}`,
            companyName: companies[i % companies.length] + ` ${Math.floor(i / companies.length) + 1}`,
            email: `contact${i + 1}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
            plan,
            startDate: startDate.toLocaleDateString('fr-FR'),
            endDate: endDate.toLocaleDateString('fr-FR'),
            status,
            amount: amounts[plan],
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            autoRenewal: Math.random() > 0.3
          };
        });
        
        setSubscriptions(mockSubscriptions);
        setLoading(false);
      }, 1000);
    };

    fetchSubscriptions();
  }, []);

  // Filtrage des abonnements
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesPlan = planFilter === 'all' || sub.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const subDate = new Date(sub.startDate.split('/').reverse().join('-'));
      const now = new Date();
      
      switch (dateFilter) {
        case '7days':
          matchesDate = (now.getTime() - subDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case '30days':
          matchesDate = (now.getTime() - subDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case '90days':
          matchesDate = (now.getTime() - subDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesPlan && matchesStatus && matchesDate;
  });

  // Statistiques
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    revenue: subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0),
    byPlan: {
      'Découverte': subscriptions.filter(s => s.plan === 'Découverte').length,
      'Standard': subscriptions.filter(s => s.plan === 'Standard').length,
      'Pro': subscriptions.filter(s => s.plan === 'Pro').length
    }
  };

  // Export en Excel
  const exportToExcel = () => {
    const exportData = filteredSubscriptions.map(sub => ({
      'ID': sub.id,
      'Entreprise': sub.companyName,
      'Email': sub.email,
      'Plan': sub.plan,
      'Date début': sub.startDate,
      'Date fin': sub.endDate,
      'Statut': sub.status === 'active' ? 'Actif' : sub.status === 'expired' ? 'Expiré' : 'Annulé',
      'Montant': `${sub.amount}€`,
      'Méthode paiement': sub.paymentMethod,
      'Renouvellement auto': sub.autoRenewal ? 'Oui' : 'Non'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Abonnements');
    XLSX.writeFile(workbook, `abonnements_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Abonnements</h1>
          <p className="text-gray-600">Gestion des abonnements et revenus</p>
        </div>
        <button
          onClick={exportToExcel}
          className="mt-4 md:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Exporter Excel</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total}
          </h3>
          <p className="text-gray-600 text-sm">Total abonnements</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.active}
          </h3>
          <p className="text-gray-600 text-sm">Abonnements actifs</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.revenue.toLocaleString()}€
          </h3>
          <p className="text-gray-600 text-sm">Revenus mensuels</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {((stats.active / stats.total) * 100).toFixed(1)}%
          </h3>
          <p className="text-gray-600 text-sm">Taux de rétention</p>
        </div>
      </div>

      {/* Répartition par plan */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.byPlan).map(([plan, count]) => (
            <div key={plan} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{plan}</div>
              <div className="text-xs text-gray-500">
                {((count / stats.total) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les plans</option>
            <option value="Découverte">Découverte</option>
            <option value="Standard">Standard</option>
            <option value="Pro">Pro</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
            <option value="cancelled">Annulé</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <span>{filteredSubscriptions.length} abonnement(s) trouvé(s)</span>
          </div>
        </div>
      </div>

      {/* Tableau des abonnements */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Renouvellement
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{subscription.companyName}</div>
                      <div className="text-sm text-gray-500">{subscription.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                      subscription.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Du {subscription.startDate}</div>
                      <div className="text-gray-500">Au {subscription.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subscription.amount === 0 ? 'Gratuit' : `${subscription.amount}€/mois`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                      subscription.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status === 'active' ? 'Actif' : 
                       subscription.status === 'expired' ? 'Expiré' : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.autoRenewal ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun abonnement trouvé</p>
              <p>Essayez de modifier vos critères de filtrage</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsSection;