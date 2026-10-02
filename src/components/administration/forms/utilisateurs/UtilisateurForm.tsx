import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Utilisateur } from "../../../../lib/mock/utilisateurs";
import { RoleDto } from "../../../../services/roleService";
import {
  Modal, FormInput, FormSelect,
  BtnPrimary, BtnSecondary, BadgeCode
} from "../../../ui/shared";

interface UtilisateurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Utilisateur> & { idRole?: string; password?: string }) => void;
  utilisateur?: Utilisateur | null;
  roles: RoleDto[];
  initialIdRole?: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  idRole?: string;
  password?: string;
  confirmPassword?: string;
}

const PWD_RULES = [
  { test: (v: string) => v.length >= 8,                           label: "8 caractères minimum" },
  { test: (v: string) => /[A-Z]/.test(v) && /[a-z]/.test(v),     label: "Une majuscule et une minuscule" },
  { test: (v: string) => /\d/.test(v),                            label: "Un chiffre" },
  { test: (v: string) => /[^A-Za-z0-9]/.test(v),                 label: "Un caractère spécial" },
];

function PasswordInput({
  label, value, onChange, error, show, onToggle, placeholder, required
}: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; show: boolean; onToggle: () => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-9 px-3 pr-9 rounded-lg border text-sm transition-colors outline-none ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
              : "border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}

export default function UtilisateurForm({
  isOpen, onClose, onSave, utilisateur, roles, initialIdRole
}: UtilisateurFormProps) {
  const isEdit = !!utilisateur;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    idRole: "", statut: "actif" as Utilisateur['statut'],
    password: "", confirmPassword: "",
  });

  useEffect(() => {
    if (utilisateur) {
      setForm({
        nom: utilisateur.nom, prenom: utilisateur.prenom,
        email: utilisateur.email, telephone: utilisateur.telephone || "",
        idRole: initialIdRole ?? "", statut: utilisateur.statut,
        password: "", confirmPassword: "",
      });
    } else {
      setForm({ nom: "", prenom: "", email: "", telephone: "", idRole: "", statut: "actif", password: "", confirmPassword: "" });
    }
    setErrors({});
    setShowPwd(false);
    setShowConfirm(false);
  }, [utilisateur, isOpen, initialIdRole]);

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.nom.trim() || form.nom.trim().length < 2)
      e.nom = "Le nom doit contenir au moins 2 caractères.";
    if (!form.prenom.trim() || form.prenom.trim().length < 2)
      e.prenom = "Le prénom doit contenir au moins 2 caractères.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Adresse email invalide.";
    if (!form.telephone.trim())
      e.telephone = "Le téléphone est obligatoire.";
    else {
      const digits = form.telephone.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15)
        e.telephone = "Le numéro doit contenir entre 8 et 15 chiffres (indicatif inclus).";
      else if (!form.telephone.trim().startsWith('+'))
        e.telephone = "Commencez par l'indicatif pays. Ex : +2250708452644";
    }
    if (!form.idRole)
      e.idRole = "Veuillez sélectionner un rôle.";

    // Mot de passe — obligatoire à la création, optionnel en édition
    if (!isEdit || form.password) {
      if (!form.password)
        e.password = "Le mot de passe est obligatoire.";
      else if (PWD_RULES.some(r => !r.test(form.password)))
        e.password = "Le mot de passe ne respecte pas les règles de sécurité.";

      if (!form.confirmPassword)
        e.confirmPassword = "Veuillez confirmer le mot de passe.";
      else if (form.password && form.confirmPassword !== form.password)
        e.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onSave({
      ...(isEdit ? { id: utilisateur!.id, code: utilisateur!.code } : {}),
      nom: form.nom.trim(), prenom: form.prenom.trim(),
      email: form.email.trim(), telephone: form.telephone.trim(),
      statut: form.statut, idRole: form.idRole || undefined,
      password: form.password || undefined,
    });
    setLoading(false);
    onClose();
  }

  const roleOptions = roles.map(r => ({ value: r.id, label: r.name }));
  const pwdChecks = PWD_RULES.map(r => ({ ...r, ok: r.test(form.password) }));
  const showStrength = form.password.length > 0;

  const title = isEdit ? `Modifier l'Utilisateur — ${utilisateur?.code}` : "Nouvel Utilisateur";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="px-6 py-5 flex flex-col gap-5">

        {isEdit && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500">Code :</span>
            <BadgeCode>{utilisateur?.code}</BadgeCode>
            <span className="text-xs text-gray-400 ml-auto">Auto-généré</span>
          </div>
        )}

        {/* Nom / Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Nom" required placeholder="Ex : Kouassi"
            value={form.nom} onChange={e => set("nom", e.target.value)} error={errors.nom} />
          <FormInput label="Prénom" required placeholder="Ex : Jean"
            value={form.prenom} onChange={e => set("prenom", e.target.value)} error={errors.prenom} />
        </div>

        {/* Email / Téléphone */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Email" required type="email" placeholder="Ex : jean@exemple.com"
            value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} />
          <FormInput label="Téléphone" required type="tel" placeholder="Ex : +2250708452644"
            value={form.telephone} onChange={e => set("telephone", e.target.value)} error={errors.telephone} />
        </div>

        {/* Rôle / Statut */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect label="Rôle" required value={form.idRole}
            onChange={e => set("idRole", e.target.value)}
            error={errors.idRole} options={roleOptions} />
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Statut</span>
              <div className="flex gap-3">
                {(['actif', 'suspendu'] as const).map(s => (
                  <label key={s} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm font-medium capitalize ${
                    form.statut === s
                      ? s === "actif" ? "border-teal-500 bg-teal-50 text-teal-700" : "border-red-400 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                    <input type="radio" name="statut" value={s} checked={form.statut === s}
                      onChange={() => set("statut", s)} className="hidden" />
                    <span className={`w-3 h-3 rounded-full ${form.statut === s ? (s === "actif" ? "bg-teal-500" : "bg-red-500") : "bg-gray-300"}`} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Statut</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                Inactif — activé à la première connexion
              </div>
            </div>
          )}
        </div>

        {/* Mot de passe */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {isEdit ? "Changer le mot de passe (laisser vide pour conserver l'actuel)" : "Mot de passe"}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <PasswordInput
                label={isEdit ? "Nouveau mot de passe" : "Mot de passe"}
                required={!isEdit}
                value={form.password}
                onChange={v => set("password", v)}
                show={showPwd}
                onToggle={() => setShowPwd(v => !v)}
                placeholder="••••••••"
                error={errors.password}
              />
              {showStrength && (
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {pwdChecks.map((c, i) => (
                    <li key={i} className={`flex items-center gap-1 text-xs ${c.ok ? "text-teal-600" : "text-gray-400"}`}>
                      <span>{c.ok ? "✓" : "·"}</span>{c.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <PasswordInput
              label="Confirmer le mot de passe"
              required={!isEdit || !!form.password}
              value={form.confirmPassword}
              onChange={v => set("confirmPassword", v)}
              show={showConfirm}
              onToggle={() => setShowConfirm(v => !v)}
              placeholder="••••••••"
              error={errors.confirmPassword}
            />
          </div>
        </div>

      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose} disabled={loading}>Annuler</BtnSecondary>
        <BtnPrimary onClick={handleSave} disabled={loading}>
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enregistrement...</>
            : isEdit ? "Modifier" : "Enregistrer"
          }
        </BtnPrimary>
      </div>
    </Modal>
  );
}
