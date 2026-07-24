import React, { useState } from 'react';
import { Eye, Pencil, Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../../services/articleService';
import { Categorie } from '../../services/categorieService';
import ArticleDeleteModal from './forms/ArticleDeleteModal';

interface ArticleTableProps {
  articles: Article[];
  categories: Categorie[];
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string) => void;
  onViewDetail: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDuplicate: (article: Article) => void;
  onDelete: (articleId: string) => void;
  onDeactivate: (articleId: string) => void;
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onPageChange?: (page: number) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  categories,
  selectedArticleId,
  onSelectArticle,
  onViewDetail,
  onEdit,
  onDuplicate,
  onDelete,
  onDeactivate,
  loading,
  currentPage = 1,
  totalPages,
  totalRecords,
  hasNext,
  hasPrevious,
  onPageChange,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const getCategorieNom = (id: string) => categories.find(c => c.id === id)?.designation ?? '—';

  const getCategorieCouleur = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.couleur ?? '#9CA3AF';
  };

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F';

  const isPaginated = totalPages !== undefined && totalPages > 1;

  return (
    <div className="space-y-3">
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Chargement…
              </div>
            </div>
          )}

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Article</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Catégorie</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Achat</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Vente</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {articles.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    Aucun article trouvé
                  </td>
                </tr>
              ) : (
                articles.map(article => (
                  <tr
                    key={article.id}
                    onClick={() => onSelectArticle(article.id!)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedArticleId === article.id ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-400">{article.codeArticle ?? '—'}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">{article.designation}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 text-white text-xs font-medium rounded"
                        style={{ backgroundColor: getCategorieCouleur(article.idCathegorie ?? '') }}
                      >
                        {getCategorieNom(article.idCathegorie ?? '')}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-gray-500">
                      {fmt(article.prixAchat ?? 0)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {fmt(article.prixVente ?? 0)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {article.estStockable ? (
                        article.stock === 0
                          ? <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded">Rupture</span>
                          : article.stock != null && article.seuilAlerte != null && article.stock <= article.seuilAlerte
                            ? <span className="text-xs text-amber-700 px-2 py-0.5 bg-amber-50 rounded">Bas · {article.stock}</span>
                            : <span className="text-xs text-gray-600 px-2 py-0.5 bg-gray-100 rounded">{article.stock ?? '—'}</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        article.etat === 'Actif' ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          article.etat === 'Actif' ? 'bg-gray-700' : 'bg-gray-300'
                        }`} />
                        {article.etat ?? 'Inactif'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          onClick={e => { e.stopPropagation(); onViewDetail(article); }}
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          onClick={e => { e.stopPropagation(); onEdit(article); }}
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          onClick={e => { e.stopPropagation(); onDuplicate(article); }}
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          onClick={e => {
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {isPaginated ? (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-400">
              {totalRecords?.toLocaleString('fr-FR')} article{totalRecords !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={!hasPrevious || loading}
                className="p-1.5 rounded text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-xs font-medium text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={!hasNext || loading}
                className="p-1.5 rounded text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {articleToDelete && (
        <ArticleDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setArticleToDelete(null); }}
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
