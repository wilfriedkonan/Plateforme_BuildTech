import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Table } from '../../../../services/tableService';

interface TableStatutModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onChangeStatut: (statue: string) => void;
}

const STATUES = [
  { value: 'disponible', label: 'Disponible', icon: '🟢' },
  { value: 'occupee', label: 'Occupée', icon: '🔴' },
  { value: 'reservee', label: 'Réservée', icon: '🟡' },
  { value: 'hors_service', label: 'Hors service', icon: '⬜' },
];

const getStatutBadge = (statue: string | undefined) => {
  switch (statue) {
    case 'disponible':
      return <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">🟢 Disponible</span>;
    case 'occupee':
      return <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">🔴 Occupée</span>;
    case 'reservee':
      return <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">🟡 Réservée</span>;
    case 'hors_service':
      return <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">⬜ Hors service</span>;
    default:
      return <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">—</span>;
  }
};

const TableStatutModal: React.FC<TableStatutModalProps> = ({ isOpen, onClose, table, onChangeStatut }) => {
  const [nouveauStatut, setNouveauStatut] = useState(table?.statue || 'disponible');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (table) {
      setNouveauStatut(table.statue || 'disponible');
    }
  }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onChangeStatut(nouveauStatut);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>🔄</span>
            <span>Changer le statut</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Table :</p>
            <span className="font-semibold text-gray-900">{table.designation || '—'}</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Statut actuel :</p>
            {getStatutBadge(table.statue)}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Nouveau statut <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {STATUES.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="statue"
                    value={s.value}
                    checked={nouveauStatut === s.value}
                    onChange={(e) => setNouveauStatut(e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="flex items-center space-x-2">
                    <span>{s.icon}</span>
                    <span className="font-medium text-gray-700">{s.label}</span>
                  </span>
                </label>
              ))}
            </div>
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
