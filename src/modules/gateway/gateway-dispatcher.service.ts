import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import Decimal from 'decimal.js';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { ValidatedJwtUser } from 'src/modules/auth/interfaces/payload.interface';
import { CartService } from 'src/modules/cart/cart.service';
import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { ITransfer } from 'src/modules/transfer/interface/transfer.interface';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { DataSource } from 'typeorm';
import { isAmountGreaterThanUnlockedBalance } from './helper/helper';
import { Gateway } from './entity/gateway.entity';
import { GatewayType } from 'src/common/enums/gateway-type.enum';
import { GatewayProviderEnum } from 'src/common/enums/gateway-provider.enum';
import { WithdrawBankCart } from './strategies/internal/withdraw-bank-cart.service';
import { DepositCryptoService } from './strategies/internal/deposit-crypto.service';
import { WithdrawCryptoService } from './strategies/internal/withdraw-crypto.service';
import { ZarrinpalService } from './strategies/external/bank-zarrinpal.service';

@Injectable()
export class GatewayDispatcherService {
  constructor(
    private depositCryptoService: DepositCryptoService,
    private withdrawCryptoService: WithdrawCryptoService,
    private withdrawBankCart: WithdrawBankCart,
    private zarrinpalService: ZarrinpalService,
    private invoiceService: InvoiceService,
    private walletService: WalletService,
  ) {}

  async dispatch(
    gateway: Gateway,
    body: ITransfer,
    user: ValidatedJwtUser,
  ): Promise<any> {
    switch (gateway.gatewayType) {
      case GatewayType.INTERNAL:
        return this.internalGatewayDispatcher(
          body,
          user,
          gateway.id.toString(),
        );
        break;

      case GatewayType.EXTERNAL:
        return this.externalGatewayDispatcher(body, user, gateway);
        break;

      default:
        throw new BadRequestException('bad GATEWAY request! dispatcher method');
    }
  }

  async internalGatewayDispatcher(
    body: ITransfer,
    user: ValidatedJwtUser,
    gatewayId: string,
  ): Promise<any> {
    if (
      body.type === TransactionType.WITHDRAWAL &&
      body.withdrawOriginWalletId &&
      body.withdrawDestinationWalletAddress
    ) {
      return this.withdrawCryptoService.withdrawCrypto(body, user, gatewayId);
    }
    if (
      body.type === TransactionType.WITHDRAWAL &&
      body.bankCartId &&
      body.withdrawOriginWalletId
    ) {
      return await this.withdrawBankCart.withdrawToBankCart(
        body,
        user,
        gatewayId,
      );
    }
    if (
      body.type === TransactionType.DEPOSIT &&
      body.cryptoDepositWalletId &&
      body.cryptoDepositNetwork
    ) {
      return await this.depositCryptoService.depostCryptoWallet(
        body,
        user,
        gatewayId,
      );
    }
    throw new BadRequestException('Bad gateway request! internal method');
  }

  async externalGatewayDispatcher(
    body: ITransfer,
    user: ValidatedJwtUser,
    gateway: Gateway,
  ): Promise<any> {
    const payload: Pick<ITransfer, 'amount'> = { amount: body.amount };
    // this.gatewayService[foundedGateway.handler]()
    const depositoWallet = await this.walletService.findOneByTypeForThisUserId(
      WalletTypeEnum.IRR,
      user.id,
    );
    switch (gateway.provider) {
      case GatewayProviderEnum.ZARRINPAL:
        const { redirUrl, authority } =
          await this.zarrinpalService.navToZarrinpalBankPayment(gateway, body);
        await this.invoiceService.createInvoice({
          paymentGatewayId: gateway.id.toString(),
          type: TransactionType.DEPOSIT,
          title: 'localized-title???',
          description: 'localized-desc',
          subtotal: payload.amount,
          tax: 0, //??
          discount: 0, //?
          user: depositoWallet.user,
          paymentGatewayAuthority: authority,
          toWallet: depositoWallet,
        });
        return redirUrl;
        break;

      case GatewayProviderEnum.PAYPAL:
        console.log('PAYPAL');
        break;

      case GatewayProviderEnum.B2B:
        console.log('B2B');
        break;

      default:
        throw new BadRequestException('Un proper external gateway!');
    }
  }
}
