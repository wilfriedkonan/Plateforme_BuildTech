import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  article?: any;
  onSave: (article: any) => void;
  categories?: any[];
}

const ArticleForm: React.FC<ArticleFormProps> = ({ isOpen, onClose, article, onSave, categories = [] }) => {
  const [formData, setFormData] = useState({
    codeArticle: '',
    designation: '',
    description: '',
    prixAchat: '',
    prixVente: '',
    prixExterieur: '',
    idCathegorie: '',
    estPos: true,
    estStockable: true,
    etat: 'Actif',
    estPromo: false,
    prixPromo: '',
    estComposer: false,
    estVendableSansComposition: true,
    position: '',
    tauxTva: '0',
    stock: '0',
    seuilAlerte: '0',
    imageURL: '',
    statut: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setFormData({
        codeArticle: article.codeArticle || '',
        designation: article.designation || '',
        description: article.description || '',
        prixAchat: article.prixAchat?.toString() || '',
        prixVente: article.prixVente?.toString() || '',
        prixExterieur: article.prixExterieur?.toString() || '',
        idCathegorie: article.idCathegorie || '',
        estPos: article.estPos !== false,
        estStockable: article.estStockable === true,
        etat: article.etat || 'Actif',
        estPromo: article.estPromo === true,
        prixPromo: article.prixPromo?.toString() || '',
        estComposer: article.estComposer === true,
        estVendableSansComposition: article.estVendableSansComposition === true,
        position: article.position?.toString() || '',
        tauxTva: article.tauxTva?.toString() || '0',
        stock: article.stock?.toString() || '0',
        seuilAlerte: article.seuilAlerte?.toString() || '0',
        imageURL: article.imageURL || '',
        statut: article.statut !== false
      });
    } else {
      const newCode = `ART${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, codeArticle: newCode }));
    }
  }, [article]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.designation || formData.designation.length < 2) {
      newErrors.designation = 'La désignation doit contenir au moins 2 caractères';
    }
    if (!formData.idCathegorie) {
      newErrors.idCathegorie = 'La catégorie est obligatoire';
    }
    if (!formData.prixAchat || parseFloat(formData.prixAchat) < 0) {
      newErrors.prixAchat = 'Le prix d\'achat doit être ≥ 0';
    }
    if (!formData.prixVente || parseFloat(formData.prixVente) < 0) {
      newErrors.prixVente = 'Le prix de vente doit être ≥ 0';
    }
    if (formData.estPromo && (!formData.prixPromo || parseFloat(formData.prixPromo) <= 0)) {
      newErrors.prixPromo = 'Le prix promo doit être > 0';
    }
    if (parseFloat(formData.tauxTva) < 0) {
      newErrors.tauxTva = 'Le taux TVA doit être ≥ 0';
    }
    if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'Le stock initial doit être ≥ 0';
    }
    if (parseInt(formData.seuilAlerte) < 0) {
      newErrors.seuilAlerte = 'Le seuil d\'alerte doit être ≥ 0';
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
      const articleData = {
        codeArticle: formData.codeArticle,
        designation: formData.designation,
        description: formData.description || undefined,
        prixAchat: parseFloat(formData.prixAchat),
        prixVente: parseFloat(formData.prixVente),
        prixExterieur: formData.prixExterieur ? parseFloat(formData.prixExterieur) : undefined,
        idCathegorie: formData.idCathegorie || undefined,
        estPos: formData.estPos,
        estStockable: formData.estStockable,
        etat: formData.etat,
        estPromo: formData.estPromo,
        prixPromo: formData.estPromo && formData.prixPromo ? parseFloat(formData.prixPromo) : undefined,
        estComposer: formData.estComposer,
        estVendableSansComposition: formData.estVendableSansComposition,
        position: formData.position ? parseInt(formData.position) : undefined,
        tauxTva: parseFloat(formData.tauxTva),
        stock: parseInt(formData.stock),
        seuilAlerte: parseInt(formData.seuilAlerte),
        imageURL: formData.imageURL || undefined,
        statut: formData.statut
      };

      await onSave(articleData);
      
      setSuccessMessage(article ? 'Article mis à jour avec succès' : 'Article créé avec succès');
      
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {article ? 'Modifier l\'Article' : 'Nouvel Article'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {submitError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Erreur</p>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Succès</p>
                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne 1: Informations générales */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 mb-3">Informations générales</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code article</label>
                <input
                  type="text"
                  value={formData.codeArticle}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Désignation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.designation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Ciment Portland"
                />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Description détaillée de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.idCathegorie}
                  onChange={(e) => setFormData({ ...formData, idCathegorie: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.idCathegorie ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.designation || cat.nom}
                    </option>
                  ))}
                </select>
                {errors.idCathegorie && <p className="text-red-500 text-xs mt-1">{errors.idCathegorie}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Colonne 2: Prix et Stock */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 mb-3">Prix et Stock</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix d'achat <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.prixAchat}
                    onChange={(e) => setFormData({ ...formData, prixAchat: e.target.value })}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.prixAchat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <span className="ml-2 text-sm text-gray-600">FCFA</span>
                </div>
                {errors.prixAchat && <p className="text-red-500 text-xs mt-1">{errors.prixAchat}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de vente <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.prixVente}
                    onChange={(e) => setFormData({ ...formData, prixVente: e.target.value })}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.prixVente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <span className="ml-2 text-sm text-gray-600">FCFA</span>
                </div>
                {errors.prixVente && <p className="text-red-500 text-xs mt-1">{errors.prixVente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix extérieur</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.prixExterieur}
                    onChange={(e) => setFormData({ ...formData, prixExterieur: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <span className="ml-2 text-sm text-gray-600">FCFA</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taux TVA (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.tauxTva}
                  onChange={(e) => setFormData({ ...formData, tauxTva: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.tauxTva ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors.tauxTva && <p className="text-red-500 text-xs mt-1">{errors.tauxTva}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock initial <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  <span className="ml-2 text-sm text-gray-600">unités</span>
                </div>
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil d'alerte <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.seuilAlerte}
                    onChange={(e) => setFormData({ ...formData, seuilAlerte: e.target.value })}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.seuilAlerte ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  <span className="ml-2 text-sm text-gray-600">unités</span>
                </div>
                {errors.seuilAlerte && <p className="text-red-500 text-xs mt-1">{errors.seuilAlerte}</p>}
              </div>
            </div>
          </div>

          {/* Promotion */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-700 mb-3">Promotion</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.estPromo}
                  onChange={(e) => setFormData({ ...formData, estPromo: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm">Article en promotion</span>
              </label>

              {formData.estPromo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix promo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.prixPromo}
                      onChange={(e) => setFormData({ ...formData, prixPromo: e.target.value })}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.prixPromo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <span className="ml-2 text-sm text-gray-600">FCFA</span>
                  </div>
                  {errors.prixPromo && <p className="text-red-500 text-xs mt-1">{errors.prixPromo}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Options supplémentaires */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-700 mb-3">Options supplémentaires</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.estPos}
                  onChange={(e) => setFormData({ ...formData, estPos: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm">Disponible au POS</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.estStockable}
                  onChange={(e) => setFormData({ ...formData, estStockable: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm">Stockable</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.estComposer}
                  onChange={(e) => setFormData({ ...formData, estComposer: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm">Composable</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.estVendableSansComposition}
                  onChange={(e) => setFormData({ ...formData, estVendableSansComposition: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm">Vendable sans composition</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.checked })}
                  className="mr-2 rounded"
                />
                <span className="text-sm">Article actif</span>
              </label>
            </div>
          </div>

          {/* État et Image */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                <select
                  value={formData.etat}
                  onChange={(e) => setFormData({ ...formData, etat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Archivé">Archivé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
                <input
                  type="url"
                  value={formData.imageURL}
                  onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            {formData.imageURL && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Aperçu de l'image:</p>
                <img src={formData.imageURL} alt="Aperçu" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
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

export default ArticleForm;
