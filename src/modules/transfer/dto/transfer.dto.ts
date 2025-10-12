import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

export class TransferDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  gatewayId: string;

  @IsOptional()
  @IsString()
  cryptoDepositNetwork?: string;

  @IsOptional()
  @IsString()
  depositWalletAdress?: string;

  @IsOptional()
  @IsString()
  withdrawOriginWalletId?: string;

  @IsOptional()
  @IsString()
  withdrawDestinationWalletAddress?: string;

  @IsOptional()
  @IsString()
  bankCartId?: string; //for withdraw of rial wallet to bank account like: topchange
}
