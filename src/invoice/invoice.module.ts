import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { UserModule } from 'src/user/user.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [TypeOrmModule.forFeature([Invoice]), UserModule, WalletModule],
})
export class InvoiceModule {}
