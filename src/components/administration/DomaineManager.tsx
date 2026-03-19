import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Globe, CheckCircle } from 'lucide-react';
import { mockDomaines } from '../lib/mock/domaines';
import DomaineForm from './forms/domaines/DomaineForm';

interface DomaineManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const DomaineManager: React.FC<DomaineManagerProps> = ({ onRegisterNewAction }) => {
  const [domaines, setDomaines] = useState(mockDomaines);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDomaine, setEditingDomaine] = useState<any>(null);

  const handleNewDomaine = () => {
    setEditingDomaine(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(handleNewDomaine);
    }
  }, [onRegisterNewAction]);

  const handleEditDomaine = (domaine: any) => {
    setEditingDomaine(domaine);
    setIsFormOpen(true);
  };

  const handleSaveDomaine = (domaineData: any) => {
    if (editingDomaine) {
      // Si on active ce domaine, désactiver tous les autres
      const updatedDomaines = domaines.map(d => ({
        ...d,
        actif: d.id === editingDomaine.id ? domaineData.actif : (domaineData.actif ? false : d.actif)
      }));
      setDomaines(updatedDomaines.map(d =>
        d.id === editingDomaine.id ? { ...d, ...domaineData } : d
      ));
    } else {
      const newDomaine = {
        id: `DOM${Date.now()}`,
        ...domaineData
      };
      // Si le nouveau domaine est actif, désactiver tous les autres
      if (domaineData.actif) {
        setDomaines([...domaines.map(d => ({ ...d, actif: false })), newDomaine]);
      } else {
        setDomaines([...domaines, newDomaine]);
      }
    }
    setIsFormOpen(false);
    setEditingDomaine(null);
  };

  const domaineActif = domaines.find(d => d.actif);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-900">Note importante</p>
            <p className="text-sm text-blue-700">Un seul domaine peut être actif à la fois. Le domaine actif détermine les fonctionnalités disponibles dans l'application.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Domaines</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom Domaine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actif</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {domaines.map((domaine) => (
                  <tr
                    key={domaine.id}
                    className={`transition-colors ${domaine.actif ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        domaine.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {domaine.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          domaine.actif ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Globe className={`w-5 h-5 ${domaine.actif ? 'text-green-600' : 'text-gray-600'}`} />
                        </div>
                        <span className="font-semibold text-gray-900">{domaine.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{domaine.description}</td>
                    <td className="px-4 py-3">
                      {domaine.actif ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          ✓ ACTIF
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                          onClick={() => handleEditDomaine(domaine)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 rounded transition-colors ${
                            domaine.actif
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          onClick={() => {
                            if (!domaine.actif && confirm('Supprimer ce domaine ?')) {
                              alert('Domaine supprimé');
                            }
                          }}
                          disabled={domaine.actif}
                          title={domaine.actif ? 'Impossible de supprimer le domaine actif' : 'Supprimer'}
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
        <div className="text-sm text-gray-600 px-4 mt-4">
          {domaines.length} domaines | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
        </div>
      </div>

      <DomaineForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDomaine(null);
        }}
        domaine={editingDomaine}
        onSave={handleSaveDomaine}
        domaineActifActuel={domaineActif}
      />
    </div>
  );
};

export default DomaineManager;
