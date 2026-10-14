import { PrinterTransport, savePrinterConfig, loadPrinterConfig } from './transport';

/**
 * VendorIDs connus pour les imprimantes thermiques POS.
 * Si l'Xprinter XP-80T n'apparaît pas, son VendorId peut être identifié via
 * chrome://device-log sur Chrome Android après branchement OTG.
 *
 * ⚠️ Prérequis Android :
 *   - Câble OTG entre tablette et imprimante
 *   - Android ne doit PAS avoir réclamé l'imprimante comme imprimante système.
 *     Si c'est le cas : Paramètres > Apps > Imprimante (défaut) > Supprimer par défaut
 */
const KNOWN_VENDOR_IDS = [
  0x0483,  // STMicroelectronics (utilisé par Xprinter, clones génériques)
  0x28E9,  // GigaDevice / Winchiphead (très courant sur thermiques chinois)
  0x6868,  // Autre clone fréquent
  0x04b8,  // Seiko Epson
  0x067b,  // Prolific Technology (convertisseurs USB-série utilisés dans certains modèles)
  0x0DD4,  // Custom Engineering (certains Xprinter OEM)
  0x1504,  // Xprinter Technology Co.
];

export class UsbTransport implements PrinterTransport {
  readonly type = 'usb' as const;

  private device: USBDevice | null = null;
  private interfaceNumber = 0;
  private endpointOut = 1;

  isConnected(): boolean {
    return !!this.device?.opened;
  }

  async connect(): Promise<void> {
    if (!navigator.usb) {
      throw new Error('WebUSB non supporté par ce navigateur (Chrome requis).');
    }

    const filters = KNOWN_VENDOR_IDS.map(vendorId => ({ vendorId }));

    try {
      this.device = await navigator.usb.requestDevice({ filters });
    } catch (e: any) {
      if (e?.name === 'NotFoundError') {
        throw new Error(
          "Aucune imprimante USB reconnue. Vérifiez :\n" +
          "• Le câble OTG est branché\n" +
          "• L'imprimante est allumée\n" +
          "• Android ne l'a pas réclamée comme imprimante système"
        );
      }
      throw e;
    }

    await this._openDevice();

    const config = loadPrinterConfig();
    config.mode = 'usb';
    config.usbVendorId = this.device.vendorId;
    config.usbProductId = this.device.productId;
    savePrinterConfig(config);
  }

  /** Tente de rouvrir un périphérique USB déjà sélectionné (reconnexion) */
  async reconnect(vendorId: number, productId: number): Promise<void> {
    if (!navigator.usb) throw new Error('WebUSB non supporté.');

    const devices = await navigator.usb.getDevices();
    const found = devices.find(d => d.vendorId === vendorId && d.productId === productId);
    if (!found) throw new Error('Imprimante USB non trouvée. Rebranchez le câble OTG.');

    this.device = found;
    await this._openDevice();
  }

  private async _openDevice(): Promise<void> {
    if (!this.device) throw new Error('Pas de périphérique USB sélectionné.');
    if (!this.device.opened) await this.device.open();

    // Sélectionner la configuration 1 (première)
    if (this.device.configuration === null) {
      await this.device.selectConfiguration(1);
    }

    // Trouver l'interface d'impression (classe 7) ou prendre la première
    const iface = this.device.configuration?.interfaces.find(i =>
      i.alternates.some(a => a.interfaceClass === 7)
    ) ?? this.device.configuration?.interfaces[0];

    if (!iface) throw new Error("Aucune interface USB d'impression trouvée.");
    this.interfaceNumber = iface.interfaceNumber;

    try {
      await this.device.claimInterface(this.interfaceNumber);
    } catch (e: any) {
      throw new Error(
        "Impossible de réclamer l'interface USB.\n" +
        "Android a probablement déjà pris le contrôle de l'imprimante.\n" +
        "Allez dans Paramètres > Apps > Defaults > USB et supprimez l'app par défaut."
      );
    }

    // Trouver l'endpoint bulk OUT
    const alternate = iface.alternates.find(a => a.interfaceClass === 7) ?? iface.alternates[0];
    const ep = alternate.endpoints.find(e => e.direction === 'out' && e.type === 'bulk');
    if (!ep) throw new Error("Endpoint USB bulk-out introuvable.");
    this.endpointOut = ep.endpointNumber;
  }

  async disconnect(): Promise<void> {
    if (!this.device) return;
    try {
      await this.device.releaseInterface(this.interfaceNumber);
      await this.device.close();
    } catch { /* ignore */ }
    this.device = null;
  }

  async write(data: Uint8Array): Promise<void> {
    if (!this.device?.opened) {
      const config = loadPrinterConfig();
      if (config.usbVendorId && config.usbProductId) {
        await this.reconnect(config.usbVendorId, config.usbProductId);
      } else {
        throw new Error('Imprimante USB non connectée.');
      }
    }
    await this.device!.transferOut(this.endpointOut, data);
  }
}
