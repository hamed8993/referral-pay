import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { WalletController } from './wallet.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers:[WalletController],
  providers: [WalletService],
  imports: [TypeOrmModule.forFeature([Wallet]),UserModule],
  exports: [WalletService],
})
export class WalletModule {}
