import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { Invoice } from 'src/modules/invoice/entity/invoice.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';

export interface ICreateTransaction {
  amount: number;
  type: TransactionType;
  title: string;
  description?: string;
  transactionTracingCode: string;
  cryptoNetwork?: string;

  fromWalletAddress?: string;
  toWalletAddress?: string;

  toBankCartId?: string;

  processedBy?: number;

  user: User;
  invoice: Invoice;
  fromWallet?: Wallet;
  toWallet?: Wallet;
}
