import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entity/invoice.entity';
import { UserModule } from 'src/modules/user/user.module';
import { WalletModule } from 'src/modules/wallet/wallet.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    UserModule,
    WalletModule,
    QueueModule,
  ],
  exports:[InvoiceService]
})
export class InvoiceModule {}
