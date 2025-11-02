import { ApiProperty } from '@nestjs/swagger';
import { CommonApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

class OtpResendResponse {
  @ApiProperty()
  otpId: string;
}

export class OtpResendResponseDto
  extends CommonApiResponseDto
  implements IControllerResponse<OtpResendResponse>
{
  data: OtpResendResponse;
}
