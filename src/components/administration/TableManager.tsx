import React, { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Utensils, RefreshCw } from 'lucide-react';
import { mockTables } from '../lib/mock/tables';
import TableForm from './forms/tables/TableForm';
import TableDeleteModal from './forms/tables/TableDeleteModal';
import TableStatutModal from './forms/tables/TableStatutModal';

interface TableManagerProps {
  onRegisterNewAction?: (action: () => void) => void;
}

const TableManager: React.FC<TableManagerProps> = ({ onRegisterNewAction }) => {
  const [tables, setTables] = useState(mockTables);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatutModalOpen, setIsStatutModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const handleNewTable = () => {
    setEditingTable(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (onRegisterNewAction) {
      onRegisterNewAction(handleNewTable);
    }
  }, [onRegisterNewAction]);

  const handleEditTable = (table: any) => {
    setEditingTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteTable = (table: any) => {
    setSelectedTable(table);
    setIsDeleteModalOpen(true);
  };

  const handleChangeStatut = (table: any) => {
    setSelectedTable(table);
    setIsStatutModalOpen(true);
  };

  const handleSaveTable = (tableData: any) => {
    if (editingTable) {
      setTables(tables.map(t => t.id === editingTable.id ? { ...editingTable, ...tableData } : t));
    } else {
      const newTable = {
        id: `TBL${Date.now()}`,
        ...tableData
      };
      setTables([...tables, newTable]);
    }
    setIsFormOpen(false);
    setEditingTable(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTable) {
      setTables(tables.filter(t => t.id !== selectedTable.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedTable(null);
  };

  const handleConfirmStatut = (statut: string, note: string) => {
    if (selectedTable) {
      setTables(tables.map(t => t.id === selectedTable.id ? { ...t, statut } : t));
    }
    setIsStatutModalOpen(false);
    setSelectedTable(null);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'disponible':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Disponible</span>;
      case 'occupee':
        return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Occupée</span>;
      case 'reservee':
        return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Réservée</span>;
      case 'hors_service':
        return <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">Hors service</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Tables</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom Table</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Zone/Salle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tables.map((table) => (
                  <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        {table.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{table.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {table.capacite} pers.
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{table.zone}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleChangeStatut(table)}
                        className="hover:opacity-75 transition-opacity"
                      >
                        {getStatutBadge(table.statut)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-sm text-gray-600 px-4 mt-4">
          {tables.length} tables | Utilisateur: Admin | <span className="font-semibold">COCOPROJECTS</span>
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
