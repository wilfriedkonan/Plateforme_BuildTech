import React from 'react';
import { X, Bluetooth, Usb, Printer, Wifi, WifiOff, TestTube2, Loader2, AlertCircle } from 'lucide-react';
import { usePrinter } from '../../hooks/usePrinter';

interface POSPrinterConfigProps {
  onClose: () => void;
}

const POSPrinterConfig: React.FC<POSPrinterConfigProps> = ({ onClose }) => {
  const { connected, mode, deviceLabel, printing, error, configureBluetooth, configureUsb, disconnect, printTest } = usePrinter();

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">Imprimante</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Statut */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            connected
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            {connected
              ? <Wifi className="w-4 h-4 shrink-0" />
              : <WifiOff className="w-4 h-4 shrink-0" />
            }
            <div className="min-w-0">
              <p className="text-sm font-medium">{connected ? 'Connectée' : 'Non connectée'}</p>
              {connected && deviceLabel && (
                <p className="text-xs truncate opacity-75">{deviceLabel} · {mode === 'bluetooth' ? 'Bluetooth' : 'USB'}</p>
              )}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="flex gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="whitespace-pre-wrap">{error}</p>
            </div>
          )}

          {/* Modes de connexion */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mode de connexion</p>

            {/* USB */}
            <button
              onClick={configureUsb}
              disabled={printing}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                connected && mode === 'usb'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              } disabled:opacity-50`}
            >
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Usb className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">USB (câble OTG)</p>
                <p className="text-xs text-gray-400">Le plus fiable · Chrome Android requis</p>
              </div>
            </button>

            {/* Bluetooth */}
            <button
              onClick={configureBluetooth}
              disabled={printing}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                connected && mode === 'bluetooth'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              } disabled:opacity-50`}
            >
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Bluetooth className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Bluetooth</p>
                <p className="text-xs text-gray-400">Requiert GATT/BLE · vérifier compatibilité XP-80T</p>
              </div>
            </button>
          </div>

          {/* Notes importantes */}
          <div className="text-xs text-gray-400 space-y-1 px-1">
            <p><span className="font-medium text-gray-600">USB :</span> Si l'imprimante n'apparaît pas → Paramètres Android &gt; Apps &gt; Defaults &gt; USB, supprimer l'app par défaut.</p>
            <p><span className="font-medium text-gray-600">Bluetooth :</span> L'imprimante doit être appairée dans les paramètres Android avant. Si la connexion échoue, l'imprimante utilise Bluetooth Classic (non supporté par le navigateur) → passer en USB.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {connected && (
              <>
                <button
                  onClick={printTest}
                  disabled={printing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {printing
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <TestTube2 className="w-4 h-4" />
                  }
                  {printing ? 'Impression...' : 'Ticket test'}
                </button>
                <button
                  onClick={disconnect}
                  disabled={printing}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Déconnecter
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className={`${connected ? '' : 'flex-1'} px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium`}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPrinterConfig;
