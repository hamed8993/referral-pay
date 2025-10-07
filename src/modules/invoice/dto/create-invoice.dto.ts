import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';

export class CreateInvoiceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  subtotal: number;

  @IsString()
  paymentGateway: string;

  @IsString()
  paymentReference: string;

  @IsEnum(TransactionType)
  invoiceType: TransactionType;

  @IsOptional()
  @IsEnum(WalletTypeEnum)
  walletType: WalletTypeEnum;

  // @IsOptional()
  // @IsNumber()
  // walletId: number;

  @ValidateIf(
    (o) =>
      o.invoiceType === TransactionType.WITHDRAWAL &&
      o.walletType === WalletTypeEnum.THIRDPART,
  )
  @IsNumber()
  thirdWalletId: number;

  @IsOptional()
  @IsString()
  walletName?: string;
}
