import { RoleEnum } from 'src/common/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { ICreateCurrency } from './interface/create.interface';

@Controller('currency')
export class CurrencyController {
  constructor() {}

  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  @Post('add')
  async createCurrency(@Body() body: ICreateCurrency): Promise<any> {
    return await this.createCurrency(body);
  }


  @Get('get')
  async get(): Promise<any> {
    return await this.get();
  }
}
