import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import POSContent from './POSContent';
import POSMobileLayout from './POSMobileLayout';

interface POSModalProps {
  onClose: () => void;
}

const POSModal: React.FC<POSModalProps> = ({ onClose }) => {
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const panierCount = 2;

  useEffect(() => {
    setIsVisible(true);

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    if (panierCount > 0) {
      setShowConfirmClose(true);
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`relative w-[96vw] h-[96vh] max-w-[1920px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isVisible && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } md:w-[98vw] md:h-[98vh] max-md:w-full max-md:h-full max-md:rounded-none`}
      >
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center text-lg">
              🧾
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-none max-md:text-sm">
                Point de Vente (POS)
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 max-md:hidden">
                Interface de caisse et gestion des transactions
              </p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold ml-2 max-md:ml-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-md:hidden">Caisse ouverte</span>
              <span className="md:hidden">Caisse</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-gray-500 tabular-nums max-md:text-xs">
              {currentTime}
            </span>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="hidden md:block h-full">
            <POSContent />
          </div>
          <div className="block md:hidden h-full">
            <POSMobileLayout />
          </div>
        </div>
      </div>

      {showConfirmClose && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <h3 className="text-xl font-bold text-gray-900">Fermer la caisse ?</h3>
            </div>

            <p className="text-gray-600 mb-2">
              Votre panier contient <span className="font-semibold text-gray-900">{panierCount} article(s)</span>.
            </p>
            <p className="text-gray-600 mb-6">
              La commande en cours sera annulée.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continuer la vente
              </button>
              <button
                onClick={confirmClose}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Fermer quand même
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSModal;
