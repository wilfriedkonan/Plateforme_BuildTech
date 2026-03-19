import { useState, useEffect } from "react";
import { TarifLivraison } from "../../../../lib/mock/tarifsLivraison";
import {
  Modal, FormInput, FormSelect,
  BtnPrimary, BtnSecondary, BadgeCode
} from "../../../ui/shared";

interface TarifLivraisonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<TarifLivraison>) => void;
  tarif?: TarifLivraison | null;
}

interface FormErrors {
  zone?: string;
  distanceMax?: string;
  tarifBase?: string;
  tarifParKm?: string;
}

const ZONES = [
  "Plateau / Cocody",
  "Yopougon",
  "Abobo / Adjamé",
  "Marcory / Treichville",
  "Bingerville / Bassam"
];

export default function TarifLivraisonForm({
  isOpen, onClose, onSave, tarif
}: TarifLivraisonFormProps) {
  const isEdit = !!tarif;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    zone: "",
    distanceMax: "",
    tarifBase: "",
    tarifParKm: "",
    statut: "actif" as TarifLivraison['statut']
  });

  useEffect(() => {
    if (tarif) {
      setForm({
        zone: tarif.zone,
        distanceMax: String(tarif.distanceMax),
        tarifBase: String(tarif.tarifBase),
        tarifParKm: String(tarif.tarifParKm),
        statut: tarif.statut
      });
    } else {
      setForm({
        zone: "", distanceMax: "", tarifBase: "",
        tarifParKm: "", statut: "actif"
      });
    }
    setErrors({});
  }, [tarif, isOpen]);

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.zone)
      e.zone = "Veuillez sélectionner une zone.";
    if (!form.distanceMax || isNaN(parseFloat(form.distanceMax)) || parseFloat(form.distanceMax) <= 0)
      e.distanceMax = "Distance maximum invalide.";
    if (!form.tarifBase || isNaN(parseFloat(form.tarifBase)) || parseFloat(form.tarifBase) <= 0)
      e.tarifBase = "Tarif de base invalide.";
    if (!form.tarifParKm || isNaN(parseFloat(form.tarifParKm)) || parseFloat(form.tarifParKm) <= 0)
      e.tarifParKm = "Tarif par km invalide.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({
      ...(isEdit ? { id: tarif!.id, code: tarif!.code } : {}),
      zone: form.zone,
      distanceMax: parseFloat(form.distanceMax),
      tarifBase: parseFloat(form.tarifBase),
      tarifParKm: parseFloat(form.tarifParKm),
      statut: form.statut
    });
    setLoading(false);
    onClose();
  }

  const distMax = parseFloat(form.distanceMax) || 0;
  const base = parseFloat(form.tarifBase) || 0;
  const perKm = parseFloat(form.tarifParKm) || 0;
  const totalEstimation = distMax > 0 ? base + (distMax * perKm) : base;

  const title = isEdit
    ? `Modifier le Tarif — ${tarif?.code}`
    : "Nouveau Tarif de Livraison";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="px-6 py-5 flex flex-col gap-5">

        {isEdit && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500">Code :</span>
            <BadgeCode>{tarif?.code}</BadgeCode>
            <span className="text-xs text-gray-400 ml-auto">Auto-généré</span>
          </div>
        )}

        <FormSelect
          label="Zone de livraison"
          required
          value={form.zone}
          onChange={e => set("zone", e.target.value)}
          error={errors.zone}
          options={ZONES.map(z => ({ value: z, label: z }))}
        />

        <FormInput
          label="Distance maximum (km)"
          required
          type="number"
          min="0"
          step="1"
          placeholder="Ex : 10"
          value={form.distanceMax}
          onChange={e => set("distanceMax", e.target.value)}
          error={errors.distanceMax}
        />

        <FormInput
          label="Tarif de base (FCFA)"
          required
          type="number"
          min="0"
          step="100"
          placeholder="Ex : 1500"
          value={form.tarifBase}
          onChange={e => set("tarifBase", e.target.value)}
          error={errors.tarifBase}
        />

        <FormInput
          label="Tarif par km (FCFA)"
          required
          type="number"
          min="0"
          step="50"
          placeholder="Ex : 300"
          value={form.tarifParKm}
          onChange={e => set("tarifParKm", e.target.value)}
          error={errors.tarifParKm}
        />

        {distMax > 0 && base > 0 && perKm > 0 && (
          <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Estimation</p>
            <p className="text-sm text-teal-700 mb-1">
              Pour <strong>{distMax} km</strong> : {new Intl.NumberFormat("fr-FR").format(totalEstimation)} FCFA
            </p>
            <p className="text-xs text-teal-600">
              {base.toLocaleString()} (base) + {distMax} × {perKm.toLocaleString()} (par km)
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Statut</span>
          <div className="flex gap-3">
            {(['actif', 'inactif'] as const).map(s => (
              <label
                key={s}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm font-medium capitalize ${
                  form.statut === s
                    ? s === "actif"
                      ? "border-teal-500 bg-teal-50 text-teal-700"
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
                    ? s === "actif" ? "bg-teal-500" : "bg-gray-400"
                    : "bg-gray-300"
                }`} />
                {s}
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
