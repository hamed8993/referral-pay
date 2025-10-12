import { TransactionType } from 'src/common/enums/transaction-type.enum';

export interface ITransfer {
  amount: number;
  type: TransactionType;
  description?: string;
  gatewayId: string;
  cryptoDepositNetwork?: string;
  cryptoDepositWalletId?: string;
  withdrawOriginWalletId?: string;
  withdrawDestinationWalletAddress?: string;
  bankCartId?: string; //for withdraw of rial wallet to bank account like: topchange
}
