import React, { useEffect } from 'react';
import { Edit2, Trash2, Tag, Loader } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { Categorie } from '../../services/categorieService';

interface CategorieTableProps {
  categories?: Categorie[];
  onEdit?: (categorie: Categorie) => void;
  onDelete?: (categorieId: string) => void;
}

const CategorieTable: React.FC<CategorieTableProps> = ({ categories: propCategories, onEdit, onDelete }) => {
  const { categories: apiCategories, loading, error, fetchCategories, deleteCategorie } = useCategories();
  const categories = propCategories || apiCategories;

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const totalCategories = categories.length;
  const categoriesActives = categories.filter(c => c.statut === true).length;
  const categoriesRestaurant = categories.filter(c => c.estRestaurant === true).length;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Total catégories</p>
              <p className="text-3xl font-bold text-blue-900">{totalCategories}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Catégories actives</p>
              <p className="text-3xl font-bold text-green-900">{categoriesActives}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Catégories Restaurant</p>
              <p className="text-3xl font-bold text-purple-900">{categoriesRestaurant}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-gray-400 animate-spin mr-3" />
          <span className="text-gray-600">Chargement des catégories...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des Catégories</h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Désignation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Couleur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">État</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {categories.length > 0 ? (
                    categories.map((categorie) => (
                      <tr key={categorie.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {categorie.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900">{categorie.designation}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: categorie.couleur }}
                            ></div>
                            <span className="text-sm text-gray-600">{categorie.couleur}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{categorie.etat}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {categorie.estRestaurant && (
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                Restaurant
                              </span>
                            )}
                            {categorie.estEmporte && (
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                Emporté
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {categorie.statut ? (
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
                              onClick={() => onEdit && onEdit(categorie)}
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                              onClick={async () => {
                                if (categorie.id && window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                                  try {
                                    if (onDelete) {
                                      await onDelete(categorie.id);
                                    } else {
                                      await deleteCategorie(categorie.id);
                                    }
                                    alert('Catégorie supprimée avec succès');
                                  } catch (err: any) {
                                    alert(`Erreur: ${err.message}`);
                                  }
                                }
                              }}
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center">
                        <p className="text-gray-600">Aucune catégorie trouvée</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-sm text-gray-600 px-4 mt-4">
            {categories.length} catégorie(s) | <span className="font-semibold">Build Tech</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorieTable;
