import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  referralCode: string;
}
