import React, { useState, useRef } from 'react';
import { Copy, Download, X, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeShareProps {
  onClose: () => void;
}

const QRCodeShare: React.FC<QRCodeShareProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const catalogueSlug = import.meta.env.VITE_CATALOGUE_SLUG || 'demo-restaurant';
  const baseUrl = window.location.origin;
  const catalogueUrl = `${baseUrl}/catalogue/${catalogueSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(catalogueUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1000;
    canvas.height = 1000;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `catalogue-qr-${catalogueSlug}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Partager le catalogue</h3>
          <p className="text-gray-600">Partagez votre catalogue avec vos clients</p>
        </div>

        <div className="flex justify-center mb-6" ref={qrRef}>
          <div className="p-4 bg-white border-4 border-gray-200 rounded-xl">
            <QRCodeSVG
              value={catalogueUrl}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien du catalogue
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={catalogueUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  copied
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-800 text-white hover:shadow-lg'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleDownloadQR}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger le QR code</span>
          </button>

          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">Comment utiliser ce QR code ?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Imprimez-le sur vos menus physiques</li>
              <li>Affichez-le à l'entrée de votre établissement</li>
              <li>Partagez-le sur vos réseaux sociaux</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeShare;
