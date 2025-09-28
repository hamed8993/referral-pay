import { IsNumber, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  balance: number;

  @IsNumber()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  currency: string;
}
