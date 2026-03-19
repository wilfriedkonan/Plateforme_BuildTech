import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { mockArticles } from '../../lib/mock/articles';
import { mockUtilisateurs } from '../../lib/mock/utilisateurs';

interface StockAjustementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const StockAjustementForm: React.FC<StockAjustementFormProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    articleId: '',
    stockReel: '',
    motif: 'inventaire',
    date: new Date().toISOString().split('T')[0],
    responsableId: '',
    note: ''
  });

  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.articleId) {
      const article = mockArticles.find(a => a.id === formData.articleId);
      setSelectedArticle(article);
    } else {
      setSelectedArticle(null);
    }
  }, [formData.articleId]);

  const getEcart = () => {
    if (!selectedArticle || !formData.stockReel) return 0;
    return parseInt(formData.stockReel) - selectedArticle.stock;
  };

  const getEcartBadge = () => {
    const ecart = getEcart();
    if (ecart > 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full border border-green-200">
          +{ecart}
        </span>
      );
    } else if (ecart < 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full border border-red-200">
          {ecart}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full border border-gray-200">
          0
        </span>
      );
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.articleId) {
      newErrors.articleId = 'L\'article est obligatoire';
    }
    if (!formData.stockReel || parseInt(formData.stockReel) < 0) {
      newErrors.stockReel = 'Le stock réel doit être ≥ 0';
    }
    if (!formData.motif) {
      newErrors.motif = 'Le motif est obligatoire';
    }
    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const ajustementData = {
      ...formData,
      stockReel: parseInt(formData.stockReel),
      type: 'ajustement',
      stockAvant: selectedArticle?.stock || 0,
      stockApres: parseInt(formData.stockReel),
      ecart: getEcart()
    };

    onSave(ajustementData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Ajustement de Stock</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.articleId}
              onChange={(e) => setFormData({ ...formData, articleId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.articleId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner...</option>
              {mockArticles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.code} - {article.nom}
                </option>
              ))}
            </select>
            {errors.articleId && <p className="text-red-500 text-xs mt-1">{errors.articleId}</p>}
          </div>

          {selectedArticle && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Stock actuel (système) :</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedArticle.stock} {selectedArticle.unite}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock réel constaté <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={formData.stockReel}
                onChange={(e) => setFormData({ ...formData, stockReel: e.target.value })}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.stockReel ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              <span className="ml-2 text-sm text-gray-600">unités</span>
            </div>
            {errors.stockReel && <p className="text-red-500 text-xs mt-1">{errors.stockReel}</p>}
          </div>

          {selectedArticle && formData.stockReel !== '' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-2">Écart calculé automatiquement :</p>
              <div className="flex items-center justify-center">
                {getEcartBadge()}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif d'ajustement <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'inventaire', label: 'Inventaire physique' },
                { value: 'correction', label: 'Correction d\'erreur de saisie' },
                { value: 'perte', label: 'Perte non constatée' },
                { value: 'autre', label: 'Autre' }
              ].map((motif) => (
                <label key={motif.value} className="flex items-center">
                  <input
                    type="radio"
                    name="motif"
                    value={motif.value}
                    checked={formData.motif === motif.value}
                    onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-sm">{motif.label}</span>
                </label>
              ))}
            </div>
            {errors.motif && <p className="text-red-500 text-xs mt-1">{errors.motif}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <select
              value={formData.responsableId}
              onChange={(e) => setFormData({ ...formData, responsableId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              {mockUtilisateurs.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.prenom} {user.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note / Justification</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Justification de l'ajustement"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Valider Ajustement
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockAjustementForm;
