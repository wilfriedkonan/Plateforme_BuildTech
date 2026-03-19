import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TableStatutModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: any;
  onChangeStatut: (statut: string, note: string) => void;
}

const TableStatutModal: React.FC<TableStatutModalProps> = ({ isOpen, onClose, table, onChangeStatut }) => {
  const [nouveauStatut, setNouveauStatut] = useState(table?.statut || 'disponible');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onChangeStatut(nouveauStatut, note);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!isOpen || !table) return null;

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">🟢 Disponible</span>;
      case 'occupee':
        return <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">🔴 Occupée</span>;
      case 'reservee':
        return <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">🟡 Réservée</span>;
      case 'hors_service':
        return <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">⬜ Hors service</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>🔄</span>
            <span>Changer le statut</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Table:</p>
            <div className="flex items-center space-x-3">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {table.code}
              </span>
              <span className="font-semibold text-gray-900">{table.nom}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Statut actuel:</p>
            {getStatutBadge(table.statut)}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nouveau statut <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="disponible"
                  checked={nouveauStatut === 'disponible'}
                  onChange={(e) => setNouveauStatut(e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span>🟢</span>
                  <span className="font-medium text-gray-700">Disponible</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="occupee"
                  checked={nouveauStatut === 'occupee'}
                  onChange={(e) => setNouveauStatut(e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span>🔴</span>
                  <span className="font-medium text-gray-700">Occupée</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="reservee"
                  checked={nouveauStatut === 'reservee'}
                  onChange={(e) => setNouveauStatut(e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span>🟡</span>
                  <span className="font-medium text-gray-700">Réservée</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="hors_service"
                  checked={nouveauStatut === 'hors_service'}
                  onChange={(e) => setNouveauStatut(e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span>⬜</span>
                  <span className="font-medium text-gray-700">Hors service</span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note (optionnel)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Raison du changement de statut..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>Confirmer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableStatutModal;
