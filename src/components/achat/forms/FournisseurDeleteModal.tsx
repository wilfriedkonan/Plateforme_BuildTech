// ============================================================
// MODALE SUPPRESSION FOURNISSEUR
// ============================================================
// Fichier : components/achat/forms/FournisseurDeleteModal.tsx

"use client"

import { useState } from "react"
import { Fournisseur, formatMontant, getFacturesByFournisseur } from "../../lib/mock/achats"
import { Modal, BadgeCode, BadgeSpecialite, BtnSecondary, BtnDanger } from "../../ui/shared"

interface FournisseurDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
  fournisseur: Fournisseur | null
}

export function FournisseurDeleteModal({
  isOpen, onClose, onConfirm, fournisseur
}: FournisseurDeleteModalProps) {
  const [loading, setLoading] = useState(false)
  if (!fournisseur) return null

  const facturesLiees = getFacturesByFournisseur(fournisseur.id)
  const hasFactures = facturesLiees.length > 0

  async function handleConfirm() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    onConfirm(fournisseur!.id)
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer le fournisseur ?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        {/* Identité */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-base">
            {fournisseur.nom.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{fournisseur.nom}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <BadgeCode>{fournisseur.code}</BadgeCode>
              <BadgeSpecialite label={fournisseur.specialite} />
            </div>
          </div>
        </div>

        {/* Blocage si factures liées */}
        {hasFactures ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              🚫 Suppression impossible
            </div>
            <p className="text-sm text-red-600">
              Ce fournisseur est lié à <strong>{facturesLiees.length} facture(s)</strong> d'achat.
              Supprimez ou réaffectez les factures avant de continuer.
            </p>
            <button
              className="text-xs text-red-700 underline text-left"
              onClick={() => { /* naviguer vers factures */ }}
            >
              Voir les factures liées →
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            ⚠️ Cette action est <strong>irréversible</strong>. Le fournisseur sera définitivement supprimé.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose}>
          {hasFactures ? "Fermer" : "Annuler"}
        </BtnSecondary>
        {!hasFactures && (
          <BtnDanger onClick={handleConfirm} disabled={loading}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Suppression...</>
              : "🗑 Supprimer"
            }
          </BtnDanger>
        )}
      </div>
    </Modal>
  )
}


// ============================================================
// MODALE FICHE FOURNISSEUR (lecture seule)
// ============================================================
// Fichier : components/achat/forms/FournisseurFicheModal.tsx

interface FournisseurFicheModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  fournisseur: Fournisseur | null
}

const STATUT_FACTURE_LABEL: Record<string, string> = {
  payee: "Payée", en_attente: "En attente",
  en_retard: "En retard", annulee: "Annulée"
}
const STATUT_FACTURE_STYLE: Record<string, string> = {
  payee: "bg-emerald-100 text-emerald-700",
  en_attente: "bg-amber-100 text-amber-700",
  en_retard: "bg-red-100 text-red-700",
  annulee: "bg-gray-100 text-gray-500",
}

import { BtnPrimary } from "../../ui/shared"

export function FournisseurFicheModal({
  isOpen, onClose, onEdit, fournisseur
}: FournisseurFicheModalProps) {
  if (!fournisseur) return null
  const facturesLiees = getFacturesByFournisseur(fournisseur.id)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fiche Fournisseur" size="lg">
      <div className="px-6 py-5 flex flex-col gap-5">

        {/* En-tête fournisseur */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {fournisseur.nom.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{fournisseur.nom}</h3>
            <div className="flex items-center gap-2 mt-1">
              <BadgeCode>{fournisseur.code}</BadgeCode>
              <BadgeSpecialite label={fournisseur.specialite} />
              {fournisseur.statut === "actif"
                ? <span className="text-xs text-emerald-600 font-semibold">● Actif</span>
                : <span className="text-xs text-gray-400 font-semibold">● Inactif</span>
              }
            </div>
          </div>
        </div>

        {/* Infos contact */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "📞", label: "Téléphone", value: fournisseur.contact },
            { icon: "✉️", label: "Email", value: fournisseur.email ?? "—" },
            { icon: "📍", label: "Adresse", value: fournisseur.adresse ?? "—" },
            { icon: "📅", label: "Enregistré le", value: fournisseur.createdAt },
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-center">
            <p className="text-2xl font-bold text-teal-700">{facturesLiees.length}</p>
            <p className="text-xs text-teal-600">Factures au total</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-lg font-bold text-blue-700">
              {formatMontant(facturesLiees.reduce((s, f) => s + f.montantTTC, 0))}
            </p>
            <p className="text-xs text-blue-600">Total achats TTC</p>
          </div>
        </div>

        {/* Dernières factures */}
        {facturesLiees.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Dernières factures</p>
            <div className="flex flex-col gap-1.5">
              {facturesLiees.slice(0, 4).map(f => (
                <div key={f.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-teal-700 font-semibold">{f.numero}</span>
                    <span className="text-gray-500 text-xs truncate max-w-[160px]">{f.designation}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-gray-700">{formatMontant(f.montantTTC)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_FACTURE_STYLE[f.statut]}`}>
                      {STATUT_FACTURE_LABEL[f.statut]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose}>Fermer</BtnSecondary>
        <BtnPrimary onClick={() => { onClose(); onEdit() }}>✏️ Modifier</BtnPrimary>
      </div>
    </Modal>
  )
}
