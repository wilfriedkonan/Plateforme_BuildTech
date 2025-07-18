import React from 'react';
import { X, Package, User, MapPin, Phone, Mail, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  deliveryNotes?: string;
}

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  const getAvailableActions = () => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          { label: 'Confirmer', status: 'confirmed' as const, color: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Annuler', status: 'cancelled' as const, color: 'bg-red-600 hover:bg-red-700' }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: 'Expédier', status: 'shipped' as const, color: 'bg-purple-600 hover:bg-purple-700' }
        );
        break;
      case 'shipped':
        actions.push(
          { label: 'Marquer comme livrée', status: 'delivered' as const, color: 'bg-green-600 hover:bg-green-700' }
        );
        break;
    }
    
    return actions;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Commande {order.id}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statut de la commande */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Statut de la commande</h3>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-medium">{getStatusLabel(order.status)}</span>
                  </div>
                </div>
                
                {/* Actions disponibles */}
                {getAvailableActions().length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {getAvailableActions().map((action) => (
                      <button
                        key={action.status}
                        onClick={() => onUpdateStatus(order.id, action.status)}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${action.color}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Articles commandés */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles commandés</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-600">Prix unitaire: {item.price}€</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Quantité: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Total: {(item.price * item.quantity).toFixed(2)}€</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total de la commande</span>
                    <span className="text-2xl font-bold text-gray-900">{order.totalAmount}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations client et livraison */}
            <div className="space-y-6">
              {/* Informations client */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  Informations client
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{order.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Informations de livraison */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-gray-600" />
                  Livraison
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-900">{order.shippingAddress}</p>
                    </div>
                  </div>
                  {order.deliveryNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Instructions:</strong> {order.deliveryNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations de commande */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  Détails commande
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de commande</span>
                    <span className="text-gray-900">{new Date(order.orderDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro</span>
                    <span className="text-gray-900 font-mono">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles</span>
                    <span className="text-gray-900">{order.items.reduce((total, item) => total + item.quantity, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;