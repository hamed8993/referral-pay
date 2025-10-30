import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

class RawData2 {
  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.BASIC,
  })
  enrollment: EnrollmentStatus;
}

export class SignUpResponseDto
  extends ApiResponseDto
  implements IControllerResponse<RawData2>
{
  @ApiProperty()
  data: RawData2;
}
