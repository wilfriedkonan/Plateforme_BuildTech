import React from 'react';
import { Package } from 'lucide-react';
import { Article } from '../../services/articleService';

interface ArticleDetailPanelProps {
  article: Article | null;
}

const ArticleDetailPanel: React.FC<ArticleDetailPanelProps> = ({ article }) => {
  if (!article) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">Sélectionnez un article</p>
        <p className="text-gray-400 text-sm">pour voir les détails</p>
      </div>
    );
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-3">
          {article.imageURL ? (
            <img src={article.imageURL} alt={article.designation} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <Package className="w-12 h-12 text-teal-600" />
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-lg text-center">{article.designation}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
          {article.codeArticle}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Prix d'achat</span>
          <span className="font-bold text-gray-900">{formatAmount(article.prixAchat || 0)}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Prix de vente</span>
          <span className="font-bold text-teal-600">{formatAmount(article.prixVente || 0)}</span>
        </div>
        {article.prixExterieur && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Prix extérieur</span>
            <span className="font-medium text-gray-900">{formatAmount(article.prixExterieur)}</span>
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Taux TVA</span>
          <span className="font-medium text-gray-900">{article.tauxTva || 0}%</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Stock initial</span>
          <span className={`font-bold ${article.stock === 0 ? 'text-red-600' : article.stock && article.seuilAlerte && article.stock <= article.seuilAlerte ? 'text-orange-600' : 'text-green-600'}`}>
            {article.stock || 0}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600">Seuil alerte</span>
          <span className="font-medium text-gray-900">{article.seuilAlerte || 0}</span>
        </div>
        {article.estPromo && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Prix promo</span>
            <span className="font-bold text-orange-600">{formatAmount(article.prixPromo || 0)}</span>
          </div>
        )}
      </div>

      {article.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-700">{article.description}</p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Caractéristiques</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Code barre:</span>
            <p className="font-medium text-gray-900">{article.codeBarre || '-'}</p>
          </div>
          <div>
            <span className="text-gray-600">État:</span>
            <p className="font-medium text-gray-900">{article.etat || 'Actif'}</p>
          </div>
          <div>
            <span className="text-gray-600">POS:</span>
            <p className="font-medium text-gray-900">{article.estPos ? 'Oui' : 'Non'}</p>
          </div>
          <div>
            <span className="text-gray-600">Stockable:</span>
            <p className="font-medium text-gray-900">{article.estStockable ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </div>

      {article.estComposer && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Options</h4>
          <div className="space-y-1 text-sm">
            {article.estComposer && <p className="text-gray-700">✓ Composable</p>}
            {article.estVendableSansComposition && <p className="text-gray-700">✓ Vendable sans composition</p>}
            {article.estExonerer && <p className="text-gray-700">✓ Exonéré de TVA</p>}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4 mt-6">
        <p className="text-xs text-gray-500 text-center">
          {article.statut ? '✓ Article actif' : '✗ Article inactif'}
        </p>
      </div>
    </div>
  );
};

export default ArticleDetailPanel;
