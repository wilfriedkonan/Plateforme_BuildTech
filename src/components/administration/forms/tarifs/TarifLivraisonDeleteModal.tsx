import { useState } from "react";
import { TarifLivraison } from "../../../../lib/mock/tarifsLivraison";
import { Modal, BadgeCode, BtnSecondary, BtnDanger } from "../../../ui/shared";

interface TarifLivraisonDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  tarif: TarifLivraison | null;
}

export function TarifLivraisonDeleteModal({
  isOpen, onClose, onConfirm, tarif
}: TarifLivraisonDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  if (!tarif) return null;

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onConfirm(tarif!.id);
    setLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer le tarif ?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <BadgeCode>{tarif.code}</BadgeCode>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              tarif.statut === "actif"
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-500"
            }`}>
              {tarif.statut === "actif" ? "Actif" : "Inactif"}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700">{tarif.zone}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Distance max: <strong>{tarif.distanceMax} km</strong></p>
            <p>Base: <strong>{new Intl.NumberFormat("fr-FR").format(tarif.tarifBase)} FCFA</strong></p>
            <p>Par km: <strong>{new Intl.NumberFormat("fr-FR").format(tarif.tarifParKm)} FCFA</strong></p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          ⚠️ Cette action est <strong>irréversible</strong>. Le tarif sera définitivement supprimé.
        </div>
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
  );
}
