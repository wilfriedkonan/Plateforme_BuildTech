import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, Package } from 'lucide-react';
import type { PublicCatalogueArticle } from '../../hooks/usePublicCatalogue';

// ─── Type partagé ─────────────────────────────────────────────────────────────

export interface CartLine {
  article: PublicCatalogueArticle;
  quantite: number;
}

// ─── Utilitaire ───────────────────────────────────────────────────────────────

const fmt = (price: number) => `${price.toLocaleString('fr-FR')} FCFA`;

const unitPrice = (a: PublicCatalogueArticle) =>
  a.estPromo && a.prixPromo != null ? a.prixPromo : a.prixVente;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartLine[];
  onIncrement: (idArticle: string) => void;
  onDecrement: (idArticle: string) => void;
  onRemove: (idArticle: string) => void;
  onValidate: () => void;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen, onClose, cart, onIncrement, onDecrement, onRemove, onValidate,
}) => {
  const totalQty = cart.reduce((s, l) => s + l.quantite, 0);
  const total    = cart.reduce((s, l) => s + unitPrice(l.article) * l.quantite, 0);

  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes drawer-in   { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes sheet-up    { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes cart-bg-in  { from{opacity:0} to{opacity:1} }
        .cart-backdrop { animation: cart-bg-in .2s ease-out; }
        @media (min-width:640px) { .cart-panel { animation: drawer-in .25s ease-out; } }
        @media (max-width:639px) { .cart-panel { animation: sheet-up  .25s ease-out; } }
      `}</style>

      {/* Backdrop */}
      <div
        className="cart-backdrop fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Panel — right drawer on desktop, bottom-sheet on mobile */}
        <div
          className="cart-panel absolute bottom-0 left-0 right-0 sm:bottom-0 sm:top-0 sm:left-auto sm:right-0 sm:w-96 bg-white rounded-t-3xl sm:rounded-none sm:rounded-l-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-black text-gray-900">Mon panier</h2>
              {totalQty > 0 && (
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalQty} article{totalQty > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Lignes */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300">
                <ShoppingCart className="w-14 h-14" />
                <p className="text-sm font-medium text-gray-400">Votre panier est vide</p>
              </div>
            ) : (
              cart.map(line => {
                const price    = unitPrice(line.article);
                const subtotal = price * line.quantite;
                const hasPromo = line.article.estPromo && line.article.prixPromo != null;
                return (
                  <div
                    key={line.article.idArticle}
                    className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {line.article.imageURL ? (
                        <img
                          src={line.article.imageURL}
                          alt={line.article.nomArticle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {line.article.nomArticle}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={`text-xs ${hasPromo ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                          {fmt(price)}
                        </span>
                        {hasPromo && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {fmt(line.article.prixVente)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-800 mt-0.5">{fmt(subtotal)}</p>
                    </div>

                    {/* Contrôle quantité */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          line.quantite === 1
                            ? onRemove(line.article.idArticle)
                            : onDecrement(line.article.idArticle)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label={line.quantite === 1 ? 'Supprimer' : 'Diminuer la quantité'}
                      >
                        {line.quantite === 1 ? (
                          <Trash2 className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="w-6 text-center text-sm font-black text-gray-900 select-none">
                        {line.quantite}
                      </span>
                      <button
                        onClick={() => onIncrement(line.article.idArticle)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-6 pt-4 border-t border-gray-100 flex-shrink-0 space-y-3">
            {cart.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-xl font-black text-gray-900">{fmt(total)}</span>
              </div>
            )}
            <button
              onClick={onValidate}
              disabled={cart.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all shadow-sm"
            >
              Valider la commande
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
