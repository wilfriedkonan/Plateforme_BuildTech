import React from 'react';
import { X, LogOut, CreditCard } from 'lucide-react';
import { User as UserType } from '../../App';

interface Tab {
  id: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue';
  label: string;
  icon: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  activeTab: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue';
  tabs: readonly Tab[];
  onTabChange: (tab: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue') => void;
  onLogout: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  user,
  activeTab,
  tabs,
  onTabChange,
  onLogout,
}) => {
  const getUserInitials = () => {
    const name = user.nomEntreprise || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 md:hidden overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {getUserInitials()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user.nomEntreprise}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-full px-3 py-1 inline-block">
            <span className="text-xs font-semibold text-green-700">Abonnement actif</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900 font-semibold border-l-4 border-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Actions */}
        <div className="py-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Mon abonnement</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-600 font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
