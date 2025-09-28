import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('create')
  async createWallet(@Body() body: CreateWalletDto) {
    return await this.walletService.createWallet(body);
  }
}
