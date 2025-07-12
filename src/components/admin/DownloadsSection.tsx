import React, { useState, useEffect } from 'react';
import { Download, Calendar, Filter, ExternalLink, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DownloadRecord {
  id: string;
  companyName: string;
  email: string;
  application: string;
  version: string;
  downloadDate: string;
  downloadTime: string;
  fileSize: string;
  ipAddress: string;
  userAgent: string;
  plan: string;
}

const DownloadsSection: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [appFilter, setAppFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Simulation de récupération des données
  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      
      setTimeout(() => {
        const companies = [
          'TechCorp Solutions', 'Digital Innovations', 'Smart Business', 'Future Systems',
          'Creative Agency', 'Data Analytics Pro', 'Cloud Services', 'Mobile First'
        ];
        
        const applications = [
          { name: 'Business Manager Pro', versions: ['2.1.4', '2.1.3', '2.1.2'], size: '45 MB' },
          { name: 'Security Suite', versions: ['1.8.2', '1.8.1', '1.8.0'], size: '32 MB' }
        ];
        
        const plans = ['Découverte', 'Standard', 'Pro'];
        const userAgents = [
          'Windows NT 10.0; Win64; x64',
          'Windows NT 11.0; Win64; x64',
          'Macintosh; Intel Mac OS X 10_15_7'
        ];
        
        const mockDownloads: DownloadRecord[] = Array.from({ length: 100 }, (_, i) => {
          const app = applications[Math.floor(Math.random() * applications.length)];
          const downloadDate = new Date();
          downloadDate.setDate(downloadDate.getDate() - Math.floor(Math.random() * 30));
          
          const downloadTime = new Date(downloadDate);
          downloadTime.setHours(Math.floor(Math.random() * 24));
          downloadTime.setMinutes(Math.floor(Math.random() * 60));
          
          return {
            id: `DL${String(i + 1).padStart(4, '0')}`,
            companyName: companies[i % companies.length] + ` ${Math.floor(i / companies.length) + 1}`,
            email: `contact${i + 1}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
            application: app.name,
            version: app.versions[Math.floor(Math.random() * app.versions.length)],
            downloadDate: downloadDate.toLocaleDateString('fr-FR'),
            downloadTime: downloadTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            fileSize: app.size,
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
            plan: plans[Math.floor(Math.random() * plans.length)]
          };
        });
        
        setDownloads(mockDownloads);
        setLoading(false);
      }, 1000);
    };

    fetchDownloads();
  }, []);

  // Filtrage des téléchargements
  const filteredDownloads = downloads.filter(download => {
    const matchesApp = appFilter === 'all' || download.application === appFilter;
    const matchesPlan = planFilter === 'all' || download.plan === planFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const downloadDate = new Date(download.downloadDate.split('/').reverse().join('-'));
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = downloadDate.toDateString() === now.toDateString();
          break;
        case '7days':
          matchesDate = (now.getTime() - downloadDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case '30days':
          matchesDate = (now.getTime() - downloadDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesApp && matchesPlan && matchesDate;
  });

  // Statistiques
  const stats = {
    total: downloads.length,
    today: downloads.filter(d => {
      const today = new Date().toLocaleDateString('fr-FR');
      return d.downloadDate === today;
    }).length,
    businessManager: downloads.filter(d => d.application === 'Business Manager Pro').length,
    securitySuite: downloads.filter(d => d.application === 'Security Suite').length,
    totalSize: downloads.reduce((sum, d) => {
      const size = parseFloat(d.fileSize.replace(' MB', ''));
      return sum + size;
    }, 0)
  };

  // Export en Excel
  const exportToExcel = () => {
    const exportData = filteredDownloads.map(download => ({
      'ID': download.id,
      'Entreprise': download.companyName,
      'Email': download.email,
      'Application': download.application,
      'Version': download.version,
      'Date': download.downloadDate,
      'Heure': download.downloadTime,
      'Taille': download.fileSize,
      'Plan': download.plan,
      'Adresse IP': download.ipAddress,
      'Navigateur': download.userAgent
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Téléchargements');
    XLSX.writeFile(workbook, `telechargements_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Téléchargements</h1>
          <p className="text-gray-600">Suivi des téléchargements d'applications</p>
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
              <Download className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.total}
          </h3>
          <p className="text-gray-600 text-sm">Total téléchargements</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.today}
          </h3>
          <p className="text-gray-600 text-sm">Aujourd'hui</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.businessManager}
          </h3>
          <p className="text-gray-600 text-sm">Business Manager Pro</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stats.securitySuite}
          </h3>
          <p className="text-gray-600 text-sm">Security Suite</p>
        </div>
      </div>

      {/* Répartition par application */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par application</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.businessManager}</div>
            <div className="text-sm text-gray-600">Business Manager Pro</div>
            <div className="text-xs text-gray-500">
              {((stats.businessManager / stats.total) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.securitySuite}</div>
            <div className="text-sm text-gray-600">Security Suite</div>
            <div className="text-xs text-gray-500">
              {((stats.securitySuite / stats.total) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.totalSize.toFixed(1)} GB</div>
            <div className="text-sm text-gray-600">Volume total</div>
            <div className="text-xs text-gray-500">Données transférées</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Toutes les applications</option>
            <option value="Business Manager Pro">Business Manager Pro</option>
            <option value="Security Suite">Security Suite</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
          </select>

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

          <div className="text-sm text-gray-600 flex items-center">
            <span>{filteredDownloads.length} téléchargement(s) trouvé(s)</span>
          </div>
        </div>
      </div>

      {/* Tableau des téléchargements */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDownloads.map((download) => (
                <tr key={download.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{download.companyName}</div>
                      <div className="text-sm text-gray-500">{download.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{download.application}</div>
                      <div className="text-sm text-gray-500">v{download.version}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{download.downloadDate}</div>
                      <div className="text-sm text-gray-500">{download.downloadTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      download.plan === 'Pro' ? 'bg-purple-100 text-purple-800' :
                      download.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {download.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {download.fileSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {download.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                      title="Voir les détails"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDownloads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun téléchargement trouvé</p>
              <p>Essayez de modifier vos critères de filtrage</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsSection;