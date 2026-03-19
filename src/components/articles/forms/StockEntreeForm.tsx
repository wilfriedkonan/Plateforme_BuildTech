import React, { useState, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { useArticles } from '../../../hooks/useArticles';
import { useFournisseur } from '../../../hooks/useFournisseur';
import { useMouvementStock } from '../../../hooks/useMouvementStock';

interface StockEntreeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  stck: any;
}

const StockEntreeForm: React.FC<StockEntreeFormProps> = ({ isOpen, onClose, onSave, stck }) => {
  const { articles, fetchArticles } = useArticles();
  const { fournisseurs, fetchFournisseurs } = useFournisseur();
  const { createMouvement } = useMouvementStock();

  const [formData, setFormData] = useState({
    articleId: '',
    quantite: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    fournisseurId: '',
    motif: '',
    lierFacture: false,
    factureId: ''
  });

  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Charger les articles et fournisseurs au montage
  useEffect(() => {
    fetchArticles();
    fetchFournisseurs({ page: 1, pageSize: 100 });
  }, [fetchArticles, fetchFournisseurs]);

  useEffect(() => {
    if (formData.articleId) {
      const article = articles.find(a => a.id === formData.articleId);
      setSelectedArticle(article);
      getStockAvant();
    } else {
      setSelectedArticle(null);
    }
  }, [formData.articleId, articles]);

  const getStockApres = () => {
    const stockActuel = getStockAvant();
    if (!formData.quantite) return stockActuel;
    return stockActuel + parseInt(formData.quantite);
  };

  const getStockAvant = () => {
    if (!selectedArticle) return 0;
    
    const stockItem = stck.find((item: any) => item.idArticle === selectedArticle.id);
    return stockItem ? stockItem.stockActuel : 0;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.articleId) {
      newErrors.articleId = 'L\'article est obligatoire';
    }
    if (!formData.quantite || parseInt(formData.quantite) <= 0) {
      newErrors.quantite = 'La quantité doit être supérieure à 0';
    }
    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const quantite = parseInt(formData.quantite);
      
      // Créer le mouvement de stock via l'API
      const now = new Date();
      const dateTimeString = `${formData.date}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const mouvementData: any = {
        DateTransaction: dateTimeString,
        TypeMouvement: 'Entree' as const,
        Quantite: quantite,
        PrixUnitaire: selectedArticle?.prixAchat || 0,
        Montant: quantite * (selectedArticle?.prixAchat || 0),
        Reference: formData.reference,
        Commentaire: formData.motif,
        IdArticle: formData.articleId,
        IdStock: null,
      };

      await createMouvement(mouvementData);

      const entreeData = {
        ...formData,
        quantite: quantite,
        type: 'entree',
        stockAvant: getStockAvant(),
        stockApres: getStockApres()
      };

      onSave(entreeData);
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la création du mouvement:', error);
      setErrors({ submit: error?.message || 'Erreur lors de l\'ajout du stock' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Entrée de Stock</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {errors.submit}
            </div>
          )}

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
              {articles.map((article: any) => (
                <option key={article.id} value={article.id}>
                  {article.codeArticle} - {article.designation}
                </option>
              ))}
            </select>
            {errors.articleId && <p className="text-red-500 text-xs mt-1">{errors.articleId}</p>}
          </div>

          {selectedArticle && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Stock actuel :</p>
              <p className="text-lg font-bold text-gray-900">
                {getStockAvant()} {selectedArticle.unite || 'unités'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité à ajouter <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.quantite ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="1"
              />
              <span className="ml-2 text-sm text-gray-600">unités</span>
            </div>
            {errors.quantite && <p className="text-red-500 text-xs mt-1">{errors.quantite}</p>}
          </div>

          {selectedArticle && formData.quantite && parseInt(formData.quantite) > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 mb-1">Stock après opération :</p>
              <p className="text-xl font-bold text-green-900">
                {getStockApres()} {selectedArticle.unite || 'unités'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de l'opération <span className="text-red-500">*</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence document
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="N° bon de livraison, facture..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
            <select
              value={formData.fournisseurId}
              onChange={(e) => setFormData({ ...formData, fournisseurId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              {fournisseurs.map((fournisseur: any) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif / Note</label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Raison de l'entrée de stock"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.lierFacture}
                onChange={(e) => setFormData({ ...formData, lierFacture: e.target.checked })}
                className="mr-2 rounded"
              />
              <span className="text-sm">Lier à une facture d'achat</span>
            </label>
          </div>

          {formData.lierFacture && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facture d'achat
              </label>
              <select
                value={formData.factureId}
                onChange={(e) => setFormData({ ...formData, factureId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                <option value="1">FA-2025-001</option>
                <option value="2">FA-2025-002</option>
              </select>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            <span>{loading ? 'Traitement...' : 'Valider Entrée'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockEntreeForm;
