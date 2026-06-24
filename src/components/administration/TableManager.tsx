import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Utensils, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useTable } from '../../hooks/useTable';
import { Table } from '../../services/tableService';
import TableForm from './forms/tables/TableForm';
import TableDeleteModal from './forms/tables/TableDeleteModal';
import TableStatutModal from './forms/tables/TableStatutModal';

interface TableManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const TableManager: React.FC<TableManagerProps> = ({ onRegisterNewAction }) => {
  const {
    tables,
    loading,
    error,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
  } = useTable();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatutModalOpen, setIsStatutModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleNewTable = () => {
    setEditingTable(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(() => handleNewTable);
    }
  }, [onRegisterNewAction]);

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteTable = (table: Table) => {
    setSelectedTable(table);
    setIsDeleteModalOpen(true);
  };

  const handleChangeStatut = (table: Table) => {
    setSelectedTable(table);
    setIsStatutModalOpen(true);
  };

  const handleSaveTable = async (tableData: any) => {
    try {
      if (editingTable?.id) {
        await updateTable(editingTable.id, {
          designation: tableData.designation,
          statue: tableData.statue,
          disponible: tableData.statue === 'disponible',
          etat: tableData.etat,
          ordre: tableData.ordre,
        });
      } else {
        await createTable({
          designation: tableData.designation,
          statue: tableData.statue,
          disponible: tableData.statue === 'disponible',
          etat: tableData.etat,
          ordre: tableData.ordre,
        });
      }
      setIsFormOpen(false);
      setEditingTable(null);
    } catch (err) {
      console.error('[TableManager] Error saving table:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedTable?.id) {
      try {
        await deleteTable(selectedTable.id);
      } catch (err) {
        console.error('[TableManager] Error deleting table:', err);
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedTable(null);
  };

  const handleConfirmStatut = async (statue: string) => {
    if (selectedTable?.id) {
      try {
        await updateTable(selectedTable.id, {
          statue,
          disponible: statue === 'disponible',
        });
      } catch (err) {
        console.error('[TableManager] Error updating table statue:', err);
      }
    }
    setIsStatutModalOpen(false);
    setSelectedTable(null);
  };

  const getStatutBadge = (table: Table) => {
    const statue = table.statue;
    switch (statue) {
      case 'disponible':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Disponible</span>;
      case 'occupee':
        return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Occupée</span>;
      case 'reservee':
        return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Réservée</span>;
      case 'hors_service':
        return <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">Hors service</span>;
      default:
        return table.disponible
          ? <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Disponible</span>
          : <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Indisponible</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Tables</h3>

        {error && (
          <div className="mb-4 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ordre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Désignation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">État</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                        <span>Chargement des tables...</span>
                      </div>
                    </td>
                  </tr>
                ) : tables.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Aucune table trouvée
                    </td>
                  </tr>
                ) : (
                  tables.map((table) => (
                    <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                          {table.ordre ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-teal-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{table.designation || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {table.etat || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleChangeStatut(table)}
                          className="hover:opacity-75 transition-opacity"
                        >
                          {getStatutBadge(table)}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 rounded transition-colors"
                            onClick={() => handleChangeStatut(table)}
                            title="Changer statut"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                            onClick={() => handleEditTable(table)}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                            onClick={() => handleDeleteTable(table)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-gray-600 px-4 mt-4">
          {tables.length} table{tables.length !== 1 ? 's' : ''}
        </div>
      </div>

      <TableForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTable(null);
        }}
        table={editingTable}
        onSave={handleSaveTable}
      />

      <TableDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTable(null);
        }}
        table={selectedTable}
        onDelete={handleConfirmDelete}
      />

      <TableStatutModal
        isOpen={isStatutModalOpen}
        onClose={() => {
          setIsStatutModalOpen(false);
          setSelectedTable(null);
        }}
        table={selectedTable}
        onChangeStatut={handleConfirmStatut}
      />
    </div>
  );
};

export default TableManager;
