// ============================================================
// FORMULAIRE FACTURE D'ACHAT — Création / Édition
// ============================================================
// Fichier : components/achat/forms/FactureAchatForm.tsx

"use client"

import { useState, useEffect } from "react"
import {
  FactureAchat, StatutFacture, TVA_OPTIONS,
  mockFournisseurs, formatMontant
} from "../../lib/mock/achats"
import {
  Modal, FormInput, FormSelect, FormTextarea,
  BtnPrimary, BtnSecondary, BadgeCode
} from "../../ui/shared"

interface FactureAchatFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<FactureAchat>) => void
  facture?: FactureAchat | null
}

interface FormErrors {
  fournisseurId?: string
  designation?: string
  date?: string
  montantHT?: string
}

export default function FactureAchatForm({
  isOpen, onClose, onSave, facture
}: FactureAchatFormProps) {
  const isEdit = !!facture
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [form, setForm] = useState({
    fournisseurId: "",
    designation:   "",
    date:          new Date().toISOString().split("T")[0],
    dateEcheance:  "",
    montantHT:     "",
    tva:           "18",
    reference:     "",
    statut:        "en_attente" as StatutFacture,
    notes:         "",
  })

  // Calcul TTC en temps réel
  const ht = parseFloat(form.montantHT) || 0
  const tvaRate = parseFloat(form.tva) || 0
  const ttc = ht * (1 + tvaRate / 100)
  const montantTVA = ttc - ht

  useEffect(() => {
    if (facture) {
      setForm({
        fournisseurId: facture.fournisseurId,
        designation:   facture.designation,
        date:          facture.date,
        dateEcheance:  facture.dateEcheance ?? "",
        montantHT:     String(facture.montantHT),
        tva:           String(facture.tva),
        reference:     facture.reference ?? "",
        statut:        facture.statut,
        notes:         facture.notes ?? "",
      })
    } else {
      setForm({
        fournisseurId:"", designation:"",
        date: new Date().toISOString().split("T")[0],
        dateEcheance:"", montantHT:"", tva:"18",
        reference:"", statut:"en_attente", notes:""
      })
    }
    setErrors({})
  }, [facture, isOpen])

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.fournisseurId) e.fournisseurId = "Sélectionnez un fournisseur."
    if (!form.designation.trim() || form.designation.trim().length < 3)
      e.designation = "La désignation doit contenir au moins 3 caractères."
    if (!form.date) e.date = "La date est obligatoire."
    if (!form.montantHT || isNaN(parseFloat(form.montantHT)) || parseFloat(form.montantHT) <= 0)
      e.montantHT = "Montant HT invalide (doit être > 0)."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    onSave({
      ...(isEdit ? { id: facture!.id, numero: facture!.numero } : {}),
      fournisseurId: form.fournisseurId,
      designation:   form.designation.trim(),
      date:          form.date,
      dateEcheance:  form.dateEcheance || undefined,
      montantHT:     parseFloat(form.montantHT),
      tva:           parseFloat(form.tva),
      montantTTC:    Math.round(ttc),
      reference:     form.reference.trim() || undefined,
      statut:        form.statut,
      notes:         form.notes.trim() || undefined,
    })
    setLoading(false)
    onClose()
  }

  const fournisseurOptions = mockFournisseurs
    .filter(f => f.statut === "actif")
    .map(f => ({ value: f.id, label: `${f.code} — ${f.nom}` }))

  const statutOptions: { value: StatutFacture; label: string }[] = [
    { value: "en_attente", label: "En attente" },
    { value: "payee",      label: "Payée" },
    { value: "en_retard",  label: "En retard" },
    { value: "annulee",    label: "Annulée" },
  ]

  const title = isEdit
    ? `Modifier la Facture — ${facture?.numero}`
    : "Nouvelle Facture d'Achat"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Code facture (édition) */}
        {isEdit && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-500">N° Facture :</span>
            <BadgeCode>{facture?.numero}</BadgeCode>
            <span className="text-xs text-gray-400 ml-auto">Auto-généré · non modifiable</span>
          </div>
        )}

        {/* Layout 2 colonnes */}
        <div className="grid grid-cols-2 gap-6">

          {/* Colonne gauche */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informations générales</p>

            <FormSelect
              label="Fournisseur"
              required
              value={form.fournisseurId}
              onChange={e => set("fournisseurId", e.target.value)}
              error={errors.fournisseurId}
              options={fournisseurOptions}
            />

            <FormInput
              label="Désignation"
              required
              placeholder="Ex : Livraison marchandises Janvier"
              value={form.designation}
              onChange={e => set("designation", e.target.value)}
              error={errors.designation}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Date de la facture"
                required
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
                error={errors.date}
              />
              <FormInput
                label="Date d'échéance"
                type="date"
                value={form.dateEcheance}
                onChange={e => set("dateEcheance", e.target.value)}
              />
            </div>

            <FormInput
              label="Référence document"
              placeholder="N° bon de livraison, commande, etc."
              value={form.reference}
              onChange={e => set("reference", e.target.value)}
              hint="Ex : BL-2025-042 / BC-2025-018"
            />

            <FormSelect
              label="Statut"
              value={form.statut}
              onChange={e => set("statut", e.target.value as StatutFacture)}
              options={statutOptions}
            />

            <FormTextarea
              label="Notes"
              placeholder="Remarques, conditions particulières..."
              rows={3}
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
            />
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Montants</p>

            <FormInput
              label="Montant HT (FCFA)"
              required
              type="number"
              min="0"
              step="100"
              placeholder="Ex : 450000"
              value={form.montantHT}
              onChange={e => set("montantHT", e.target.value)}
              error={errors.montantHT}
            />

            {/* Taux TVA — radio buttons */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-gray-700">Taux TVA</span>
              <div className="flex gap-2 flex-wrap">
                {TVA_OPTIONS.map(rate => (
                  <label
                    key={rate}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-colors
                      ${form.tva === String(rate)
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="tva"
                      value={rate}
                      checked={form.tva === String(rate)}
                      onChange={() => set("tva", String(rate))}
                      className="hidden"
                    />
                    {rate}%
                  </label>
                ))}
              </div>
            </div>

            {/* Récapitulatif calculé */}
            <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4 flex flex-col gap-3 mt-1">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Récapitulatif</p>

              <div className="flex flex-col gap-2">
                {[
                  { label: "Montant HT",  value: ht,        style: "text-gray-700" },
                  { label: `TVA (${tvaRate}%)`, value: montantTVA, style: "text-gray-500" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{row.label}</span>
                    <span className={`font-semibold ${row.style}`}>
                      {ht > 0 ? formatMontant(Math.round(row.value)) : "—"}
                    </span>
                  </div>
                ))}
                <div className="border-t border-teal-200 pt-2 flex justify-between items-center">
                  <span className="text-sm font-bold text-teal-700">Montant TTC</span>
                  <span className="text-lg font-bold text-teal-700">
                    {ht > 0 ? formatMontant(Math.round(ttc)) : "—"}
                  </span>
                </div>
              </div>

              {ht === 0 && (
                <p className="text-xs text-teal-500 text-center">
                  Saisissez le montant HT pour voir le calcul
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
  )
}
