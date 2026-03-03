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

export interface User {
  id: string;
  companyName: string;
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
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isStoreMode, setIsStoreMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<Partial<User> | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otpDeliveryMethod, setOtpDeliveryMethod] = useState<'email' | 'whatsapp'>('email');
  const [pendingPlan, setPendingPlan] = useState<{app: string, plan: string, idPlan: string} | null>(null);

  // Vérifier si on est en mode admin via l'URL
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path.startsWith('/admin/')) {
      setIsAdminMode(true);
    } else if (path === '/boutique' || path.startsWith('/boutique/')) {
      setIsStoreMode(true);
    }
  }, []);

  // Si on est en mode admin, afficher l'interface admin
  if (isAdminMode) {
    return <AdminApp />;
  }

  // Si on est en mode boutique, afficher la boutique
  if (isStoreMode) {
    return <StorePage />;
  }

  const handleSignUp = (userData: { companyName: string; email: string; phone: string; otpMethod: 'email' | 'whatsapp' }, planData?: {app: string, plan: string, idPlan: string}) => {
    setPendingUser(userData);
    setOtpDeliveryMethod(userData.otpMethod);
    if (planData) {
      setPendingPlan(planData);
    }
    setShowOTPModal(true);
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would call your API
    if (email && password) {
      const existingUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        companyName: 'Entreprise Demo',
        email: email,
        phone: '+33 6 12 34 56 78',
        isSubscribed: true,
        subscriptionPlan: 'Standard',
        downloadHistory: [
          { date: '2024-01-15', application: 'Business Manager Pro', version: '2.1.4' },
          { date: '2024-01-10', application: 'Security Suite', version: '1.8.2' }
        ]
      };
      setCurrentUser(existingUser);
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } else {
      alert('Veuillez remplir tous les champs');
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
      companyName: userData?.companyName || pendingUser?.companyName || '',
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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Dashboard user={currentUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout}
        onLogin={() => setShowLoginModal(true)}
      />
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
        />
      )}
      
      {showOTPModal && (
        <OTPModal
          onVerify={handleOTPVerification}
          onClose={() => setShowOTPModal(false)}
          email={pendingUser?.email || ''}
          phone={pendingUser?.phone || ''}
          deliveryMethod={otpDeliveryMethod}
          userData={{ companyName: pendingUser?.companyName || '' }}
          planData={pendingPlan || undefined}
        />
      )}
    </div>
  );
}

export default App;