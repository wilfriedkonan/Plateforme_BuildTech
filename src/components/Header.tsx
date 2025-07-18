import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Build Tech Solutions
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-purple-600 transition-colors text-left"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-purple-600 transition-colors text-left"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-purple-600 transition-colors text-left"
            >
              Tarifs
            </button>
            <button
              onClick={() => window.location.href = '/boutique'}
              className="text-gray-700 hover:text-purple-600 transition-colors text-left"
            >
              Boutique
            </button>
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Déconnexion
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onLogin}
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Choisir un plan
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
            <nav className="flex flex-col p-4 space-y-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Tarifs
              </button>
              {isAuthenticated ? (
                <button
                  onClick={onLogout}
                  className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                >
                  Déconnexion
                </button>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="bg-gray-800 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 text-center"
                  >
                    Choisir un plan
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;