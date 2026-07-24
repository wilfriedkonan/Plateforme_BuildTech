import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Tag, Package, Plus, RefreshCw, Download,
  TrendingUp, DollarSign, Search, X, Pencil,
} from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Article, ArticleListParams } from '../../services/articleService';
import ArticleTable from './ArticleTable';
import CategorieTable from './CategorieTable';
import StockManager from './StockManager';
import ArticleForm from './forms/ArticleForm';
import CategorieForm from './forms/CategorieForm';

type SubTab = 'articles' | 'categories' | 'stock';

const PAGE_SIZE = 20;

// ─── Modale de détail article ──────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('fr-FR') + ' F';

interface DetailRow { label: string; value: React.ReactNode }

const DetailModal: React.FC<{
  article: Article;
  categorieName?: string;
  categorieColor?: string;
  onClose: () => void;
  onEdit: (a: Article) => void;
}> = ({ article, categorieName, categorieColor, onClose, onEdit }) => {
  const prixAchat  = article.prixAchat  ?? 0;
  const prixVente  = article.prixVente  ?? 0;
  const marge      = prixVente - prixAchat;
  const margePct   = prixAchat > 0 ? (marge / prixAchat) * 100 : null;

  const rows: DetailRow[] = [
    { label: 'Code article',     value: <span className="font-mono text-sm">{article.codeArticle ?? '—'}</span> },
    { label: 'Prix d\'achat',    value: fmt(prixAchat) },
    { label: 'Prix de vente',    value: <span className="font-semibold">{fmt(prixVente)}</span> },
    ...(prixAchat > 0 ? [{
      label: 'Marge brute',
      value: (
        <span>
          {fmt(marge)}
          {margePct != null && (
            <span className="ml-1.5 text-gray-400 text-xs">({margePct.toFixed(0)} %)</span>
          )}
        </span>
      ),
    }] : []),
    ...(article.tauxTva ? [{ label: 'TVA', value: `${article.tauxTva} %` }] : []),
    ...(article.estStockable ? [
      { label: 'Stock actuel',    value: article.stockActuel ?? '—' },
      { label: 'Seuil d\'alerte', value: article.seuilAlerte ?? '—' },
    ] : []),
    ...(article.codeBarre ? [{ label: 'Code barre', value: <span className="font-mono text-sm">{article.codeBarre}</span> }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div className="min-w-0 pr-4">
            <p className="font-mono text-xs text-gray-400 mb-0.5">{article.codeArticle ?? ''}</p>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{article.designation}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                article.etat === 'Actif' ? 'text-gray-700' : 'text-gray-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  article.etat === 'Actif' ? 'bg-gray-700' : 'bg-gray-300'
                }`} />
                {article.etat ?? 'Inactif'}
              </span>
              {categorieName && (
                <span
                  className="text-xs px-2 py-0.5 rounded text-white font-medium"
                  style={{ backgroundColor: categorieColor ?? '#9CA3AF' }}
                >
                  {categorieName}
                </span>
              )}
              {article.estVisibleCatalogue && (
                <span className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                  Visible catalogue
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {article.description && (
          <div className="px-6 pt-4 pb-2">
            <p className="text-sm text-gray-500 leading-relaxed">{article.description}</p>
          </div>
        )}

        {/* Image */}
        {article.imageURL && (
          <div className="px-6 pt-3">
            <img
              src={article.imageURL}
              alt={article.designation}
              className="w-full h-36 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Tableau de détails */}
        <div className="px-6 py-4 space-y-1">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-400">{row.label}</span>
              <span className="text-sm text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => { onEdit(article); onClose(); }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <Pencil className="w-3.5 h-3.5" />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Composant principal ───────────────────────────────────────────────────────

const ArticlesManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('articles');
  const {
    articles, pagination, loading, total,
    fetchArticlesList, createArticle, updateArticle, deleteArticle,
  } = useArticles();
  const { categories, fetchCategories, createCategorie, updateCategorie, deleteCategorie } = useCategories();

  const [selectedArticleId,  setSelectedArticleId]  = useState<string | null>(null);
  const [detailArticle,      setDetailArticle]      = useState<Article | null>(null);
  const [isArticleFormOpen,  setIsArticleFormOpen]  = useState(false);
  const [isCategorieFormOpen,setIsCategorieFormOpen]= useState(false);
  const [editingArticle,     setEditingArticle]     = useState<any>(null);
  const [editingCategorie,   setEditingCategorie]   = useState<any>(null);
  const [searchTerm,         setSearchTerm]         = useState('');
  const [debouncedSearch,    setDebouncedSearch]    = useState('');
  const [currentPage,        setCurrentPage]        = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    if (activeSubTab !== 'articles') return;
    const params: ArticleListParams = {
      page: currentPage,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
    };
    fetchArticlesList(params);
  }, [currentPage, debouncedSearch, activeSubTab, fetchArticlesList]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const reload = useCallback(() => {
    fetchArticlesList({ page: currentPage, pageSize: PAGE_SIZE, ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}) });
  }, [fetchArticlesList, currentPage, debouncedSearch]);

  const handleTabChange = (tab: SubTab) => {
    setActiveSubTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const handleNewClick = () => {
    if (activeSubTab === 'articles') { setEditingArticle(null); setIsArticleFormOpen(true); }
    else if (activeSubTab === 'categories') { setEditingCategorie(null); setIsCategorieFormOpen(true); }
  };

  const handleEditArticle = (article: any) => { setEditingArticle(article); setIsArticleFormOpen(true); };

  const handleDuplicateArticle = async (article: any) => {
    try {
      await createArticle({ ...article, id: undefined, codeArticle: `ART${Date.now().toString().slice(-6)}`, designation: `Copie de - ${article.designation}` });
      await reload();
    } catch (e) { console.error(e); }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      await deleteArticle(articleId);
      if (selectedArticleId === articleId) setSelectedArticleId(null);
      await reload();
    } catch (e) { console.error(e); }
  };

  const handleDeactivateArticle = async (articleId: string) => {
    try { await updateArticle(articleId, { etat: 'Inactif' }); await reload(); }
    catch (e) { console.error(e); }
  };

  const handleSaveArticle = async (articleData: any) => {
    try {
      if (editingArticle) await updateArticle(editingArticle.id, articleData);
      else await createArticle(articleData);
      setIsArticleFormOpen(false);
      setEditingArticle(null);
      await reload();
    } catch (e) { console.error(e); }
  };

  const handleEditCategorie    = (cat: any) => { setEditingCategorie(cat); setIsCategorieFormOpen(true); };
  const handleDeleteCategorie  = async (id: string) => { try { await deleteCategorie(id); } catch (e) { console.error(e); } };

  const handleSaveCategorie = async (data: any) => {
    try {
      if (editingCategorie) await updateCategorie(editingCategorie.id, data);
      else await createCategorie(data);
      setIsCategorieFormOpen(false);
      setEditingCategorie(null);
      await fetchCategories();
    } catch (e) { console.error(e); }
  };

  const articlesActifs = articles.filter(a => a.etat === 'Actif').length;
  const valeurStock    = articles.reduce((s, a) => s + ((a.prixAchat ?? 0) * (a.stockActuel ?? 0)), 0);

  const detailCategorie = detailArticle
    ? categories.find(c => c.id === detailArticle.idCathegorie)
    : null;

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'articles':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article (nom, code, catégorie…)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <ArticleTable
              articles={articles as any}
              categories={categories as any}
              selectedArticleId={selectedArticleId}
              onSelectArticle={setSelectedArticleId}
              onViewDetail={setDetailArticle}
              onEdit={handleEditArticle}
              onDuplicate={handleDuplicateArticle}
              onDelete={handleDeleteArticle}
              onDeactivate={handleDeactivateArticle}
              loading={loading}
              currentPage={currentPage}
              totalPages={pagination?.totalPages}
              totalRecords={pagination?.totalRecords ?? total}
              hasNext={pagination?.hasNext}
              hasPrevious={pagination?.hasPrevious}
              onPageChange={setCurrentPage}
            />
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
        return (
          <StockManager
            onUpdateStock={async (articleId) => {
              try { await updateArticle(articleId, { etat: 'Actif' }); }
              catch (e) { console.error(e); }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestion des Articles</h2>
            <p className="text-sm text-gray-400 mt-0.5">Articles, catégories et mouvements de stock</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
            <button
              onClick={reload}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            {activeSubTab !== 'stock' && (
              <button
                onClick={handleNewClick}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {activeSubTab === 'articles' ? 'Nouvel article' : 'Nouvelle catégorie'}
              </button>
            )}
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { icon: Package,    label: 'Total articles',      value: total,              color: 'text-gray-500' },
            { icon: TrendingUp, label: 'Articles actifs',     value: articlesActifs,     color: 'text-gray-500' },
            { icon: DollarSign, label: 'Valeur stock',        value: `${(valeurStock / 1000000).toFixed(1)} M`, color: 'text-gray-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-100 shrink-0">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div className="flex border-b border-gray-200">
          {([
            { id: 'articles',   icon: FileText, label: 'Articles'   },
            { id: 'categories', icon: Tag,      label: 'Catégories' },
            { id: 'stock',      icon: Package,  label: 'Stock'      },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeSubTab === id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {renderSubTabContent()}
      </div>

      {/* Formulaires */}
      <ArticleForm
        isOpen={isArticleFormOpen}
        onClose={() => { setIsArticleFormOpen(false); setEditingArticle(null); }}
        article={editingArticle}
        onSave={handleSaveArticle}
        categories={categories as any}
      />

      <CategorieForm
        isOpen={isCategorieFormOpen}
        onClose={() => { setIsCategorieFormOpen(false); setEditingCategorie(null); }}
        categorie={editingCategorie}
        onSave={handleSaveCategorie}
      />

      {/* Modale de détail */}
      {detailArticle && (
        <DetailModal
          article={detailArticle}
          categorieName={detailCategorie?.designation}
          categorieColor={detailCategorie?.couleur}
          onClose={() => setDetailArticle(null)}
          onEdit={handleEditArticle}
        />
      )}
    </div>
  );
};

export default ArticlesManager;
