import React, { useState, useRef, useEffect } from 'react';
import { Zap, RefreshCw, Settings, ChevronDown, LogOut, User, CreditCard, Menu } from 'lucide-react';
import { User as UserType } from '../../App';
import MobileDrawer from './MobileDrawer';
import logo from "../assets/logo.png";

interface DashboardNavbarProps {
  user: UserType;
  activeTab: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue';
  onTabChange: (tab: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue') => void;
  onLogout: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'reports', label: 'Rapports', icon: '📄' },
    { id: 'articles', label: 'Gestion articles', icon: '📦' },
    { id: 'administration', label: 'Administration', icon: '⚙️' },
    { id: 'pos', label: 'POS', icon: '🧾' },
  /*   { id: 'achat', label: 'Achat', icon: '🛒' },
    { id: 'client', label: 'Client', icon: '👥' },
    { id: 'catalogue', label: 'Catalogue', icon: '📋' }, */
  ] as const;

  const getUserInitials = () => {
    const name = user.nomEntreprise || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserFirstName = () => {
    const name = user.nomEntreprise || 'User';
    return name.split(' ')[0];
  };

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le dropdown à la touche Échap
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm h-14">
        <div className="flex items-center justify-between h-full px-6">
          {/* Zone gauche: Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onTabChange('overview')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
                
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Build Tech Solutions" className="h-20 w-auto object-contain" />
          </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:inline"></span>
            </button>

            {/* Séparateur */}
            <div className="w-px h-5 bg-gray-200 mx-2 hidden md:block" />

            {/* Zone centrale: Navigation Tabs (desktop) */}
            <div className="hidden md:flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zone droite: Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Badge abonnement (desktop) */}
            <div className="hidden md:flex items-center bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <span className="text-xs font-semibold text-green-700">Abonnement actif</span>
            </div>

            {/* Bouton Actualiser */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>

            {/* Bouton Paramètres */}
            <button
              onClick={() => onTabChange('administration')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Paramètres"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown utilisateur (desktop) */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {getUserInitials()}
                </div>
                <span className="text-sm font-medium text-gray-900">{getUserFirstName()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[220px] z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.nomEntreprise}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>

                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Mon profil</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('administration');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Paramètres</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Mon abonnement</span>
                  </button>

                  <div className="border-t border-gray-100 my-2" />

                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setShowMobileDrawer(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        user={user}
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={(tab: 'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue') => {
          onTabChange(tab);
          setShowMobileDrawer(false);
        }}
        onLogout={() => {
          onLogout();
          setShowMobileDrawer(false);
        }}
      />
    </>
  );
};

export default DashboardNavbar;
