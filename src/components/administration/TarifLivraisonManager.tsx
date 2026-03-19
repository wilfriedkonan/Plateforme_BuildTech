import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, MapPin, DollarSign } from 'lucide-react';
import { mockTarifsLivraison, TarifLivraison } from '../lib/mock/tarifsLivraison';
import TarifLivraisonForm from './forms/tarifs/TarifLivraisonForm';
import { TarifLivraisonDeleteModal } from './forms/tarifs/TarifLivraisonDeleteModal';

interface TarifLivraisonManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const TarifLivraisonManager: React.FC<TarifLivraisonManagerProps> = ({ onRegisterNewAction }) => {
  const [tarifs, setTarifs] = useState(mockTarifsLivraison);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarif, setEditingTarif] = useState<TarifLivraison | null>(null);
  const [deletingTarif, setDeletingTarif] = useState<TarifLivraison | null>(null);

  const handleNewTarif = () => {
    setEditingTarif(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(handleNewTarif);
    }
  }, [onRegisterNewAction]);

  const handleEditTarif = (tarif: TarifLivraison) => {
    setEditingTarif(tarif);
    setIsFormOpen(true);
  };

  const handleSaveTarif = (data: Partial<TarifLivraison>) => {
    if (editingTarif) {
      setTarifs(tarifs.map(t =>
        t.id === editingTarif.id ? { ...t, ...data } : t
      ));
    } else {
      const newTarif: TarifLivraison = {
        id: `T${Date.now()}`,
        code: `TRF${(tarifs.length + 1).toString().padStart(3, '0')}`,
        ...data as Omit<TarifLivraison, 'id' | 'code'>
      };
      setTarifs([...tarifs, newTarif]);
    }
    setIsFormOpen(false);
    setEditingTarif(null);
  };

  const handleDeleteTarif = (id: string) => {
    setTarifs(tarifs.filter(t => t.id !== id));
    setDeletingTarif(null);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Tarifs de Livraison</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zone</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Distance max (km)</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Tarif de base</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Tarif/km sup.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tarifs.map((tarif) => (
                  <tr key={tarif.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {tarif.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{tarif.zone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {tarif.distanceMax} km
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatAmount(tarif.tarifBase)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{formatAmount(tarif.tarifParKm)}</td>
                    <td className="px-4 py-3">
                      {tarif.statut === 'actif' ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          ✓ Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                          onClick={() => handleEditTarif(tarif)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                          onClick={() => setDeletingTarif(tarif)}
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
        <div className="text-sm text-gray-600 px-4 mt-4">
          {tarifs.length} tarifs | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <DollarSign className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <p className="font-semibold text-blue-900 mb-2">Calcul du tarif de livraison</p>
            <p className="text-sm text-blue-700">
              Le tarif final est calculé ainsi : <strong>Tarif de base</strong> + (distance supplémentaire × <strong>Tarif/km sup.</strong>)
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Exemple : Pour une livraison à 15 km en zone "Yopougon" : 2000 F + (5 km × 350 F) = 3750 F
            </p>
          </div>
        </div>
      </div>

      <TarifLivraisonForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTarif(null);
        }}
        onSave={handleSaveTarif}
        tarif={editingTarif}
      />

      <TarifLivraisonDeleteModal
        isOpen={!!deletingTarif}
        onClose={() => setDeletingTarif(null)}
        onConfirm={handleDeleteTarif}
        tarif={deletingTarif}
      />
    </div>
  );
};

export default TarifLivraisonManager;
