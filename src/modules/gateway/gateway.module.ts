import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gateway } from './entity/gateway.entity';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { HttpModule } from '@nestjs/axios';
import { CartModule } from '../cart/cart.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { WalletModule } from '../wallet/wallet.module';
import { DepositCryptoService } from './strategies/internal/deposit-crypto.service';
import { WithdrawCryptoService } from './strategies/internal/withdraw-crypto.service';
import { WithdrawBankCart } from './strategies/internal/withdraw-bank-cart.service';
import { GatewayDispatcherService } from './gateway-dispatcher.service';
import { ZarrinpalService } from './strategies/external/bank-zarrinpal.service';
import { UserModule } from '../user/user.module';
import { TransactionModule } from '../transaction/transaction.module';
import { PaymentGatewayFactory } from './factory/payment-gateway.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gateway]),
    HttpModule,
    CartModule,
    InvoiceModule,
    WalletModule,
    UserModule,
    TransactionModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    GatewayDispatcherService,
    DepositCryptoService,
    WithdrawBankCart,
    WithdrawCryptoService,
    ZarrinpalService,
    PaymentGatewayFactory,
  ],
  exports: [
    GatewayService,
    GatewayDispatcherService,
    DepositCryptoService,
    WithdrawBankCart,
    WithdrawCryptoService,
  ],
})
export class GatewayModule {}
