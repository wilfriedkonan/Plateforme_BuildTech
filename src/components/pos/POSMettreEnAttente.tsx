import React, { useState } from 'react';
import { X } from 'lucide-react';

interface POSMettreEnAttenteProps {
  onConfirmer: (nom: string) => void;
  onFermer: () => void;
}

const POSMettreEnAttente: React.FC<POSMettreEnAttenteProps> = ({ onConfirmer, onFermer }) => {
  const [nom, setNom] = useState('');

  const handleConfirmer = () => {
    if (nom.trim()) {
      onConfirmer(nom.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && nom.trim()) {
      handleConfirmer();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Nommer cette commande</h3>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: Table 3, Client Kouassi..."
            autoFocus
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-2">
            Donnez un nom à cette commande pour la retrouver facilement
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onFermer}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirmer}
            disabled={!nom.trim()}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              nom.trim()
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Mettre en attente
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSMettreEnAttente;
