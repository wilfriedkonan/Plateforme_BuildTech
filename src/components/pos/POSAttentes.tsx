import React, { useState } from 'react';
import { X, Clock, RefreshCw, Loader2, AlertCircle, Smartphone, MapPin, ExternalLink, ShoppingCart } from 'lucide-react';
import { PosFacture } from '../../services/posService';
import { usePosFactures } from '../../hooks/usePosFactures';
import { CommandeDto, DetailCommandeDto, EtatCommande, fetchCommandeDetail, putCommandeEtat } from '../../lib/commandeAdminApi';

interface POSAttentesProps {
  attentes: PosFacture[];
  loading?: boolean;
  onReprendre: (facture: PosFacture) => void;
  onFermer: () => void;
  onRefresh: () => void;
  commandesEnLigne?: CommandeDto[];
  loadingEnLigne?: boolean;
  onRefreshEnLigne?: () => void;
  onTraiterEnLigne?: (commande: CommandeDto, lignes: DetailCommandeDto[]) => void;
}

const ETAT_CFG: Record<EtatCommande, { label: string; bg: string; text: string }> = {
  EnAttente:     { label: 'En attente',   bg: 'bg-orange-100', text: 'text-orange-700' },
  Confirmee:     { label: 'Confirmée',    bg: 'bg-blue-100',   text: 'text-blue-700'   },
  EnPreparation: { label: 'En prépa.',    bg: 'bg-indigo-100', text: 'text-indigo-700' },
  Prete:         { label: 'Prête',        bg: 'bg-teal-100',   text: 'text-teal-700'   },
  EnLivraison:   { label: 'En livraison', bg: 'bg-amber-100',  text: 'text-amber-700'  },
  Livree:        { label: 'Livrée',       bg: 'bg-green-100',  text: 'text-green-700'  },
  Annulee:       { label: 'Annulée',      bg: 'bg-red-100',    text: 'text-red-600'    },
  Terminee:      { label: 'Terminée',     bg: 'bg-green-100',  text: 'text-green-700'  },
};

