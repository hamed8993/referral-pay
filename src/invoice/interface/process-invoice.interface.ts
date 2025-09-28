import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';

export interface IProcessInvoice {
  adminNote: string;
  status: InvoiceStatus;
  invoiceNumber: string;
}
