import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gateway } from './entity/gateway.entity';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { HttpModule } from '@nestjs/axios';
import { InternalGatewayService } from './strategies/internal.service';
import { CartModule } from '../cart/cart.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { WalletModule } from '../wallet/wallet.module';
import { DepositCryptoService } from './strategies/internal/deposit-crypto.service';
import { WithdrawCryptoService } from './strategies/internal/withdraw-crypto.service';
import { WithdrawBankCart } from './strategies/internal/withdraw-bank-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gateway]),
    HttpModule,
    CartModule,
    InvoiceModule,
    WalletModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    InternalGatewayService,
    DepositCryptoService,
    WithdrawBankCart,
    WithdrawCryptoService,
  ],
  exports: [
    GatewayService,
    InternalGatewayService,
    DepositCryptoService,
    WithdrawBankCart,
    WithdrawCryptoService,
  ],
})
export class GatewayModule {}
