import { InvoiceStatus } from '../enums/invoice-status.enum';
import { TransactionType } from '../enums/transaction-type.enum';

interface ITransactionItem {
  type: TransactionType;
  amount: number;
}
export interface IDailyTranactionsReportItem {
  parent: {
    email: string;
  };
  transactions: ITransactionItem[];
}

export interface IInstanceTranactionOwnerReportItem {
  userEmail: string;
  title: string;
  type: TransactionType;
  amount: number;
  fee: number;
  netAmount: number;
  description: string;
  processedBy: string;
  status: InvoiceStatus.SUBMITTED | InvoiceStatus.REJECTED;
  processDescription: string;
  walletId: number;
  invoiceNumber: string;
}

export interface IInstanceTranactionParentReportItem {
  parentEmail: string;
  type: TransactionType;
  amount: number;
}
// [
//   {
//     type: 'withdrawal',
//     amount: 14,
//   },
//   {
//     type: 'withdrawal',
//     amount: 88,
//   },
//   {
//     type: 'deposite',
//     amount: 10,
//   },
//   {
//     type: 'deposite',
//     amount: 45,
//   },
// ];
