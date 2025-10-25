import { IsOptional, IsString } from 'class-validator';
import { IsStrongPassword } from '../../decorators/password-validation.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsStrongPassword()
  passwordRepeat: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
