import React, { useState, useMemo } from 'react';
import { Search, User, Plus, X } from 'lucide-react';
import { Client } from '../lib/mock/clients';

interface POSClientSelectorProps {
  clients: Client[];
  clientSelectionne: Client | null;
  onSelectionner: (client: Client | null) => void;
  onAjouterClient: () => void;
}

const POSClientSelector: React.FC<POSClientSelectorProps> = ({
  clients,
  clientSelectionne,
  onSelectionner,
  onAjouterClient
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [recherche, setRecherche] = useState('');

  const clientsFiltres = useMemo(() => {
    if (!recherche) return clients.filter(c => c.statut === 'actif');

    const term = recherche.toLowerCase();
    return clients.filter(c =>
      c.statut === 'actif' && (
        c.nom.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        c.telephone.includes(term)
      )
    );
  }, [clients, recherche]);

  const handleSelectionner = (client: Client) => {
    onSelectionner(client);
    setShowDropdown(false);
    setRecherche('');
  };

  const handleRetirer = () => {
    onSelectionner(null);
  };

  return (
    <div className="relative">
      {!clientSelectionne ? (
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-all text-left text-sm text-gray-600"
        >
          <User className="w-4 h-4" />
          <span>Sélectionner un client</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg">
          <User className="w-4 h-4" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{clientSelectionne.nom}</p>
            <p className="text-xs text-gray-300">{clientSelectionne.code}</p>
          </div>
          <button
            onClick={handleRetirer}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setShowDropdown(false);
              setRecherche('');
            }}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 z-20 max-h-96 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-gray-100">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher par nom, code ou téléphone..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onAjouterClient();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau client</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {clientsFiltres.length === 0 ? (
                <div className="p-6 text-center">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Aucun client trouvé</p>
                </div>
              ) : (
                <div className="p-2">
                  {clientsFiltres.map(client => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectionner(client)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {client.nom}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{client.code}</span>
                          <span>•</span>
                          <span>{client.telephone}</span>
                        </div>
                      </div>
                      {client.type === 'Entreprise' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Entreprise
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default POSClientSelector;
