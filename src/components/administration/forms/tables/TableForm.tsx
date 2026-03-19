import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  table?: any;
  onSave: (table: any) => void;
}

const TableForm: React.FC<TableFormProps> = ({ isOpen, onClose, table, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    capacite: '',
    zone: '',
    zoneAutre: '',
    description: '',
    statut: 'disponible',
    actif: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (table) {
      setFormData({
        code: table.code,
        nom: table.nom,
        capacite: table.capacite.toString(),
        zone: table.zone,
        zoneAutre: table.zoneAutre || '',
        description: table.description || '',
        statut: table.statut || 'disponible',
        actif: table.actif !== false
      });
    } else {
      const newCode = `TBL${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, code: newCode }));
    }
  }, [table]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom || formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    if (!formData.capacite || parseInt(formData.capacite) < 1 || parseInt(formData.capacite) > 50) {
      newErrors.capacite = 'La capacité doit être entre 1 et 50 personnes';
    }
    if (!formData.zone) {
      newErrors.zone = 'La zone est obligatoire';
    }
    if (formData.zone === 'Autre' && !formData.zoneAutre) {
      newErrors.zoneAutre = 'Précisez la zone';
    }
    if (!formData.statut) {
      newErrors.statut = 'Le statut est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const tableData = {
        ...formData,
        capacite: parseInt(formData.capacite),
        zone: formData.zone === 'Autre' ? formData.zoneAutre : formData.zone
      };
      onSave(tableData);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {table ? 'Modifier la Table' : 'Nouvelle Table'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Code
            </label>
            <input
              type="text"
              value={formData.code}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la table <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Table 1, Table Terrasse..."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Capacité (personnes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.capacite}
              onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.capacite ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="4"
            />
            <p className="mt-1 text-xs text-gray-500">Min: 1 — Max: 50</p>
            {errors.capacite && <p className="mt-1 text-sm text-red-600">{errors.capacite}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Zone / Salle <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                errors.zone ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner...</option>
              <option value="Salle principale">Salle principale</option>
              <option value="Terrasse">Terrasse</option>
              <option value="Salon privé">Salon privé</option>
              <option value="Bar">Bar</option>
              <option value="Autre">Autre</option>
            </select>
            {errors.zone && <p className="mt-1 text-sm text-red-600">{errors.zone}</p>}
          </div>

          {formData.zone === 'Autre' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Précisez la zone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.zoneAutre}
                onChange={(e) => setFormData({ ...formData, zoneAutre: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.zoneAutre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Jardin, Mezzanine..."
              />
              {errors.zoneAutre && <p className="mt-1 text-sm text-red-600">{errors.zoneAutre}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Notes additionnelles..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Statut <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="disponible"
                  checked={formData.statut === 'disponible'}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span className="text-green-600 font-bold">🟢</span>
                  <span className="font-medium text-gray-700">Disponible</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="occupee"
                  checked={formData.statut === 'occupee'}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span className="text-red-600 font-bold">🔴</span>
                  <span className="font-medium text-gray-700">Occupée</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="reservee"
                  checked={formData.statut === 'reservee'}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span className="text-orange-600 font-bold">🟡</span>
                  <span className="font-medium text-gray-700">Réservée</span>
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="statut"
                  value="hors_service"
                  checked={formData.statut === 'hors_service'}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex items-center space-x-2">
                  <span className="text-gray-600 font-bold">⬜</span>
                  <span className="font-medium text-gray-700">Hors service</span>
                </span>
              </label>
            </div>
            {errors.statut && <p className="mt-1 text-sm text-red-600">{errors.statut}</p>}
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="actif"
              checked={formData.actif}
              onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
              className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor="actif" className="font-medium text-gray-700 cursor-pointer">
              Table active
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
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
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;
