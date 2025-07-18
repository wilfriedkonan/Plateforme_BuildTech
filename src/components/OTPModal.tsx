import React, { useState } from 'react';
import { X, MessageCircle, Mail, Check } from 'lucide-react';

interface OTPModalProps {
  onVerify: (otp: string) => void;
  onClose: () => void;
  email: string;
  phone: string;
  deliveryMethod: 'email' | 'whatsapp';
}

const OTPModal: React.FC<OTPModalProps> = ({ onVerify, onClose, email, phone, deliveryMethod }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      onVerify(otpValue);
    } else {
      setError('Veuillez saisir le code à 4 chiffres');
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendOTP = () => {
    setOtp(['', '', '', '']);
    setError('');
    // Simulate OTP resending
    console.log(`Code OTP renvoyé via ${deliveryMethod === 'email' ? 'email' : 'WhatsApp'}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vérification OTP</h2>
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
            Code envoyé via {deliveryMethod === 'email' ? 'Email' : 'WhatsApp'}
          </h3>
          <p className="text-gray-600 mb-2">
            Nous avons envoyé un code de vérification à 4 chiffres sur votre{' '}
            {deliveryMethod === 'email' ? 'adresse email' : 'numéro WhatsApp'}.
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
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Vérifier le code
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Vous n'avez pas reçu le code ?
          </p>
          <button 
            onClick={resendOTP}
            className="text-gray-700 hover:text-gray-900 font-medium text-sm"
          >
            Renvoyer via {deliveryMethod === 'email' ? 'Email' : 'WhatsApp'}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Pour cette démo, utilisez le code : <strong>1234</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;