import { useState, useEffect } from "react";
import { Utilisateur } from "../../../../lib/mock/utilisateurs";
import {
  Modal, FormInput, FormSelect,
  BtnPrimary, BtnSecondary, BadgeCode
} from "../../../ui/shared";

interface UtilisateurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Utilisateur>) => void;
  utilisateur?: Utilisateur | null;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  role?: string;
}

const ROLES = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "caissier", label: "Caissier" },
  { value: "livreur", label: "Livreur" }
];

export default function UtilisateurForm({
  isOpen, onClose, onSave, utilisateur
}: UtilisateurFormProps) {
  const isEdit = !!utilisateur;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "" as Utilisateur['role'] | "",
    statut: "actif" as Utilisateur['statut']
  });

  useEffect(() => {
    if (utilisateur) {
      setForm({
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        telephone: utilisateur.telephone || "",
        role: utilisateur.role,
        statut: utilisateur.statut
      });
    } else {
      setForm({
        nom: "", prenom: "", email: "", telephone: "",
        role: "", statut: "actif"
      });
    }
    setErrors({});
  }, [utilisateur, isOpen]);

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
    if (form.telephone && !/^[\d\s]{10,}$/.test(form.telephone.replace(/\s/g, '')))
      e.telephone = "Numéro de téléphone invalide.";
    if (!form.role)
      e.role = "Veuillez sélectionner un rôle.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({
      ...(isEdit ? { id: utilisateur!.id, code: utilisateur!.code } : {}),
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      email: form.email.trim(),
      telephone: form.telephone.trim() || undefined,
      role: form.role as Utilisateur['role'],
      statut: form.statut
    });
    setLoading(false);
    onClose();
  }

  const title = isEdit
    ? `Modifier l'Utilisateur — ${utilisateur?.code}`
    : "Nouvel Utilisateur";

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

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Nom"
            required
            placeholder="Ex : Kouassi"
            value={form.nom}
            onChange={e => set("nom", e.target.value)}
            error={errors.nom}
          />
          <FormInput
            label="Prénom"
            required
            placeholder="Ex : Jean"
            value={form.prenom}
            onChange={e => set("prenom", e.target.value)}
            error={errors.prenom}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Email"
            required
            type="email"
            placeholder="Ex : jean@cocoprojects.com"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            error={errors.email}
          />
          <FormInput
            label="Téléphone"
            placeholder="Ex : 05 06 07 08 09"
            value={form.telephone}
            onChange={e => set("telephone", e.target.value)}
            error={errors.telephone}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Rôle"
            required
            value={form.role}
            onChange={e => set("role", e.target.value)}
            error={errors.role}
            options={ROLES}
          />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Statut</span>
            <div className="flex gap-3">
              {(['actif', 'suspendu'] as const).map(s => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm font-medium capitalize ${
                    form.statut === s
                      ? s === "actif"
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-red-400 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="statut"
                    value={s}
                    checked={form.statut === s}
                    onChange={() => set("statut", s)}
                    className="hidden"
                  />
                  <span className={`w-3 h-3 rounded-full ${
                    form.statut === s
                      ? s === "actif" ? "bg-teal-500" : "bg-red-500"
                      : "bg-gray-300"
                  }`} />
                  {s}
                </label>
              ))}
            </div>
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
