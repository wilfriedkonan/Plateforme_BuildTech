import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UsersSection from './UsersSection';
import SubscriptionsSection from './SubscriptionsSection';
import DownloadsSection from './DownloadsSection';

interface AdminUser {
  email: string;
  name: string;
}

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Simulation de connexion admin
    setAdminUser({
      email,
      name: 'Administrateur'
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setActiveSection('dashboard');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UsersSection />;
      case 'subscriptions':
        return <SubscriptionsSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'analytics':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Statistiques de visites</h1>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <p className="text-gray-600">Section en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Intégration prévue avec Plausible ou Google Analytics
              </p>
            </div>
          </div>
        );
      case 'otp':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Historique OTP</h1>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <p className="text-gray-600">Section en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Suivi des tentatives de vérification OTP
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Paramètres</h1>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <p className="text-gray-600">Section en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">
                Gestion des paramètres administrateur
              </p>
            </div>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default AdminApp;