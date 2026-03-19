import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { LigneCommande, formaterPrix } from '../lib/mock/pos';

interface POSRemiseLigneProps {
  ligne: LigneCommande;
  onAppliquer: (id: string, remise: number) => void;
  onFermer: () => void;
}

const POSRemiseLigne: React.FC<POSRemiseLigneProps> = ({ ligne, onAppliquer, onFermer }) => {
  const [remisePct, setRemisePct] = useState(String(ligne.remise));
  const [remiseEur, setRemiseEur] = useState('');

  const prixBase = ligne.prixUnitaire * ligne.quantite;

  useEffect(() => {
    const pct = parseFloat(remisePct) || 0;
    const eur = (prixBase * pct) / 100;
    setRemiseEur(eur.toFixed(2));
  }, [remisePct, prixBase]);

  const handleRemiseEurChange = (value: string) => {
    setRemiseEur(value);
    const eur = parseFloat(value) || 0;
    const pct = (eur / prixBase) * 100;
    setRemisePct(pct.toFixed(2));
  };

  const handleAppliquer = () => {
    const remise = parseFloat(remisePct) || 0;
    onAppliquer(ligne.produit.id, Math.max(0, Math.min(100, remise)));
  };

  const prixApresRemise = prixBase * (1 - (parseFloat(remisePct) || 0) / 100);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Remise sur — {ligne.produit.nom}
          </h3>
          <button
            onClick={onFermer}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Prix unitaire</p>
            <p className="text-lg font-bold text-gray-900">{formaterPrix(ligne.prixUnitaire)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Quantité</p>
            <p className="text-lg font-bold text-gray-900">{ligne.quantite}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Total avant remise</p>
            <p className="text-lg font-bold text-gray-900">{formaterPrix(prixBase)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remise (%)
              </label>
              <input
                type="number"
                value={remisePct}
                onChange={(e) => setRemisePct(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remise (€)
              </label>
              <input
                type="number"
                value={remiseEur}
                onChange={(e) => handleRemiseEurChange(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Prix après remise</p>
            <p className="text-2xl font-bold text-gray-900">{formaterPrix(prixApresRemise)}</p>
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
            onClick={handleAppliquer}
            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSRemiseLigne;
