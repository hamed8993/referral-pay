import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { Invoice } from '../../entity/invoice.entity';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { WalletStatus } from 'src/common/enums/wallet-status.enum';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

class WalletResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  status: WalletStatus;

  @ApiProperty()
  type: WalletTypeEnum;

  @ApiProperty()
  depositAddress: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  lockedBalance: number;
}

class RawData1 {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  tax: number;

  @ApiProperty()
  discount: number;

  @ApiProperty({
    enum: InvoiceStatus,
    example: InvoiceStatus.CANCELLED,
  })
  status: InvoiceStatus;

  @ApiProperty()
  invoiceNumber: string;

  // @ApiProperty()
  // paymentGatewayId: string;

  @ApiProperty()
  userCancellDescription: string;

  @ApiProperty()
  fromWallet?: WalletResponse;

  @ApiProperty()
  toWallet?: WalletResponse;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  type: TransactionType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  cryptoNetwork?: string;

  @ApiProperty()
  fromWalletAddress?: string;

  @ApiProperty()
  toWalletAddress?: string;

  @ApiProperty()
  toBankCartId?: string;
}

export class CancellInvoiceResponseDto extends ApiResponseDto {
  @ApiProperty()
  data: RawData1;
}
