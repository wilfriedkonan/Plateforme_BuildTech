import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { formaterPrix } from '../lib/mock/pos';

interface POSStatsProps {
  stats: {
    nombreVentes: number;
    ca: number;
    panierMoyen: number;
  };
}

const POSStats: React.FC<POSStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Ventes aujourd'hui</p>
            <p className="text-2xl font-bold text-gray-900">{stats.nombreVentes}</p>
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
            <p className="text-2xl font-bold text-gray-900">{formaterPrix(stats.ca)}</p>
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
            <p className="text-2xl font-bold text-gray-900">{formaterPrix(stats.panierMoyen)}</p>
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
