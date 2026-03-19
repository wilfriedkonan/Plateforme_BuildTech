import React, { useState } from 'react';
import { Save, AlertCircle, Users } from 'lucide-react';
import { mockCrmConfig } from '../../lib/mock/crmConfig';
import { mockClients } from '../../lib/mock/clients';

const ParametresActivite: React.FC = () => {
  const [config, setConfig] = useState(mockCrmConfig);

  const convertToJours = (valeur: number, unite: string): number => {
    switch (unite) {
      case 'semaines': return valeur * 7;
      case 'mois': return valeur * 30;
      default: return valeur;
    }
  };

  const calculateClientsARisque = () => {
    const joursARisque = convertToJours(config.delaiARisque.valeur, config.delaiARisque.unite);
    const joursInactif = convertToJours(config.delaiInactif.valeur, config.delaiInactif.unite);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - joursARisque);

    return mockClients.filter(client => {
      const lastOrder = new Date(client.lastOrderDate);
      const joursDepuis = Math.floor((new Date().getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
      return joursDepuis >= joursARisque && joursDepuis < joursInactif;
    }).length;
  };

  const calculateClientsInactifs = () => {
    const joursInactif = convertToJours(config.delaiInactif.valeur, config.delaiInactif.unite);
    const joursPerdu = convertToJours(config.delaiPerdu.valeur, config.delaiPerdu.unite);

    return mockClients.filter(client => {
      const lastOrder = new Date(client.lastOrderDate);
      const joursDepuis = Math.floor((new Date().getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
      return joursDepuis >= joursInactif && joursDepuis < joursPerdu;
    }).length;
  };

  const calculateClientsPerdus = () => {
    const joursPerdu = convertToJours(config.delaiPerdu.valeur, config.delaiPerdu.unite);

    return mockClients.filter(client => {
      const lastOrder = new Date(client.lastOrderDate);
      const joursDepuis = Math.floor((new Date().getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
      return joursDepuis >= joursPerdu;
    }).length;
  };

  const handleSave = () => {
    alert('Configuration enregistrée avec succès !');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Seuils d'inactivité client</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai client "À risque"
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={config.delaiARisque.valeur}
                onChange={(e) => setConfig({
                  ...config,
                  delaiARisque: { ...config.delaiARisque, valeur: parseInt(e.target.value) || 0 }
                })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="1"
              />
              <select
                value={config.delaiARisque.unite}
                onChange={(e) => setConfig({
                  ...config,
                  delaiARisque: { ...config.delaiARisque, unite: e.target.value as any }
                })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="jours">jours</option>
                <option value="semaines">semaines</option>
                <option value="mois">mois</option>
              </select>
              <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                À risque
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Un client sans achat depuis {config.delaiARisque.valeur} {config.delaiARisque.unite} est considéré À risque
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai client "Inactif"
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={config.delaiInactif.valeur}
                onChange={(e) => setConfig({
                  ...config,
                  delaiInactif: { ...config.delaiInactif, valeur: parseInt(e.target.value) || 0 }
                })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="1"
              />
              <select
                value={config.delaiInactif.unite}
                onChange={(e) => setConfig({
                  ...config,
                  delaiInactif: { ...config.delaiInactif, unite: e.target.value as any }
                })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="jours">jours</option>
                <option value="semaines">semaines</option>
                <option value="mois">mois</option>
              </select>
              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                Inactif
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Un client sans achat depuis {config.delaiInactif.valeur} {config.delaiInactif.unite} est considéré Inactif
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai client "Perdu"
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={config.delaiPerdu.valeur}
                onChange={(e) => setConfig({
                  ...config,
                  delaiPerdu: { ...config.delaiPerdu, valeur: parseInt(e.target.value) || 0 }
                })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="1"
              />
              <select
                value={config.delaiPerdu.unite}
                onChange={(e) => setConfig({
                  ...config,
                  delaiPerdu: { ...config.delaiPerdu, unite: e.target.value as any }
                })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="jours">jours</option>
                <option value="semaines">semaines</option>
                <option value="mois">mois</option>
              </select>
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                Perdu
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Un client sans achat depuis {config.delaiPerdu.valeur} {config.delaiPerdu.unite} est considéré Perdu
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">
                Activer les alertes automatiques
              </label>
              <button
                onClick={() => setConfig({ ...config, alertesActives: !config.alertesActives })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.alertesActives ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.alertesActives ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence de vérification
              </label>
              <select
                value={config.frequenceVerification}
                onChange={(e) => setConfig({
                  ...config,
                  frequenceVerification: e.target.value as any
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="quotidienne">Quotidienne</option>
                <option value="hebdomadaire">Hebdomadaire</option>
                <option value="mensuelle">Mensuelle</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Enregistrer la configuration</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de l'impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-900">{calculateClientsARisque()}</span>
            </div>
            <p className="text-sm text-orange-700 mb-3">Clients "À risque"</p>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Voir la liste →
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-red-900">{calculateClientsInactifs()}</span>
            </div>
            <p className="text-sm text-red-700 mb-3">Clients "Inactifs"</p>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              Voir la liste →
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-gray-600" />
              <span className="text-2xl font-bold text-gray-900">{calculateClientsPerdus()}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">Clients "Perdus"</p>
            <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
              Voir la liste →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresActivite;
