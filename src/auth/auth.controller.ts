import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateDto } from 'src/user/dto/create.dto';
import { FullRegisterDto } from 'src/user/dto/full-register.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginReturnedRequest } from './interfaces/payload.interface';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() body: CreateDto): Promise<any> {
    return this.authService.signUp(body);
  }

  //TODO => after passport complete.
  @Post('fullRegister')
  async fullRegister(@Body() body: FullRegisterDto): Promise<any> {
    return this.authService.fullRegister(body);
  }

  //Done => after passport
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sigIn')
  async signIn(@Request() req): Promise<any> {
    const { id, email }: LoginReturnedRequest = req.user;
    return this.authService.signIn(id, email);
  }
}
