import React from 'react';
import { Search, Plus, TrendingUp, DollarSign, ShoppingCart, Trash2 } from 'lucide-react';

const POSTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Point de Vente (POS)</h2>
            <p className="text-gray-600">Interface de caisse et gestion des transactions</p>
          </div>
          <button className="mt-4 md:mt-0 bg-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nouvelle vente</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Scanner ou rechercher un produit..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Scanner
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all text-left"
                  >
                    <div className="text-3xl mb-2">{product.image}</div>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="text-gray-600 text-sm">{product.price}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Ventes aujourd'hui</p>
                    <p className="text-2xl font-bold text-gray-900">48</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">CA aujourd'hui</p>
                    <p className="text-2xl font-bold text-gray-900">12,450€</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Panier moyen</p>
                    <p className="text-2xl font-bold text-gray-900">259€</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Panier actuel</h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">iPhone 15 Pro</p>
                  <p className="text-sm text-gray-600">1 x 1299€</p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">AirPods Pro</p>
                  <p className="text-sm text-gray-600">1 x 279€</p>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>1,578€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA (20%)</span>
                <span>315.60€</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>1,893.60€</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
                Encaisser
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
                Mettre en attente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSTab;
