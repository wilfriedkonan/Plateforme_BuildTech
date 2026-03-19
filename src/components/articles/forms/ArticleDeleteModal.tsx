import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ArticleDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: any;
  onDelete: () => void;
  onDeactivate: () => void;
  hasMouvements?: boolean;
}

const ArticleDeleteModal: React.FC<ArticleDeleteModalProps> = ({
  isOpen,
  onClose,
  article,
  onDelete,
  onDeactivate,
  hasMouvements = false
}) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Supprimer l'article ?</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-3">Vous êtes sur le point de supprimer :</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                {article.code}
              </span>
              <span className="font-semibold text-gray-900">{article.nom}</span>
            </div>
          </div>

          {hasMouvements ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-orange-800 text-sm mb-2">
                <strong>Impossible de supprimer :</strong> cet article a des mouvements de stock liés.
              </p>
              <p className="text-orange-700 text-sm">
                Les mouvements de stock seront conservés dans l'historique. Désactivez l'article à la place.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">
                <strong>⚠️ Cette action est irréversible.</strong>
              </p>
              <p className="text-red-700 text-sm mt-1">
                Les mouvements de stock liés seront conservés dans l'historique.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          {hasMouvements ? (
            <button
              onClick={() => {
                onDeactivate();
                onClose();
              }}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Désactiver l'article
            </button>
          ) : (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDeleteModal;
