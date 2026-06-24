import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Table } from '../../../../services/tableService';

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  table?: Table | null;
  onSave: (data: {
    designation: string;
    statue: string;
    etat: string;
    ordre: number | undefined;
  }) => Promise<void>;
}

interface FormData {
  designation: string;
  statue: string;
  etat: string;
  ordre: string;
}

const STATUES = [
  { value: 'disponible', label: 'Disponible', icon: '🟢', color: 'text-green-700' },
  { value: 'occupee', label: 'Occupée', icon: '🔴', color: 'text-red-700' },
  { value: 'reservee', label: 'Réservée', icon: '🟡', color: 'text-orange-700' },
  { value: 'hors_service', label: 'Hors service', icon: '⬜', color: 'text-gray-700' },
];

const TableForm: React.FC<TableFormProps> = ({ isOpen, onClose, table, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    designation: '',
    statue: 'disponible',
    etat: 'actif',
    ordre: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (table) {
      setFormData({
        designation: table.designation || '',
        statue: table.statue || 'disponible',
        etat: table.etat || 'actif',
        ordre: table.ordre != null ? String(table.ordre) : '',
      });
    } else {
      setFormData({ designation: '', statue: 'disponible', etat: 'actif', ordre: '' });
    }
    setErrors({});
  }, [table, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.designation || formData.designation.trim().length < 2) {
      newErrors.designation = 'La désignation doit contenir au moins 2 caractères';
    }
    if (!formData.statue) {
      newErrors.statue = 'Le statut est obligatoire';
    }
    if (formData.ordre && (isNaN(Number(formData.ordre)) || Number(formData.ordre) < 1)) {
      newErrors.ordre = "L'ordre doit être un nombre positif";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        designation: formData.designation.trim(),
        statue: formData.statue,
        etat: formData.etat,
        ordre: formData.ordre ? Number(formData.ordre) : undefined,
      });
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {table ? 'Modifier la Table' : 'Nouvelle Table'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Désignation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Désignation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.designation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Table 1, Table Terrasse..."
            />
            {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
          </div>

          {/* Ordre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ordre d'affichage
            </label>
            <input
              type="number"
              min="1"
              value={formData.ordre}
              onChange={(e) => setFormData({ ...formData, ordre: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.ordre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1"
            />
            {errors.ordre && <p className="mt-1 text-sm text-red-600">{errors.ordre}</p>}
          </div>

          {/* État */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              État
            </label>
            <select
              value={formData.etat}
              onChange={(e) => setFormData({ ...formData, etat: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Statut <span className="text-red-500">*</span>
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
                    checked={formData.statue === s.value}
                    onChange={(e) => setFormData({ ...formData, statue: e.target.value })}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="flex items-center space-x-2">
                    <span>{s.icon}</span>
                    <span className={`font-medium ${s.color}`}>{s.label}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.statue && <p className="mt-1 text-sm text-red-600">{errors.statue}</p>}
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
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;
