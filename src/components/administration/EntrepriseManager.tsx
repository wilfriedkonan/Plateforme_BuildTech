import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useEntreprises } from '../../hooks/useEntreprises';
import { usePlans } from '../../hooks/usePlans';
import { useAuth } from '../../hooks/useAuth';
import { validatePhone, validatePassword, GUID_REGEX } from '../../utils/validators';
import { Modal, FormInput, BtnPrimary, BtnSecondary } from '../ui/shared';

interface EntrepriseManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const EMPTY_FORM = {
  idEntreprise: '',
  nom: '',
  prenom: '',
  email: '',
  password: '',
  phone: '',
  entrepriseName: '',
  organisationName: '',
  idPlan: '',
  durationMonths: '',
};

const SELECT_CLASS =
  'h-9 px-3 rounded-lg border text-sm transition-colors outline-none appearance-none bg-white cursor-pointer border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 disabled:opacity-50';

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const EntrepriseManager: React.FC<EntrepriseManagerProps> = ({ onRegisterNewAction }) => {
  const { entreprises, isLoading, error, refresh } = useEntreprises();
  const { data: planApps, loading: plansLoading } = usePlans();
  const { registerForEntreprise, isLoading: isSubmitting, error: authError, clearError } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Seuls les plans avec un identifiant sont sélectionnables (les plans de secours n'en ont pas)
  const plans = useMemo(
    () => (planApps ?? []).flatMap(a => a.plans).filter(p => !!p.id),
    [planApps]
  );

  const handleNew = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setSuccessMessage('');
    clearError();
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) onRegisterNewAction(() => handleNew);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRegisterNewAction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'idPlan' && !value ? { durationMonths: '' } : {}) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idEntreprise = form.idEntreprise.trim();
    if (!GUID_REGEX.test(idEntreprise)) return setFormError('Identifiant d\'entreprise invalide (GUID attendu)');
    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.password) {
      return setFormError('Veuillez renseigner le nom, le prénom, l\'email et le mot de passe');
    }
    const passwordError = validatePassword(form.password);
    if (passwordError) return setFormError(passwordError);
    if (form.phone.trim()) {
      const phoneError = validatePhone(form.phone);
      if (phoneError) return setFormError(phoneError);
    }
    let months: number | undefined;
    if (form.idPlan) {
      months = Number(form.durationMonths);
      if (!form.durationMonths.trim() || !Number.isInteger(months) || months <= 0) {
        return setFormError('La durée de l\'abonnement doit être un entier de mois supérieur à 0');
      }
    }

    setFormError('');
    clearError();
    try {
      const response = await registerForEntreprise({
        idEntreprise,
        email: form.email.trim(),
        telephone: form.phone.trim(),
        password: form.password,
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        entrepriseName: form.entrepriseName.trim(),
        organisationName: form.organisationName.trim() || undefined,
        contact: form.phone.trim(),
        localisation: '',
        pays: '',
        ville: '',
        commune: '',
        ...(form.idPlan && months !== undefined ? { idPlan: form.idPlan, subscriptionDurationMonths: months } : {}),
      });
      setSuccessMessage(
        `Compte créé. ${response.entrepriseCreee ? 'Entreprise et organisation créées automatiquement. ' : ''}` +
        (response.codeEntreprise ? `Code entreprise : ${response.codeEntreprise}` : '')
      );
      setForm(EMPTY_FORM);
      setIsFormOpen(false);
      refresh();
    } catch {
      // Message mappé exposé par le hook (authError)
    }
  };

  const closeForm = () => { setIsFormOpen(false); clearError(); };
  const modalError = formError || authError;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Entreprises</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {entreprises.length} entreprise{entreprises.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {successMessage && (
        <div className="px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">{successMessage}</div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
          {' — Liste indisponible. Vous pouvez tout de même connecter une entreprise.'}
        </div>
      )}

      {/* Tableau */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto relative">
          {isLoading && entreprises.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Chargement…
              </div>
            </div>
          )}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Désignation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Localisation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Abonnement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entreprises.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    {error ? 'Liste indisponible' : 'Aucune entreprise trouvée'}
                  </td>
                </tr>
              ) : (
                entreprises.map((en, i) => (
                  <tr key={en.id || i} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{en.designation ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{en.codeEntreprise ?? '—'}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{en.email ?? '—'}</p>
                      {en.contact && <p className="text-xs text-gray-400">{en.contact}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {[en.pays, en.ville].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{en.subscriptionStatus ?? '—'}</p>
                      <p className="text-xs text-gray-400">{formatDate(en.subscriptionEndsAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {en.isActive === undefined ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${en.isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${en.isActive ? 'bg-gray-700' : 'bg-gray-300'}`} />
                          {en.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire */}
      <Modal isOpen={isFormOpen} onClose={closeForm} title="Connecter une entreprise existante" size="lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput
            label="Identifiant de l'entreprise (GUID)" required name="idEntreprise"
            value={form.idEntreprise} onChange={handleChange}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Nom" required name="nom" value={form.nom} onChange={handleChange} />
            <FormInput label="Prénom" required name="prenom" value={form.prenom} onChange={handleChange} />
            <FormInput label="Email" required type="email" name="email" value={form.email} onChange={handleChange} />
            <FormInput
              label="Mot de passe" required type="password" name="password" autoComplete="new-password"
              value={form.password} onChange={handleChange}
              hint="10 caractères minimum, une lettre et un chiffre"
            />
          </div>
          <FormInput label="Téléphone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="22507123456" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Nom de l'entreprise" name="entrepriseName" value={form.entrepriseName} onChange={handleChange} />
            <FormInput label="Nom de l'organisation" name="organisationName" value={form.organisationName} onChange={handleChange} />
          </div>
          <p className="text-xs text-gray-400 -mt-2">
            Obligatoire si l'entreprise n'existe pas encore : elle sera créée avec une organisation générée automatiquement
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Plan</label>
              <select name="idPlan" value={form.idPlan} onChange={handleChange} disabled={plansLoading} className={SELECT_CLASS}>
                <option value="">Aucun abonnement</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.price ? `${p.name} — ${p.price}` : p.name}</option>
                ))}
              </select>
            </div>
            <FormInput
              label="Durée de l'abonnement (mois)" type="number" min={1} step={1} name="durationMonths"
              value={form.durationMonths} onChange={handleChange} disabled={!form.idPlan} required={!!form.idPlan}
            />
          </div>

          {modalError && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{modalError}</div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <BtnSecondary type="button" onClick={closeForm}>Annuler</BtnSecondary>
            <BtnPrimary type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création en cours...' : 'Créer le compte'}
            </BtnPrimary>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EntrepriseManager;
