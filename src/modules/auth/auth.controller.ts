import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ValidatedLoginReq } from './interfaces/payload.interface';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() body: CreateUserDto): Promise<any> {
    return this.authService.signUp(body);
  }

  //Done => after passport
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(@Request() req): Promise<any> {
    const { id, email }: ValidatedLoginReq = req.user;
    return this.authService.signIn(id, email);
  }
}
