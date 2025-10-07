import { WalletCategoryEnum } from 'src/modules/wallet/enum/wallet-category.enum';

export interface ITransfer {
  fromWallet: WalletCategoryEnum;

  toWallet: WalletCategoryEnum;

  amount: number;
}
