import { useState } from "react";
import { Livreur } from "../../../../lib/mock/livreurs";
import { Modal, BadgeCode, BtnSecondary, BtnDanger } from "../../../ui/shared";

interface LivreurDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  livreur: Livreur | null;
}

const VEHICULE_ICONS: Record<string, string> = {
  Moto: "🏍️",
  Vélo: "🚴",
  Voiture: "🚗"
};

const STATUT_COLORS: Record<string, string> = {
  disponible: "bg-teal-100 text-teal-700",
  en_livraison: "bg-orange-100 text-orange-700",
  inactif: "bg-gray-100 text-gray-500"
};

const STATUT_LABELS: Record<string, string> = {
  disponible: "Disponible",
  en_livraison: "En livraison",
  inactif: "Inactif"
};

export function LivreurDeleteModal({
  isOpen, onClose, onConfirm, livreur
}: LivreurDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  if (!livreur) return null;

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onConfirm(livreur!.id);
    setLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer le livreur ?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-lg">
            {VEHICULE_ICONS[livreur.vehicule]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{livreur.nom}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <BadgeCode>{livreur.code}</BadgeCode>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUT_COLORS[livreur.statut]}`}>
                {STATUT_LABELS[livreur.statut]}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          ⚠️ Cette action est <strong>irréversible</strong>. Le livreur sera définitivement supprimé.
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
