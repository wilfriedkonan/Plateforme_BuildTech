import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { catalogueService } from '../lib/services/catalogueService';
import { Article, Categorie } from '../lib/mock/catalogue';

const CataloguePublicPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const companyName = 'Restaurant La Bonne Table';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, categoriesData] = await Promise.all([
        catalogueService.getVisibleArticles(),
        catalogueService.getVisibleCategories()
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading catalogue:', error);
    } finally {
      setLoading(false);
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

  const articlesByCategory = categories.map(category => ({
    category,
    articles: filteredArticles.filter(a => a.categorieId === category.id)
  })).filter(group => group.articles.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{companyName}</h1>
            <p className="text-xl text-gray-300">Découvrez notre carte</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Toutes les catégories
            </button>
            {categories.map(category => {
              const hasArticles = articles.some(a => a.categorieId === category.id);
              if (!hasArticles) return null;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-700 hover:opacity-80 bg-white border'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.couleur : 'white',
                    borderColor: category.couleur,
                  }}
                >
                  {category.nom}
                </button>
              );
            })}
          </div>
        </div>

        {articlesByCategory.length > 0 ? (
          <div className="space-y-12">
            {articlesByCategory.map(({ category, articles }) => (
              <div key={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: category.couleur }}
                  />
                  <h2 className="text-2xl font-bold text-gray-900">{category.nom}</h2>
                  <span className="text-gray-500 text-sm">({articles.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map(article => (
                    <div
                      key={article.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className="text-xs px-3 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: category.couleur }}
                        >
                          {category.nom}
                        </span>
                        {article.disponible ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Disponible
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            Indisponible
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg mb-2">
                        {article.nom}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(article.prix)}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                          {article.unite}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Essayez de modifier votre recherche'
                : 'Aucun article disponible dans cette catégorie'}
            </p>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2024 {companyName}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default CataloguePublicPage;
