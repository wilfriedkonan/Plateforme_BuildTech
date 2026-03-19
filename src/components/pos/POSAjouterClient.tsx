import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { Client } from '../lib/mock/clients';


interface POSAjouterClientProps {
  onAjouter: (client: Omit<Client, 'id' | 'code' | 'createdAt'|'lastOrderDate'>) => void;
  onFermer: () => void;
}

const POSAjouterClient: React.FC<POSAjouterClientProps> = ({ onAjouter, onFermer }) => {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [type, setType] = useState<'Particulier' | 'Entreprise'>('Particulier');

  const handleAjouter = () => {
    if (!nom.trim() || !telephone.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onAjouter({
      nom: nom.trim(),
      telephone: telephone.trim(),
      type,
      statut: 'actif'
    });

    onFermer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && nom.trim() && telephone.trim()) {
      handleAjouter();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Nouveau client</h3>
          </div>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Jean Dupont"
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: 01 02 03 04 05"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('Particulier')}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                  type === 'Particulier'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Particulier
              </button>
              <button
                type="button"
                onClick={() => setType('Entreprise')}
                className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                  type === 'Entreprise'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Entreprise
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onFermer}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleAjouter}
            disabled={!nom.trim() || !telephone.trim()}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              nom.trim() && telephone.trim()
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSAjouterClient;
