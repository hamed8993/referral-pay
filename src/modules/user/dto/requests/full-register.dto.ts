import { IsString } from 'class-validator';

export class FullRegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
