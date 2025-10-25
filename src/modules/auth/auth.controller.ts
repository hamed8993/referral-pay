import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/requests/create.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ValidatedLoginReq } from './interfaces/payload.interface';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from '../user/dto/responses/login.response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../user/dto/requests/login.dto';
import { SignUpResponseDto } from './dto/reponse/sign-up.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    type: SignUpResponseDto,
  })
  @Public()
  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto): Promise<SignUpResponseDto> {
    const res = await this.authService.signUp(body);
    return {
      data: {
        enrollment: res.enrollment,
        email: res.user,
      },
    };
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({
    type: LoginResponseDto,
  })
  //Done => after passport
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req): Promise<LoginResponseDto> {
    const { id, email }: ValidatedLoginReq = req.user;
    return {
      data: {
        accessToken: await this.authService.signIn(id, email),
      },
    };
  }
}
