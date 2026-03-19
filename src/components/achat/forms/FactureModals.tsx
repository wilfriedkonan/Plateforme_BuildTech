// ============================================================
// MODALE SUPPRESSION FACTURE D'ACHAT
// ============================================================
// Fichier : components/achat/forms/FactureDeleteModal.tsx

"use client"

import { useState } from "react"
import {
  FactureAchat, formatMontant, getFournisseurById
} from "../../lib/mock/achats"
import {
  Modal, BadgeCode, BtnSecondary, BtnDanger, BtnPrimary
} from "../../ui/shared"

const STATUT_STYLE: Record<string, string> = {
  payee:       "bg-emerald-100 text-emerald-700",
  en_attente:  "bg-amber-100 text-amber-700",
  en_retard:   "bg-red-100 text-red-700",
  annulee:     "bg-gray-100 text-gray-500",
}
const STATUT_LABEL: Record<string, string> = {
  payee: "Payée", en_attente: "En attente",
  en_retard: "En retard", annulee: "Annulée"
}

interface DeleteProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  facture: FactureAchat | null
}

export function FactureDeleteModal({ isOpen, onClose, onConfirm, facture }: DeleteProps) {
  const [loading, setLoading] = useState(false)
  if (!facture) return null

  const fournisseur = getFournisseurById(facture.fournisseurId)
  const isPayee = facture.statut === "payee"

  async function handleConfirm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    onConfirm(facture!.id)
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer la facture ?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        {/* Identité facture */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <BadgeCode>{facture.numero}</BadgeCode>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUT_STYLE[facture.statut]}`}>
              {STATUT_LABEL[facture.statut]}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700">{facture.designation}</p>
          <p className="text-xs text-gray-500">Fournisseur : {fournisseur?.nom ?? "—"}</p>
          <p className="text-sm font-bold text-teal-700">{formatMontant(facture.montantTTC)}</p>
        </div>

        {/* Blocage si facture payée */}
        {isPayee ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold mb-1">🚫 Suppression déconseillée</p>
            <p>Cette facture est marquée comme <strong>payée</strong>. Supprimez-la uniquement si c'est une erreur de saisie.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            ⚠️ Cette action est <strong>irréversible</strong>. La facture sera définitivement supprimée.
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose}>Annuler</BtnSecondary>
        <BtnDanger onClick={handleConfirm} disabled={loading}>
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Suppression...</>
            : "🗑 Supprimer"
          }
        </BtnDanger>
      </div>
    </Modal>
  )
}


// ============================================================
// MODALE DÉTAIL FACTURE (lecture seule)
// ============================================================

interface DetailProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onMarkPaid: (id: string, datePaiement?: string) => void
  facture: FactureAchat | null
}

export function FactureDetailModal({ isOpen, onClose, onEdit, onMarkPaid, facture }: DetailProps) {
  if (!facture) return null
  const fournisseur = getFournisseurById(facture.fournisseurId)
  const isPaid = facture.statut === "payee"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Détail de la Facture" size="lg">
      <div className="px-6 py-5 flex flex-col gap-5">

        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BadgeCode>{facture.numero}</BadgeCode>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUT_STYLE[facture.statut]}`}>
                {STATUT_LABEL[facture.statut]}
              </span>
            </div>
            <p className="text-base font-bold text-gray-800">{facture.designation}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-teal-700">{formatMontant(facture.montantTTC)}</p>
            <p className="text-xs text-gray-400">TTC</p>
          </div>
        </div>

        {/* Infos principales */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🏢", label: "Fournisseur",     value: fournisseur?.nom ?? "—" },
            { icon: "📅", label: "Date facture",     value: facture.date },
            { icon: "⏰", label: "Date échéance",    value: facture.dateEcheance ?? "—" },
            { icon: "📎", label: "Référence",        value: facture.reference ?? "—" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
              <span className="text-base mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-medium text-gray-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau des montants */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Détail des montants</p>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: "Montant HT",   value: facture.montantHT, bold: false },
              { label: `TVA (${facture.tva}%)`, value: facture.montantTTC - facture.montantHT, bold: false },
              { label: "Montant TTC",  value: facture.montantTTC, bold: true },
            ].map(row => (
              <div key={row.label} className={`flex justify-between items-center px-4 py-3 ${row.bold ? "bg-teal-50" : ""}`}>
                <span className={`text-sm ${row.bold ? "font-bold text-teal-700" : "text-gray-600"}`}>
                  {row.label}
                </span>
                <span className={`text-sm ${row.bold ? "font-bold text-teal-700" : "font-semibold text-gray-700"}`}>
                  {formatMontant(row.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {facture.notes && (
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-500 font-semibold mb-1">Notes</p>
            <p className="text-sm text-blue-700">{facture.notes}</p>
          </div>
        )}

        {/* Alerte retard */}
        {facture.statut === "en_retard" && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-sm text-red-700 flex items-center gap-2">
            ⚠️ Cette facture est <strong>en retard de paiement</strong>.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <div>
          {!isPaid && (
            <button
              onClick={() => { onMarkPaid(facture.id); onClose() }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
            >
              ✓ Marquer comme payée
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <BtnSecondary onClick={onClose}>Fermer</BtnSecondary>
          <BtnPrimary onClick={() => { onClose(); onEdit() }}>✏️ Modifier</BtnPrimary>
        </div>
      </div>
    </Modal>
  )
}


// ============================================================
// MODALE MARQUER FACTURE PAYÉE (confirmation)
// ============================================================

interface MarkPaidProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string, datePaiement: string) => void
  facture: FactureAchat | null
}

export function FactureMarquerPayeeModal({ isOpen, onClose, onConfirm, facture }: MarkPaidProps) {
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split("T")[0])
  const [modePaiement, setModePaiement] = useState("virement")
  const [loading, setLoading] = useState(false)
  if (!facture) return null

  const modes = [
    { value: "virement",  label: "🏦 Virement" },
    { value: "especes",   label: "💵 Espèces" },
    { value: "cheque",    label: "📄 Chèque" },
    { value: "mobile",    label: "📱 Mobile Money" },
  ]

  async function handleConfirm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    onConfirm(facture!.id, datePaiement)
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmer le paiement" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-500">Facture</p>
            <p className="font-semibold text-emerald-700 text-sm">{facture.numero}</p>
          </div>
          <p className="text-lg font-bold text-emerald-700">{formatMontant(facture.montantTTC)}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Date du paiement <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={datePaiement}
            onChange={e => setDatePaiement(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 text-sm outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Mode de paiement</span>
          <div className="grid grid-cols-2 gap-2">
            {modes.map(m => (
              <label
                key={m.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer text-sm transition-colors
                  ${modePaiement === m.value
                    ? "border-teal-500 bg-teal-50 text-teal-700 font-semibold"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
              >
                <input type="radio" name="mode" value={m.value}
                  checked={modePaiement === m.value}
                  onChange={() => setModePaiement(m.value)}
                  className="hidden"
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose}>Annuler</BtnSecondary>
        <button
          onClick={handleConfirm}
          disabled={loading || !datePaiement}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Confirmation...</>
            : "✓ Confirmer le paiement"
          }
        </button>
      </div>
    </Modal>
  )
}
