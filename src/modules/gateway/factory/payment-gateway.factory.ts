import { Injectable, NotFoundException } from '@nestjs/common';
import { GatewayProviderEnum } from 'src/common/enums/gateway-provider.enum';
import { ZarrinpalService } from '../strategies/external/bank-zarrinpal.service';
import { IGatewayCallback } from '../interface/gateway.interface';

@Injectable()
export class  PaymentGatewayFactory {
  constructor(
    private zarrinpalService: ZarrinpalService,
    // private paypalService: PaypalService,
  ) {}
  getGateway(provider: GatewayProviderEnum): IGatewayCallback {

    switch (provider) {
      case GatewayProviderEnum.ZARRINPAL:
        return this.zarrinpalService;
        break;

      //   case GatewayProviderEnum.PAYPAL:
      //     // return this.paypalService
      //     break;

      //   case GatewayProviderEnum.B2B:
      //     // return this.B2bService
      //     break;

      default:
        throw new NotFoundException(
          'could not find any gatewaySerivce in Factory!',
        );
    }
  }
}
