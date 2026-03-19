import { useState } from "react";
import { Utilisateur } from "../../../../lib/mock/utilisateurs";
import {
  Modal, BadgeCode, BtnSecondary, BtnDanger
} from "../../../ui/shared";

interface UtilisateurDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  utilisateur: Utilisateur | null;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  caissier: "Caissier",
  livreur: "Livreur"
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  manager: "bg-orange-100 text-orange-700",
  caissier: "bg-blue-100 text-blue-700",
  livreur: "bg-green-100 text-green-700"
};

export function UtilisateurDeleteModal({
  isOpen, onClose, onConfirm, utilisateur
}: UtilisateurDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  if (!utilisateur) return null;

  const isAdmin = utilisateur.role === "admin";

  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    onConfirm(utilisateur!.id);
    setLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer l'utilisateur ?" size="sm">
      <div className="px-6 py-5 flex flex-col gap-4">

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
            ROLE_COLORS[utilisateur.role]?.includes('bg-red') ? 'bg-red-500' :
            ROLE_COLORS[utilisateur.role]?.includes('bg-orange') ? 'bg-orange-500' :
            ROLE_COLORS[utilisateur.role]?.includes('bg-blue') ? 'bg-blue-500' :
            'bg-green-500'
          }`}>
            {utilisateur.prenom[0]}{utilisateur.nom[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">
              {utilisateur.prenom} {utilisateur.nom}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <BadgeCode>{utilisateur.code}</BadgeCode>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ROLE_COLORS[utilisateur.role]}`}>
                {ROLE_LABELS[utilisateur.role]}
              </span>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              🚫 Suppression impossible
            </div>
            <p className="text-sm text-red-600">
              Impossible de supprimer un <strong>administrateur</strong>. Modifiez son rôle avant de le supprimer.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            ⚠️ Cette action est <strong>irréversible</strong>. L'utilisateur sera définitivement supprimé.
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <BtnSecondary onClick={onClose}>
          {isAdmin ? "Fermer" : "Annuler"}
        </BtnSecondary>
        {!isAdmin && (
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
