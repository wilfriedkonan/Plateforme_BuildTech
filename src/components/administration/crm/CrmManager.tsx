import React, { useState, useEffect } from 'react';
import { Settings, MessageSquare, Send } from 'lucide-react';
import ParametresActivite from './ParametresActivite';
import MessagesPredéfinis from './MessagesPredéfinis';
import CampagnesWhatsApp from './CampagnesWhatsApp';

type CrmTab = 'parametres' | 'messages' | 'campagnes';

interface CrmManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const CrmManager: React.FC<CrmManagerProps> = ({ onRegisterNewAction }) => {
  const [activeTab, setActiveTab] = useState<CrmTab>('parametres');
  const [onNewMessage, setOnNewMessage] = useState<(() => void) | null>(null);
  const [onNewCampagne, setOnNewCampagne] = useState<(() => void) | null>(null);

  // Le bouton "Nouveau" change selon l'onglet actif
  useEffect(() => {
    if (onRegisterNewAction) {
      if (activeTab === 'messages' && onNewMessage) {
        onRegisterNewAction(onNewMessage);
      } else if (activeTab === 'campagnes' && onNewCampagne) {
        onRegisterNewAction(onNewCampagne);
      } else {
        // Pour l'onglet paramètres, pas de bouton "Nouveau"
        onRegisterNewAction(() => {});
      }
    }
  }, [onRegisterNewAction, activeTab, onNewMessage, onNewCampagne]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'parametres':
        return <ParametresActivite />;
      case 'messages':
        return <MessagesPredéfinis onRegisterNewAction={setOnNewMessage} />;
      case 'campagnes':
        return <CampagnesWhatsApp onRegisterNewAction={setOnNewCampagne} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200 -mt-2">
        <button
          onClick={() => setActiveTab('parametres')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'parametres'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Paramètres Activité</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'messages'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Messages Prédéfinis</span>
        </button>
        <button
          onClick={() => setActiveTab('campagnes')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'campagnes'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>Campagnes WhatsApp</span>
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default CrmManager;
