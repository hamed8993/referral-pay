import { IsEnum, IsNumber } from 'class-validator';
import { WalletCategoryEnum } from 'src/modules/wallet/enum/wallet-category.enum';

export class TransferDto {
  @IsEnum(WalletCategoryEnum)
  fromWallet: WalletCategoryEnum;

  @IsEnum(WalletCategoryEnum)
  toWallet: WalletCategoryEnum;

  @IsNumber()
  amount: number;
}
