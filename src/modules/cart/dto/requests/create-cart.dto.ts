import { IsCreditCard, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  bankName: string;

  @IsCreditCard()
  cartNumber: string;
}
