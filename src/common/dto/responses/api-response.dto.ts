import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty()
  path?: string;

  @ApiProperty()
  requestId?: string;

  @ApiProperty()
  success?: true;

  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  timestamp?: string;
}
