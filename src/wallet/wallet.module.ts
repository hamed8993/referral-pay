import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';

@Module({
  providers: [WalletService],
  imports: [TypeOrmModule.forFeature([Wallet])],
})
export class WalletModule {}
