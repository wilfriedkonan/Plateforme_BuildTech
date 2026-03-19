import React from 'react';
import { Eye, Trash2, Edit2 } from 'lucide-react';
import { Fournisseur } from '../../services/fournisseurService';

interface FournisseurTableProps {
  fournisseurs: Fournisseur[];
  selectedFournisseurId: string | null;
  onSelectFournisseur: (fournisseurId: string) => void;
  onEdit: (fournisseur: Fournisseur) => void;
  onDelete: (id: string) => void;
}

const FournisseurTable: React.FC<FournisseurTableProps> = ({
  fournisseurs,
  selectedFournisseurId,
  onSelectFournisseur,
  onEdit,
  onDelete
}) => {
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

  const getSpecialiteColor = (specialite: string) => {
    const colorMap: Record<string, string> = {
      'Alimentaire': 'bg-green-100 text-green-700',
      'Matériaux': 'bg-orange-100 text-orange-700',
      'Informatique': 'bg-blue-100 text-blue-700',
      'Logistique': 'bg-purple-100 text-purple-700',
      'Fournitures': 'bg-yellow-100 text-yellow-700'
    };
    return colorMap[specialite] || 'bg-gray-100 text-gray-700';
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
                Fournisseur
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Spécialité
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
            {fournisseurs.map((fournisseur) => (
              <tr
                key={fournisseur.id}
                onClick={() => onSelectFournisseur(fournisseur.id)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedFournisseurId === fournisseur.id
                    ? 'bg-teal-50 border-l-4 border-l-teal-600'
                    : ''
                }`}
              >
                <td className="px-4 py-3">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {fournisseur.code}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getAvatarColor(fournisseur.nom)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-sm font-bold">{getInitials(fournisseur.nom)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{fournisseur.nom}</p>
                      <p className="text-xs text-gray-500">{fournisseur.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-700 text-sm">{fournisseur.contact}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getSpecialiteColor(fournisseur.specialite)}`}>
                    {fournisseur.specialite}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {fournisseur.etat === 'Actif' ? (
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
                        onSelectFournisseur(fournisseur.id);
                      }}
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(fournisseur);
                      }}
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
                          onDelete(fournisseur.id);
                        }
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default FournisseurTable;
