import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('x')
  async getHello(): Promise<any> {}
}
