import React, { useState, useEffect } from 'react';
import { Grid2x2 as Grid, List, Eye, Search, Filter, Share2, LayoutGrid } from 'lucide-react';
import { catalogueService } from '../lib/services/catalogueService';
import { Article, Categorie } from '../lib/mock/catalogue';
import QRCodeShare from './QRCodeShare';

const CatalogueManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, categoriesData] = await Promise.all([
        catalogueService.getCatalogueArticles(),
        catalogueService.getCatalogueCategories()
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading catalogue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (articleId: string) => {
    try {
      const updatedArticle = await catalogueService.toggleArticleVisibility(articleId);
      setArticles(prev => prev.map(a => a.id === articleId ? updatedArticle : a));
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleToggleCategoryVisibility = async (categoryId: string) => {
    try {
      const updatedCategory = await catalogueService.toggleCategoryVisibility(categoryId);
      setCategories(prev => prev.map(c => c.id === categoryId ? updatedCategory : c));
    } catch (error) {
      console.error('Error toggling category visibility:', error);
    }
  };

  const getCategoryById = (id: string): Categorie | undefined => {
    return categories.find(c => c.id === id);
  };

  const formatPrice = (price: number): string => {
    return `${(price / 100).toLocaleString('fr-FR')} FCFA`;
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.categorieId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const visibleArticles = articles.filter(a => a.visibleDansCatalogue);
  const visibleCategoriesCount = categories.filter(c => c.visibleDansCatalogue).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <LayoutGrid className="w-8 h-8 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">{visibleCategoriesCount}/{categories.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{categories.length}</h3>
            <p className="text-gray-600 text-sm">Catégories</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Grid className="w-8 h-8 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">{articles.length} total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{articles.length}</h3>
            <p className="text-gray-600 text-sm">Articles dans le catalogue</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                {((visibleArticles.length / articles.length) * 100).toFixed(0)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{visibleArticles.length}</h3>
            <p className="text-gray-600 text-sm">Articles visibles</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Catégories</h3>
            <span className="text-sm text-gray-600">{visibleCategoriesCount} visible(s) sur {categories.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(category => {
              const categoryArticles = articles.filter(a => a.categorieId === category.id);
              return (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.couleur }}
                    />
                    <span className="text-xs text-gray-500">{categoryArticles.length} articles</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">{category.nom}</h4>
                  <button
                    onClick={() => handleToggleCategoryVisibility(category.id)}
                    className={`w-full px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      category.visibleDansCatalogue
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.visibleDansCatalogue ? 'Visible' : 'Masqué'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
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
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-gray-700 hover:opacity-80'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.couleur : `${category.couleur}20`,
                borderColor: category.couleur,
                borderWidth: '1px'
              }}
            >
              {category.nom}
            </button>
          ))}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => {
              const category = getCategoryById(article.categorieId);
              return (
                <div
                  key={article.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="text-xs px-3 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: category?.couleur }}
                    >
                      {category?.nom}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          article.disponible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {article.disponible ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{article.nom}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(article.prix)}</span>
                    <span className="text-sm text-gray-500">{article.unite}</span>
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
                      onClick={() => handleToggleVisibility(article.id)}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                        article.visibleDansCatalogue
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {article.visibleDansCatalogue ? 'Visible' : 'Masqué'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map(article => {
              const category = getCategoryById(article.categorieId);
              return (
                <div
                  key={article.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{article.nom}</h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: category?.couleur }}
                        >
                          {category?.nom}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            article.disponible
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {article.disponible ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(article.prix)}</span>
                        <span className="text-sm text-gray-500">{article.unite}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewArticle(article)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Aperçu</span>
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(article.id)}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                          article.visibleDansCatalogue
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {article.visibleDansCatalogue ? 'Visible' : 'Masqué'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        )}
      </div>

      {showQRModal && <QRCodeShare onClose={() => setShowQRModal(false)} />}

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
              <div>
                <span
                  className="inline-block text-sm px-3 py-1 rounded-full text-white font-medium mb-3"
                  style={{ backgroundColor: getCategoryById(previewArticle.categorieId)?.couleur }}
                >
                  {getCategoryById(previewArticle.categorieId)?.nom}
                </span>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{previewArticle.nom}</h4>
                <p className="text-gray-600 mb-4">{previewArticle.description}</p>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
                <span className="text-gray-600">Prix</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(previewArticle.prix)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Unité</span>
                <span className="text-gray-900 font-medium">{previewArticle.unite}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Disponibilité</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    previewArticle.disponible
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {previewArticle.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Visible dans le catalogue</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    previewArticle.visibleDansCatalogue
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {previewArticle.visibleDansCatalogue ? 'Oui' : 'Non'}
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
