import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useFournisseur } from '../../hooks/useFournisseur';
import { FournisseurFilters } from '../../services/fournisseurService';
import FournisseurTable from './FournisseurTable';
import FournisseurDetail from './FournisseurDetail';
import FournisseurForm from './forms/FournisseurForm';

const FournisseurManager: React.FC = () => {
  const { fournisseurs, loading, error, pagination, totals, fetchFournisseurs, createFournisseur, updateFournisseur, deleteFournisseur } = useFournisseur();
  const [selectedFournisseurId, setSelectedFournisseurId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FournisseurFilters>({
    page: 1,
    pageSize: 20,
    searchTerm: undefined,
    orderBy: 'nom',
    orderDirection: 'asc',
  });

  // Charger les fournisseurs au montage et quand les filtres changent
  useEffect(() => {
    fetchFournisseurs(filters);
  }, [filters, fetchFournisseurs]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      searchTerm: searchInput || undefined,
    }));
  };

  const handleAddFournisseur = () => {
    setEditingFournisseur(null);
    setIsFormOpen(true);
  };

  const handleEditFournisseur = (fournisseur: any) => {
    setEditingFournisseur(fournisseur);
    setIsFormOpen(true);
  };

  const handleDeleteFournisseur = async (id: string) => {
    try {
      const success = await deleteFournisseur(id);
      if (success) {
        await fetchFournisseurs(filters);
        if (selectedFournisseurId === id) {
          setSelectedFournisseurId(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSaveFournisseur = async (data: any) => {
    try {
      if (editingFournisseur) {
        await updateFournisseur(editingFournisseur.id, data);
      } else {
        await createFournisseur(data);
      }
      await fetchFournisseurs(filters);
      setIsFormOpen(false);
      setEditingFournisseur(null);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const selectedFournisseur = fournisseurs.find(f => f.id === selectedFournisseurId) || null;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fournisseurs</h2>
          <p className="text-gray-600 mt-1">Gérez vos fournisseurs et leurs informations</p>
        </div>
        <button
          onClick={handleAddFournisseur}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Fournisseur</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Total Fournisseurs</p>
          <p className="text-2xl font-bold text-gray-900">{totals.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600">{totals.totalActifs}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Inactifs</p>
          <p className="text-2xl font-bold text-red-600">{totals.totalInactifs}</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un fournisseur..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher</span>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
          ) : (
            <>
              <FournisseurTable
                fournisseurs={fournisseurs}
                selectedFournisseurId={selectedFournisseurId}
                onSelectFournisseur={setSelectedFournisseurId}
                onEdit={handleEditFournisseur}
                onDelete={handleDeleteFournisseur}
              />

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage} sur {pagination.totalPages} | {pagination.totalRecords} fournisseurs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      page: prev.page ? prev.page - 1 : 1,
                    }))}
                    disabled={!pagination.hasPrevious}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      page: (prev.page || 1) + 1,
                    }))}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Détails */}
        <div className="lg:col-span-1">
          <FournisseurDetail fournisseur={selectedFournisseur} />
        </div>
      </div>

      {/* Formulaire */}
      <FournisseurForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFournisseur(null);
        }}
        onSave={handleSaveFournisseur}
        fournisseur={editingFournisseur}
      />
    </div>
  );
};

export default FournisseurManager;
