import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Eye, Search, Filter, Download, CheckCircle, XCircle, Truck, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import ProductFormModal from './ProductFormModal';
import OrderDetailsModal from './OrderDetailsModal';
import CategoryFormModal from './CategoryFormModal';
import ConfirmationModal from './ConfirmationModal';
import { Product } from '../store/StorePage';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdDate: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
}

const StoreSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'success' | 'info';
    onConfirm: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {}
  });

  const defaultCategories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'pos-systems', name: 'Systèmes de caisse' },
    { id: 'printers', name: 'Imprimantes' },
    { id: 'paper', name: 'Papier thermique' },
    { id: 'accessories', name: 'Accessoires' },
    { id: 'software', name: 'Logiciels' }
  ];

  // Simulation de récupération des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        // Produits simulés
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
              'Tiroir-caisse automatique'
            ],
            specifications: {
              'Écran': '15" tactile capacitif',
              'Processeur': 'Intel Celeron J4125',
              'RAM': '8GB DDR4'
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
              'Coupe automatique'
            ],
            specifications: {
              'Largeur papier': '80mm',
              'Vitesse': '250mm/s',
              'Résolution': '203 DPI'
            }
          }
        ];

        // Commandes simulées
        const mockOrders: Order[] = [
          {
            id: 'CMD001',
            customerName: 'Restaurant Le Gourmet',
            customerEmail: 'contact@legourmet.fr',
            customerPhone: '+33 1 23 45 67 89',
            items: [
              {
                productId: '1',
                productName: 'Terminal de Caisse Tactile Pro',
                quantity: 2,
                price: 899
              },
              {
                productId: '2',
                productName: 'Imprimante Thermique 80mm',
                quantity: 1,
                price: 189
              }
            ],
            totalAmount: 1987,
            status: 'confirmed',
            orderDate: '2024-01-15',
            shippingAddress: '123 Rue de la Paix, 75001 Paris',
            deliveryNotes: 'Livraison en matinée de préférence'
          },
          {
            id: 'CMD002',
            customerName: 'Boutique Mode & Style',
            customerEmail: 'info@modestyle.com',
            customerPhone: '+33 6 12 34 56 78',
            items: [
              {
                productId: '1',
                productName: 'Terminal de Caisse Tactile Pro',
                quantity: 1,
                price: 899
              }
            ],
            totalAmount: 899,
            status: 'pending',
            orderDate: '2024-01-16',
            shippingAddress: '456 Avenue des Champs, 69000 Lyon',
            deliveryNotes: ''
          }
        ];

        setProducts(mockProducts);
        setOrders(mockOrders);
        
        // Catégories simulées
        const mockCategories: Category[] = [
          {
            id: 'pos-systems',
            name: 'Systèmes de caisse',
            description: 'Terminaux et systèmes de point de vente complets',
            productCount: 1,
            isActive: true,
            createdDate: '2024-01-01'
          },
          {
            id: 'printers',
            name: 'Imprimantes',
            description: 'Imprimantes thermiques et accessoires d\'impression',
            productCount: 1,
            isActive: true,
            createdDate: '2024-01-01'
          },
          {
            id: 'paper',
            name: 'Papier thermique',
            description: 'Rouleaux et consommables d\'impression',
            productCount: 0,
            isActive: true,
            createdDate: '2024-01-01'
          },
          {
            id: 'accessories',
            name: 'Accessoires',
            description: 'Lecteurs, tiroirs-caisses et accessoires divers',
            productCount: 0,
            isActive: true,
            createdDate: '2024-01-01'
          },
          {
            id: 'software',
            name: 'Logiciels',
            description: 'Licences et solutions logicielles',
            productCount: 0,
            isActive: false,
            createdDate: '2024-01-01'
          }
        ];
        
        setCategories(mockCategories);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtrage des commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtrage des catégories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Gestion des produits
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Modification
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? { ...p, ...productData } : p
      ));
    } else {
      // Création
      const newProduct: Product = {
        id: Date.now().toString(),
        rating: 0,
        reviews: 0,
        features: [],
        specifications: {},
        ...productData
      } as Product;
      setProducts(prev => [...prev, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setConfirmationModal({
      isOpen: true,
      title: 'Supprimer le produit',
      message: `Êtes-vous sûr de vouloir supprimer le produit "${product?.name}" ? Cette action est irréversible.`,
      type: 'danger',
      confirmText: 'Supprimer',
      onConfirm: () => {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    });
  };

  const confirmDeleteProduct = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Gestion des catégories
  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      // Modification
      setCategories(prev => prev.map(c => 
        c.id === editingCategory.id ? { ...c, ...categoryData } : c
      ));
    } else {
      // Création
      const newCategory: Category = {
        id: Date.now().toString(),
        productCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        isActive: true,
        ...categoryData
      } as Category;
      setCategories(prev => [...prev, newCategory]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.productCount > 0) {
      setConfirmationModal({
        isOpen: true,
        title: 'Suppression impossible',
        message: `Impossible de supprimer la catégorie "${category.name}" car elle contient ${category.productCount} produit(s). Veuillez d'abord déplacer ou supprimer les produits.`,
        type: 'warning',
        confirmText: 'Compris',
        onConfirm: () => {}
      });
      return;
    }
    
    setConfirmationModal({
      isOpen: true,
      title: 'Supprimer la catégorie',
      message: `Êtes-vous sûr de vouloir supprimer la catégorie "${category?.name}" ? Cette action est irréversible.`,
      type: 'danger',
      confirmText: 'Supprimer',
      onConfirm: () => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
      }
    });
  };

  const confirmDeleteCategory = (categoryId: string) => {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const toggleCategoryStatus = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const newStatus = !category?.isActive;
    
    setConfirmationModal({
      isOpen: true,
      title: `${newStatus ? 'Activer' : 'Désactiver'} la catégorie`,
      message: `Êtes-vous sûr de vouloir ${newStatus ? 'activer' : 'désactiver'} la catégorie "${category?.name}" ? ${!newStatus ? 'Les produits de cette catégorie ne seront plus visibles dans la boutique.' : 'Les produits de cette catégorie redeviendront visibles dans la boutique.'}`,
      type: newStatus ? 'success' : 'warning',
      confirmText: newStatus ? 'Activer' : 'Désactiver',
      onConfirm: () => {
        setCategories(prev => prev.map(c => 
          c.id === categoryId ? { ...c, isActive: !c.isActive } : c
        ));
      }
    });
  };

  // Export des données
  const exportProducts = () => {
    const exportData = filteredProducts.map(product => ({
      'ID': product.id,
      'Nom': product.name,
      'Description': product.description,
      'Prix': `${product.price}€`,
      'Catégorie': product.category,
      'Stock': product.stock,
      'Note': product.rating,
      'Avis': product.reviews
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produits');
    XLSX.writeFile(workbook, `produits_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportOrders = () => {
    const exportData = filteredOrders.map(order => ({
      'ID Commande': order.id,
      'Client': order.customerName,
      'Email': order.customerEmail,
      'Téléphone': order.customerPhone,
      'Montant Total': `${order.totalAmount}€`,
      'Statut': order.status,
      'Date': order.orderDate,
      'Adresse': order.shippingAddress
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Commandes');
    XLSX.writeFile(workbook, `commandes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportCategories = () => {
    const exportData = filteredCategories.map(category => ({
      'ID': category.id,
      'Nom': category.name,
      'Description': category.description,
      'Nombre de produits': category.productCount,
      'Statut': category.isActive ? 'Actif' : 'Inactif',
      'Date de création': category.createdDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catégories');
    XLSX.writeFile(workbook, `categories_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Gestion des commandes
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    const statusLabels = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    
    const getConfirmationType = (status: Order['status']) => {
      switch (status) {
        case 'cancelled': return 'danger';
        case 'confirmed': return 'success';
        case 'shipped': return 'info';
        case 'delivered': return 'success';
        default: return 'info';
      }
    };
    
    setConfirmationModal({
      isOpen: true,
      title: 'Changer le statut de la commande',
      message: `Êtes-vous sûr de vouloir changer le statut de la commande ${order?.id} vers "${statusLabels[newStatus]}" ?`,
      type: getConfirmationType(newStatus),
      confirmText: 'Confirmer',
      onConfirm: () => {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusActions = (order: Order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          <button
            key="confirm"
            onClick={() => updateOrderStatus(order.id, 'confirmed')}
            className="p-2 text-green-600 hover:text-green-800 transition-colors"
            title="Confirmer la commande"
          >
            <CheckCircle className="w-4 h-4" />
          </button>,
          <button
            key="cancel"
            onClick={() => updateOrderStatus(order.id, 'cancelled')}
            className="p-2 text-red-600 hover:text-red-800 transition-colors"
            title="Annuler la commande"
          >
            <XCircle className="w-4 h-4" />
          </button>
        );
        break;
      case 'confirmed':
        actions.push(
          <button
            key="ship"
            onClick={() => updateOrderStatus(order.id, 'shipped')}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Marquer comme expédiée"
          >
            <Truck className="w-4 h-4" />
          </button>
        );
        break;
      case 'shipped':
        actions.push(
          <button
            key="deliver"
            onClick={() => updateOrderStatus(order.id, 'delivered')}
            className="p-2 text-green-600 hover:text-green-800 transition-colors"
            title="Marquer comme livrée"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        );
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion Boutique</h1>
          <p className="text-gray-600">Gérez vos produits et commandes en ligne</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={
              activeTab === 'products' ? exportProducts : 
              activeTab === 'orders' ? exportOrders : 
              exportCategories
            }
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Exporter Excel</span>
          </button>
          {(activeTab === 'products' || activeTab === 'categories') && (
            <button
              onClick={() => {
                if (activeTab === 'products') {
                  setShowProductModal(true);
                } else {
                  setShowCategoryModal(true);
                }
              }}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{activeTab === 'products' ? 'Ajouter un produit' : 'Ajouter une catégorie'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg max-w-md">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'products'
              ? 'bg-gray-800 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Produits ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'orders'
              ? 'bg-gray-800 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Commandes ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'categories'
              ? 'bg-gray-800 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Catégories ({categories.length})</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'products' ? 'Rechercher un produit...' : 
                activeTab === 'orders' ? 'Rechercher une commande...' :
                'Rechercher une catégorie...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          {activeTab === 'products' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              {defaultCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          
          {activeTab === 'orders' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          )}

          <div className="text-sm text-gray-600 flex items-center">
            <span>
              {activeTab === 'products' 
                ? `${filteredProducts.length} produit(s) trouvé(s)`
                : activeTab === 'orders'
                ? `${filteredOrders.length} commande(s) trouvée(s)`
                : `${filteredCategories.length} catégorie(s) trouvée(s)`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'products' ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                        {categories.find(c => c.id === product.category)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.price}€</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {product.originalPrice}€
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {defaultCategories.find(c => c.id === product.category)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ⭐ {product.rating} ({product.reviews})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'orders' ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.reduce((total, item) => total + item.quantity, 0)} article(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.totalAmount}€</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.orderDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {getStatusActions(order)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Produits
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">ID: {category.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        category.productCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.productCount} produit(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCategoryStatus(category.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {category.isActive ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(category.createdDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                          disabled={category.productCount > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
              <p className="text-gray-600">Créez votre première catégorie pour organiser vos produits</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de produit */}
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          categories={defaultCategories.filter(c => c.id !== 'all')}
        />
      )}

      {/* Modal de catégorie */}
      {showCategoryModal && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}

      {/* Modal de détails de commande */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={updateOrderStatus}
        />
      )}

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText={confirmationModal.confirmText}
      />
    </div>
  );
};

export default StoreSection;