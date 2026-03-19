import React from 'react';
import { User, Phone, Calendar, Briefcase } from 'lucide-react';
import { Client } from '../lib/mock/clients';

interface ClientDetailPanelProps {
  client: Client | null;
}

const ClientDetailPanel: React.FC<ClientDetailPanelProps> = ({ client }) => {
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

  if (!client) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">Sélectionnez un client</p>
        <p className="text-gray-400 text-sm">pour voir les détails</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col items-center mb-6">
        <div className={`w-24 h-24 ${getAvatarColor(client.nom)} rounded-full flex items-center justify-center mb-3`}>
          <span className="text-white text-2xl font-bold">{getInitials(client.nom)}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg text-center">{client.nom}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
          {client.code}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Téléphone</p>
            <p className="font-medium text-gray-900">{client.telephone}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
              {client.type}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Date de création</p>
            <p className="font-medium text-gray-900">
              {new Date(client.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
        Voir fiche complète
      </button>
    </div>
  );
};

export default ClientDetailPanel;
