import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Fournisseur, CreateFournisseurRequest } from '../../../services/fournisseurService';

interface FournisseurFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateFournisseurRequest) => Promise<void>;
  fournisseur?: Fournisseur | null;
}

interface FormErrors {
  code?: string;
  nom?: string;
  contact?: string;
  email?: string;
  specialite?: string;
  nrc?: string;
  adresse?: string;
}

const SPECIALITES = ['Alimentaire', 'Matériaux', 'Informatique', 'Logistique', 'Fournitures', 'Autre'];

export default function FournisseurForm({
  isOpen,
  onClose,
  onSave,
  fournisseur
}: FournisseurFormProps) {
  const isEdit = !!fournisseur;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateFournisseurRequest>({
    request: 'create',
    code: '',
    nom: '',
    contact: '',
    email: '',
    specialite: '',
    nrc: '',
    adresse: '',
    statut: true,
  });

  useEffect(() => {
    if (fournisseur) {
      setForm({
        request: 'update',
        code: fournisseur.code,
        nom: fournisseur.nom,
        contact: fournisseur.contact,
        email: fournisseur.email || '',
        specialite: fournisseur.specialite,
        nrc: fournisseur.nrc || '',
        adresse: fournisseur.adresse || '',
        statut: fournisseur.statut === 1 ? true : false,
      });
    } else {
      setForm({
        request: 'create',
        code: `FR${Date.now().toString().slice(-6)}`,
        nom: '',
        contact: '',
        email: '',
        specialite: '',
        nrc: '',
        adresse: '',
        statut: true,
      });
    }
    setErrors({});
    setSubmitError(null);
  }, [fournisseur, isOpen]);

  const handleChange = (field: keyof CreateFournisseurRequest, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!form.code?.trim()) {
      newErrors.code = 'Le code est obligatoire.';
    }
    if (!form.nom?.trim() || form.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères.';
    }
    if (!form.contact?.trim()) {
      newErrors.contact = 'Le téléphone est obligatoire.';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Adresse email invalide.';
    }
    if (!form.specialite?.trim()) {
      newErrors.specialite = 'Veuillez sélectionner une spécialité.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setSubmitError(null);
    
    try {
      await onSave(form);
      onClose();
    } catch (error: any) {
      setSubmitError(error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? `Modifier le Fournisseur - ${fournisseur?.code}` : 'Nouveau Fournisseur'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {submitError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Erreur</p>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Ex : FR250002"
                disabled={isEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                } ${isEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Ex : BTP Services SARL"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité *</label>
              <select
                value={form.specialite}
                onChange={(e) => handleChange('specialite', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.specialite ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une spécialité</option>
                {SPECIALITES.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.specialite && <p className="text-red-500 text-xs mt-1">{errors.specialite}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                type="tel"
                value={form.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="Ex : 05 06 07 08 09"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Ex : contact@btp-services.ci"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NRC</label>
              <input
                type="text"
                value={form.nrc}
                onChange={(e) => handleChange('nrc', e.target.value)}
                placeholder="Ex : NCC 012358468JR"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={form.adresse}
              onChange={(e) => handleChange('adresse', e.target.value)}
              placeholder="Ex : Zone Industrielle de Vridi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={form.statut ? 'actif' : 'inactif'}
              onChange={(e) => handleChange('statut', e.target.value === 'actif')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            <span>{isEdit ? 'Modifier' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
