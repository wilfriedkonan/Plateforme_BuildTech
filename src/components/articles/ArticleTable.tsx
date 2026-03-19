import React, { useState } from 'react';
import { CreditCard as Edit, Copy, Trash2 } from 'lucide-react';
import { Article } from '../../services/articleService';
import { Categorie } from '../../services/categorieService';
import ArticleDeleteModal from './forms/ArticleDeleteModal';

interface ArticleTableProps {
  articles: Article[];
  categories: Categorie[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string) => void;
  onEdit: (article: Article) => void;
  onDuplicate: (article: Article) => void;
  onDelete: (articleId: string) => void;
  onDeactivate: (articleId: string) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  categories,
  selectedArticleId,
  onSelectArticle,
  onEdit,
  onDuplicate,
  onDelete,
  onDeactivate
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const getCategorieNom = (categorieId: string) => {
    const cat = categories.find(c => c.id === categorieId);
    return cat?.designation || 'Aucune';
  };

  const getCategorieCouleur = (categorieId: string) => {
    const cat = categories.find(c => c.id === categorieId);
    return cat?.couleur || cat?.designation ? '#10B981' : '#6B7280';
  };

  const getStockBadge = (article: Article) => {
    if (article.stock === 0) {
      return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">🔴 Rupture</span>;
    }
    if (article.stock && article.seuilAlerte && article.stock <= article.seuilAlerte) {
      return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">🟡 Stock bas</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">🟢 Normal</span>;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' F';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Liste des Articles</h3>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Article</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix Achat</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix Vente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TVA %</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {articles.map((article) => (
                <tr
                  key={article.id}
                  onClick={() => onSelectArticle(article.id!)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedArticleId === article.id ? 'bg-teal-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                      {article.codeArticle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">{article.designation}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-1 text-white text-xs font-medium rounded"
                      style={{ backgroundColor: getCategorieCouleur(article.idCathegorie || '') }}
                    >
                      {getCategorieNom(article.idCathegorie || '')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 text-sm">
                    {formatAmount(article.prixAchat || 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 text-sm">
                    {formatAmount(article.prixVente || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{article.tauxTva || 0}%</td>
                  <td className="px-4 py-3 text-center">
                    {getStockBadge(article)}
                  </td>
                  <td className="px-4 py-3">
                    {article.etat === 'Actif' ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        ✓ {article.etat}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {article.etat || 'Inactif'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(article);
                        }}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(article);
                        }}
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setArticleToDelete(article);
                          setDeleteModalOpen(true);
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-sm text-gray-600 px-4">
        {articles.length} articles | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
      </div>

      {articleToDelete && (
        <ArticleDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setArticleToDelete(null);
          }}
          article={articleToDelete}
          onDelete={() => onDelete(articleToDelete.id!)}
          onDeactivate={() => onDeactivate(articleToDelete.id!)}
          hasMouvements={false}
        />
      )}
    </div>
  );
};

export default ArticleTable;
