import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

class Dataa {
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
  implements IControllerResponse<Dataa>
{
  @ApiProperty()
  data: Dataa;
}
