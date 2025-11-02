import { ApiProperty } from '@nestjs/swagger';
import { CommonApiResponseDto } from 'src/common/dto/responses/api-response.dto';
import { IControllerResponse } from 'src/common/interface/api-response.interface';

export class CreateCartResponse {
  @ApiProperty()
  bankName: string;

  @ApiProperty()
  bankNumber: number;
}

export class CreateCartResponseDto
  extends CommonApiResponseDto
  implements IControllerResponse<CreateCartResponse>
{
  data: CreateCartResponse;
}
