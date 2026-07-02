import React, { useState } from 'react';
import { Utensils, Globe, Truck, Users, DollarSign, Plus, RefreshCw, Handshake } from 'lucide-react';
import TableManager from './TableManager';
import DomaineManager from './DomaineManager';
import LivreurManager from './LivreurManager';
import UtilisateurManager from './UtilisateurManager';
import TarifLivraisonManager from './TarifLivraisonManager';
import CrmManager from './crm/CrmManager';

type SubTab = 'tables' | 'domaine' | 'livreurs' | 'utilisateurs' | 'tarifs' | 'crm';

const AdminManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('tables');
  const [onNewAction, setOnNewAction] = useState<(() => void) | null>(null);

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'tables':
        return <TableManager onRegisterNewAction={setOnNewAction} />;
      case 'domaine':
        return <DomaineManager onRegisterNewAction={setOnNewAction} />;
      case 'livreurs':
        return <LivreurManager onRegisterNewAction={setOnNewAction} />; 
        return <UtilisateurManager onRegisterNewAction={setOnNewAction} />;
      case 'tarifs':
        return <TarifLivraisonManager onRegisterNewAction={setOnNewAction} />;
      case 'crm':
        return <CrmManager onRegisterNewAction={setOnNewAction} />;
      default:
        return null;
    }
  };

  const handleNewClick = () => {
    if (onNewAction) {
      onNewAction();
    }
  };

  const getButtonText = () => {
    switch (activeSubTab) {
      case 'tables':
        return 'Nouvelle Table';
      case 'domaine':
        return 'Nouveau Domaine';
      case 'livreurs':
        return 'Nouveau Livreur'; 
      case 'utilisateurs':
        return 'Nouvel Utilisateur';
       case 'tarifs':
        return 'Nouveau Tarif';
      case 'crm':
        return 'Nouveau Message';
      default:
        return 'Nouveau';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Administration</h2>
            <p className="text-gray-600">Gérez les paramètres de votre système</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button
              onClick={handleNewClick}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{getButtonText()}</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-2 border-b border-gray-200">
          {/* <button
            onClick={() => setActiveSubTab('tables')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'tables'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span>Tables</span>
          </button> */}
          {/* <button
            onClick={() => setActiveSubTab('domaine')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'domaine'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span>Domaine</span>
          </button> */}
       {/*    <button
            onClick={() => setActiveSubTab('livreurs')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'livreurs'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span>Livreurs</span>
          </button> */}
          <button
            onClick={() => setActiveSubTab('utilisateurs')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'utilisateurs'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Utilisateurs</span>
          </button>
      {/*     <button
            onClick={() => setActiveSubTab('tarifs')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'tarifs'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Tarifs Livraison</span>
          </button> */}
        {/*   <button
            onClick={() => setActiveSubTab('crm')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeSubTab === 'crm'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Handshake className="w-5 h-5" />
            <span>Réglages CRM</span>
          </button> */}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default AdminManager;
