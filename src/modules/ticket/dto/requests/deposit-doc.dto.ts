import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDocBodyDto {
  @Transform(({ value }) => value?.toString())
  @IsString()
  invoiceNumber: string;
}

export class UploadDocDto extends DepositDocBodyDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  doc: any;
}
