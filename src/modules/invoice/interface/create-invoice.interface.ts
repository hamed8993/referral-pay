import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';

export interface ICreateInvoice {
  title: string;

  description?: string;

  subtotal: number;

  paymentGateway: string;

  paymentReference: string;

  invoiceType: TransactionType;

  walletType?: WalletTypeEnum;

  thirdWalletId?: number;

  walletName?: string;
}