const POSAttentes: React.FC<POSAttentesProps> = ({
  attentes,
  loading,
  onReprendre,
  onFermer,
  onRefresh,
  commandesEnLigne = [],
  loadingEnLigne,
  onRefreshEnLigne,
  onTraiterEnLigne,
}) => {
  const { cancelFacture } = usePosFactures();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError]   = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<'caisse' | 'enligne'>('caisse');
  const [traitingId, setTraitingId]     = useState<string | null>(null);
  const [traitError, setTraitError]     = useState<string | null>(null);
  const [annulantId, setAnnulantId]     = useState<string | null>(null);

  // Masquer les commandes terminées ou annulées
  const commandesVisibles = commandesEnLigne.filter(
    c => c.etat !== 'Annulee' && c.etat !== 'Terminee'
  );

  const handleAnnulerCaisse = async (id: string) => {
    if (!window.confirm('Annuler cette commande en attente ?')) return;
    setCancellingId(id);
    setCancelError(null);
    try {
      await cancelFacture(id, { motif: 'Annulation caisse' });
      onRefresh();
    } catch (err: any) {
      setCancelError(err?.response?.data?.message || err?.message || "Erreur lors de l'annulation");
    } finally {
      setCancellingId(null);
    }
  };

  const handleTraiter = async (commande: CommandeDto) => {
    setTraitingId(commande.id);
    setTraitError(null);
    const detail = await fetchCommandeDetail(commande.id);
    setTraitingId(null);
    if (!detail) { setTraitError('Impossible de charger les détails.'); return; }
    onTraiterEnLigne?.(commande, detail.lignes);
    onFermer();
  };

  const handleAnnulerEnLigne = async (commande: CommandeDto) => {
    if (!window.confirm('Annuler cette commande en ligne ?')) return;
    setAnnulantId(commande.id);
    const ok = await putCommandeEtat(commande.id, 'Annulee');
    setAnnulantId(null);
    if (ok) onRefreshEnLigne?.();
    else setTraitError("Impossible d'annuler la commande.");
  };

  const formatHeure = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

  const getResume = (details?: PosFacture['details']) => {
    if (!details || details.length === 0) return 'Aucun article';
    const items = details.slice(0, 2).map(d => `${d.designation} × ${d.quantite ?? 1}`);
    const plus = details.length > 2 ? ` + ${details.length - 2} autre(s)` : '';
    return items.join(' + ') + plus;
  };

  const isLoadingActive = activeTab === 'caisse' ? loading : loadingEnLigne;
  const onRefreshActive = activeTab === 'caisse' ? onRefresh : onRefreshEnLigne;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onFermer} />

      <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">En attente</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRefreshActive} disabled={isLoadingActive} title="Actualiser"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${isLoadingActive ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onFermer} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4">
          {(['caisse', 'enligne'] as const).map(tab => {
            const count = tab === 'caisse' ? attentes.length : commandesVisibles.length;
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab === 'caisse' ? 'Caisse' : 'En ligne'}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    active ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                  }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">

          {(cancelError || traitError) && (
            <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cancelError || traitError}</span>
              <button onClick={() => { setCancelError(null); setTraitError(null); }} className="ml-auto text-red-400 hover:text-red-600">✕</button>
            </div>
          )}

          {/* ── Caisse ── */}
          {activeTab === 'caisse' && (
            loading ? (
              <div className="flex items-center justify-center h-full gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" /><span>Chargement...</span>
              </div>
            ) : attentes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Clock className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-1">Aucune commande en attente</p>
                <p className="text-gray-400 text-sm">Les commandes mises en attente apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attentes.map(facture => {
                  const nom = facture.designation || facture.numeroFacture || 'Sans nom';
                  const total = facture.total_final ?? facture.montant ?? 0;
                  const totalArticles = (facture.details || []).reduce((s, d) => s + (d.quantite ?? 1), 0);
                  return (
                    <div key={facture.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{nom.toLowerCase().includes('table') ? '📋' : '👤'}</span>
                          <div>
                            <h4 className="font-bold text-gray-900">{nom}</h4>
                            <p className="text-xs text-gray-500">{formatHeure(facture.dateCreation)}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold">En attente</span>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 line-clamp-1">{getResume(facture.details)}</p>
                        <p className="text-xs text-gray-500 mt-1">{totalArticles} article(s)</p>
                      </div>
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-lg font-bold text-gray-900">{total.toLocaleString('fr-FR')} F</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => onReprendre(facture)}
                          className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
                          Reprendre
                        </button>
                        <button onClick={() => facture.id && handleAnnulerCaisse(facture.id)}
                          disabled={cancellingId === facture.id}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-1.5">
                          {cancellingId === facture.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          Annuler
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── En ligne ── */}
          {activeTab === 'enligne' && (
            loadingEnLigne && commandesVisibles.length === 0 ? (
              <div className="flex items-center justify-center h-full gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" /><span>Chargement...</span>
              </div>
            ) : commandesVisibles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Smartphone className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-1">Aucune commande en ligne</p>
                <p className="text-gray-400 text-sm">Les commandes WhatsApp apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {commandesVisibles.map(commande => {
                  const cfg = ETAT_CFG[commande.etat] ?? ETAT_CFG.EnAttente;
                  const hasGps = commande.livraisonLat != null && commande.livraisonLng != null;
                  const mapsUrl = hasGps
                    ? `https://www.google.com/maps?q=${commande.livraisonLat},${commande.livraisonLng}`
                    : null;
                  const isBusy = traitingId === commande.id || annulantId === commande.id;

                  return (
                    <div key={commande.id}
                      className="bg-white border-2 border-blue-100 rounded-xl p-4 hover:border-blue-200 transition-all">

                      {/* Header carte */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📱</span>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{commande.clientWhatsApp}</p>
                            <p className="text-xs text-gray-500">{formatHeure(commande.dateCommande)}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Adresse */}
                      <div className="mb-3 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        {mapsUrl ? (
                          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                            Voir sur la carte <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        ) : commande.livraisonTexte ? (
                          <p className="text-xs text-gray-600 line-clamp-2">{commande.livraisonTexte}</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Adresse non précisée</p>
                        )}
                      </div>
                      {commande.livraisonTexte && hasGps && (
                        <p className="text-xs text-gray-500 mb-3 pl-5 line-clamp-1">{commande.livraisonTexte}</p>
                      )}

                      {/* Total */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-lg font-bold text-gray-900">{commande.total.toLocaleString('fr-FR')} F</span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button onClick={() => handleTraiter(commande)} disabled={isBusy}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-[.98] transition-all font-semibold text-sm disabled:opacity-50">
                          {traitingId === commande.id
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</>
                            : <><ShoppingCart className="w-4 h-4" /> Traiter dans le panier</>}
                        </button>
                        <button onClick={() => handleAnnulerEnLigne(commande)} disabled={isBusy}
                          className="w-full px-3 py-2 text-gray-400 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-medium text-sm disabled:opacity-50">
                          {annulantId === commande.id
                            ? <span className="flex items-center justify-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Annulation…</span>
                            : 'Annuler la commande'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default POSAttentes;
