import { IsNumber, IsString } from 'class-validator';

export class CancellInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsString()
  userCancellDescription;
}
