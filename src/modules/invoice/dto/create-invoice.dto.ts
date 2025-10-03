import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

export class CreateInvoiceDto {
  @IsString()
  title: string;

  @IsNumber()
  subtotal: number;

  @IsString()
  paymentGateway: string;

  @IsString()
  paymentReference: string;

  @IsEnum(TransactionType)
  invoiceType: TransactionType;

  @IsNumber()
  walletId: number;
}
