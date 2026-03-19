import React, { useEffect, useState } from 'react';
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
import DashboardNavbar from './components/layout/DashboardNavbar';
import { useAuth } from './hooks/useAuth';

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
  const { login } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isStoreMode, setIsStoreMode] = useState(false);
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

  // Vérifier si on est en mode admin via l'URL et restaurer la session depuis localStorage
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path.startsWith('/admin/')) {
      setIsAdminMode(true);
    } else if (path === '/boutique' || path.startsWith('/boutique/')) {
      setIsStoreMode(true);
    }

    // Restaurer la session depuis localStorage
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        setActiveTab(session.activeTab || 'overview');
      } catch (error) {
        console.error('Erreur lors de la restauration de la session:', error);
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  // Sauvegarder l'onglet actif quand il change
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem('userSession', JSON.stringify({
        user: currentUser,
        activeTab: activeTab
      }));
    }
  }, [activeTab, isAuthenticated, currentUser]);

  // Si on est en mode admin, afficher l'interface admin
  if (isAdminMode) {
    return <AdminApp />;
  }

  // Si on est en mode boutique, afficher la boutique
  if (isStoreMode) {
    return <StorePage />;
  }
  useEffect(()=>{
    console.log('pendingUser:', pendingUser)
  },[pendingUser])

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
      console.log('[App] Logging in user:', email);
      const response = await login({ email, password });
      console.log('[App] Login response:', response);

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
        console.log('[App] Creating authenticated user:', newUser);
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
      alert(`Plan ${plan} sélectionné pour ${app}`);
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
    console.log('[App] OTP verified, creating user session');
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
    console.log('[App] Creating user:', newUser);
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('overview');
    // Supprimer la session du localStorage
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