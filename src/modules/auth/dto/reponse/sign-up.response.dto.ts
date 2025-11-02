import { ApiProperty } from '@nestjs/swagger';
import { CommonApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { WalletStatus } from 'src/common/enums/wallet-status.enum';
import { IControllerResponse } from 'src/common/interface/api-response.interface';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';

class WalletData implements Partial<Wallet> {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  lockedBalance: number;

  @ApiProperty()
  status: WalletStatus;

  @ApiProperty()
  type: WalletTypeEnum;
}

class RawData2 {
  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.BASIC,
  })
  enrollment: EnrollmentStatus;

  @ApiProperty()
  walletsList: WalletData;
}

export class SignUpResponseDto
  extends CommonApiResponseDto
  implements IControllerResponse<RawData2>
{
  @ApiProperty()
  data: RawData2;
}
