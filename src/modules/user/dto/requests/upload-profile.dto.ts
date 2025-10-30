import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from './update.dto';

export class UpoadProfileDto extends UpdateUserDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
