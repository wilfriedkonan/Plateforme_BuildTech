import React, { useState } from 'react';
import { Search, Plus, TrendingUp, DollarSign, ShoppingCart, Trash2, Package, ShoppingBag } from 'lucide-react';

const POSMobileLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');
  const cartItemCount = 2;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-center gap-2 px-4 py-3 font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white border-b-2 border-gray-900'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produits</span>
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center justify-center gap-2 px-4 py-3 font-medium transition-all relative ${
              activeTab === 'cart'
                ? 'bg-gray-900 text-white border-b-2 border-gray-900'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Panier</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'products' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
                <button className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                  Scanner
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'MacBook Pro', price: '2499€', image: '💻' },
                  { name: 'iPhone 15', price: '1299€', image: '📱' },
                  { name: 'AirPods Pro', price: '279€', image: '🎧' },
                  { name: 'iPad Air', price: '699€', image: '📱' },
                  { name: 'Apple Watch', price: '449€', image: '⌚' },
                  { name: 'Magic Mouse', price: '89€', image: '🖱️' }
                ].map((product, index) => (
                  <button
                    key={index}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all text-left bg-white"
                  >
                    <div className="text-2xl mb-2">{product.image}</div>
                    <p className="font-medium text-gray-900 text-xs line-clamp-1">{product.name}</p>
                    <p className="text-gray-600 text-xs mt-1">{product.price}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex flex-col">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-gray-600 text-xs mb-1">Ventes</p>
                  <p className="text-lg font-bold text-gray-900">48</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex flex-col">
                  <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-gray-600 text-xs mb-1">CA</p>
                  <p className="text-lg font-bold text-gray-900">12K€</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex flex-col">
                  <ShoppingCart className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-gray-600 text-xs mb-1">Moyen</p>
                  <p className="text-lg font-bold text-gray-900">259€</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Panier actuel</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">iPhone 15 Pro</p>
                    <p className="text-xs text-gray-600 mt-1">1 x 1299€</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">AirPods Pro</p>
                    <p className="text-xs text-gray-600 mt-1">1 x 279€</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Sous-total</span>
                  <span>1,578€</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>TVA (20%)</span>
                  <span>315.60€</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>1,893.60€</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm">
                  Encaisser
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm">
                  Mettre en attente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSMobileLayout;
