import { Request } from 'express';

export interface IVerifyPaymentArgs {
  invoiceTotalAmount: string;
  invoicePaymentAuthority: string;
}

export interface PaymentCallbackResponse {
  authority?: string; // Authority || order_id
  status?: 'OK' | 'FAILED' | 'CANCELLED';
}

export interface PaymentVerifyResponse {
  success: boolean;
  referenceId?: string;
}

export interface IGatewayCallback {
  extractCallbackData(req: Request): Promise<PaymentCallbackResponse>;

  verifyPayment(payload: IVerifyPaymentArgs): Promise<PaymentVerifyResponse>;
}
