import { BadRequestException, Injectable } from '@nestjs/common';
import { ITransfer } from './interface/transfer.interface';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayType } from 'src/common/enums/gateway-type.enum';
import { ValidatedJwtUser } from '../auth/interfaces/payload.interface';
import { InternalGatewayService } from '../gateway/strategies/internal.service';

@Injectable()
export class TransferService {
  constructor(
    private gatewayService: GatewayService,
    private internalGatewayService: InternalGatewayService,
  ) {}
  async dispatcher(body: ITransfer, user: ValidatedJwtUser): Promise<any> {
    const gateway = await this.gatewayService.findOneActiveById(body.gatewayId);
    if (!gateway) throw new BadRequestException('Such a GATEWAY not found!');

    switch (gateway.gatewayType) {
      case GatewayType.INTERNAL:
        return this.internalGatewayServiceDispatcher(body, user, gateway.id);
        break;

      case GatewayType.EXTERNAL:
        return this.externalGatewayDispatcher(body);
        break;

      default:
        throw new BadRequestException('bad GATEWAY request! dispatcher method');
    }
  }

  async internalGatewayServiceDispatcher(
    body: ITransfer,
    user: ValidatedJwtUser,
    gatewayId: string,
  ): Promise<any> {
    if (
      body.type === TransactionType.WITHDRAWAL &&
      body.withdrawOriginWalletId &&
      body.withdrawDestinationWalletAddress
    ) {
      return this.internalGatewayService.withdrawCrypto(body, user, gatewayId);
    }
    if (
      body.type === TransactionType.WITHDRAWAL &&
      body.bankCartId &&
      body.withdrawOriginWalletId
    ) {
      return await this.internalGatewayService.withdrawToBankCart(
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
      return await this.internalGatewayService.depostCryptoWallet(
        body,
        user,
        gatewayId,
      );
    }
    throw new BadRequestException('Bad gateway request! internal method');
  }

  async externalGatewayDispatcher(body: ITransfer): Promise<any> {}
}

//   amount: number;
//   type: TransactionType;
//   description?: string;
//   gatewayId: string | number;
//   cryptoDepositNetwork?: string;
//   depositWalletAdress?: string;
//   withdrawOriginWalletId?: string;
//   withdrawDestinationWalletAddress?: string;
//   bankCartId?: string; //for withdraw of rial wallet to bank account like: topchange
