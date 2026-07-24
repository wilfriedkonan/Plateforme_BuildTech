import React, { useState } from 'react';
import {
  X, CheckCircle2, MapPin, AlignLeft, Loader2,
  AlertTriangle, ChevronLeft,
} from 'lucide-react';
import { publicApiClient } from '../../services/publicApiClient';
import type { CartLine } from './CartDrawer';

// ─── Validation numéro WhatsApp ───────────────────────────────────────────────
// Accepte : "225 0725691200", "2250725691200", "+2250725691200"

const WA_REGEX = /^(\+?225)\s?\d{10}$/;

const normalizeWA = (v: string): string =>
  v.replace(/[\s\-()]/g, '').replace(/^\+/, '');

const fmt = (price: number) => `${price.toLocaleString('fr-FR')} FCFA`;
const unitPrice = (a: CartLine['article']) =>
  a.estPromo && a.prixPromo != null ? a.prixPromo : a.prixVente;

// ─── Props ────────────────────────────────────────────────────────────────────

interface OrderModalProps {
  idBoutique: string;
  cart: CartLine[];
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2;
type GpsState = 'idle' | 'loading' | 'success' | 'error';
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

// ─── Composant ────────────────────────────────────────────────────────────────

const OrderModal: React.FC<OrderModalProps> = ({ idBoutique, cart, onClose, onSuccess }) => {
  // Étape 1 — WhatsApp
  const [step, setStep]         = useState<Step>(1);
  const [whatsapp, setWhatsapp] = useState('');
  const [waError, setWaError]   = useState<string | null>(null);

  // Étape 2 — Lieu de livraison
  const [locationMode, setLocationMode] = useState<'gps' | 'text'>('gps');
  const [gpsState, setGpsState]         = useState<GpsState>('idle');
  const [gpsCoords, setGpsCoords]       = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError]         = useState<string | null>(null);
  const [manualText, setManualText]     = useState('');

  // Soumission
  const [submitState, setSubmitState]   = useState<SubmitState>('idle');
  const [submitError, setSubmitError]   = useState<string | null>(null);

  // Total
  const total = cart.reduce((s, l) => s + unitPrice(l.article) * l.quantite, 0);

  const isWaValid = WA_REGEX.test(whatsapp.trim());
  const hasLocation =
    (gpsState === 'success' && gpsCoords !== null) ||
    manualText.trim().length > 0;

  // Fermeture body scroll
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStep1 = () => {
    if (!isWaValid) { setWaError('Format invalide. Exemple : 225 0725691200'); return; }
    setWaError(null);
    setStep(2);
  };

