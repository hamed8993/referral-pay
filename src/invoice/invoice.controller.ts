import { Body, Controller, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CancellInvoiceDto } from './dto/cancell-invoice.dto';
import { ProcessInvoiceDto } from './dto/process-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  //Todo=>insert user by cookie
  @Post('create')
  async createInvoice(@Body() body: CreateInvoiceDto): Promise<any> {
    return await this.invoiceService.createInvoice(body);
  }

  //Todo=>insert user by cookie
  @Post('cancell')
  async cancellInvoice(@Body() body: CancellInvoiceDto): Promise<any> {
    return await this.invoiceService.cancellInvoice(body);
  }

  //Todo=>insert admin by cookie
  @Post('admin')
  async processByAdmin(@Body() body: ProcessInvoiceDto): Promise<any> {
    return this.invoiceService.processByAdmin(body);
  }
}
