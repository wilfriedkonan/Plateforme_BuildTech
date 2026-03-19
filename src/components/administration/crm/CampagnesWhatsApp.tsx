import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Copy, Play, BarChart3, XCircle, Send } from 'lucide-react';
import { mockCampagnes, CampagneWhatsApp } from '../../lib/mock/campagnesWhatsApp';

interface CampagnesWhatsAppProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const CampagnesWhatsApp: React.FC<CampagnesWhatsAppProps> = ({ onRegisterNewAction }) => {
  const [campagnes, setCampagnes] = useState(mockCampagnes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState<CampagneWhatsApp | null>(null);

  const handleNewCampagne = () => {
    setEditingCampagne(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(handleNewCampagne);
    }
  }, [onRegisterNewAction]);

  const handleEditCampagne = (campagne: CampagneWhatsApp) => {
    setEditingCampagne(campagne);
    setIsFormOpen(true);
  };

  const handleViewReport = (campagne: CampagneWhatsApp) => {
    alert(`Rapport de la campagne "${campagne.nom}" - À implémenter`);
  };

  const handleLaunchCampagne = (campagne: CampagneWhatsApp) => {
    if (confirm(`Lancer la campagne "${campagne.nom}" maintenant ?`)) {
      setCampagnes(campagnes.map(c =>
        c.id === campagne.id ? { ...c, statut: 'en_cours' } : c
      ));
    }
  };

  const handleCancelCampagne = (campagne: CampagneWhatsApp) => {
    if (confirm(`Annuler la campagne "${campagne.nom}" ?`)) {
      setCampagnes(campagnes.map(c =>
        c.id === campagne.id ? { ...c, statut: 'annulee' } : c
      ));
    }
  };

  const handleDeleteCampagne = (campagne: CampagneWhatsApp) => {
    if (confirm(`Supprimer la campagne "${campagne.nom}" ?`)) {
      setCampagnes(campagnes.filter(c => c.id !== campagne.id));
    }
  };

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'tous':
        return <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded mr-1 mb-1">Tous</span>;
      case 'a_risque':
        return <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded mr-1 mb-1">À risque</span>;
      case 'inactifs':
        return <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded mr-1 mb-1">Inactifs</span>;
      case 'nouveaux':
        return <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mr-1 mb-1">Nouveaux</span>;
      case 'vip':
        return <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded mr-1 mb-1">VIP</span>;
      default:
        return null;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'brouillon':
        return <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">🟡 Brouillon</span>;
      case 'planifiee':
        return <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">🔵 Planifiée</span>;
      case 'en_cours':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">🟢 En cours</span>;
      case 'terminee':
        return <span className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">✓ Terminée</span>;
      case 'annulee':
        return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">🔴 Annulée</span>;
      default:
        return null;
    }
  };

  const totalCampagnes = campagnes.length;
  const enCours = campagnes.filter(c => c.statut === 'en_cours' || c.statut === 'planifiee').length;
  const terminees = campagnes.filter(c => c.statut === 'terminee').length;
  const tauxOuvertureMoyen = campagnes
    .filter(c => c.rapport)
    .reduce((acc, c) => {
      const taux = c.rapport ? (c.rapport.lus / c.rapport.delivres) * 100 : 0;
      return acc + taux;
    }, 0) / campagnes.filter(c => c.rapport).length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-700 mb-1">Total campagnes</p>
              <p className="text-3xl font-bold text-teal-900">{totalCampagnes}</p>
            </div>
            <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-teal-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">En cours</p>
              <p className="text-3xl font-bold text-blue-900">{enCours}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Terminées</p>
              <p className="text-3xl font-bold text-green-900">{terminees}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Taux ouverture</p>
              <p className="text-3xl font-bold text-purple-900">{tauxOuvertureMoyen.toFixed(0)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campagnes WhatsApp</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom campagne</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cible</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Destinataires</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Envoyés</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date envoi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {campagnes.map((campagne) => (
                  <tr key={campagne.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {campagne.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-semibold text-gray-900">{campagne.nom}</span>
                        {campagne.description && (
                          <p className="text-xs text-gray-500">{campagne.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap">
                        {campagne.segment.map((seg) => getSegmentBadge(seg))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-gray-900">{campagne.nbDestinataires}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-gray-900">
                          {campagne.envoyes}/{campagne.nbDestinataires}
                        </span>
                        {campagne.nbDestinataires > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-teal-600 h-1.5 rounded-full"
                              style={{ width: `${(campagne.envoyes / campagne.nbDestinataires) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {campagne.dateEnvoi ? new Date(campagne.dateEnvoi).toLocaleString('fr-FR') : '-'}
                    </td>
                    <td className="px-4 py-3">{getStatutBadge(campagne.statut)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        {campagne.statut === 'terminee' && (
                          <button
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                            onClick={() => handleViewReport(campagne)}
                            title="Voir rapport"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        )}
                        {campagne.statut === 'brouillon' && (
                          <>
                            <button
                              className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                              onClick={() => handleEditCampagne(campagne)}
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors"
                              onClick={() => handleLaunchCampagne(campagne)}
                              title="Lancer"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {campagne.statut === 'planifiee' && (
                          <button
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                            onClick={() => handleCancelCampagne(campagne)}
                            title="Annuler"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded transition-colors"
                          onClick={() => alert(`Dupliquer la campagne "${campagne.nom}" - À implémenter`)}
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {campagne.statut === 'brouillon' && (
                          <button
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                            onClick={() => handleDeleteCampagne(campagne)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-sm text-gray-600 px-4 mt-4">
          {campagnes.length} campagnes | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
        </div>
      </div>
    </div>
  );
};

export default CampagnesWhatsApp;
