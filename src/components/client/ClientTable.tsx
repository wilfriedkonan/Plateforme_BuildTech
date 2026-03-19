import React from 'react';
import { Eye, BarChart3, Trash2, MessageSquare, QrCode } from 'lucide-react';
import { Client } from '../lib/mock/clients';

interface ClientTableProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, selectedClientId, onSelectClient }) => {
  const getInitials = (nom: string) => {
    const parts = nom.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (nom: string) => {
    const colors = [
      'bg-teal-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    const index = nom.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                État
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {clients.map((client) => (
              <tr
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedClientId === client.id
                    ? 'bg-teal-50 border-l-4 border-l-teal-600'
                    : ''
                }`}
              >
                <td className="px-4 py-3">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                    {client.code}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getAvatarColor(client.nom)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-sm font-bold">{getInitials(client.nom)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{client.nom}</p>
                      <p className="text-xs text-gray-500">{client.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 text-sm">{client.telephone}</span>
                    <QrCode className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {client.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {client.statut === 'actif' ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      <span className="mr-1">✓</span> Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Inactif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Voir la fiche');
                      }}
                      title="Voir la fiche"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Statistiques');
                      }}
                      title="Statistiques"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Supprimer ce client ?')) {
                          alert('Client supprimé');
                        }
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Messagerie/Note');
                      }}
                      title="Messagerie"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
