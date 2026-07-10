import React from 'react';
import { X, MessageCircle, CheckCircle } from 'lucide-react';

/* ── Interface conservée pour compatibilité avec les appelants ─────────────── */
interface OTPModalProps {
  onVerify: (otp: string, userData?: { email: string; phone: string; nomEntreprise?: string }, planData?: { app: string; plan: string; idPlan: string }) => void;
  onClose: () => void;
  email: string;
  phone: string;
  deliveryMethod: 'email' | 'whatsapp';
  userData?: { nomEntreprise: string };
  planData?: { app: string; plan: string; idPlan: string };
}

/* ── Ancien contenu OTP commenté ──────────────────────────────────────────────
import { Mail } from 'lucide-react';
import { useOTP } from '../hooks/useOTP';
import { otpService } from '../services/otpService';

  const { validate, isLoading, error: otpError, remainingAttempts } = useOTP();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(otpError || '');
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index: number, value: string) => { ... };
  const handleSubmit = async (e: React.FormEvent) => { ... };
  const handleBackspace = (index: number, e: React.KeyboardEvent) => { ... };
  const resendOTP = async () => { ... };
────────────────────────────────────────────────────────────────────────────── */

const OTPModal: React.FC<OTPModalProps> = ({ onClose, userData }) => {
  const nomEntreprise = userData?.nomEntreprise ?? '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl">

        {/* Trait de poignée mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pt-4 pb-10 sm:p-8">
          {/* Bouton fermer */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Icône succès */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Inscription validée !
            </h2>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Cher administrateur / Chère administratrice
              {nomEntreprise && (
                <span className="font-semibold text-gray-900"> {nomEntreprise}</span>
              )},
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Votre inscription a été validée avec succès.
              Vous recevrez prochainement un message{' '}
              <span className="inline-flex items-center gap-1 font-semibold text-green-700">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </span>{' '}
              pour vous indiquer le mode de paiement.
            </p>

            <p className="text-gray-400 text-sm italic">
              Merci de nous faire confiance.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-700 active:scale-[0.98] transition-all duration-200 touch-manipulation"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
