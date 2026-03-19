import React from 'react';
import { Building2, Phone, Tag, Mail, MapPin, FileText } from 'lucide-react';
import { Fournisseur } from '../../services/fournisseurService';

interface FournisseurDetailProps {
  fournisseur: Fournisseur | null;
}

const FournisseurDetail: React.FC<FournisseurDetailProps> = ({ fournisseur }) => {
  const getInitials = (nom: string) => {
    const parts = nom.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (nom: string) => {
    const colors = [
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-emerald-500',
      'bg-cyan-500'
    ];
    const index = nom.length % colors.length;
    return colors[index];
  };

  if (!fournisseur) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">Sélectionnez un fournisseur</p>
        <p className="text-gray-400 text-sm">pour voir les détails</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col items-center mb-6">
        <div className={`w-24 h-24 ${getAvatarColor(fournisseur.nom)} rounded-full flex items-center justify-center mb-3`}>
          <span className="text-white text-2xl font-bold">{getInitials(fournisseur.nom)}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg text-center">{fournisseur.nom}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
          {fournisseur.code}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Contact</p>
            <p className="font-medium text-gray-900">{fournisseur.contact}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Spécialité</p>
            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              {fournisseur.specialite}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Dernières factures</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">FA250001</span>
            <span className="font-medium text-gray-900">531 000 F</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">FA250004</span>
            <span className="font-medium text-gray-900">377 600 F</span>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
        Voir historique achats
      </button>
    </div>
  );
};

export default FournisseurDetail;
