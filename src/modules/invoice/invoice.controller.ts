import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/requests/create-invoice.dto';
import { CancellInvoiceDto } from './dto/requests/cancell-invoice.dto';
import { ProcessInvoiceDto } from './dto/requests/process-invoice.dto';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CancellInvoiceResponseDto } from './dto/responses/cancell-invoice.response.dto';

@ApiBearerAuth('authorizationToken')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  //Done=>insert user by cookie
  @ApiResponse({ type: CancellInvoiceResponseDto })
  @Post('cancell')
  async cancellInvoice(
    @Body() body: CancellInvoiceDto,
    @Request() req,
  ): Promise<CancellInvoiceResponseDto> {
    const user: ValidatedJwtUser = req.user;
    const res = await this.invoiceService.cancellInvoiceByUser(body, user);
    return { data: res };
  }

  //Done=>insert admin by cookie
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  @Post('admin')
  async processByAdmin(
    @Body() body: ProcessInvoiceDto,
    @Request() req,
  ): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return this.invoiceService.processByAdmin(body, user);
  }
}