  const handleGPS = () => {
    setGpsState('loading');
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsState('success');
      },
      err => {
        const msg =
          err.code === 1
            ? 'Permission refusée. Vous pouvez saisir votre adresse manuellement ci-dessous.'
            : err.code === 2
            ? 'Position indisponible. Réessayez ou saisissez votre adresse manuellement.'
            : 'Délai dépassé. Réessayez ou saisissez votre adresse manuellement.';
        setGpsError(msg);
        setGpsState('error');
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  const handleSubmit = async () => {
    setSubmitState('loading');
    setSubmitError(null);

    const body: Record<string, unknown> = {
      clientWhatsApp: normalizeWA(whatsapp.trim()),
      lignes: cart.map(l => ({
        idArticle:     l.article.idArticle,
        nomArticle:    l.article.nomArticle,
        prixUnitaire:  unitPrice(l.article),
        quantite:      l.quantite,
      })),
      total,
    };
    if (gpsCoords) {
      body.livraisonLat = gpsCoords.lat;
      body.livraisonLng = gpsCoords.lng;
    }
    if (manualText.trim()) {
      body.livraisonTexte = manualText.trim();
    }

    try {
      await publicApiClient.post(`/public/boutique/${idBoutique}/commande/whatsapp`, body);
      setSubmitState('success');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitError(msg || 'Une erreur est survenue. Veuillez réessayer.');
      setSubmitState('error');
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes order-slide-up  { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes order-fade-in   { from{opacity:0} to{opacity:1} }
        @keyframes step-in-right   { from{transform:translateX(32px);opacity:0} to{transform:translateX(0);opacity:1} }
        .order-backdrop { animation: order-fade-in .2s ease-out; }
        .order-panel    { animation: order-slide-up .25s ease-out; }
        .step-enter     { animation: step-in-right .22s ease-out; }
      `}</style>

      <div
        className="order-backdrop fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <div
          className="order-panel relative bg-white w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* ── En-tête ────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">
              {submitState === 'success' ? 'Commande confirmée !' : 'Valider ma commande'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* ── Indicateur d'étapes ────────────────────────────────────────── */}
          {submitState !== 'success' && (
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step === 1 ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className={`text-xs font-semibold ${step === 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                  WhatsApp
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  2
                </div>
                <span className={`text-xs font-semibold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                  Livraison
                </span>
              </div>
            </div>
          )}

          {/* ── Contenu défilable ──────────────────────────────────────────── */}
          <div className="px-5 py-5 max-h-[62vh] sm:max-h-[70vh] overflow-y-auto">

            {/* ── SUCCÈS ───────────────────────────────────────────────────── */}
            {submitState === 'success' && (
              <div className="step-enter flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <div>
                  <p className="font-black text-gray-900 text-lg">Commande envoyée !</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
                    La boutique vous contactera sur WhatsApp très bientôt pour confirmer les détails.
                  </p>
                </div>
                <button
                  onClick={() => { onSuccess(); onClose(); }}
                  className="mt-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-2xl transition-all"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* ── ÉTAPE 1 — WhatsApp ───────────────────────────────────────── */}
            {submitState !== 'success' && step === 1 && (
              <div className="step-enter space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Votre numéro WhatsApp
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="225 0725691200"
                    value={whatsapp}
                    onChange={e => { setWhatsapp(e.target.value); if (waError) setWaError(null); }}
                    className={`w-full px-4 py-3 text-sm rounded-xl border-2 focus:outline-none transition-colors font-mono tracking-wide ${
                      waError
                        ? 'border-red-400 bg-red-50'
                        : isWaValid && whatsapp
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 focus:border-orange-400'
                    }`}
                  />
                  {waError && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{waError}</p>
                  )}
                  <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800 leading-relaxed">
                    Votre commande sera traitée directement via WhatsApp sur ce numéro. Assurez-vous qu'il soit actif.
                  </div>
                </div>

                {/* Récap panier */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Récapitulatif
                  </p>
                  <div className="space-y-1.5">
                    {cart.map(l => (
                      <div key={l.article.idArticle} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {l.quantite}× {l.article.nomArticle}
                        </span>
                        <span className="font-semibold text-gray-900 tabular-nums">
                          {(unitPrice(l.article) * l.quantite).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2.5 border-t border-gray-200 mt-2">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-black text-orange-600 text-base tabular-nums">
                        {fmt(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStep1}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all"
                >
                  Continuer →
                </button>
              </div>
            )}

            {/* ── ÉTAPE 2 — Livraison ──────────────────────────────────────── */}
            {submitState !== 'success' && step === 2 && (
              <div className="step-enter space-y-4">
                {/* Sélecteur de mode */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setLocationMode('gps')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      locationMode === 'gps'
                        ? 'border-orange-400 text-orange-600 bg-orange-50'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Ma position
                  </button>
                  <button
                    onClick={() => setLocationMode('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      locationMode === 'text'
                        ? 'border-orange-400 text-orange-600 bg-orange-50'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                    Saisie libre
                  </button>
                </div>

                {/* ── Panneau GPS ──────────────────────────────────────────── */}
                {locationMode === 'gps' && (
                  <div className="space-y-3">
                    {gpsState === 'idle' && (
                      <button
                        onClick={handleGPS}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold rounded-2xl transition-all"
                      >
                        <MapPin className="w-4 h-4" />
                        Utiliser ma position actuelle
                      </button>
                    )}

                    {gpsState === 'loading' && (
                      <div className="flex items-center justify-center gap-3 py-5 text-blue-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">Localisation en cours…</span>
                      </div>
                    )}

                    {gpsState === 'success' && gpsCoords && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-bold">Position enregistrée ✅</span>
                        </div>
                        <p className="text-xs text-emerald-700 font-mono">
                          {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}
                        </p>
                        <a
                          href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-xs text-blue-600 underline hover:text-blue-800"
                        >
                          Vérifier sur Google Maps →
                        </a>
                        <button
                          onClick={handleGPS}
                          className="text-xs text-gray-400 hover:text-gray-600 mt-0.5"
                        >
                          Rafraîchir ma position
                        </button>
                      </div>
                    )}

                    {gpsState === 'error' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-amber-800 leading-relaxed">{gpsError}</p>
                            <button
                              onClick={() => setLocationMode('text')}
                              className="text-xs text-blue-600 underline mt-1.5 hover:text-blue-800"
                            >
                              Saisir mon adresse manuellement →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Complément textuel (visible uniquement si GPS ok) */}
                    {gpsState === 'success' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                          Précision optionnelle
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ex : 2e portail après la boulangerie, sonnez deux fois…"
                          value={manualText}
                          onChange={e => setManualText(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ── Panneau saisie libre ─────────────────────────────────── */}
                {locationMode === 'text' && (
                  <textarea
                    rows={4}
                    placeholder="Ex : Cocody Angré 8e tranche, non loin de la pharmacie du carrefour…"
                    value={manualText}
                    onChange={e => setManualText(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none resize-none leading-relaxed"
                  />
                )}

                {/* Erreur réseau */}
                {submitState === 'error' && submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 leading-relaxed">
                    {submitError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-4 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors flex-shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" /> Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!hasLocation || submitState === 'loading'}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all"
                  >
                    {submitState === 'loading' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</>
                    ) : (
                      'Envoyer ma commande'
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default OrderModal;
