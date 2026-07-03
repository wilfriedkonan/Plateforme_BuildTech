import React, { useState } from 'react';
import { X, MessageCircle, Mail } from 'lucide-react';
import { useOTP } from '../hooks/useOTP';
import { otpService } from '../services/otpService';

interface OTPModalProps {
  onVerify: (otp: string, userData?: { email: string; phone: string; nomEntreprise?: string }, planData?: { app: string; plan: string; idPlan: string }) => void;
  onClose: () => void;
  email: string;
  phone: string;
  deliveryMethod: 'email' | 'whatsapp';
  userData?: { nomEntreprise: string };
  planData?: { app: string; plan: string; idPlan: string };
}

const OTPModal: React.FC<OTPModalProps> = ({ onVerify, onClose, email, phone, deliveryMethod, userData, planData }) => {
  const { validate, isLoading, error: otpError, remainingAttempts } = useOTP();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(otpError || '');
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      setError('Veuillez saisir le code Ã  4 chiffres');
      return;
    }

    try {
      const response = await validate({ email, code: otpValue });
      if (response.isValid) {
        onVerify(otpValue, { email, phone, nomEntreprise: userData?.nomEntreprise }, planData);
      } else {
        setError(response.message || 'Code OTP invalide');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors de la validation du code OTP');
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendOTP = async () => {
    setIsResending(true);
    setError('');
    try {
      await otpService.resend({
        email,
        method: deliveryMethod,
      });
      setOtp(['', '', '', '']);
      setError('');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Erreur lors du renvoi du code OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">VÃ©rification OTP</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              {deliveryMethod === 'email' ? (
                <Mail className="w-8 h-8 text-white" />
              ) : (
                <MessageCircle className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Code envoyÃ© via {deliveryMethod === 'email' ? 'Email' : 'WhatsApp'}
          </h3>
          <p className="text-gray-600 mb-2">
            Nous avons envoyÃ© un code de vÃ©rification Ã  4 chiffres sur votre{' '}
            {deliveryMethod === 'email' ? 'adresse email' : 'numÃ©ro WhatsApp'}.
          </p>
          <p className="text-sm text-gray-500">
            {deliveryMethod === 'email' ? `Email : ${email}` : `WhatsApp : ${phone}`}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                maxLength={1}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {error}
              {remainingAttempts > 0 && (
                <p className="text-xs mt-2">Tentatives restantes : {remainingAttempts}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'VÃ©rification en cours...' : 'VÃ©rifier le code'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Vous n'avez pas reÃ§u le code ?
          </p>
          <button 
            onClick={resendOTP}
            disabled={isResending}
            className="text-gray-700 hover:text-gray-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? 'Envoi en cours...' : `Renvoyer via ${deliveryMethod === 'email' ? 'Email' : 'WhatsApp'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
