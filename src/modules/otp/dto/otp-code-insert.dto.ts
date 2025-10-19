import { IsOptional, IsString } from 'class-validator';

export class OtpCodeInsertDto {
  @IsString()
  otpId: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  invoiceId?: string;
}
