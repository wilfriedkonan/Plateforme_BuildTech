import React, { useState, useEffect, useCallback } from 'react';
import { Grid2x2 as Grid, List, Eye, Search, Filter, Share2, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Article, ArticleListParams } from '../../services/articleService';
import { useBoutiques } from '../../lib/boutiqueAdminApi';
import QRCodeShare from './QRCodeShare';

const PAGE_SIZE = 50;

const CatalogueManager: React.FC = () => {
  const {
    articles, pagination, loading, total,
    fetchArticlesList, updateArticle,
  } = useArticles();
  const { categories, fetchCategories } = useCategories();
  const { boutiques } = useBoutiques();
  const boutique = boutiques[0] ?? null;
  const catalogueUrl = boutique
    ? `${window.location.origin}/r/${boutique.codeQR}`
    : `${window.location.origin}`;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQRModal, setShowQRModal] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadArticles = useCallback((page = 1) => {
    const params: ArticleListParams = {
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
      ...(selectedCategory ? { idCategorie: selectedCategory } : {}),
    };
    fetchArticlesList(params);
  }, [fetchArticlesList, debouncedSearch, selectedCategory]);

  useEffect(() => {
    loadArticles(currentPage);
  }, [currentPage, debouncedSearch, selectedCategory, fetchArticlesList]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (catId: string | null) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleToggleVisibility = async (article: Article) => {
    try {
      await updateArticle(article.id!, {
        estVisibleCatalogue: !article.estVisibleCatalogue,
      } as any);
      loadArticles(currentPage);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
    }
  };

  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  const formatPrice = (price: number): string =>
    `${price.toLocaleString('fr-FR')} FCFA`;

  const visibleCount = articles.filter(a => a.estVisibleCatalogue).length;
  const isPaginated = (pagination?.totalPages ?? 1) > 1;

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion du catalogue</h2>
            <p className="text-gray-600">Gérez la visibilité de vos articles dans le catalogue public</p>
          </div>
          <button
            onClick={() => setShowQRModal(true)}
            className="mt-4 md:mt-0 bg-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Partager le catalogue</span>
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <LayoutGrid className="w-8 h-8 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">{categories.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{categories.length}</h3>
            <p className="text-gray-600 text-sm">Catégories</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Grid className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">{total} total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{total}</h3>
            <p className="text-gray-600 text-sm">Articles dans le catalogue</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                {total > 0 ? `${((visibleCount / articles.length) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{visibleCount}</h3>
            <p className="text-gray-600 text-sm">Visibles (page courante)</p>
          </div>
        </div>

        {/* Recherche + vue */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Catégories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Catégories</h3>
              <span className="text-sm text-gray-600">{categories.length} catégorie(s)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCategoryChange(selectedCategory === category.id ? null : category.id ?? null)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.couleur }}
                    />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selectedCategory === category.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 bg-gray-100'
                    }`}>
                      {selectedCategory === category.id ? 'Filtré' : category.etat}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{category.designation}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtre chips catégories */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id ?? null)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: selectedCategory === category.id ? category.couleur : `${category.couleur}20`,
                color: selectedCategory === category.id ? '#fff' : '#374151',
                borderWidth: '1px',
                borderColor: category.couleur,
              }}
            >
              {category.designation}
            </button>
          ))}
        </div>

        {/* Liste des articles */}
        <div className="relative">
          {loading && articles.length > 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Chargement…
              </div>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => {
                const category = getCategoryById(article.idCathegorie || '');
                return (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      {category ? (
                        <span
                          className="text-xs px-3 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: category.couleur }}
                        >
                          {category.designation}
                        </span>
                      ) : (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">—</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        article.etat === 'Actif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {article.etat === 'Actif' ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{article.designation}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description || '—'}</p>
                    <div className="mb-4">
                      <span className="text-xl font-bold text-gray-900">{formatPrice(article.prixVente || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewArticle(article)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Aperçu</span>
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(article)}
                        className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                          article.estVisibleCatalogue
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {article.estVisibleCatalogue ? 'Visible' : 'Masqué'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map(article => {
                const category = getCategoryById(article.idCathegorie || '');
                return (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{article.designation}</h3>
                          {category && (
                            <span
                              className="text-xs px-3 py-0.5 rounded-full text-white font-medium"
                              style={{ backgroundColor: category.couleur }}
                            >
                              {category.designation}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            article.etat === 'Actif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {article.etat === 'Actif' ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm truncate">{article.description || '—'}</p>
                        <span className="text-base font-bold text-gray-900 mt-1 block">
                          {formatPrice(article.prixVente || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setPreviewArticle(article)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Aperçu</span>
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(article)}
                          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                            article.estVisibleCatalogue
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {article.estVisibleCatalogue ? 'Visible' : 'Masqué'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {articles.length === 0 && !loading && (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {isPaginated && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {total.toLocaleString('fr-FR')} article{total !== 1 ? 's' : ''} au total
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!pagination?.hasPrevious || loading}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                {currentPage} / {pagination?.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!pagination?.hasNext || loading}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showQRModal && (
        <QRCodeShare
          onClose={() => setShowQRModal(false)}
          catalogueUrl={catalogueUrl}
          boutiqueName={boutique?.nomBoutique}
        />
      )}

      {/* Modal aperçu */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Aperçu de l'article</h3>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {(() => {
                const cat = getCategoryById(previewArticle.idCathegorie || '');
                return (
                  <>
                    {cat && (
                      <span
                        className="inline-block text-sm px-3 py-1 rounded-full text-white font-medium mb-3"
                        style={{ backgroundColor: cat.couleur }}
                      >
                        {cat.designation}
                      </span>
                    )}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{previewArticle.designation}</h4>
                    <p className="text-gray-600 mb-4">{previewArticle.description || '—'}</p>
                  </>
                );
              })()}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                <span className="text-gray-600">Prix vente</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(previewArticle.prixVente || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Prix achat</span>
                <span className="text-gray-900 font-medium">{formatPrice(previewArticle.prixAchat || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Code article</span>
                <span className="text-gray-900 font-medium font-mono">{previewArticle.codeArticle || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Disponibilité</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  previewArticle.etat === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {previewArticle.etat === 'Actif' ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Visible dans le catalogue</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  previewArticle.estVisibleCatalogue ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {previewArticle.estVisibleCatalogue ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setPreviewArticle(null)}
              className="w-full mt-6 px-4 py-3 bg-gray-800 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogueManager;
