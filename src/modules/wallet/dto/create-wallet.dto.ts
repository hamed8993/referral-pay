import { IsNumber, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  balance: number;

  @IsString()
  name: string;

  @IsString()
  currency: string;
}
