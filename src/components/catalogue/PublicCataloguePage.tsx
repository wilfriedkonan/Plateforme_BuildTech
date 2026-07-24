import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutGrid, Info, ShoppingCart, Package,
  ChevronLeft, ChevronRight, Search, X, Plus, Tag, AlertCircle,
} from 'lucide-react';
import type { BoutiqueDto } from '../../services/boutiqueService';
import type { PublicCatalogueArticle, PublicCatalogueCategory } from '../../hooks/usePublicCatalogue';
import CartDrawer from './CartDrawer';
import type { CartLine } from './CartDrawer';
import OrderModal from './OrderModal';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PublicCataloguePageProps {
  boutique: BoutiqueDto;
  categories: PublicCatalogueCategory[];
  mode: 'view' | 'shop';
  permitCommande: boolean;
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const fmt = (price: number) => `${price.toLocaleString('fr-FR')} FCFA`;

const CAT_GRADIENTS = [
  'from-emerald-400 to-teal-600',
  'from-blue-400 to-indigo-600',
  'from-purple-400 to-pink-600',
  'from-amber-400 to-orange-600',
  'from-red-400 to-rose-600',
  'from-cyan-400 to-sky-600',
];

const cartStorageKey = (idBoutique: string) => `cart:${idBoutique}`;

const loadCart = (idBoutique: string): CartLine[] => {
  try {
    const raw = localStorage.getItem(cartStorageKey(idBoutique));
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch { return []; }
};

// ─── Image statique de catégorie ──────────────────────────────────────────────

const CategoryImage: React.FC<{
  category: PublicCatalogueCategory;
  gradient: string;
  className?: string;
}> = ({ category, gradient, className = '' }) => (
  <div className={`overflow-hidden rounded-2xl ${className}`}>
    {category.imageURL ? (
      <img src={category.imageURL} alt={category.nomCategorie} className="w-full h-full object-cover" />
    ) : (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-white/40 text-4xl font-black uppercase">
          {category.nomCategorie.charAt(0)}
        </span>
      </div>
    )}
  </div>
);

// ─── Placeholder invisible (maintient la hauteur de la grille) ───────────────

const ListItemPlaceholder: React.FC = () => (
  <div
    className="flex items-center gap-2 py-2 border-b border-transparent invisible"
    aria-hidden="true"
  >
    <div className="w-10 h-10 rounded-lg flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between gap-1">
        <div className="h-3 w-2/3" />
        <div className="h-3 w-12" />
      </div>
      <div className="h-2.5 mt-px" />
    </div>
  </div>
);

// ─── Article compact ──────────────────────────────────────────────────────────

const ListItem: React.FC<{
  article: PublicCatalogueArticle;
  onPress: (a: PublicCatalogueArticle) => void;
}> = ({ article, onPress }) => {
  const hasPromo = article.estPromo && article.prixPromo != null && article.prixPromo < article.prixVente;
  const price = hasPromo ? article.prixPromo! : article.prixVente;

  return (
    <div
      className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0 hover:bg-orange-50/50 active:bg-orange-50 transition-colors rounded px-1 cursor-pointer select-none"
      onClick={() => onPress(article)}
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
        {article.imageURL ? (
          <img src={article.imageURL} alt={article.nomArticle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-4 h-4 text-gray-300" />
          </div>
        )}
        {hasPromo && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-lg" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1">
          <h4 className="font-semibold text-gray-900 text-xs leading-snug line-clamp-1 flex-1">
            {article.nomArticle}
          </h4>
          <span className="text-xs font-black text-gray-900 flex-shrink-0 ml-1 whitespace-nowrap">
            {fmt(price)}
          </span>
        </div>
        {article.descriptionArticle && (
          <p className="text-[10px] text-gray-400 line-clamp-1 leading-tight mt-px">
            {article.descriptionArticle}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Dots de pagination ───────────────────────────────────────────────────────

const PaginationDots: React.FC<{
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onGo: (i: number) => void;
}> = ({ total, current, onPrev, onNext, onGo }) => {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-4 select-none">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="p-1.5 disabled:opacity-25 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex gap-2 items-center">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGo(i)}
            className={`rounded-full transition-all duration-200 ${
              i === current ? 'w-5 h-2 bg-gray-900' : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'
            }`}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={current >= total - 1}
        className="p-1.5 disabled:opacity-25 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// ─── Swiper paginé — 6 articles/page, image catégorie STATIQUE ───────────────

const PagedSwiper: React.FC<{
  articles: PublicCatalogueArticle[];
  onPress: (a: PublicCatalogueArticle) => void;
  category: PublicCatalogueCategory;
  gradient: string;
}> = ({ articles, onPress, category, gradient }) => {
  const [page, setPage] = useState(0);
  const touchX = useRef(0);

  const LEFT  = 4;
  const RIGHT = 2;
  const PER   = LEFT + RIGHT;
  const total = Math.max(1, Math.ceil(articles.length / PER));

  const left  = articles.slice(page * PER,        page * PER + LEFT);
  const right = articles.slice(page * PER + LEFT, page * PER + PER);
  const leftPad  = Math.max(0, LEFT  - left.length);
  const rightPad = Math.max(0, RIGHT - right.length);

  if (articles.length === 0) {
    return <p className="text-sm text-gray-400 py-4">Aucun article dans cette catégorie.</p>;
  }

  return (
    <div
      onTouchStart={e => { e.stopPropagation(); touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        e.stopPropagation();
        const dx = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) {
          if (dx > 0) setPage(p => Math.min(total - 1, p + 1));
          else        setPage(p => Math.max(0, p - 1));
        }
      }}
    >
      <div className="grid grid-cols-2 gap-x-3 lg:gap-x-10">
        {/* Colonne gauche — 4 articles (slots fixes) */}
        <div>
          {left.map(a => <ListItem key={a.idArticle} article={a} onPress={onPress} />)}
          {Array.from({ length: leftPad }).map((_, i) => <ListItemPlaceholder key={`lp-${i}`} />)}
        </div>
        {/* Colonne droite — image STATIQUE + 2 articles (slots fixes) */}
        <div>
          <CategoryImage category={category} gradient={gradient} className="w-full h-28 lg:h-44 mb-3" />
          {right.map(a => <ListItem key={a.idArticle} article={a} onPress={onPress} />)}
          {Array.from({ length: rightPad }).map((_, i) => <ListItemPlaceholder key={`rp-${i}`} />)}
        </div>
      </div>
      <PaginationDots
        total={total}
        current={page}
        onPrev={() => setPage(p => Math.max(0, p - 1))}
        onNext={() => setPage(p => Math.min(total - 1, p + 1))}
        onGo={setPage}
      />
    </div>
  );
};

// ─── Modale article ───────────────────────────────────────────────────────────

const ArticleModal: React.FC<{
  article: PublicCatalogueArticle;
  onClose: () => void;
  onAdd?: (a: PublicCatalogueArticle) => void;
  directUrl: string;
}> = ({ article, onClose, onAdd, directUrl }) => {
  const hasPromo = article.estPromo && article.prixPromo != null && article.prixPromo < article.prixVente;
  const displayPrice = hasPromo ? article.prixPromo! : article.prixVente;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes modal-slide-up { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes modal-fade-in  { from{opacity:0} to{opacity:1} }
        .modal-backdrop { animation: modal-fade-in .2s ease-out; }
        .modal-panel    { animation: modal-slide-up .25s ease-out; }
      `}</style>

      <div
        className="modal-backdrop fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <div
          className="modal-panel relative bg-white w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Image hero */}
          <div className="relative h-52 sm:h-64 bg-gray-100 rounded-t-3xl sm:rounded-t-2xl overflow-hidden">
            {article.imageURL ? (
              <img
                src={article.imageURL}
                alt={article.nomArticle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <Package className="w-20 h-20 text-gray-300" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
            {hasPromo && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" /> PROMO
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-5 pb-8">
            {article.nomCategorie && (
              <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-1">
                {article.nomCategorie}
              </p>
            )}
            <h2 className="text-xl font-black text-gray-900 leading-tight mb-3">
              {article.nomArticle}
            </h2>
            {article.descriptionArticle ? (
              <p className="text-sm text-gray-600 leading-relaxed">{article.descriptionArticle}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Aucune description disponible.</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {article.estStockable && (
                <span
                  className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${
                    (article.stock ?? 0) > 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {(article.stock ?? 0) > 0 ? `En stock · ${article.stock}` : 'Rupture de stock'}
                </span>
              )}
              {article.codeArticle && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-mono">
                  {article.codeArticle}
                </span>
              )}
              {(article.tauxTva ?? 0) > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                  TVA {article.tauxTva}%
                </span>
              )}
            </div>

            {/* Prix + action */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <div>
                {hasPromo ? (
                  <>
                    <span className="text-2xl font-black text-red-600">{fmt(displayPrice)}</span>
                    <span className="block text-sm text-gray-400 line-through">{fmt(article.prixVente)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-gray-900">{fmt(displayPrice)}</span>
                )}
              </div>

              {onAdd ? (
                <button
                  onClick={() => { onAdd(article); onClose(); }}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Ajouter au panier
                </button>
              ) : (
                <a
                  href={directUrl}
                  className="flex items-center gap-2 text-sm text-orange-600 font-semibold border border-orange-300 px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Commander en ligne →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Section catégorie ────────────────────────────────────────────────────────

const CategorySection: React.FC<{
  category: PublicCatalogueCategory;
  index: number;
  articles: PublicCatalogueArticle[];
  onPress: (a: PublicCatalogueArticle) => void;
}> = ({ category, index, articles, onPress }) => (
  <section id={`cat-${category.idCategorie}`} className="mb-12 scroll-mt-20">
    <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wide mb-1">
      {category.nomCategorie}
    </h2>
    {category.description && (
      <p className="text-sm text-gray-500 italic mb-4">{category.description}</p>
    )}
    {!category.description && <div className="mb-3" />}
    <PagedSwiper
      articles={articles}
      onPress={onPress}
      category={category}
      gradient={CAT_GRADIENTS[index % CAT_GRADIENTS.length]}
    />
  </section>
);

// ─── Page principale ──────────────────────────────────────────────────────────

const PublicCataloguePage: React.FC<PublicCataloguePageProps> = ({
  boutique, categories, mode, permitCommande,
}) => {
  // ── Panier persisté par boutique ──────────────────────────────────────────
  const [cart, setCart] = useState<CartLine[]>(() => loadCart(boutique.idBoutique));

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(cartStorageKey(boutique.idBoutique), JSON.stringify(cart));
    } else {
      localStorage.removeItem(cartStorageKey(boutique.idBoutique));
    }
  }, [cart, boutique.idBoutique]);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]     = useState('');
  const [modalArticle, setModalArticle] = useState<PublicCatalogueArticle | null>(null);
  const [isCartOpen, setIsCartOpen]     = useState(false);
  const [isOrderOpen, setIsOrderOpen]   = useState(false);
  const [catPage, setCatPage]           = useState(0);
  const catTouchX = useRef(0);

  const CAT_PER_PAGE  = 2;
  const canOrder      = mode === 'shop' && permitCommande;
  const totalCartQty  = cart.reduce((s, l) => s + l.quantite, 0);
  const directUrl     = `/${boutique.typeBoutique.toLowerCase()}/${boutique.slugBoutique}/menu`;

  // ── Gestion du panier ────────────────────────────────────────────────────
  const handleAdd = (a: PublicCatalogueArticle) => {
    setCart(prev => {
      const idx = prev.findIndex(l => l.article.idArticle === a.idArticle);
      if (idx >= 0) return prev.map((l, i) => i === idx ? { ...l, quantite: l.quantite + 1 } : l);
      return [...prev, { article: a, quantite: 1 }];
    });
  };

  const handleIncrement = (id: string) =>
    setCart(prev => prev.map(l => l.article.idArticle === id ? { ...l, quantite: l.quantite + 1 } : l));

  const handleDecrement = (id: string) =>
    setCart(prev => {
      const line = prev.find(l => l.article.idArticle === id);
      if (!line) return prev;
      if (line.quantite <= 1) return prev.filter(l => l.article.idArticle !== id);
      return prev.map(l => l.article.idArticle === id ? { ...l, quantite: l.quantite - 1 } : l);
    });

  const handleRemove = (id: string) =>
    setCart(prev => prev.filter(l => l.article.idArticle !== id));

  const handleOrderSuccess = () => {
    setCart([]);
    setIsOrderOpen(false);
    setIsCartOpen(false);
    localStorage.removeItem(cartStorageKey(boutique.idBoutique));
  };

  // ── Recherche & pagination catégories ────────────────────────────────────
  const filterArticles = (arts: PublicCatalogueArticle[]) => {
    if (!searchTerm.trim()) return arts;
    const q = searchTerm.toLowerCase();
    return arts.filter(a =>
      a.nomArticle.toLowerCase().includes(q) ||
      a.descriptionArticle?.toLowerCase().includes(q),
    );
  };

  const hasSearch      = searchTerm.trim().length > 0;
  const catTotalPages  = Math.max(1, Math.ceil(categories.length / CAT_PER_PAGE));
  const displayedCats  = hasSearch
    ? categories
    : categories.slice(catPage * CAT_PER_PAGE, catPage * CAT_PER_PAGE + CAT_PER_PAGE);
  const noResults      = hasSearch && categories.every(cat => filterArticles(cat.articles).length === 0);

  const goPage = (p: number) => {
    if (p < 0 || p >= catTotalPages) return;
    setCatPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes cat-slide-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .cat-page-enter { animation: cat-slide-in .3s ease-out; }
      `}</style>

      {/* ── Bannière mode consultation ─────────────────────────────────────── */}
      {mode === 'view' && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center py-2 px-4 text-sm">
          <AlertCircle className="inline w-3.5 h-3.5 mr-1 -mt-px" />
          Mode consultation —{' '}
          <a href={directUrl} className="font-semibold underline hover:text-amber-900">
            Commandez en ligne
          </a>
        </div>
      )}

      {/* ── Header sticky ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 pt-3 flex items-center justify-between">
          <h1 className="text-base md:text-xl font-black text-gray-900 tracking-widest uppercase truncate max-w-[55vw]">
            {boutique.nomBoutique}
          </h1>
          <div className="flex items-center gap-0.5">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors" title="Menu">
              <LayoutGrid className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors" title="Infos">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
            {/* Panier visible uniquement en mode shop */}
            {canOrder && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Panier"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {totalCartQty > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {totalCartQty > 9 ? '9+' : totalCartQty}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Rechercher un article…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-gray-900/20 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Effacer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Contenu ────────────────────────────────────────────────────────── */}
      <main
        className="max-w-5xl mx-auto px-4 py-6"
        onTouchStart={e => { catTouchX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = catTouchX.current - e.changedTouches[0].clientX;
          if (Math.abs(dx) > 60 && !hasSearch) {
            if (dx > 0) goPage(catPage + 1);
            else        goPage(catPage - 1);
          }
        }}
      >
        {categories.length === 0 && (
          <p className="text-center py-24 text-sm text-gray-400">Aucune catégorie disponible.</p>
        )}
        {noResults && (
          <p className="text-center py-16 text-sm text-gray-400">
            Aucun résultat pour «&nbsp;{searchTerm}&nbsp;»
          </p>
        )}

        {/* Navigation catégories — haut */}
        {!hasSearch && catTotalPages > 1 && (
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => goPage(catPage - 1)}
              disabled={catPage === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold text-sm text-gray-700 select-none"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Précédent</span>
            </button>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs text-gray-400 font-medium">
                {catPage * CAT_PER_PAGE + 1}–{Math.min((catPage + 1) * CAT_PER_PAGE, categories.length)} sur {categories.length} catégories
              </span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: catTotalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goPage(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === catPage ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'
                    }`}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => goPage(catPage + 1)}
              disabled={catPage >= catTotalPages - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold text-sm text-gray-700 select-none"
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Catégories */}
        <div key={hasSearch ? 'search' : catPage} className="cat-page-enter">
          {displayedCats.map(cat => {
            const originalIdx = categories.indexOf(cat);
            const filtered = filterArticles(cat.articles);
            if (hasSearch && filtered.length === 0) return null;
            return (
              <CategorySection
                key={cat.idCategorie}
                category={cat}
                index={originalIdx}
                articles={filtered}
                onPress={setModalArticle}
              />
            );
          })}
        </div>

        {/* Navigation catégories — bas */}
        {!hasSearch && catTotalPages > 1 && (
          <div className="flex items-center justify-between pt-4 pb-2 border-t border-gray-100">
            <button
              onClick={() => goPage(catPage - 1)}
              disabled={catPage === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold text-sm text-gray-700 select-none"
            >
              <ChevronLeft className="w-4 h-4" /> Menu précédent
            </button>
            <span className="text-xs text-gray-400">{catPage + 1} / {catTotalPages}</span>
            <button
              onClick={() => goPage(catPage + 1)}
              disabled={catPage >= catTotalPages - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all font-semibold text-sm text-gray-700 select-none"
            >
              Menu suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-6 mt-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-300">
          &copy; {new Date().getFullYear()} {boutique.nomBoutique} — Propulsé par BuildTech
        </div>
      </footer>

      {/* ── Modale article ─────────────────────────────────────────────────── */}
      {modalArticle && (
        <ArticleModal
          article={modalArticle}
          onClose={() => setModalArticle(null)}
          onAdd={canOrder ? handleAdd : undefined}
          directUrl={directUrl}
        />
      )}

      {/* ── Drawer panier + modal commande — mode shop uniquement ──────────── */}
      {canOrder && (
        <>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onValidate={() => { setIsCartOpen(false); setIsOrderOpen(true); }}
          />
          {isOrderOpen && (
            <OrderModal
              idBoutique={boutique.idBoutique}
              cart={cart}
              onClose={() => setIsOrderOpen(false)}
              onSuccess={handleOrderSuccess}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PublicCataloguePage;
