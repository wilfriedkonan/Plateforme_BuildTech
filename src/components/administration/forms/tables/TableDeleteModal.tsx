import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Table } from '../../../../services/tableService';

interface TableDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  onDelete: () => void;
}

const TableDeleteModal: React.FC<TableDeleteModalProps> = ({ isOpen, onClose, table, onDelete }) => {
  if (!isOpen || !table) return null;

  const isOccupied = table.statue === 'occupee';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>🗑️</span>
            <span>Supprimer la table ?</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-teal-700 font-bold text-sm">{table.ordre ?? '—'}</span>
            </div>
            <span className="font-semibold text-gray-900">{table.designation || '—'}</span>
          </div>

          <div className="text-sm text-gray-600">
            <p>État: {table.etat || '—'} — Statut: {table.statue || (table.disponible ? 'disponible' : 'indisponible')}</p>
          </div>

          {isOccupied ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Suppression impossible</h3>
                  <p className="text-sm text-red-700">
                    Cette table est actuellement occupée. Changez son statut avant de la supprimer.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-900">Attention</span>
              </div>
              <p className="text-sm text-orange-700">
                Cette action est irréversible. L'historique des données liées sera conservé.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          {isOccupied ? (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              Fermer
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={onDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableDeleteModal;
