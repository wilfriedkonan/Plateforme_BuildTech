import React, { useState } from 'react';
import { Building, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SignUpFormProps {
  onSignUp: (userData: { companyName: string; email: string; phone: string; otpMethod: 'email' | 'whatsapp' }) => void;
  selectedPlan?: { app: string; plan: string; idPlan: string };
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, selectedPlan }) => {
  const { register, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    password: '',
    otpMethod: 'email' as 'email' | 'whatsapp'
  });
  const [error, setError] = useState(authError || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.phone || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    console.log('[SignUpForm] selectedPlan:', selectedPlan);
    console.log('[SignUpForm] idPlan to send:', selectedPlan?.idPlan);

    try {
      const payload = {
        email: formData.email,
        telephone: formData.phone,
        password: formData.password,
        nom: 'User',
        prenom: 'User',
        entrepriseName: formData.companyName,
        contact: formData.phone,
        localisation: '',
        pays: '',
        ville: '',
        commune: '',
        idPlan: selectedPlan?.idPlan,
        subscriptionDurationMonths: 1,
      };
      console.log('[SignUpForm] Full payload:', payload);
      await register(payload);
      onSignUp({
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        otpMethod: formData.otpMethod,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="signup" className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedPlan ? `Finaliser votre abonnement` : 'Créez votre compte'}{' '}
            <span className="text-gray-800">
              {selectedPlan ? selectedPlan.plan : 'professionnel'}
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            {selectedPlan 
              ? `Vous avez choisi le plan ${selectedPlan.plan} pour ${selectedPlan.app}`
              : 'Rejoignez des centaines d\'entreprises qui font confiance à Build Tech Solutions'
            }
          </p>
        </div>

        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedPlan.app}</h3>
                <p className="text-purple-600 font-medium">Plan {selectedPlan.plan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Sélectionné</p>
                <Check className="w-6 h-6 text-green-500 ml-auto" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="Votre entreprise"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  placeholder="contact@votre-entreprise.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  placeholder="Votre mot de passe sécurisé"
                />
              </div>
            </div>

            <div>
              <label htmlFor="otpMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de vérification *
              </label>
              <select
                id="otpMethod"
                name="otpMethod"
                value={formData.otpMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choisissez comment vous souhaitez recevoir votre code de vérification
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Vérification requise :</strong> Après inscription, vous recevrez un code de vérification 
                  via la méthode sélectionnée pour valider votre compte.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Inscription en cours...' : (selectedPlan ? 'Finaliser l\'abonnement' : 'S\'inscrire maintenant')}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              En vous inscrivant, vous acceptez nos{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900">
                conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900">
                politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;