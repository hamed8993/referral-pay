import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Roles } from './auth/decorators/role.decorator';
import { RoleEnum } from './common/enums/role.enum';
import { RoleGuard } from './auth/guards/role.guard';
import { Public } from './auth/decorators/public.decorator';

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
