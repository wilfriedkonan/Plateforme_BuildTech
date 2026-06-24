import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Copy, Trash2, Send, Plus, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { mockMessagesCRM, MessageCRM } from '../../lib/mock/messagesCRM';

interface MessagesPredéfinisProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const MessagesPredéfinis: React.FC<MessagesPredéfinisProps> = ({ onRegisterNewAction }) => {
  const [messages, setMessages] = useState(mockMessagesCRM);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageCRM | null>(null);

  const handleNewMessage = () => {
    setSelectedMessage(null);
    setShowMessageForm(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(() => handleNewMessage);
    }
  }, [onRegisterNewAction]);

  const handleEditMessage = (message: MessageCRM) => {
    setSelectedMessage(message);
    setShowMessageForm(true);
  };

  const handleDeleteMessage = (message: MessageCRM) => {
    if (confirm(`Supprimer le message "${message.nom}" ?`)) {
      setMessages(messages.filter(m => m.id !== message.id));
    }
  };

  const handleTestMessage = (message: MessageCRM) => {
    alert(`Test d'envoi du message "${message.nom}" - À implémenter`);
  };

  const getCanalBadge = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">🟢 WhatsApp</span>;
      case 'sms':
        return <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">🔵 SMS</span>;
      case 'email':
        return <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">🟣 Email</span>;
      default:
        return null;
    }
  };

  const getDecoderBadge = (declencheur: string) => {
    switch (declencheur) {
      case 'a_risque':
        return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">À risque</span>;
      case 'inactif':
        return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Inactif</span>;
      case 'perdu':
        return <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">Perdu</span>;
      case 'manuel':
        return <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Manuel</span>;
      case 'anniversaire':
        return <span className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded">Anniversaire</span>;
      default:
        return null;
    }
  };

  const totalMessages = messages.length;
  const messagesWhatsApp = messages.filter(m => m.canal === 'whatsapp').length;
  const messagesSMS = messages.filter(m => m.canal === 'sms').length;
  const messagesEmail = messages.filter(m => m.canal === 'email').length;

  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-700 mb-1">Total messages</p>
              <p className="text-3xl font-bold text-teal-900">{totalMessages}</p>
            </div>
            <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-teal-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">WhatsApp</p>
              <p className="text-3xl font-bold text-green-900">{messagesWhatsApp}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">SMS</p>
              <p className="text-3xl font-bold text-blue-900">{messagesSMS}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-1">Email</p>
              <p className="text-3xl font-bold text-purple-900">{messagesEmail}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages Prédéfinis</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom du message</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Canal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Déclencheur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aperçu</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {messages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {message.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{message.nom}</span>
                    </td>
                    <td className="px-4 py-3">{getCanalBadge(message.canal)}</td>
                    <td className="px-4 py-3">{getDecoderBadge(message.declencheur)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {truncateText(message.corps)}
                    </td>
                    <td className="px-4 py-3">
                      {message.statut === 'actif' ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          ✓ Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                          onClick={() => handleEditMessage(message)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors"
                          onClick={() => handleTestMessage(message)}
                          title="Tester l'envoi"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                          onClick={() => alert(`Dupliquer le message "${message.nom}" - À implémenter`)}
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                          onClick={() => handleDeleteMessage(message)}
                          title="Supprimer"
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
        <div className="text-sm text-gray-600 px-4 mt-4">
          {messages.length} messages | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
        </div>
      </div>
    </div>
  );
};

export default MessagesPredéfinis;
