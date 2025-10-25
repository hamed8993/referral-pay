import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/responses/api-response.dto';

class LoginResponse {
  @ApiProperty()
  accessToken: string;
}

export class LoginResponseDto extends ApiResponseDto {
  @ApiProperty()
  data: LoginResponse;
}
