import { Body, Controller, Post, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('create')
  async createWallet(@Body() body: CreateWalletDto, @Request() req) {
    return await this.walletService.createWallet(body, req.user);
  }
}
