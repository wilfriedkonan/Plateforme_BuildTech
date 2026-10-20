import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SignUpForm from './components/SignUpForm';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import OTPModal from './components/OTPModal';
import LoginModal from './components/LoginModal';
import AdminApp from './components/admin/AdminApp';
import StorePage from './components/store/StorePage';
import RestaurantPage from './components/catalogue/RestaurantPage';
import DashboardNavbar from './components/layout/DashboardNavbar';
import type { CatalogueSource } from './hooks/usePublicCatalogue';
import { useAuth } from './hooks/useAuth';
import { authService } from './services/authService';

export interface User {
  id: string;
  nomEntreprise: string;
  email: string;
  phone: string;
  isSubscribed: boolean;
  subscriptionPlan: string;
  selectedApp?: string;
  downloadHistory: Array<{
    date: string;
    application: string;
    version: string;
  }>;
}

function App() {
  // Tous les hooks doivent être déclarés avant tout return anticipé
  const { login, logout: authLogout } = useAuth();

  // Initialisation synchrone depuis l'URL — évite un flash au premier render
  const [isAdminMode] = useState(() => {
    const p = window.location.pathname;
    return p === '/admin' || p.startsWith('/admin/');
  });
  const [isStoreMode] = useState(() => {
    const p = window.location.pathname;
    return p === '/boutique' || p.startsWith('/boutique/');
  });
  const [publicRoute] = useState<CatalogueSource | null>(() => {
    const p = window.location.pathname;
    if (p.startsWith('/r/')) {
      const code = p.replace('/r/', '').split('/')[0];
      if (code) return { type: 'qr', code };
    }
    const restaurantMatch = p.match(/^\/restaurant\/([^/]+)\/menu/);
    if (restaurantMatch) return { type: 'direct', typeBoutique: 'Restaurant', slug: restaurantMatch[1] };
    if (p.startsWith('/catalogue/')) {
      const slug = p.replace('/catalogue/', '').split('/')[0];
      if (slug) return { type: 'legacy', slug };
    }
    return null;
  });

  // isSessionLoading démarre à true uniquement pour la branche principale
  const isBranchSeparee = isAdminMode || isStoreMode || publicRoute !== null;
  const [isSessionLoading, setIsSessionLoading] = useState(!isBranchSeparee);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<Partial<User> | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otpDeliveryMethod, setOtpDeliveryMethod] = useState<'email' | 'whatsapp'>('email');
  const [pendingPlan, setPendingPlan] = useState<{app: string, plan: string, idPlan: string} | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'articles' | 'administration' | 'pos' | 'achat' | 'client' | 'catalogue'>('overview');

  // Vérifier la session auprès du serveur (branche principale uniquement)
  React.useEffect(() => {
    if (isBranchSeparee) return;
    let cancelled = false;
    authService.getSession()
      .then(session => {
        if (cancelled || !session) return;
        // N'utilise les données localStorage que si elles correspondent à la session active
        const saved = (() => {
          try { return JSON.parse(localStorage.getItem('userSession') ?? '{}'); } catch { return {}; }
        })();
        const savedUser: User | undefined = saved?.user;
        const isSameUser = savedUser && (savedUser.id === session.id || savedUser.email === session.email);
        setIsAuthenticated(true);
        setCurrentUser(isSameUser ? savedUser : {
          id: session.id,
          email: session.email,
          // Les champs d'affichage non renvoyés par Auth/me restent vides
          // → enrichir Auth/me côté API pour les obtenir
          nomEntreprise: '',
          phone: '',
          isSubscribed: false,
          subscriptionPlan: '',
          downloadHistory: [],
        });
        setActiveTab(isSameUser ? (saved.activeTab ?? 'overview') : 'overview');
      })
      .finally(() => { if (!cancelled) setIsSessionLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sauvegarder l'onglet actif quand il change (données d'affichage non-sensibles)
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem('userSession', JSON.stringify({ user: currentUser, activeTab }));
    }
  }, [activeTab, isAuthenticated, currentUser]);

  // Branches séparées — pas de check de session, pas de loader
  if (isAdminMode) return <AdminApp />;
  if (isStoreMode) return <StorePage />;
  if (publicRoute) return <RestaurantPage source={publicRoute} />;

  // Branche principale — attend la vérification de session pour éviter le flash
  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
      </div>
    );
  }

  const handleSignUp = (userData: { companyName: string; email: string; phone: string; otpMethod: 'email' | 'whatsapp' }, planData?: {app: string, plan: string, idPlan: string}) => {
    setPendingUser(userData);
    setOtpDeliveryMethod(userData.otpMethod);
    if (planData) {
      setPendingPlan(planData);
    }
    setShowOTPModal(true);
  };

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const response = await login({ email, password });

      if (response.success && response.user) {
        const newUser: User = {
          id: response.user.id || Math.random().toString(36).substr(2, 9),
          nomEntreprise: response.user.nomEntreprise || 'Entreprise',
          email: response.user.email,
          phone: response.user.telephone || '',
          isSubscribed: true,
          subscriptionPlan: 'Standard',
          downloadHistory: []
        };
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        
        // Sauvegarder la session dans localStorage
        localStorage.setItem('userSession', JSON.stringify({
          user: newUser,
          activeTab: 'overview'
        }));
      } else {
        setLoginError(response.message || 'Erreur lors de la connexion');
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Erreur lors de la connexion';
      console.error('[App] Login error:', errorMessage);
      setLoginError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePlanSelection = (app: string, plan: string, idPlan: string) => {
    if (isAuthenticated) {
      // User is logged in, proceed with plan selection
      alert(`Plan ${plan} sÃ©lectionnÃ© pour ${app}`);
    } else {
      // User not logged in, show signup/login options
      setPendingPlan({app, plan, idPlan});
      // For now, we'll show the signup form, but you could show a modal with login/signup options
      const element = document.getElementById('signup');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOTPVerification = (_otp: string, userData?: { email: string; phone: string; companyName?: string }, planData?: { app: string; plan: string; idPlan: string }) => {
    // OTP has been validated by the API, create user session
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      nomEntreprise: userData?.companyName || pendingUser?.nomEntreprise || '',
      email: userData?.email || pendingUser?.email || '',
      phone: userData?.phone || pendingUser?.phone || '',
      isSubscribed: planData ? true : false,
      subscriptionPlan: planData ? planData.plan : 'none',
      selectedApp: planData?.app,
      downloadHistory: []
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setShowOTPModal(false);
    setPendingUser(null);
    setPendingPlan(null);
    
    // Sauvegarder la session dans localStorage
    localStorage.setItem('userSession', JSON.stringify({
      user: newUser,
      activeTab: 'overview'
    }));
  };

  const handleLogout = async () => {
    await authLogout(); // invalide le cookie côté serveur + clearCsrfToken()
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('overview');
    localStorage.removeItem('userSession');
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar 
          user={currentUser} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
        <Dashboard user={currentUser} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAuthenticated && (
        <Header 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
          onLogin={() => setShowLoginModal(true)}
        />
      )}
      <Hero onLogin={() => setShowLoginModal(true)} />
      <Features />
      <Pricing onPlanSelect={handlePlanSelection} />
      {pendingPlan && (
        <SignUpForm 
          onSignUp={(userData) => handleSignUp(userData, pendingPlan)} 
          selectedPlan={pendingPlan}
        />
      )}
      <FAQ />
      <Footer />
      
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            const element = document.getElementById('signup');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          isLoading={isLoggingIn}
          error={loginError}
        />
      )}
      
      {showOTPModal && (
        <OTPModal
          onVerify={handleOTPVerification}
          onClose={() => setShowOTPModal(false)}
          email={pendingUser?.email || ''}
          phone={pendingUser?.phone || ''}
          deliveryMethod={otpDeliveryMethod}
          userData={{ nomEntreprise : pendingUser?.nomEntreprise || '' }}
          planData={pendingPlan || undefined}
        />
      )}
    </div>
  );
}

export default App;
