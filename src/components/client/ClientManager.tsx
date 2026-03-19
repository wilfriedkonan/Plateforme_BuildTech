import React, { useState } from 'react';
import { Search, Download, RefreshCw, Plus, Users as UsersIcon, CheckCircle, BarChart3 } from 'lucide-react';
import { mockClients } from '../lib/mock/clients';
import ClientTable from './ClientTable';
import ClientDetailPanel from './ClientDetailPanel';

const ClientManager: React.FC = () => {
  const [clients] = useState(mockClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'tous' | 'actif' | 'inactif'>('tous');

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telephone.includes(searchTerm);

    const matchesStatus =
      filterStatus === 'tous' ||
      client.statut === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.statut === 'actif').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Clients</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg">
              <BarChart3 className="w-4 h-4" />
              <span className="font-semibold text-lg">{totalClients}</span>
              <span className="text-sm">Total</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold text-lg">{activeClients}</span>
              <span className="text-sm">Actifs</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span className="font-medium">Exporter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span className="font-medium">Actualiser</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nouveau Client</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="tous">Tous</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Liste des Clients</h3>
          </div>
          <ClientTable
            clients={filteredClients}
            selectedClientId={selectedClientId}
            onSelectClient={setSelectedClientId}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-3">
            <span>
              {filteredClients.length} clients trouvés | {activeClients} actifs
            </span>
            <span className="text-gray-500">
              Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ClientDetailPanel client={selectedClient} />
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
