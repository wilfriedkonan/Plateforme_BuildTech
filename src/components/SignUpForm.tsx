import React, { useState } from 'react';
import { Building, Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validatePhone, validatePassword, GUID_REGEX } from '../utils/validators';
import type { RegistrationResponse } from '../services/authService';

const INPUT_CLASS =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all';

const EMPTY_EXISTING_FORM = {
  idEntreprise: '',
  nom: '',
  prenom: '',
  email: '',
  password: '',
  phone: '',
  entrepriseName: '',
  organisationName: '',
  durationMonths: '',
  operatorKey: '',
};

interface SignUpFormProps {
  onSignUp: (userData: { companyName: string; email: string; phone: string; otpMethod: 'email' | 'whatsapp' }) => void;
  selectedPlan?: { app: string; plan: string; idPlan: string };
  /** 'existing' : création d'un compte pour une entreprise via son Id (super-admin ; l'API vérifie les droits). */
  mode?: 'new' | 'existing';
  onExistingCreated?: (response: RegistrationResponse) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, selectedPlan, mode = 'new', onExistingCreated }) => {
  const [useExisting, setUseExisting] = useState(false);
  const isExisting = mode === 'existing' || useExisting;
  const { register, registerForEntreprise, isLoading, error: authError } = useAuth();
  const [existingData, setExistingData] = useState(EMPTY_EXISTING_FORM);
  const [existingError, setExistingError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }


    try {
      const payload = {
        email: formData.email,
        telephone: formData.phone,
        password: formData.password,
        nom: 'Administrateur / Administratrice',
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

  const handleExistingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExistingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExistingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const d = existingData;
    const idEntreprise = d.idEntreprise.trim();

    if (!GUID_REGEX.test(idEntreprise)) {
      setExistingError('Identifiant d\'entreprise invalide (GUID attendu)');
      return;
    }
    if (!d.nom.trim() || !d.prenom.trim() || !d.email.trim() || !d.password) {
      setExistingError('Veuillez renseigner le nom, le prénom, l\'email et le mot de passe');
      return;
    }
    const passwordError = validatePassword(d.password);
    if (passwordError) {
      setExistingError(passwordError);
      return;
    }
    if (d.phone.trim()) {
      const phoneError = validatePhone(d.phone);
      if (phoneError) {
        setExistingError(phoneError);
        return;
      }
    }
    const months = d.durationMonths.trim() ? Number(d.durationMonths) : undefined;
    if (months !== undefined && (!Number.isInteger(months) || months <= 0)) {
      setExistingError('La durée doit être un nombre entier de mois supérieur à 0');
      return;
    }

    setExistingError('');
    try {
      const response = await registerForEntreprise({
        idEntreprise,
        email: d.email.trim(),
        telephone: d.phone.trim(),
        password: d.password,
        nom: d.nom.trim(),
        prenom: d.prenom.trim(),
        entrepriseName: d.entrepriseName.trim(),
        organisationName: d.organisationName.trim() || undefined,
        contact: d.phone.trim(),
        localisation: '',
        pays: '',
        ville: '',
        commune: '',
        operatorKey: d.operatorKey.trim() || undefined,
        // Souscription uniquement si le plan ET la durée sont renseignés
        ...(selectedPlan?.idPlan && months !== undefined
          ? { idPlan: selectedPlan.idPlan, subscriptionDurationMonths: months }
          : {}),
      });
      setSuccessMessage(
        `Compte créé. ${response.entrepriseCreee ? 'Entreprise et organisation créées automatiquement. ' : ''}` +
        (response.codeEntreprise ? `Code entreprise : ${response.codeEntreprise}` : '')
      );
      setExistingData(EMPTY_EXISTING_FORM);
      onExistingCreated?.(response);
    } catch {
      // Le message mappé est exposé par le hook (authError)
    }
  };

  const existingErrorMessage = existingError || authError;

  const existingForm = (
    <form onSubmit={handleExistingSubmit} className="space-y-6">
      <div>
        <label htmlFor="idEntreprise" className="block text-sm font-medium text-gray-700 mb-2">
          Identifiant de l'entreprise (GUID) *
        </label>
        <input
          type="text"
          id="idEntreprise"
          name="idEntreprise"
          value={existingData.idEntreprise}
          onChange={handleExistingChange}
          required
          className={INPUT_CLASS}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
          <input type="text" id="nom" name="nom" value={existingData.nom} onChange={handleExistingChange} required className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
          <input type="text" id="prenom" name="prenom" value={existingData.prenom} onChange={handleExistingChange} required className={INPUT_CLASS} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Adresse email *</label>
          <input type="email" id="email" name="email" value={existingData.email} onChange={handleExistingChange} required className={INPUT_CLASS} placeholder="contact@votre-entreprise.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
          <input type="password" id="password" name="password" value={existingData.password} onChange={handleExistingChange} required className={INPUT_CLASS} placeholder="10 caractères min., lettre et chiffre" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
        <input type="tel" id="phone" name="phone" value={existingData.phone} onChange={handleExistingChange} className={INPUT_CLASS} placeholder="22507123456" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="entrepriseName" className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
          <input type="text" id="entrepriseName" name="entrepriseName" value={existingData.entrepriseName} onChange={handleExistingChange} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700 mb-2">Nom de l'organisation</label>
          <input type="text" id="organisationName" name="organisationName" value={existingData.organisationName} onChange={handleExistingChange} className={INPUT_CLASS} />
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-4">
        Obligatoire si l'entreprise n'existe pas encore : elle sera créée avec une organisation générée automatiquement
      </p>

      <div>
        <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700 mb-2">Durée de l'abonnement (mois)</label>
        <input type="number" min={1} step={1} id="durationMonths" name="durationMonths" value={existingData.durationMonths} onChange={handleExistingChange} className={INPUT_CLASS} />
        <p className="text-xs text-gray-500 mt-1">
          La souscription n'est créée que si un plan est sélectionné et une durée renseignée.
        </p>
      </div>

      <div>
        <label htmlFor="operatorKey" className="block text-sm font-medium text-gray-700 mb-2">Code opérateur</label>
        <input
          type="password"
          id="operatorKey"
          name="operatorKey"
          autoComplete="off"
          value={existingData.operatorKey}
          onChange={handleExistingChange}
          className={INPUT_CLASS}
        />
        <p className="text-xs text-gray-500 mt-1">Réservé à l'équipe Build Tech. Non conservé.</p>
      </div>

      {existingErrorMessage && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{existingErrorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-700 text-sm text-center bg-green-50 p-3 rounded-lg">{successMessage}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Création en cours...' : 'Créer le compte'}
        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  );

  return (
    <section id="signup" className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isExisting
              ? 'Créer un compte pour une entreprise'
              : (selectedPlan ? `Finaliser votre abonnement` : 'Créez votre compte')}{' '}
            <span className="text-gray-800">
              {isExisting ? '' : (selectedPlan ? selectedPlan.plan : 'professionnel')}
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            {isExisting
              ? 'Rattachez un compte propriétaire à une entreprise via son identifiant'
              : selectedPlan
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
          {mode !== 'existing' && (
            <label className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useExisting}
                onChange={(e) => { setUseExisting(e.target.checked); setExistingError(''); setSuccessMessage(''); }}
                className="w-4 h-4 rounded border-gray-300"
              />
              Entreprise existante ? (renseigner son identifiant)
            </label>
          )}
          {isExisting ? existingForm : (
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
                  Numéro de téléphone whatsapp *
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
                    placeholder="22507123456"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Indicatif pays obligatoire — ex : <span className="font-medium">225</span>07123456
                </p>
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
                {/* Méthode de vérification * */}
                Méthode de validation *
              </label>
              <select
                id="otpMethod"
                name="otpMethod"
                value={formData.otpMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              >
               {/*  <option value="email">Email</option> */}
                <option value="whatsapp">WhatsApp</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
              {/*   Choisissez comment vous souhaitez recevoir votre code de vérification */}
              ⏱️ *Note:* Pour le moment, nous effectuons les activations manuelles. Votre compte sera activé dans les 24 heures suivant la réception du paiement.
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
          )}

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
