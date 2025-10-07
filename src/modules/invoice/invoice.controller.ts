import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CancellInvoiceDto } from './dto/cancell-invoice.dto';
import { ProcessInvoiceDto } from './dto/process-invoice.dto';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { TransferDto } from './dto/transfer.dto';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';

@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post('/fiat/deposit')
  async handlePaymentDeposit() {
    //pay mony from my bank account for deposit my system wallet
    //online => not works.
    // OR
    // cartToCart/ShensaDar=>admin approve => server sends "cartToCart/ShenseDar" then just user should approve that i deposited.
  }

  @Post('/currency/deposit')
  async handleFiatDeposit() {
    // Dto:{
    //   currency,
    //   network,
    //   amount,
    //return address for this before deposit for deposit  => receive from blockchain nework
    // }
  }

  @Post('/fiat/withdraw')
  async handleFiatWithdraw() {
    //withdraw from my wallet to system's main wallet for pay back mony into my bank account
    // Dto:{
    //    amount
    //    bank-card
    //    fee? => from inserted amount => will go to selected bank by shaba after awhile.
    // }
  }

  @Post('/currency/withdraw')
  async handleCurrencyWithdraw() {
    //withdraw from my wallet to system's main wallet for pay back mony into my bank account
    // Dto:{
    //   currency,
    //   network,
    //   destinationAddress,
    //   amount,
    //   networkFee ???
    // }
  }

  @Post('transfer')
  async exchangeCurrency(@Body() body: TransferDto, @Request() req) {
    const user: ValidatedJwtUser = req.user;
    return await this.invoiceService.exchangeCurrency(body, user);
  }

  // async createInvoice(
  //   @Body() body: CreateInvoiceDto,
  //   @Request() req,
  // ): Promise<any> {
  //   return await this.invoiceService.createInvoice(body, req.user);
  // }

  //Done=>insert user by cookie
  @Post('cancell')
  async cancellInvoice(
    @Body() body: CancellInvoiceDto,
    @Request() req,
  ): Promise<any> {
    const user: ValidatedJwtUser = req.user;
    return await this.invoiceService.cancellInvoice(body, user);
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
