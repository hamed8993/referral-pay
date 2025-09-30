import { TransactionType } from 'src/common/enums/transaction-type.enum';

export interface MessageInterface {
  sendTo: string;
  by?: string;
  transActionType: TransactionType;
  transActionAmount: number;
  walletBalance?: number;
  transActionDate: Date;
}
