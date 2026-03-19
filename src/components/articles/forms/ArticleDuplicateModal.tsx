import React, { useState } from 'react';
import { X, Copy } from 'lucide-react';

interface ArticleDuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: any;
  onDuplicate: (data: any) => void;
}

const ArticleDuplicateModal: React.FC<ArticleDuplicateModalProps> = ({
  isOpen,
  onClose,
  article,
  onDuplicate
}) => {
  const [formData, setFormData] = useState({
    nom: `Copie de - ${article?.nom || ''}`,
    stockInitial: '0',
    conserverPrix: true,
    conserverCategorie: true,
    conserverDescription: true
  });

  const handleDuplicate = () => {
    onDuplicate({
      ...formData,
      stockInitial: parseInt(formData.stockInitial)
    });
    onClose();
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Copy className="w-6 h-6 text-teal-600" />
            <h3 className="text-xl font-bold text-gray-900">Dupliquer l'article</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Dupliquer :</p>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                  {article.code}
                </span>
                <span className="font-semibold text-gray-900">{article.nom}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du nouvel article <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock initial pour la copie
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={formData.stockInitial}
                onChange={(e) => setFormData({ ...formData, stockInitial: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
              />
              <span className="ml-2 text-sm text-gray-600">unités</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.conserverPrix}
                onChange={(e) => setFormData({ ...formData, conserverPrix: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Conserver le même prix</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.conserverCategorie}
                onChange={(e) => setFormData({ ...formData, conserverCategorie: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Conserver la même catégorie</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.conserverDescription}
                onChange={(e) => setFormData({ ...formData, conserverDescription: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Conserver la description</span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleDuplicate}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Dupliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDuplicateModal;
