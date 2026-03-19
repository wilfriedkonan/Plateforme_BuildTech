import { useState, useEffect } from "react";
import { Livreur } from "../../../../lib/mock/livreurs";
import {
  Modal, FormInput, FormSelect,
  BtnPrimary, BtnSecondary, BadgeCode
} from "../../../ui/shared";

interface LivreurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Livreur>) => void;
  livreur?: Livreur | null;
}

interface FormErrors {
  nom?: string;
  telephone?: string;
  zone?: string;
  vehicule?: string;
}

const VEHICULES = [
  { value: "Moto", label: "Moto" },
  { value: "Vélo", label: "Vélo" },
  { value: "Voiture", label: "Voiture" }
];

const ZONES = [
  "Plateau / Cocody",
  "Yopougon",
  "Abobo / Adjamé",
  "Marcory / Treichville",
  "Bingerville / Bassam"
];

export default function LivreurForm({
  isOpen, onClose, onSave, livreur
}: LivreurFormProps) {
  const isEdit = !!livreur;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    zone: "",
    vehicule: "" as Livreur['vehicule'] | "",
    statut: "disponible" as Livreur['statut']
  });

  useEffect(() => {
    if (livreur) {
      setForm({
        nom: livreur.nom,
        telephone: livreur.telephone,
        zone: livreur.zone,
        vehicule: livreur.vehicule,
        statut: livreur.statut
      });
    } else {
      setForm({
        nom: "", telephone: "", zone: "",
        vehicule: "", statut: "disponible"
      });
    }
    setErrors({});
  }, [livreur, isOpen]);

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.nom.trim() || form.nom.trim().length < 3)
      e.nom = "Le nom doit contenir au moins 3 caractères.";
    if (!form.telephone || !/^[\d\s]{10,}$/.test(form.telephone.replace(/\s/g, '')))
      e.telephone = "Numéro de téléphone invalide.";
    if (!form.zone)
      e.zone = "Veuillez sélectionner une zone.";
    if (!form.vehicule)
      e.vehicule = "Veuillez sélectionner un véhicule.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({
      ...(isEdit ? { id: livreur!.id, code: livreur!.code } : {}),
      nom: form.nom.trim(),
      telephone: form.telephone.trim(),
      zone: form.zone,
      vehicule: form.vehicule as Livreur['vehicule'],
      statut: form.statut
    });
    setLoading(false);
    onClose();
  }

  const title = isEdit
    ? `Modifier le Livreur — ${livreur?.code}`
    : "Nouveau Livreur";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="px-6 py-5 flex flex-col gap-5">

        {isEdit && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500">Code :</span>
            <BadgeCode>{livreur?.code}</BadgeCode>
            <span className="text-xs text-gray-400 ml-auto">Auto-généré</span>
          </div>
        )}

        <FormInput
          label="Nom complet"
          required
          placeholder="Ex : Konan Serge"
          value={form.nom}
          onChange={e => set("nom", e.target.value)}
          error={errors.nom}
        />

        <FormInput
          label="Téléphone"
          required
          placeholder="Ex : 07 01 02 03 04"
          value={form.telephone}
          onChange={e => set("telephone", e.target.value)}
          error={errors.telephone}
        />

        <FormSelect
          label="Zone d'affectation"
          required
          value={form.zone}
          onChange={e => set("zone", e.target.value)}
          error={errors.zone}
          options={ZONES.map(z => ({ value: z, label: z }))}
        />

        <FormSelect
          label="Type de véhicule"
          required
          value={form.vehicule}
          onChange={e => set("vehicule", e.target.value)}
          error={errors.vehicule}
          options={VEHICULES}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Statut</span>
          <div className="flex gap-2">
            {(['disponible', 'en_livraison', 'inactif'] as const).map(s => (
              <label
                key={s}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm font-medium ${
                  form.statut === s
                    ? s === "disponible"
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : s === "en_livraison"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-400 bg-gray-50 text-gray-600"
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
                    ? s === "disponible" ? "bg-teal-500"
                      : s === "en_livraison" ? "bg-orange-500"
                      : "bg-gray-400"
                    : "bg-gray-300"
                }`} />
                {s === "disponible" ? "Disponible" : s === "en_livraison" ? "En livraison" : "Inactif"}
              </label>
            ))}
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
