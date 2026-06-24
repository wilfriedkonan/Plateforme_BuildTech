import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, Loader2, AlertCircle, Tag } from 'lucide-react';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Article } from '../../services/articleService';

interface CartItem {
  article: Article;
  quantite: number;
}

const POSTab: React.FC = () => {
  const {
    articles,
    loading: loadingArticles,
    error: errorArticles,
    fetchArticles,
  } = useArticles();

  const { categories, loading: loadingCategories, fetchCategories } = useCategories();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategorie !== 'all') {
      result = result.filter(a => a.idCathegorie === selectedCategorie);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.designation?.toLowerCase().includes(q) ||
        a.codeArticle?.toLowerCase().includes(q) ||
        (a.codeBarre && a.codeBarre.toLowerCase().includes(q))
      );
    }
    return result;
  }, [articles, search, selectedCategorie]);

  const getArticlePrice = (article: Article) =>
    article.estPromo && article.prixPromo ? article.prixPromo : article.prixVente || 0;

  const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' F';

  const addToCart = (article: Article) => {
    setCart(prev => {
      const existing = prev.find(item => item.article.id === article.id);
      if (existing) {
        return prev.map(item =>
          item.article.id === article.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { article, quantite: 1 }];
    });
  };

  const removeFromCart = (articleId: string) => {
    setCart(prev => prev.filter(item => item.article.id !== articleId));
  };

  const updateQuantite = (articleId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.article.id === articleId ? { ...item, quantite: item.quantite + delta } : item
        )
        .filter(item => item.quantite > 0)
    );
  };

  const sousTotal = cart.reduce((sum, item) => {
    return sum + getArticlePrice(item.article) * item.quantite;
  }, 0);

  const tva = cart.reduce((sum, item) => {
    const price = getArticlePrice(item.article);
    const taux = item.article.tauxTva || 0;
    return sum + price * item.quantite * (taux / 100);
  }, 0);

  const total = sousTotal + tva;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Point de Vente (POS)</h2>
        <p className="text-gray-600 text-sm mt-1">Interface de caisse et gestion des transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
        {/* ── Gauche : Articles ── */}
        <div className="lg:col-span-2 border-r border-gray-200 flex flex-col">
          {/* Recherche + filtres catégories */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article, code barre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedCategorie('all')}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategorie === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {!loadingCategories &&
                categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorie(cat.id || 'all')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategorie === cat.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={
                      selectedCategorie === cat.id
                        ? { backgroundColor: cat.couleur || '#0d9488' }
                        : {}
                    }
                  >
                    {cat.designation}
                  </button>
                ))}
            </div>
          </div>

          {/* Grille d'articles */}
          <div className="flex-1 p-4 overflow-y-auto">
            {errorArticles && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorArticles}</span>
              </div>
            )}

            {loadingArticles ? (
              <div className="flex items-center justify-center h-48 space-x-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                <span>Chargement des articles...</span>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Aucun article trouvé
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredArticles.map(article => {
                  const price = getArticlePrice(article);
                  const inCart = cart.find(i => i.article.id === article.id);
                  return (
                    <button
                      key={article.id}
                      onClick={() => addToCart(article)}
                      className={`relative p-3 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                        inCart ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {inCart && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {inCart.quantite}
                        </span>
                      )}
                      {article.estPromo && (
                        <span className="absolute top-2 left-2 flex items-center px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                          <Tag className="w-3 h-3 mr-0.5" />
                          Promo
                        </span>
                      )}

                      <div className="w-full h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-2 mt-1 overflow-hidden">
                        {article.imageURL ? (
                          <img
                            src={article.imageURL}
                            alt={article.designation}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🍽️</span>
                        )}
                      </div>

                      <p className="font-medium text-gray-900 text-sm leading-tight truncate">
                        {article.designation}
                      </p>
                      {article.nomCategorie && (
                        <p className="text-xs text-gray-400 truncate">{article.nomCategorie}</p>
                      )}

                      <div className="mt-1">
                        {article.estPromo && article.prixPromo ? (
                          <div className="flex items-baseline space-x-1">
                            <span className="font-bold text-orange-600 text-sm">
                              {formatPrice(article.prixPromo)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(article.prixVente || 0)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-teal-700 text-sm">{formatPrice(price)}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500 flex items-center space-x-4">
            <span>{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}</span>
            <span>
              {cart.reduce((s, i) => s + i.quantite, 0)} unité
              {cart.reduce((s, i) => s + i.quantite, 0) !== 1 ? 's' : ''} au panier
            </span>
          </div>
        </div>

        {/* ── Droite : Panier ── */}
        <div className="flex flex-col border-t lg:border-t-0">
          <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Panier</h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="ml-auto text-xs text-gray-400 hover:text-red-600 transition-colors"
              >
                Vider
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-[200px]">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm">
                <ShoppingCart className="w-8 h-8 mb-2 opacity-30" />
                <span>Panier vide</span>
              </div>
            ) : (
              cart.map(item => {
                const price = getArticlePrice(item.article);
                return (
                  <div
                    key={item.article.id}
                    className="flex items-center space-x-2 py-2 border-b border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.article.designation}</p>
                      <p className="text-xs text-gray-500">{formatPrice(price)} / u</p>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => updateQuantite(item.article.id!, -1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantite}</span>
                      <button
                        onClick={() => updateQuantite(item.article.id!, 1)}
                        className="w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-700 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right flex-shrink-0 w-20">
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatPrice(price * item.quantite)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.article.id!)}
                      className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Totaux */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(sousTotal)}</span>
            </div>
            {tva > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>TVA</span>
                <span>{formatPrice(tva)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-teal-700">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="p-4 space-y-2">
            <button
              disabled={cart.length === 0}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Encaisser — {formatPrice(total)}
            </button>
            <button
              disabled={cart.length === 0}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              Mettre en attente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSTab;
