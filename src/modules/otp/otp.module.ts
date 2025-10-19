import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entity/otp.entity';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { OtpWithdrawService } from './strategies/otp-withdraw.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { QueueModule } from 'src/queue/queue.module';
import { CartModule } from '../cart/cart.module';
import { OtpDispatcherService } from './otp-dispatcher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    InvoiceModule,
    QueueModule,
    CartModule,
  ],
  providers: [OtpService,OtpDispatcherService, OtpWithdrawService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
