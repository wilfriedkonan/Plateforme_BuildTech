/** Interface commune pour tous les transports d'impression */
export interface PrinterTransport {
  readonly type: 'bluetooth' | 'usb';
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  write(data: Uint8Array): Promise<void>;
}

export type PrinterMode = 'bluetooth' | 'usb' | 'none';

export interface PrinterConfig {
  mode: PrinterMode;
  bluetoothDeviceName?: string;
  usbVendorId?: number;
  usbProductId?: number;
}

const CONFIG_KEY = 'pos_printer_config';

export function loadPrinterConfig(): PrinterConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? (JSON.parse(raw) as PrinterConfig) : { mode: 'none' };
  } catch {
    return { mode: 'none' };
  }
}

export function savePrinterConfig(config: PrinterConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
