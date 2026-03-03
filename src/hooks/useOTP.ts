import { useCallback, useMemo, useState } from 'react';
import { otpService, type OTPValidatePayload } from '../services/otpService';

type UseOTPState = {
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
  remainingAttempts: number;
};

export const useOTP = () => {
  const [state, setState] = useState<UseOTPState>({
    isLoading: false,
    error: null,
    isValid: false,
    remainingAttempts: 0,
  });

  const validate = useCallback(async (payload: OTPValidatePayload) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      console.log('[useOTP] Validating OTP...');
      const response = await otpService.validate(payload);
      console.log('[useOTP] Validation response:', response);

      if (response.success && response.isValid) {
        setState({
          isLoading: false,
          error: null,
          isValid: true,
          remainingAttempts: response.remainingAttempts,
        });
        return response;
      } else {
        const errorMessage = response.message || 'Code OTP invalide';
        setState({
          isLoading: false,
          error: errorMessage,
          isValid: false,
          remainingAttempts: response.remainingAttempts,
        });
        throw new Error(errorMessage);
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Erreur lors de la validation OTP';
      console.error('[useOTP] Validation error:', errorMessage);
      setState({
        isLoading: false,
        error: errorMessage,
        isValid: false,
        remainingAttempts: 0,
      });
      throw e;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isValid: false,
      remainingAttempts: 0,
    });
  }, []);

  return useMemo(() => ({
    isLoading: state.isLoading,
    error: state.error,
    isValid: state.isValid,
    remainingAttempts: state.remainingAttempts,
    validate,
    clearError,
    reset,
  }), [state.isLoading, state.error, state.isValid, state.remainingAttempts, validate, clearError, reset]);
};
