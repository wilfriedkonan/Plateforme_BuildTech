import React, { useState, useEffect } from 'react';
import { X, TrendingDown, AlertTriangle } from 'lucide-react';
import { useArticles } from '../../../hooks/useArticles';
import { useMouvementStock } from '../../../hooks/useMouvementStock';

interface StockSortieFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  stck : any;
}

const StockSortieForm: React.FC<StockSortieFormProps> = ({ isOpen, onClose, onSave , stck}) => {
  const { articles, fetchArticles } = useArticles();
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
  const { createMouvement } = useMouvementStock();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // Charger les articles au montage
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    if (formData.articleId) {
      const article = articles.find(a => a.id === formData.articleId);
      setSelectedArticle(article);
       getStockAvant();
    } else {
      setSelectedArticle(null);
    }
  }, [formData.articleId, articles]);

  useEffect(() => {
    if (selectedArticle && formData.quantite) {
      const qte = parseInt(formData.quantite);
      const stockApres = selectedArticle.stock - qte;
      const newWarnings = [];

      if (stockApres <= selectedArticle.seuilAlerte && stockApres > 0) {
        newWarnings.push(`Proche du seuil (${selectedArticle.seuilAlerte})`);
      }

      setWarnings(newWarnings);
    } else {
      setWarnings([]);
    }
  }, [selectedArticle, formData.quantite]);

  const getStockApres = () => {
    if (!selectedArticle || !formData.quantite) return 0;
    return getStockAvant() - parseInt(formData.quantite);
  };

   const getStockAvant = () => {
    if (!selectedArticle) return 0;
    
    const stockItem = stck.find((item: any) => item.idArticle === selectedArticle.id);
    return stockItem ? stockItem.stockActuel : 0;
  };

  const getStockBadgeColor = () => {
    const stockApres = getStockApres();
    if (!selectedArticle) return 'bg-gray-100 text-gray-700';
    if (stockApres <= 0) return 'bg-red-100 text-red-700 border-red-200';
    if (stockApres <= selectedArticle.seuilAlerte) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.articleId) {
      newErrors.articleId = 'L\'article est obligatoire';
    }
    if (!formData.quantite || parseInt(formData.quantite) <= 0) {
      newErrors.quantite = 'La quantité doit être supérieure à 0';
    }
    if (selectedArticle && parseInt(formData.quantite) >  getStockAvant()) {
      newErrors.quantite = `Stock insuffisant. Maximum : ${ getStockAvant()}`;
    }
    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }
    if (!formData.motif) {
      newErrors.motifSortie = 'Le motif est obligatoire';
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
        TypeMouvement: 'Sortie' as const,
        Quantite: quantite,
        PrixUnitaire: selectedArticle?.prixAchat || 0,
        Montant: quantite * (selectedArticle?.prixAchat || 0),
        Reference: formData.reference,
        Commentaire: formData.motif,
        IdArticle: formData.articleId,
        IdStock: null,
      };
      
      await createMouvement(mouvementData);
      
    const sortieData = {
      ...formData,
      quantite: parseInt(formData.quantite),
      type: 'sortie',
      stockAvant:  getStockAvant() || 0,
      stockApres: getStockApres()
    };

    onSave(sortieData);
    onClose();
        }
        catch(error: any) {
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
            <TrendingDown className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Sortie de Stock</h3>
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
                { getStockAvant()} {selectedArticle.unite}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif de sortie <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'vente', label: 'Vente' },
                { value: 'usage_interne', label: 'Usage interne' },
                { value: 'perte', label: 'Perte/Casse' },
                { value: 'retour_fournisseur', label: 'Retour fournisseur' },
                { value: 'autre', label: 'Autre' }
              ].map((motif) => (
                <label key={motif.value} className="flex items-center">
                  <input
                    type="radio"
                    name="motifSortie"
                    value={motif.value}
                    checked={formData.motif === motif.value}
                    onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                    className="mr-2"
                  />
                  <span className="text-sm">{motif.label}</span>
                </label>
              ))}
            </div>
            {errors.motifSortie && <p className="text-red-500 text-xs mt-1">{errors.motifSortie}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité à retirer <span className="text-red-500">*</span>
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
                max={ getStockAvant() || undefined}
              />
              <span className="ml-2 text-sm text-gray-600">unités</span>
            </div>
            {errors.quantite && <p className="text-red-500 text-xs mt-1">{errors.quantite}</p>}
          </div>

          {selectedArticle && formData.quantite && parseInt(formData.quantite) > 0 && !errors.quantite && (
            <div className={`border rounded-lg p-3 ${getStockBadgeColor()}`}>
              <p className="text-sm mb-1">Stock après opération :</p>
              <p className="text-xl font-bold">
                {getStockApres()} {selectedArticle.unite}
              </p>
              {warnings.length > 0 && (
                <div className="mt-2 flex items-center text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span>{warnings.join(', ')}</span>
                </div>
              )}
            </div>
          )}

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="N° commande, ticket..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Informations complémentaires"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Valider Sortie
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSortieForm;
