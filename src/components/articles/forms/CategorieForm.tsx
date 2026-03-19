import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface CategorieFormProps {
  isOpen: boolean;
  onClose: () => void;
  categorie?: any;
  onSave: (categorie: any) => void;
}

const CategorieForm: React.FC<CategorieFormProps> = ({ isOpen, onClose, categorie, onSave }) => {
  const [formData, setFormData] = useState({
    Code: '',
    Designation: '',
    Couleur: '#0d9488',
    Actif: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const presetColors = ['#eab308', '#3b82f6', '#10b981', '#a855f7', '#ef4444', '#f97316'];

  useEffect(() => {
    if (categorie) {
      setFormData({
        Code: categorie.code,
        Designation: categorie.designation || '',
        Couleur: categorie.couleur,
        Actif: categorie.actif !== false
      });
    } else {
      const newCode = `CAT${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, Code: newCode }));
    }
  }, [categorie]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.Designation || formData.Designation.length < 2) {
      newErrors.Designation = 'La designation doit contenir au moins 2 caractères';
    }
    if (!formData.Couleur || !/^#[0-9A-F]{6}$/i.test(formData.Couleur)) {
      newErrors.Couleur = 'Couleur invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const categorieData = {
        ...categorie,
        code: formData.Code,
        designation: formData.Designation,
        couleur: formData.Couleur,
        actif: formData.Actif
      };

      await onSave(categorieData);
      
      setSuccessMessage(categorie ? 'Catégorie mise à jour avec succès' : 'Catégorie créée avec succès');
      
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Une erreur est survenue lors de la sauvegarde';
      setSubmitError(errorMessage);
      console.error('Erreur lors de la sauvegarde:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {categorie ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Erreur</p>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Succès</p>
                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              value={formData.Code}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.Designation}
              onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.Designation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Matériaux de construction"
            />
            {errors.Designation && <p className="text-red-500 text-xs mt-1">{errors.Designation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Couleur d'identification <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="color"
                value={formData.Couleur}
                onChange={(e) => setFormData({ ...formData, Couleur: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.Couleur}
                onChange={(e) => setFormData({ ...formData, Couleur: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-gray-600 mb-2">Prévisualisations rapides :</p>
            <div className="flex space-x-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, Couleur: color })}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {errors.Couleur && <p className="text-red-500 text-xs mt-1">{errors.Couleur}</p>}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">Aperçu du badge :</p>
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${formData.Couleur}20`,
                color: formData.Couleur,
                border: `1px solid ${formData.Couleur}40`
              }}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: formData.Couleur }}
              />
              {formData.Designation || 'Nom catégorie'}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.Actif}
                onChange={(e) => setFormData({ ...formData, Actif: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Catégorie active</span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Enregistrer</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorieForm;
