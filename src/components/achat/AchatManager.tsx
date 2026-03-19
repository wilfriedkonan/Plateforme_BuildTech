import React, { useState, useEffect } from 'react';
import { Users, FileText, Search, Eye, CreditCard as Edit2, Trash2, CheckCircle } from 'lucide-react';
import { useFournisseur } from '../../hooks/useFournisseur';
import { FournisseurFilters, Fournisseur as FournisseurAPI } from '../../services/fournisseurService';
import {
  mockFacturesAchat,
  FactureAchat,
  formatMontant,
  getFournisseurById
} from '../lib/mock/achats';
import {
  BadgeActif,
  BadgeInactif,
  BadgePayee,
  BadgeEnAttente,
  BadgeEnRetard,
  BadgeCode,
  BadgeSpecialite,
  BtnEdit,
  BtnDelete,
  BtnView,
  StatCard,
  Avatar
} from '../ui/shared';
import FournisseurForm from './forms/FournisseurForm';
import { FournisseurDeleteModal, FournisseurFicheModal } from './forms/FournisseurDeleteModal';
import FactureAchatForm from './forms/FactureAchatForm';
import {
  FactureDeleteModal,
  FactureDetailModal,
  FactureMarquerPayeeModal
} from './forms/FactureModals';

type AchatTab = 'fournisseurs' | 'factures';

const AchatManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AchatTab>('fournisseurs');
  const { fournisseurs, totals, fetchFournisseurs, createFournisseur, updateFournisseur, deleteFournisseur } = useFournisseur();
  const [factures, setFactures] = useState(mockFacturesAchat);

  const [searchFournisseur, setSearchFournisseur] = useState('');
  const [searchFacture, setSearchFacture] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [filters] = useState<FournisseurFilters>({
    page: 1,
    pageSize: 20,
    searchTerm: undefined,
    orderBy: 'nom',
    orderDirection: 'asc',
  });

  const [showFournisseurForm, setShowFournisseurForm] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState<FournisseurAPI | null>(null);
  const [deletingFournisseur, setDeletingFournisseur] = useState<FournisseurAPI | null>(null);
  const [viewingFournisseur, setViewingFournisseur] = useState<FournisseurAPI | null>(null);

  const [showFactureForm, setShowFactureForm] = useState(false);
  const [editingFacture, setEditingFacture] = useState<FactureAchat | null>(null);
  const [deletingFacture, setDeletingFacture] = useState<FactureAchat | null>(null);
  const [viewingFacture, setViewingFacture] = useState<FactureAchat | null>(null);
  const [markingPaidFacture, setMarkingPaidFacture] = useState<FactureAchat | null>(null);

  // Charger les fournisseurs au montage et quand les filtres changent
  useEffect(() => {
    fetchFournisseurs(filters);
  }, [filters, fetchFournisseurs]);

  const handleSaveFournisseur = async (data: any) => {
    try {
      if (editingFournisseur) {
        await updateFournisseur(editingFournisseur.id, data);
      } else {
        await createFournisseur(data);
      }
      await fetchFournisseurs(filters);
      setShowFournisseurForm(false);
      setEditingFournisseur(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDeleteFournisseur = async (id: string) => {
    try {
      await deleteFournisseur(id);
      await fetchFournisseurs(filters);
      setDeletingFournisseur(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSaveFacture = (data: Partial<FactureAchat>) => {
    if (editingFacture) {
      setFactures(factures.map(f =>
        f.id === editingFacture.id ? { ...f, ...data } : f
      ));
    } else {
      const newFacture: FactureAchat = {
        id: `FA${Date.now()}`,
        numero: `FA${250000 + factures.length + 1}`,
        date: data.date!,
        dateEcheance: data.dateEcheance,
        fournisseurId: data.fournisseurId!,
        designation: data.designation!,
        montantHT: data.montantHT!,
        tva: data.tva!,
        montantTTC: data.montantTTC!,
        statut: data.statut!,
        reference: data.reference,
        notes: data.notes,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setFactures([...factures, newFacture]);
    }
    setShowFactureForm(false);
    setEditingFacture(null);
  };

  const handleDeleteFacture = (id: string) => {
    setFactures(factures.filter(f => f.id !== id));
    setDeletingFacture(null);
  };

  const handleMarkPaid = (id: string, datePaiement?: string) => {
    setFactures(factures.map(f =>
      f.id === id ? { ...f, statut: 'payee' as const } : f
    ));
    setMarkingPaidFacture(null);
  };

  // Filtrer les fournisseurs localement pour la recherche
  const fournisseursFiltres = fournisseurs.filter(f =>
    f.nom.toLowerCase().includes(searchFournisseur.toLowerCase()) ||
    f.code.toLowerCase().includes(searchFournisseur.toLowerCase()) ||
    f.specialite.toLowerCase().includes(searchFournisseur.toLowerCase())
  );

  const facturesFiltrees = factures.filter(f => {
    const matchSearch = f.numero.toLowerCase().includes(searchFacture.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchFacture.toLowerCase()) ||
      getFournisseurById(f.fournisseurId)?.nom.toLowerCase().includes(searchFacture.toLowerCase());
    const matchStatut = filterStatut === 'tous' || f.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const statsFactures = {
    totalTTC: factures.reduce((sum, f) => sum + f.montantTTC, 0),
    payees: factures.filter(f => f.statut === 'payee').length,
    enRetard: factures.filter(f => f.statut === 'en_retard').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('fournisseurs')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'fournisseurs'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Fournisseurs</span>
        </button>
        <button
          onClick={() => setActiveTab('factures')}
          className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all border-b-2 ${
            activeTab === 'factures'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Factures d'achat</span>
        </button>
      </div>

      {activeTab === 'fournisseurs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <StatCard icon="🏢" label="Fournisseurs" value={totals.total} color="teal" />
              <StatCard icon="✓" label="Actifs" value={totals.totalActifs} color="green" />
            </div>
            <button
              onClick={() => {
                setEditingFournisseur(null);
                setShowFournisseurForm(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              + Nouveau Fournisseur
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                value={searchFournisseur}
                onChange={e => setSearchFournisseur(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none text-sm"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fournisseur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Spécialité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {fournisseursFiltres.map(fournisseur => (
                  <tr key={fournisseur.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <BadgeCode>{fournisseur.code}</BadgeCode>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={fournisseur.nom} size="md" />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{fournisseur.nom}</p>
                          <p className="text-xs text-gray-500">{fournisseur.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{fournisseur.contact}</td>
                    <td className="px-4 py-3">
                      <BadgeSpecialite label={fournisseur.specialite} />
                    </td>
                    <td className="px-4 py-3">
                      { fournisseur.statut === 1
                        ? <BadgeActif>Actif</BadgeActif>
                        : <BadgeInactif>Inactif</BadgeInactif>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <BtnView onClick={() => setViewingFournisseur(fournisseur)} title="Voir fiche">
                          <Eye className="w-4 h-4" />
                        </BtnView>
                        <BtnEdit onClick={() => {
                          setEditingFournisseur(fournisseur);
                          setShowFournisseurForm(true);
                        }} title="Modifier">
                          <Edit2 className="w-4 h-4" />
                        </BtnEdit>
                        <BtnDelete onClick={() => setDeletingFournisseur(fournisseur)} title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </BtnDelete>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'factures' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <StatCard icon="💰" label="Total TTC" value={formatMontant(statsFactures.totalTTC)} color="teal" />
              <StatCard icon="✓" label="Payées" value={statsFactures.payees} color="green" />
              <StatCard icon="⚠" label="En retard" value={statsFactures.enRetard} color="red" />
            </div>
            <button
              onClick={() => {
                setEditingFacture(null);
                setShowFactureForm(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              + Nouvelle Facture
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une facture..."
                value={searchFacture}
                onChange={e => setSearchFacture(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none text-sm"
              />
            </div>
            <select
              value={filterStatut}
              onChange={e => setFilterStatut(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none text-sm"
            >
              <option value="tous">Tous les statuts</option>
              <option value="payee">Payée</option>
              <option value="en_attente">En attente</option>
              <option value="en_retard">En retard</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">N° Facture</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fournisseur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Désignation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Montant TTC</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {facturesFiltrees.map(facture => {
                  const fournisseur = getFournisseurById(facture.fournisseurId);
                  return (
                    <tr key={facture.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <BadgeCode>{facture.numero}</BadgeCode>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {fournisseur?.nom || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {facture.designation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{facture.date}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">
                        {formatMontant(facture.montantTTC)}
                      </td>
                      <td className="px-4 py-3">
                        {facture.statut === 'payee' && <BadgePayee>Payée</BadgePayee>}
                        {facture.statut === 'en_attente' && <BadgeEnAttente>En attente</BadgeEnAttente>}
                        {facture.statut === 'en_retard' && <BadgeEnRetard>En retard</BadgeEnRetard>}
                        {facture.statut === 'annulee' && <BadgeInactif>Annulée</BadgeInactif>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {facture.statut !== 'payee' && (
                            <button
                              onClick={() => setMarkingPaidFacture(facture)}
                              className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                              title="Marquer comme payée"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <BtnView onClick={() => setViewingFacture(facture)} title="Voir détails">
                            <Eye className="w-4 h-4" />
                          </BtnView>
                          <BtnEdit onClick={() => {
                            setEditingFacture(facture);
                            setShowFactureForm(true);
                          }} title="Modifier">
                            <Edit2 className="w-4 h-4" />
                          </BtnEdit>
                          <BtnDelete onClick={() => setDeletingFacture(facture)} title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </BtnDelete>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FournisseurForm
        isOpen={showFournisseurForm}
        onClose={() => {
          setShowFournisseurForm(false);
          setEditingFournisseur(null);
        }}
        onSave={handleSaveFournisseur}
        fournisseur={editingFournisseur}
      />

      <FournisseurDeleteModal
        isOpen={!!deletingFournisseur}
        onClose={() => setDeletingFournisseur(null)}
        onConfirm={handleDeleteFournisseur}
        fournisseur={deletingFournisseur as any}
      />

      <FournisseurFicheModal
        isOpen={!!viewingFournisseur}
        onClose={() => setViewingFournisseur(null)}
        onEdit={() => {
          setEditingFournisseur(viewingFournisseur);
          setShowFournisseurForm(true);
        }}
        fournisseur={viewingFournisseur as any}
      />

      <FactureAchatForm
        isOpen={showFactureForm}
        onClose={() => {
          setShowFactureForm(false);
          setEditingFacture(null);
        }}
        onSave={handleSaveFacture}
        facture={editingFacture}
      />

      <FactureDeleteModal
        isOpen={!!deletingFacture}
        onClose={() => setDeletingFacture(null)}
        onConfirm={handleDeleteFacture}
        facture={deletingFacture}
      />

      <FactureDetailModal
        isOpen={!!viewingFacture}
        onClose={() => setViewingFacture(null)}
        onEdit={() => {
          setEditingFacture(viewingFacture);
          setShowFactureForm(true);
        }}
        onMarkPaid={handleMarkPaid}
        facture={viewingFacture}
      />

      <FactureMarquerPayeeModal
        isOpen={!!markingPaidFacture}
        onClose={() => setMarkingPaidFacture(null)}
        onConfirm={handleMarkPaid}
        facture={markingPaidFacture}
      />
    </div>
  );
};

export default AchatManager;
