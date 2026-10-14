import { useState, useCallback } from 'react';
import { PrinterTransport, PrinterMode, loadPrinterConfig, savePrinterConfig } from '../lib/printer/transport';
import { BluetoothTransport } from '../lib/printer/bluetooth-transport';
import { UsbTransport } from '../lib/printer/usb-transport';
import { buildTicket, PrintTicketData } from '../lib/printer/escpos';
import type { TransactionPOS } from '../components/lib/mock/pos';
import type { PosFacture } from '../services/posService';

export interface PrinterState {
  connected: boolean;
  mode: PrinterMode;
  deviceLabel: string;
  printing: boolean;
  error: string | null;
}

// Singleton transport — persiste entre les re-renders sans être dans le state React
let _transport: PrinterTransport | null = null;

function getTransportInstance(mode: PrinterMode): PrinterTransport | null {
  if (_transport?.type === mode) return _transport;
  if (mode === 'bluetooth') { _transport = new BluetoothTransport(); return _transport; }
  if (mode === 'usb') { _transport = new UsbTransport(); return _transport; }
  return null;
}

/** Convertit transaction + facture en données normalisées pour l'impression */
function toTicketData(transaction: TransactionPOS, facture?: PosFacture | null): PrintTicketData {
  const titre = facture?.caisse?.trim() || 'CAISSE POS';
  const numero = facture?.numeroFacture || transaction.numero;
  const date = facture?.dateCreation
    ? new Date(facture.dateCreation).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
    : transaction.date;
  const caissier = facture?.nomUtilisateur || transaction.caissier || '';
  const clientNom = facture?.nomClient || transaction.clientNom;
  const sousTotal = facture?.sous_total ?? transaction.sousTotal;
  const montantTVA = facture?.valeurTVA ?? transaction.montantTVA;
  const remiseGlobale = facture?.remise_globale ?? transaction.remiseGlobale;
  const valeurRemise = facture?.valeurRemise_globale ?? (sousTotal * remiseGlobale / 100);
  const total = facture?.total_final ?? transaction.total;
  const modePaiement = facture?.designationPayement || String(transaction.modePaiement) || '';
  const montantVerser = facture?.montantVerser ?? transaction.montantRecu;
  const monnaieRemis = facture?.monnaieRemis ?? transaction.monnaieRendue ?? 0;

  const articles = facture?.details?.length
    ? facture.details.map(d => ({
        nom: d.designation || '',
        quantite: d.quantite ?? 1,
        prixUnitaire: d.prixVente ?? d.prixUnitaireTTC ?? 0,
        remise: d.valeurRemise ?? 0,
        montantLigne: d.sousTotal ?? d.prixTotal ?? (d.prixVente ?? 0) * (d.quantite ?? 1),
      }))
    : transaction.lignes.map(l => ({
        nom: l.produit.nom,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
        remise: l.remise,
        montantLigne: l.prixUnitaire * l.quantite * (1 - l.remise / 100),
      }));

  return {
    titre, numero, date, caissier, clientNom,
    articles, sousTotal, remiseGlobale, valeurRemise,
    montantTVA, total, modePaiement, montantVerser, monnaieRemis,
  };
}

export function usePrinter() {
  const config = loadPrinterConfig();

  const [state, setState] = useState<PrinterState>({
    connected: _transport?.isConnected() ?? false,
    mode: config.mode,
    deviceLabel: config.bluetoothDeviceName ?? (config.usbVendorId ? `USB 0x${config.usbVendorId.toString(16)}` : ''),
    printing: false,
    error: null,
  });

  const setError = (error: string | null) => setState(s => ({ ...s, error }));
  const setConnected = (connected: boolean) => setState(s => ({ ...s, connected }));
  const setPrinting = (printing: boolean) => setState(s => ({ ...s, printing }));

  const configureBluetooth = useCallback(async () => {
    setError(null);
    try {
      _transport = new BluetoothTransport();
      await _transport.connect();
      const cfg = loadPrinterConfig();
      setState(s => ({
        ...s,
        connected: true,
        mode: 'bluetooth',
        deviceLabel: cfg.bluetoothDeviceName ?? 'Bluetooth',
        error: null,
      }));
    } catch (e: any) {
      _transport = null;
      setError(e?.message || 'Erreur connexion Bluetooth');
      setConnected(false);
    }
  }, []);

  const configureUsb = useCallback(async () => {
    setError(null);
    try {
      _transport = new UsbTransport();
      await _transport.connect();
      const cfg = loadPrinterConfig();
      setState(s => ({
        ...s,
        connected: true,
        mode: 'usb',
        deviceLabel: cfg.usbVendorId ? `USB 0x${cfg.usbVendorId.toString(16).toUpperCase()}` : 'USB',
        error: null,
      }));
    } catch (e: any) {
      _transport = null;
      setError(e?.message || 'Erreur connexion USB');
      setConnected(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await _transport?.disconnect();
    _transport = null;
    savePrinterConfig({ mode: 'none' });
    setState(s => ({ ...s, connected: false, mode: 'none', deviceLabel: '', error: null }));
  }, []);

  /** Imprime un ticket depuis les données de transaction */
  const print = useCallback(async (transaction: TransactionPOS, facture?: PosFacture | null) => {
    const cfg = loadPrinterConfig();

    // Auto-reconnect USB si données persistées
    if (!_transport?.isConnected() && cfg.mode === 'usb' && cfg.usbVendorId && cfg.usbProductId) {
      _transport = new UsbTransport();
      try {
        await (_transport as UsbTransport).reconnect(cfg.usbVendorId, cfg.usbProductId);
        setConnected(true);
      } catch {
        _transport = null;
      }
    }

    if (!_transport?.isConnected()) {
      setError("Imprimante non connectée. Configurez l'imprimante dans les paramètres.");
      return false;
    }

    setPrinting(true);
    setError(null);
    try {
      const data = toTicketData(transaction, facture);
      const bytes = buildTicket(data);
      await _transport.write(bytes);
      setPrinting(false);
      return true;
    } catch (e: any) {
      setPrinting(false);
      setConnected(false);
      setError(e?.message || "Erreur lors de l'impression");
      return false;
    }
  }, []);

  /** Impression de test */
  const printTest = useCallback(async () => {
    if (!_transport?.isConnected()) {
      setError("Imprimante non connectée.");
      return;
    }
    setPrinting(true);
    setError(null);
    try {
      const { buildTicket: bt } = await import('../lib/printer/escpos');
      const bytes = bt({
        titre: 'TEST IMPRESSION',
        numero: 'TEST-001',
        date: new Date().toLocaleString('fr-FR'),
        caissier: 'Test',
        articles: [{ nom: 'Article test', quantite: 1, prixUnitaire: 1000, remise: 0, montantLigne: 1000 }],
        sousTotal: 1000, remiseGlobale: 0, valeurRemise: 0,
        montantTVA: 0, total: 1000, modePaiement: 'Especes',
        montantVerser: 1000, monnaieRemis: 0,
      });
      await _transport!.write(bytes);
      setPrinting(false);
    } catch (e: any) {
      setPrinting(false);
      setError(e?.message || "Erreur test impression");
    }
  }, []);

  return {
    ...state,
    configureBluetooth,
    configureUsb,
    disconnect,
    print,
    printTest,
  };
}
