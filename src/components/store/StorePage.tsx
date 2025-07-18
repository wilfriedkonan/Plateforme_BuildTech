import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, Plus, Minus, Eye, Heart, ArrowLeft, Home } from 'lucide-react';
import ProductModal from './ProductModal';
import CartModal from './CartModal';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  specifications: Record<string, string>;
  isNew?: boolean;
  isPromo?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tous les produits', count: 0 },
    { id: 'pos-systems', name: 'Systèmes de caisse', count: 0 },
    { id: 'printers', name: 'Imprimantes', count: 0 },
    { id: 'paper', name: 'Papier thermique', count: 0 },
    { id: 'accessories', name: 'Accessoires', count: 0 },
    { id: 'software', name: 'Logiciels', count: 0 }
  ];

  // Simulation de récupération des produits
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Terminal de Caisse Tactile Pro',
            description: 'Terminal de caisse tout-en-un avec écran tactile 15" et imprimante intégrée',
            price: 899,
            originalPrice: 1199,
            category: 'pos-systems',
            image: 'https://images.pexels.com/photos/6205509/pexels-photo-6205509.jpeg?auto=compress&cs=tinysrgb&w=800',
            stock: 15,
            rating: 4.8,
            reviews: 124,
            isPromo: true,
            features: [
              'Écran tactile 15" haute résolution',
              'Imprimante thermique intégrée',
              'Tiroir-caisse automatique',
              'Lecteur de codes-barres',
              'Connexion WiFi et Ethernet'
            ],
            specifications: {
              'Écran': '15" tactile capacitif',
              'Processeur': 'Intel Celeron J4125',
              'RAM': '8GB DDR4',
              'Stockage': '128GB SSD',
              'Connectivité': 'WiFi, Ethernet, USB 3.0',
              'Garantie': '2 ans'
            }
          },
          {
            id: '2',
            name: 'Imprimante Thermique 80mm',
            description: 'Imprimante de tickets thermique haute vitesse pour point de vente',
            price: 189,
            category: 'printers',
            image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
            stock: 32,
            rating: 4.6,
            reviews: 89,
            features: [
              'Impression thermique 80mm',
              'Vitesse 250mm/s',
              'Coupe automatique',
              'Interface USB et Ethernet',
              'Compatible ESC/POS'
            ],
            specifications: {
              'Largeur papier': '80mm',
              'Vitesse': '250mm/s',
              'Résolution': '203 DPI',
              'Interface': 'USB, Ethernet, Série',
              'Garantie': '1 an'
            }
          },
          {
            id: '3',
            name: 'Rouleaux Papier Thermique 80x80',
            description: 'Pack de 50 rouleaux de papier thermique premium pour imprimantes de caisse',
            price: 45,
            category: 'paper',
            image: 'https://images.pexels.com/photos/6205471/pexels-photo-6205471.jpeg?auto=compress&cs=tinysrgb&w=800',
            stock: 150,
            rating: 4.4,
            reviews: 203,
            features: [
              'Papier thermique premium',
              'Format 80x80mm',
              'Pack de 50 rouleaux',
              'Longue conservation',
              'Sans BPA'
            ],
            specifications: {
              'Format': '80mm x 80mm',
              'Quantité': '50 rouleaux',
              'Grammage': '55g/m²',
              'Longueur': '80 mètres/rouleau',
              'Conservation': '5 ans'
            }
          },
          {
            id: '4',
            name: 'Lecteur Code-Barres Sans Fil',
            description: 'Lecteur de codes-barres laser sans fil avec base de charge',
            price: 129,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800',
            stock: 28,
            rating: 4.7,
            reviews: 156,
            isNew: true,
            features: [
              'Technologie laser',
              'Connexion sans fil 2.4GHz',
              'Portée jusqu\'à 100m',
              'Batterie longue durée',
              'Base de charge incluse'
            ],
            specifications: {
              'Technologie': 'Laser rouge',
              'Portée': '100 mètres',
              'Batterie': '2200mAh Li-ion',
              'Autonomie': '12 heures',
              'Garantie': '2 ans'
            }
          },
          {
            id: '5',
            name: 'Tiroir-Caisse Électronique',
            description: 'Tiroir-caisse robuste avec ouverture électronique et compartiments ajustables',
            price: 159,
            category: 'accessories',
            image: 'https://images.pexels.com/photos/6205298/pexels-photo-6205298.jpeg?auto=compress&cs=tinysrgb&w=800',
            stock: 22,
            rating: 4.5,
            reviews: 78,
            features: [
              'Ouverture électronique',
              '5 compartiments billets',
              '8 compartiments pièces',
              'Serrure de sécurité',
              'Interface RJ11/RJ12'
            ],
            specifications: {
              'Dimensions': '410 x 420 x 100mm',
              'Matériau': 'Acier renforcé',
              'Compartiments': '5 billets + 8 pièces',
              'Interface': 'RJ11, RJ12',
              'Garantie': '3 ans'
            }
          },
          {
            id: '6',
            name: 'Business Manager Pro - Licence',
            description: 'Logiciel de gestion complet pour point de vente et gestion d\'entreprise',
            price: 299,
            category: 'software',
            image: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=800',
            stock: 999,
            rating: 4.9,
            reviews: 342,
            isNew: true,
            features: [
              'Gestion des ventes',
              'Gestion des stocks',
              'Facturation automatique',
              'Rapports détaillés',
              'Support technique inclus'
            ],
            specifications: {
              'Licence': 'Perpétuelle',
              'Utilisateurs': 'Illimité',
              'Support': '1 an inclus',
              'Mises à jour': '1 an incluses',
              'Plateforme': 'Windows 10/11'
            }
          }
        ];
        
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  // Filtrage et tri des produits
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Gestion du panier
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed w-full top-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Back to home button */}
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour à l'accueil</span>
            </button>

            {/* Center: Store title */}
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              <h1 className="text-xl font-bold text-gray-900">Boutique BuildTech</h1>
            </div>

            {/* Right: Cart button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-gray-800 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Panier</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 text-center">Équipements professionnels pour points de vente</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="name">Trier par nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <span>{filteredProducts.length} produit(s) trouvé(s)</span>
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Nouveau
                  </span>
                )}
                {product.isPromo && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Promo
                  </span>
                )}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{product.price}€</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product.originalPrice}€
                      </span>
                    )}
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun produit trouvé</p>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  );
};

export default StorePage;