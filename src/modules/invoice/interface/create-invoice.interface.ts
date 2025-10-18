import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { User } from 'src/modules/user/entity/user.entity';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';

export interface ICreateInvoice {
  type: TransactionType;

  status?: InvoiceStatus;

  title: string;

  description: string;

  subtotal: number;

  tax: number;

  discount: number;

  paymentGatewayId: string;

  paymentGatewayAuthority?: string;

  user: User;

  fromWallet?: Wallet;

  toWallet?: Wallet;

  toBankCartId?: string;

  cryptoNetwork?: string;

  toWalletAddress?: string;

  // amount: number;
  // type: TransactionType;
  // description?: string;
  // gatewayId: string | number;
  // cryptoDepositNetwork?: string;
  // depositWalletAdress?: string;
  // withdrawOriginWalletId?: string;
  // withdrawDestinationWalletAddress?: string;
  // bankCartId?: string; //for withdraw of rial wallet to bank account like: topchange
}
