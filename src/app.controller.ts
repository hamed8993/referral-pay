import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { Roles } from './modules/auth/decorators/role.decorator';
import { RoleEnum } from './common/enums/role.enum';
import { RoleGuard } from './modules/auth/guards/role.guard';
import { Public } from './modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  // @Roles(RoleEnum.ADMIN)
  // @UseGuards(RoleGuard)
  // @UseGuards(JwtAuthGuard)
  // @Public()
  @Get('x')
  async getHello(): Promise<any> {
    return 'passed!!!!';
  }
}
