import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DepositDocDto {
  @Transform(({ value }) => value?.toString())
  @IsString()
  invoiceNumber: string;
}
