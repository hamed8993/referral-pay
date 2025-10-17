import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from '../decorators/password-validation.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  passwordRepeat: string;

  @IsOptional()
  @IsString()
  referralCode: string;
}
