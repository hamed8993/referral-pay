import { Body, Controller, Post, Request } from '@nestjs/common';
import { IFullRegister } from './interface/full-register.interface';
import { UserService } from './user.service';
import { FullRegisterDto } from './dto/full-register.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('fullRegister')
  async fullRegister(
    @Body() body: FullRegisterDto,
    @Request() req,
  ): Promise<any> {
    return this.userService.fullRegister(body, req.user);
  }
}
