import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

class RawData4 {
  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  imageAddress: string;
}

export class UploadProfileResponseDto
  extends ApiResponseDto
  implements IControllerResponse<RawData4>
{
  @ApiProperty()
  data: RawData4;
}
