import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Eye, History, Truck, Phone } from 'lucide-react';
import { mockLivreurs, Livreur } from '../lib/mock/livreurs';
import LivreurForm from './forms/livreurs/LivreurForm';
import { LivreurDeleteModal } from './forms/livreurs/LivreurDeleteModal';

interface LivreurManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const LivreurManager: React.FC<LivreurManagerProps> = ({ onRegisterNewAction }) => {
  const [livreurs, setLivreurs] = useState(mockLivreurs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLivreur, setEditingLivreur] = useState<Livreur | null>(null);
  const [deletingLivreur, setDeletingLivreur] = useState<Livreur | null>(null);

  const handleNewLivreur = () => {
    setEditingLivreur(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(() => handleNewLivreur);
    }
  }, [onRegisterNewAction]);

  const handleEditLivreur = (livreur: Livreur) => {
    setEditingLivreur(livreur);
    setIsFormOpen(true);
  };

  const handleSaveLivreur = (data: Partial<Livreur>) => {
    if (editingLivreur) {
      setLivreurs(livreurs.map(l =>
        l.id === editingLivreur.id ? { ...l, ...data } : l
      ));
    } else {
      const newLivreur: Livreur = {
        id: `L${Date.now()}`,
        code: `LIV${(livreurs.length + 1).toString().padStart(3, '0')}`,
        ...data as Omit<Livreur, 'id' | 'code'>
      };
      setLivreurs([...livreurs, newLivreur]);
    }
    setIsFormOpen(false);
    setEditingLivreur(null);
  };

  const handleViewLivreur = (livreur: Livreur) => {
    alert(`Fiche détaillée de ${livreur.nom} - À implémenter`);
  };

  const handleViewHistory = (livreur: Livreur) => {
    alert(`Historique des livraisons de ${livreur.nom} - À implémenter`);
  };

  const handleDeleteLivreur = (id: string) => {
    setLivreurs(livreurs.filter(l => l.id !== id));
    setDeletingLivreur(null);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Disponible</span>;
      case 'en_livraison':
        return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">En livraison</span>;
      case 'inactif':
        return <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">Inactif</span>;
      default:
        return null;
    }
  };

  const getVehiculeBadge = (vehicule: string) => {
    const colors: Record<string, string> = {
      'Moto': 'bg-blue-100 text-blue-700',
      'Vélo': 'bg-green-100 text-green-700',
      'Voiture': 'bg-purple-100 text-purple-700'
    };
    return <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${colors[vehicule] || 'bg-gray-100 text-gray-700'}`}>{vehicule}</span>;
  };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Livreurs</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Livreur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Véhicule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {livreurs.map((livreur) => (
                  <tr key={livreur.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {livreur.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{getInitials(livreur.nom)}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{livreur.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{livreur.telephone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{livreur.zone}</td>
                    <td className="px-4 py-3">{getVehiculeBadge(livreur.vehicule)}</td>
                    <td className="px-4 py-3">{getStatutBadge(livreur.statut)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                          onClick={() => handleViewLivreur(livreur)}
                          title="Voir fiche"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                          onClick={() => handleViewHistory(livreur)}
                          title="Historique"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded transition-colors"
                          onClick={() => handleEditLivreur(livreur)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                          onClick={() => setDeletingLivreur(livreur)}
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
          {livreurs.length} livreurs | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
        </div>
      </div>

      <LivreurForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLivreur(null);
        }}
        onSave={handleSaveLivreur}
        livreur={editingLivreur}
      />

      <LivreurDeleteModal
        isOpen={!!deletingLivreur}
        onClose={() => setDeletingLivreur(null)}
        onConfirm={handleDeleteLivreur}
        livreur={deletingLivreur}
      />
    </div>
  );
};

export default LivreurManager;
