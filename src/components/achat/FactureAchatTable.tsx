import React from 'react';
import { Eye, CheckCircle, Trash2 } from 'lucide-react';
import { FactureAchat } from '../lib/mock/facturesAchat';
import { mockFournisseurs } from '../lib/mock/fournisseurs';

interface FactureAchatTableProps {
  factures: FactureAchat[];
}

const FactureAchatTable: React.FC<FactureAchatTableProps> = ({ factures }) => {
  const getFournisseurNom = (fournisseurId: string) => {
    const fournisseur = mockFournisseurs.find(f => f.id === fournisseurId);
    return fournisseur?.nom || 'Inconnu';
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'payee':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            <span className="mr-1">🟢</span> Payée
          </span>
        );
      case 'en_attente':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
            <span className="mr-1">🟡</span> En attente
          </span>
        );
      case 'en_retard':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            <span className="mr-1">🔴</span> En retard
          </span>
        );
      default:
        return null;
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                N° Facture
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fournisseur
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Désignation
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Montant HT
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                TVA
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Montant TTC
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {factures.map((facture) => (
              <tr key={facture.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {facture.numero}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {new Date(facture.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900 text-sm">
                    {getFournisseurNom(facture.fournisseurId)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {facture.designation}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 text-sm">
                  {formatAmount(facture.montantHT)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {formatAmount(facture.tva)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900 text-sm">
                  {formatAmount(facture.montantTTC)}
                </td>
                <td className="px-4 py-3">
                  {getStatutBadge(facture.statut)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                      onClick={() => alert('Voir détail')}
                      title="Voir détail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {facture.statut !== 'payee' && (
                      <button
                        className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors"
                        onClick={() => {
                          if (confirm('Marquer cette facture comme payée ?')) {
                            alert('Facture marquée comme payée');
                          }
                        }}
                        title="Marquer payée"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                      onClick={() => {
                        if (confirm('Supprimer cette facture ?')) {
                          alert('Facture supprimée');
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

export default FactureAchatTable;
