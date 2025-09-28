import { IsEnum, IsString } from 'class-validator';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';

export class ProcessInvoiceDto {
  @IsString()
  adminNote: string;

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsString()
  invoiceNumber: string;
}
