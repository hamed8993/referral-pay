import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { QueueModule } from './queue/queue.module';
import { JobModule } from './jobs/job.module';
import { MailModule } from './mailer/mail.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { CartModule } from './modules/cart/cart.module';
import { OtpModule } from './modules/otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    InvoiceModule,
    WalletModule,
    QueueModule,
    JobModule,
    TransactionModule,
    MailModule,
    GatewayModule,
    TransferModule,
    CartModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
