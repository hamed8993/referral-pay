import { IsOptional, IsString } from 'class-validator';

export class OtpResendDto {
  @IsString()
  otpId: string;

  @IsOptional()
  @IsString()
  invoiceId?: string;
}
