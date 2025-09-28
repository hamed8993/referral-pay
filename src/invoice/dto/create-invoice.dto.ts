import { IsNumber, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsString()
  title: string;

  @IsNumber()
  subtotal: number;

  @IsString()
  paymentGateway: string;

  @IsString()
  paymentReference: string;
}
