import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DomaineFormProps {
  isOpen: boolean;
  onClose: () => void;
  domaine?: any;
  onSave: (domaine: any) => void;
  domaineActifActuel?: any;
}

const DomaineForm: React.FC<DomaineFormProps> = ({ isOpen, onClose, domaine, onSave, domaineActifActuel }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    description: '',
    icone: '🍽️',
    couleur: '#14B8A6',
    logo: '',
    actif: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojisPredefinis = ['🍽️', '🏪', '🏗️', '💻', '🚗', '🛒', '🏥', '🎓', '🏨', '⚡'];
  const couleursRapides = ['#14B8A6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#1F2937'];

  useEffect(() => {
    if (domaine) {
      setFormData({
        code: domaine.code,
        nom: domaine.nom,
        description: domaine.description || '',
        icone: domaine.icone || '🍽️',
        couleur: domaine.couleur || '#14B8A6',
        logo: domaine.logo || '',
        actif: domaine.actif || false
      });
    } else {
      const newCode = `DOM${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, code: newCode }));
    }
  }, [domaine]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom || formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    if (!formData.couleur) {
      newErrors.couleur = 'La couleur est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      onSave(formData);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 500);
    }
  };

  if (!isOpen) return null;

  const afficherWarningAutreDomaine = formData.actif && domaineActifActuel && domaineActifActuel.id !== domaine?.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {domaine ? 'Modifier le Domaine' : 'Nouveau Domaine'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Code
            </label>
            <input
              type="text"
              value={formData.code}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du domaine <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Restauration, Commerce, Services..."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Description du domaine d'activité..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icône (emoji)
            </label>
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="text"
                value={formData.icone}
                onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-2xl"
                maxLength={2}
              />
              <span className="text-sm text-gray-600">ou choisissez:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {emojisPredefinis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icone: emoji })}
                  className={`w-12 h-12 text-2xl border-2 rounded-lg hover:border-teal-500 transition-colors ${
                    formData.icone === emoji ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Couleur thème <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="color"
                value={formData.couleur}
                onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.couleur}
                onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="#14B8A6"
              />
            </div>
            <p className="text-xs text-gray-500 mb-2">Prévisualisations rapides:</p>
            <div className="flex flex-wrap gap-2">
              {couleursRapides.map((couleur) => (
                <button
                  key={couleur}
                  type="button"
                  onClick={() => setFormData({ ...formData, couleur })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.couleur === couleur ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: couleur }}
                  title={couleur}
                />
              ))}
            </div>
            {errors.couleur && <p className="mt-1 text-sm text-red-600">{errors.couleur}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo (URL)
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Aperçu:</p>
                <img src={formData.logo} alt="Logo" className="h-12 object-contain" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu en temps réel</h3>
            <div
              className="p-6 rounded-xl border-2 transition-all"
              style={{
                backgroundColor: `${formData.couleur}15`,
                borderColor: formData.couleur
              }}
            >
              <div className="flex items-start space-x-4">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-12 h-12 object-contain" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }} />
                ) : (
                  <div className="text-4xl">{formData.icone}</div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{formData.nom || 'Nom du domaine'}</h4>
                  <p className="text-sm text-gray-600">{formData.description || 'Description courte...'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activation</h3>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="actif"
                checked={formData.actif}
                onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor="actif" className="font-medium text-gray-700 cursor-pointer">
                Définir comme domaine actif
              </label>
            </div>

            {afficherWarningAutreDomaine && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">
                  Le domaine <span className="font-semibold">"{domaineActifActuel.nom}"</span> sera désactivé automatiquement.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomaineForm;
