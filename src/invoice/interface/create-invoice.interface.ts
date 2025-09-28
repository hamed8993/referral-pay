import { TransactionType } from 'src/common/enums/transaction-type.enum';

export interface ICreateInvoice {
  title: string;

  subtotal: number;

  paymentGateway: string;

  paymentReference: string;

  invoiceType: TransactionType;

  walletId: number
}
