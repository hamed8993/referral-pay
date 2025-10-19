import { OtpTypeEnum } from '../enum/otp-type.enum';

export interface IOtp {
  userId: string;
  withDrawInvoiceId?: string;
  otpType: OtpTypeEnum;
}
