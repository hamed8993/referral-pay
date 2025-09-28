import { Body, Controller, Post } from '@nestjs/common';
import { CreateDto } from 'src/user/dto/create.dto';
import { FullRegisterDto } from 'src/user/dto/full-register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: CreateDto): Promise<any> {
    return this.authService.signUp(body);
  }

  @Post('fullRegister')
  async fullRegister(@Body() body: FullRegisterDto): Promise<any> {
    return this.authService.fullRegister(body);
  }

  @Post('sigIn')
  async signIn(@Body() body: CreateDto): Promise<any> {}
}
