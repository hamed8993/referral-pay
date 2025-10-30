import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

class RawData3 {
  @ApiProperty()
  fullName: string;

  @ApiProperty({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.FULLY,
  })
  enrollment: EnrollmentStatus;
}

export class FullRegisterResDto
  extends ApiResponseDto
  implements IControllerResponse<RawData3>
{
  @ApiProperty()
  data: RawData3;
}
