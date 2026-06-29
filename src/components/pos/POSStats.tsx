import React, { useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Loader2 } from 'lucide-react';
import { usePosFactures } from '../../hooks/usePosFactures';

const POSStats: React.FC = () => {
  const { statistiquesJour, loading, fetchStatistiquesJour } = usePosFactures();

  useEffect(() => {
    fetchStatistiquesJour();
  }, [fetchStatistiquesJour]);

  const fmt = (value: number) =>
    value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  const monnaie =  'F';

  if (loading && !statistiquesJour) {
    return (
      <div className="flex items-center justify-center h-14 gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Chargement des statistiques...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Ventes aujourd'hui</p>
            <p className="text-2xl font-bold text-gray-900">
              {statistiquesJour?.nombreVentes ?? 0}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">CA aujourd'hui</p>
            <p className="text-2xl font-bold text-gray-900">
              {(statistiquesJour?.chiffreAffaires ?? 0).toLocaleString('FR-fr')} {monnaie}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Panier moyen</p>
            <p className="text-2xl font-bold text-gray-900">
              {fmt(statistiquesJour?.panierMoyen ?? 0)} {monnaie}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSStats;
