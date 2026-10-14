import { PrinterTransport, savePrinterConfig, loadPrinterConfig } from './transport';

/**
 * UUIDs GATT connus pour imprimantes thermiques génériques / Xprinter.
 * ⚠️  Web Bluetooth ne supporte que GATT/BLE, pas Bluetooth Classic SPP.
 * Ces UUIDs fonctionnent sur les modèles qui exposent un service GATT de
 * compatibilité (très courant sur les clones chinois dont la XP-80T BT).
 * Si aucun des deux ne fonctionne, l'imprimante ne supporte pas BLE → passer en USB.
 */
const GATT_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb', // Le plus courant (Xprinter, génériques)
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Variante (certains clones Epson)
] as const;

const GATT_WRITE_CHARS: Record<string, string> = {
  '000018f0-0000-1000-8000-00805f9b34fb': '00002af1-0000-1000-8000-00805f9b34fb',
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2': 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
};

const CHUNK_SIZE = 200; // octets max par write GATT (conservatif; MTU négocié peut être plus grand)

export class BluetoothTransport implements PrinterTransport {
  readonly type = 'bluetooth' as const;

  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private writeChar: BluetoothRemoteGATTCharacteristic | null = null;

  isConnected(): boolean {
    return !!this.server?.connected && !!this.writeChar;
  }

  async connect(): Promise<void> {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth non supporté par ce navigateur/appareil.');
    }

    // Demande le périphérique via l'UI navigateur
    this.device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [GATT_SERVICES[0]] },
        { services: [GATT_SERVICES[1]] },
        { namePrefix: 'Printer' },
        { namePrefix: 'XPrinter' },
        { namePrefix: 'Xprinter' },
        { namePrefix: 'MTP' },
      ],
      optionalServices: [...GATT_SERVICES],
    });

    await this._openGatt();

    // Persiste le nom pour l'UI
    const config = loadPrinterConfig();
    config.mode = 'bluetooth';
    config.bluetoothDeviceName = this.device.name ?? 'Bluetooth';
    savePrinterConfig(config);

    this.device.addEventListener('gattserverdisconnected', () => {
      this.server = null;
      this.writeChar = null;
    });
  }

  private async _openGatt(): Promise<void> {
    if (!this.device) throw new Error('Pas de périphérique Bluetooth sélectionné.');

    this.server = await this.device.gatt!.connect();

    // Essaye les services connus dans l'ordre
    for (const serviceUUID of GATT_SERVICES) {
      try {
        const service = await this.server.getPrimaryService(serviceUUID);
        const charUUID = GATT_WRITE_CHARS[serviceUUID];
        this.writeChar = await service.getCharacteristic(charUUID);
        return; // trouvé
      } catch {
        // ce service n'existe pas sur cet appareil, essaye le suivant
      }
    }

    throw new Error(
      "Aucun service d'impression GATT trouvé sur cette imprimante.\n" +
      "L'imprimante utilise peut-être uniquement Bluetooth Classic (SPP), " +
      "incompatible avec Web Bluetooth. Utilisez le mode USB à la place."
    );
  }

  async disconnect(): Promise<void> {
    try { this.device?.gatt?.disconnect(); } catch { /* ignore */ }
    this.server = null;
    this.writeChar = null;
  }

  async write(data: Uint8Array): Promise<void> {
    if (!this.writeChar) {
      // Tentative de reconnexion automatique
      if (this.device) await this._openGatt();
      if (!this.writeChar) throw new Error('Imprimante Bluetooth non connectée.');
    }

    // Découpe en chunks pour le GATT
    for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
      const chunk = data.slice(offset, offset + CHUNK_SIZE);
      try {
        await this.writeChar.writeValueWithoutResponse(chunk);
      } catch {
        // Fallback avec réponse si sans-réponse n'est pas supporté
        await this.writeChar.writeValue(chunk);
      }
      // Petite pause pour laisser le buffer de l'imprimante absorber
      if (data.length > CHUNK_SIZE) await _delay(10);
    }
  }
}

function _delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
