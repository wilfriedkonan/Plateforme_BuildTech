import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { mockArticles } from '../../lib/mock/articles';

interface CategorieDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorie: any;
  onDelete: () => void;
}

const CategorieDeleteModal: React.FC<CategorieDeleteModalProps> = ({
  isOpen,
  onClose,
  categorie,
  onDelete
}) => {
  if (!isOpen || !categorie) return null;

  const articlesLinked = mockArticles.filter(a => a.categorieId === categorie.id).length;
  const canDelete = articlesLinked === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Supprimer la catégorie ?</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${categorie.couleur}20`,
                color: categorie.couleur,
                border: `1px solid ${categorie.couleur}40`
              }}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: categorie.couleur }}
              />
              {categorie.nom}
            </span>
          </div>

          <p className="text-gray-700 mb-4">
            Cette catégorie contient <strong>{articlesLinked} article(s)</strong>.
          </p>

          {canDelete ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>⚠️ Cette action est irréversible.</strong>
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm mb-2">
                <strong>🚫 Suppression impossible</strong>
              </p>
              <p className="text-orange-700 text-sm">
                Veuillez d'abord réaffecter ou supprimer les {articlesLinked} articles liés.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          {canDelete ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => alert('Voir les articles liés')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir les articles liés
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorieDeleteModal;
