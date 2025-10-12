import {
  BadGatewayException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gateway } from './entity/gateway.entity';
import { IcreateGateway } from './interface/create-gateway.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { returnEnvName } from 'src/common/helpers/return-env-name.helper';

let myAuthority = '';

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(Gateway) private gatewayRepo: Repository<Gateway>,
    private readonly httpService: HttpService,
  ) {}

  async createGateway(body: IcreateGateway): Promise<any> {
    return await this.gatewayRepo.save({
      name: body.name,
      displayName: body.displayName,
      endpoints: {
        sandbox: {
          requestUrl: body.sandboxRequestUrl,
          paymentUrl: body.sandboxPaymentUrl,
          callbackUrl: body.sandboxCallbackUrl,
          verifyUrl: body.sandboxVerifyUrl,
        },
        production: {
          requestUrl: body.productRequestUrl,
          paymentUrl: body.productPaymentUrl,
          callbackUrl: body.productCallbackUrl,
          verifyUrl: body.productVerifyUrl,
        },
      },
      credentials: {
        apiKey: body?.apiKey,
        merchantId: body?.merchantId,
      },
    });
  }

  async findOneActiveById(id: string): Promise<any> {
    return await this.gatewayRepo.findOne({
      where: {
        id: +id,
        isActive: true,
      },
    });
  }

  async bankPayment(): Promise<any> {
    const gateWayId = 1;
    const existGateway = await this.gatewayRepo.findOne({
      where: { id: gateWayId },
    });

    if (!existGateway)
      throw new BadGatewayException('such a gateway not found!');
    //invoice by pending-status be created or create.

    try {
      const resCanUserGoToPayment = await firstValueFrom(
        this.httpService.post(
          existGateway?.endpoints[returnEnvName()].requestUrl,
          {
            merchant_id: existGateway?.credentials.merchantId,
            callback_url: existGateway?.endpoints[returnEnvName()].callbackUrl,
            amount: '11500',
            description: 'bla blas',
            currency: 'IRR',
            order_id: '11', //invoiceNumber
          },
        ),
      );

      myAuthority = resCanUserGoToPayment.data.data.authority;

      return `${existGateway?.endpoints[returnEnvName()].paymentUrl}/${myAuthority}`;
    } catch (error) {
      throw new PreconditionFailedException(
        `ZARINPAL gives error for accepting payment>>${error}`,
      );
    }
  }

  async checkPayment(req: Request): Promise<any> {
    console.log('req.url>>>', req.url, req.query);
    console.log('req.query>>>', req.query);

    try {
      if (req.query.Status === 'OK') {
        const gateWayId = 1;

        const existGateway = await this.gatewayRepo.findOne({
          where: { id: gateWayId },
        });
        if (!existGateway)
          throw new BadGatewayException('such a gateway not found!');
        console.log('myAuthority>>>', myAuthority);
        const resIsPaymentProccessedSucces = await firstValueFrom(
          this.httpService.post(
            `${existGateway?.endpoints[returnEnvName()].verifyUrl}`,
            {
              merchant_id: existGateway.credentials.merchantId,
              amount: '11500',
              //   authority: resCanUserGoToPayment.data.data.authority,
              authority: myAuthority,
              //   currency: 'IRR',
            },
          ),
        );
        console.log(
          'resIsPaymentProccessedSucces>>>>',
          resIsPaymentProccessedSucces,
        );

        const {
          wages,
          message,
          code,
          ref_id,
          card_pan,
          card_hash,
          fee_type,
          shaparak_fee,
          fee,
          order_id,
        } = resIsPaymentProccessedSucces.data.data;

        if (code === 100 || code === 101) {
          console.log('wages>>>>', wages);
          console.log('message>>>>', message);

          console.log('code>>>>', code);
          console.log('ref_id>>>>', ref_id);
          console.log('card_pan>>>>', card_pan);
          console.log('card_hash>>>>', card_hash);
          console.log('fee_type>>>>', fee_type);
          console.log('shaparak_fee>>>>', shaparak_fee);

          console.log('fee>>>>', fee);
          console.log('order_id>>>>', order_id);

          // complete INVOICE AND
          // redirect by RESPONSE that is success...
          return { ref_id, card_pan, card_hash, fee_type, fee };
        } else {
          ('error');
        }
      } else {
        //redirect fault
      }
    } catch (error) {
      throw new PreconditionFailedException(
        `ZARINPAL gives error in verification the payment>>${error}`,
      );
    }
  }
}
