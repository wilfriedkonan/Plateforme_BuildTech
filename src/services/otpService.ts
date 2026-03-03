import { apiClient } from './apiClient';

export interface OTPValidatePayload {
  email: string;
  code: string;
}

export interface OTPValidateResponse {
  success: boolean;
  message: string;
  isValid: boolean;
  remainingAttempts: number;
  token?: string;
  user?: any;
}

export interface OTPSendPayload {
  email: string;
  method: 'email' | 'whatsapp';
}

export interface OTPSendResponse {
  success: boolean;
  message: string;
}

export const otpService = {
  validate: async (payload: OTPValidatePayload): Promise<OTPValidateResponse> => {
    try {
      console.log('[otpService] Validating OTP for:', payload.email);
      const { data } = await apiClient.post<OTPValidateResponse>('Otp/validate', payload);
      console.log('[otpService] OTP validation response:', data);
      return data;
    } catch (error: any) {
      console.error('[otpService] OTP validation error:', error.message);
      throw error;
    }
  },

  send: async (payload: OTPSendPayload): Promise<OTPSendResponse> => {
    try {
      console.log('[otpService] Sending OTP to:', payload.email);
      const { data } = await apiClient.post<OTPSendResponse>('Otp/send', payload);
      console.log('[otpService] OTP send response:', data);
      return data;
    } catch (error: any) {
      console.error('[otpService] OTP send error:', error.message);
      throw error;
    }
  },

  resend: async (payload: OTPSendPayload): Promise<OTPSendResponse> => {
    try {
      console.log('[otpService] Resending OTP to:', payload.email);
      const { data } = await apiClient.post<OTPSendResponse>('Otp/resend', payload);
      console.log('[otpService] OTP resend response:', data);
      return data;
    } catch (error: any) {
      console.error('[otpService] OTP resend error:', error.message);
      throw error;
    }
  },
};
