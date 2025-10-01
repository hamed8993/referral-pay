import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CancellInvoiceDto } from './dto/cancell-invoice.dto';
import { ProcessInvoiceDto } from './dto/process-invoice.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  //Done=>insert user by cookie
  @Post('create')
  async createInvoice(@Body() body: CreateInvoiceDto, @Request() req): Promise<any> {
    return await this.invoiceService.createInvoice(body,req.user);
  }

  //Done=>insert user by cookie
  @Post('cancell')
  async cancellInvoice(@Body() body: CancellInvoiceDto, @Request() req): Promise<any> {
    return await this.invoiceService.cancellInvoice(body,req.user);
  }

  //Done=>insert admin by cookie
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  @Post('admin')
  async processByAdmin(@Body() body: ProcessInvoiceDto,@Request() req): Promise<any> {
    return this.invoiceService.processByAdmin(body,req.user);
  }
}
