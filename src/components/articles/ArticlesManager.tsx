import React, { useState, useEffect } from 'react';
import { FileText, Tag, Package, Plus, RefreshCw, Download, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import ArticleTable from './ArticleTable';
import ArticleDetailPanel from './ArticleDetailPanel';
import CategorieTable from './CategorieTable';
import StockManager from './StockManager';
import ArticleForm from './forms/ArticleForm';
import CategorieForm from './forms/CategorieForm';

type SubTab = 'articles' | 'categories' | 'stock';

const ArticlesManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('articles');
  const { articles, fetchArticles, createArticle, updateArticle, deleteArticle } = useArticles();
  const { categories, fetchCategories, createCategorie, updateCategorie, deleteCategorie } = useCategories();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [isCategorieFormOpen, setIsCategorieFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [editingCategorie, setEditingCategorie] = useState<any>(null);

  // Charger les articles et catégories au montage
  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || null;
  const totalArticles = articles.length;
  const articlesActifs = articles.filter(a => a.etat === 'Actif').length;
  const valeurStock = articles.reduce((sum, a) => sum + ((a.prixAchat || 0) * 0), 0);

  const handleNewClick = () => {
    if (activeSubTab === 'articles') {
      setEditingArticle(null);
      setIsArticleFormOpen(true);
    } else if (activeSubTab === 'categories') {
      setEditingCategorie(null);
      setIsCategorieFormOpen(true);
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setIsArticleFormOpen(true);
  };

  const handleDuplicateArticle = async (article: any) => {
    try {
      const newArticle = {
        ...article,
        id: undefined,
        codeArticle: `ART${Date.now().toString().slice(-6)}`,
        designation: `Copie de - ${article.designation}`
      };
      await createArticle(newArticle);
    } catch (error: any) {
      console.error('Erreur lors de la duplication:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      await deleteArticle(articleId);
      if (selectedArticleId === articleId) {
        setSelectedArticleId(null);
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleDeactivateArticle = async (articleId: string) => {
    try {
      await updateArticle(articleId, { etat: 'Inactif' });
    } catch (error: any) {
      console.error('Erreur lors de la désactivation:', error);
    }
  };

  const handleSaveArticle = async (articleData: any) => {
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, articleData);
      } else {
        await createArticle(articleData);
      }
      setIsArticleFormOpen(false);
      setEditingArticle(null);
      await fetchArticles();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEditCategorie = (categorie: any) => {
    setEditingCategorie(categorie);
    setIsCategorieFormOpen(true);
  };

  const handleDeleteCategorie = async (categorieId: string) => {
    try {
      await deleteCategorie(categorieId);
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSaveCategorie = async (categorieData: any) => {
    try {
      if (editingCategorie) {
        await updateCategorie(editingCategorie.id, categorieData);
      } else {
        await createCategorie(categorieData);
      }
      setIsCategorieFormOpen(false);
      setEditingCategorie(null);
      await fetchCategories();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'articles':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ArticleTable
                articles={articles as any}
                categories={categories as any}
                selectedArticleId={selectedArticleId}
                onSelectArticle={setSelectedArticleId}
                onEdit={handleEditArticle}
                onDuplicate={handleDuplicateArticle}
                onDelete={handleDeleteArticle}
                onDeactivate={handleDeactivateArticle}
              />
            </div>
            <div className="lg:col-span-1">
              <ArticleDetailPanel article={selectedArticle as any} />
            </div>
          </div>
        );
      case 'categories':
        return (
          <CategorieTable
            categories={categories as any}
            onEdit={handleEditCategorie}
            onDelete={handleDeleteCategorie}
          />
        );
      case 'stock':
        return <StockManager onUpdateStock={async (articleId) => {
          try {
            await updateArticle(articleId, { etat: 'Actif' });
          } catch (error: any) {
            console.error('Erreur lors de la mise à jour du stock:', error);
          }
        }} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Gestion des Articles</h2>
            <p className="text-sm text-gray-600">Gérez vos articles, catégories et mouvements de stock</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            <button className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button
              onClick={handleNewClick}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeSubTab === 'articles' && 'Nouvel Article'}
                {activeSubTab === 'categories' && 'Nouvelle Catégorie'}
                {activeSubTab === 'stock' && 'Nouveau Mouvement'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-700 mb-1">Total articles</p>
                <p className="text-3xl font-bold text-teal-900">{totalArticles}</p>
              </div>
              <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-teal-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Articles actifs</p>
                <p className="text-3xl font-bold text-green-900">{articlesActifs}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">Valeur stock totale</p>
                <p className="text-3xl font-bold text-orange-900">{(valeurStock / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200 -mx-1 px-1">
          <button
            onClick={() => setActiveSubTab('articles')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'articles'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Articles</span>
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'categories'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span>Catégories</span>
          </button>
          <button
            onClick={() => setActiveSubTab('stock')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'stock'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Stock</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {renderSubTabContent()}
      </div>

      <ArticleForm
        isOpen={isArticleFormOpen}
        onClose={() => {
          setIsArticleFormOpen(false);
          setEditingArticle(null);
        }}
        article={editingArticle}
        onSave={handleSaveArticle}
        categories={categories as any}
      />

      <CategorieForm
        isOpen={isCategorieFormOpen}
        onClose={() => {
          setIsCategorieFormOpen(false);
          setEditingCategorie(null);
        }}
        categorie={editingCategorie}
        onSave={handleSaveCategorie}
      />
    </div>
  );
};

export default ArticlesManager;
