import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, Plus, Minus, BarChart3, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStock } from '../../hooks/useStock';
import { useCategories } from '../../hooks/useCategories';
import { useMouvementStock } from '../../hooks/useMouvementStock';
import { StockFilters } from '../../services/stockService';
import { MouvementFilters } from '../../services/mouvementStockService';
import StockEntreeForm from './forms/StockEntreeForm';
import StockSortieForm from './forms/StockSortieForm';
import StockAjustementForm from './forms/StockAjustementForm';

interface StockManagerProps {
  onUpdateStock?: (articleId: string, newStock: number) => void;
}

type StockView = 'etat' | 'mouvements';

const StockManager: React.FC<StockManagerProps> = ({ onUpdateStock }) => {
  const { stocks, loading, error, pagination, totals, fetchStocks } = useStock();
  const { categories, fetchCategories } = useCategories();
  const { mouvements, loading: mouvementsLoading, error: mouvementsError, pagination: mouvementsPagination, totals: mouvementsTotals, fetchMouvements } = useMouvementStock();
  const [activeView, setActiveView] = useState<StockView>('etat');
  const [isEntreeFormOpen, setIsEntreeFormOpen] = useState(false);
  const [isSortieFormOpen, setIsSortieFormOpen] = useState(false);
  const [isAjustementFormOpen, setIsAjustementFormOpen] = useState(false);
  
  // Filtres stocks
  const [filters, setFilters] = useState<StockFilters>({
    page: 1,
    pageSize: 20,
    statutStock: undefined,
    designationCategorie: undefined,
    searchTerm: undefined,
    orderBy: 'designationArticle',
    orderDirection: 'asc',
  });
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Filtres mouvements
  const [mouvementFilters, setMouvementFilters] = useState<MouvementFilters>({
    page: 1,
    pageSize: 20,
    dateDebut: undefined,
    dateFin: undefined,
    typeMouvement: undefined,
    orderBy: 'dateMouvement',
    orderDirection: 'desc',
  });
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Charger les stocks et catégories au montage
  useEffect(() => {
    fetchStocks(filters);
    fetchCategories();
  }, [filters, fetchStocks, fetchCategories]);

  // Charger les mouvements quand les filtres changent
  useEffect(() => {
    fetchMouvements(mouvementFilters);
  }, [mouvementFilters, fetchMouvements]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      searchTerm: searchInput || undefined,
    }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      [key]: value || undefined,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleSaveEntree = (data: any) => {
    if (onUpdateStock) {
      onUpdateStock(data.articleId, data.stockApres);
    }
    fetchStocks(filters);
  };

  const handleSaveSortie = (data: any) => {
    if (onUpdateStock) {
      onUpdateStock(data.articleId, data.stockApres);
    }
    fetchStocks(filters);
  };

  const handleSaveAjustement = (data: any) => {
    if (onUpdateStock) {
      onUpdateStock(data.articleId, data.stockApres);
    }
    fetchStocks(filters);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'entree':
        return <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">🟢 Entrée</span>;
      case 'sortie':
        return <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">🟠 Sortie</span>;
      case 'ajustement':
        return <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">🔵 Ajustement</span>;
      case 'retour':
        return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">🔴 Retour</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 -mt-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('etat')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeView === 'etat'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>État du Stock</span>
          </button>
          <button
            onClick={() => setActiveView('mouvements')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeView === 'mouvements'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Mouvements</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setIsEntreeFormOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Entrée</span>
          </button>
          <button
            onClick={() => setIsSortieFormOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Sortie</span>
          </button>
          <button
            onClick={() => setIsAjustementFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Ajustement</span>
          </button>
        </div>
      </div>

      {activeView === 'etat' ? (
        <>
          {totals.totalEnRupture > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">{totals.totalEnRupture} article(s) en rupture de stock</p>
                  <p className="text-sm text-red-700">Action requise pour réapprovisionner ces articles</p>
                </div>
              </div>
            </div>
          )}

          {/* Filtres */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Nom article..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleFilterChange('designationCategorie', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.designation}>{cat.designation}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut Stock</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    handleFilterChange('statutStock', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="EN STOCK">En Stock</option>
                  <option value="STOCK FAIBLE">En Alerte</option>
                  <option value="RUPTURE">Rupture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tri</label>
                <select
                  value={filters.orderBy}
                  onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="designationArticle">Nom article</option>
                  <option value="designationCategorie">Catégorie</option>
                  <option value="stockActuel">Stock actuel</option>
                  <option value="tauxStock">Taux stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{totals.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">En Stock</p>
              <p className="text-2xl font-bold text-green-600">{totals.totalEnStock}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">En Alerte</p>
              <p className="text-2xl font-bold text-orange-600">{totals.totalEnAlerte}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">En Rupture</p>
              <p className="text-2xl font-bold text-red-600">{totals.totalEnRupture}</p>
            </div>
          </div>

          {/* Tableau */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État du Stock</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Chargement...</div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
            ) : (
              <>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Article</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock Actuel</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Seuil Alerte</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Taux Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {stocks.map((stock) => (
                          <tr key={stock.idArticle} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-900">{stock.designation}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{stock.designationCategorie}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-bold ${stock.statutStock === 'RUPTURE' ? 'text-red-600' : stock.statutStock === 'STOCK FAIBLE' ? 'text-orange-600' : 'text-green-600'}`}>
                                {stock.stockActuel}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-700">{stock.seuilStock}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-700">{stock.tauxStock.toFixed(1)}%</td>
                            <td className="px-4 py-3">
                              {stock.statutStock === 'RUPTURE' && (
                                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">🔴 Rupture</span>
                              )}
                              {stock.statutStock === 'STOCK FAIBLE' && (
                                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">🟡 Alerte</span>
                              )}
                              {stock.statutStock === 'EN STOCK' && (
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">🟢 Normal</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-1">
                                <button
                                  className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors"
                                  onClick={() => setIsEntreeFormOpen(true)}
                                  title="Entrée"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded transition-colors"
                                  onClick={() => setIsSortieFormOpen(true)}
                                  title="Sortie"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
                                  onClick={() => setIsAjustementFormOpen(true)}
                                  title="Ajustement"
                                >
                                  <Activity className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} sur {pagination.totalPages} | {pagination.totalRecords} articles
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevious}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Filtres mouvements */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Début</label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => {
                    setDateDebut(e.target.value);
                    setMouvementFilters(prev => ({
                      ...prev,
                      page: 1,
                      dateDebut: e.target.value || undefined,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Fin</label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => {
                    setDateFin(e.target.value);
                    setMouvementFilters(prev => ({
                      ...prev,
                      page: 1,
                      dateFin: e.target.value || undefined,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type Mouvement</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setMouvementFilters(prev => ({
                      ...prev,
                      page: 1,
                      typeMouvement: e.target.value || undefined,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Tous les types</option>
                  <option value="Entree">Entrée</option>
                  <option value="Sortie">Sortie</option>
                  <option value="Ajustement">Ajustement</option>
                  <option value="Retour">Retour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tri</label>
                <select
                  value={mouvementFilters.orderBy}
                  onChange={(e) => setMouvementFilters(prev => ({
                    ...prev,
                    page: 1,
                    orderBy: e.target.value,
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="dateMouvement">Date mouvement</option>
                  <option value="quantite">Quantité</option>
                  <option value="montant">Montant</option>
                  <option value="nomArticle">Nom article</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistiques mouvements */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Mouvements</p>
              <p className="text-2xl font-bold text-gray-900">{mouvementsTotals.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Entrées</p>
              <p className="text-2xl font-bold text-green-600">{mouvementsTotals.totalEntrees}</p>
              <p className="text-xs text-gray-500 mt-1">{mouvementsTotals.valeurEntrees.toLocaleString('fr-FR')} F</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Sorties</p>
              <p className="text-2xl font-bold text-orange-600">{mouvementsTotals.totalSorties}</p>
              <p className="text-xs text-gray-500 mt-1">{mouvementsTotals.valeurSorties.toLocaleString('fr-FR')} F</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Solde</p>
              <p className={`text-2xl font-bold ${mouvementsTotals.soldeQuantite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mouvementsTotals.soldeQuantite}
              </p>
              <p className="text-xs text-gray-500 mt-1">{mouvementsTotals.soldeValeur.toLocaleString('fr-FR')} F</p>
            </div>
          </div>

          {/* Tableau mouvements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mouvements de Stock</h3>
            {mouvementsLoading ? (
              <div className="text-center py-8 text-gray-500">Chargement...</div>
            ) : mouvementsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{mouvementsError}</div>
            ) : (
              <>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Article</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantité</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix Unitaire</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Référence</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commentaire</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {mouvements.map((mouvement) => (
                          <tr key={mouvement.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {new Date(mouvement.dateTransaction).toLocaleString('fr-FR')}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-900">{mouvement.nomArticle}</span>
                            </td>
                            <td className="px-4 py-3">
                              {mouvement.typeMouvement === 'Entree' && (
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">🟢 Entrée</span>
                              )}
                              {mouvement.typeMouvement === 'Sortie' && (
                                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">🟠 Sortie</span>
                              )}
                              {mouvement.typeMouvement === 'Ajustement' && (
                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">🔵 Ajustement</span>
                              )}
                              {mouvement.typeMouvement === 'Retour' && (
                                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">🔴 Retour</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-bold ${mouvement.typeMouvement === 'Entree' || mouvement.typeMouvement === 'Retour' ? 'text-green-600' : 'text-orange-600'}`}>
                                {mouvement.typeMouvement === 'Entree' || mouvement.typeMouvement === 'Retour' ? '+' : '-'}{mouvement.quantite}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-700">
                              {mouvement.prixUnitaire.toLocaleString('fr-FR')} F
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                              {mouvement.montant.toLocaleString('fr-FR')} F
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{mouvement.reference}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{mouvement.commentaire}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {mouvementsPagination.currentPage} sur {mouvementsPagination.totalPages} | {mouvementsPagination.totalRecords} mouvements
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMouvementFilters(prev => ({
                        ...prev,
                        page: prev.page ? prev.page - 1 : 1,
                      }))}
                      disabled={!mouvementsPagination.hasPrevious}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setMouvementFilters(prev => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))}
                      disabled={!mouvementsPagination.hasNext}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <StockEntreeForm
        isOpen={isEntreeFormOpen}
        onClose={() => setIsEntreeFormOpen(false)}
        onSave={handleSaveEntree}
        stck={stocks}
      />

      <StockSortieForm
        isOpen={isSortieFormOpen}
        onClose={() => setIsSortieFormOpen(false)}
        onSave={handleSaveSortie}
        stck={stocks}
      />

      <StockAjustementForm
        isOpen={isAjustementFormOpen}
        onClose={() => setIsAjustementFormOpen(false)}
        onSave={handleSaveAjustement}
      />
    </div>
  );
};

export default StockManager;
