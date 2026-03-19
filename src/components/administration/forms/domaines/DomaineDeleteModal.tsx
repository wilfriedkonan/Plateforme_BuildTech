import { useState } from "react";
import { Domaine } from "../../../../lib/mock/domaines";
import { Modal, BadgeCode, BtnSecondary, BtnDanger } from "../../../ui/shared";

interface DomaineDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  domaine: Domaine | null;
}

export function DomaineDeleteModal({
  isOpen, onClose, onConfirm, domaine
}: DomaineDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  if (!domaine) return null;

  const isActif = domaine.actif;

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onConfirm(domaine!.id);
    setLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer le domaine ?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-base">
            {domaine.nom.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{domaine.nom}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <BadgeCode>{domaine.code}</BadgeCode>
              {domaine.actif && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 text-teal-700">
                  Actif
                </span>
              )}
            </div>
          </div>
        </div>

        {isActif ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              🚫 Suppression impossible
            </div>
            <p className="text-sm text-red-600">
              Ce domaine est actuellement <strong>actif</strong>. Désactivez-le avant de le supprimer.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            ⚠️ Cette action est <strong>irréversible</strong>. Le domaine sera définitivement supprimé.
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose}>
          {isActif ? "Fermer" : "Annuler"}
        </BtnSecondary>
        {!isActif && (
          <BtnDanger onClick={handleConfirm} disabled={loading}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Suppression...</>
              : "🗑 Supprimer"
            }
          </BtnDanger>
        )}
      </div>
    </Modal>
  );
}
