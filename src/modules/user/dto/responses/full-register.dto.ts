import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

class Data {
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
  implements IControllerResponse<Data>
{
  @ApiProperty()
  data: Data;
}
