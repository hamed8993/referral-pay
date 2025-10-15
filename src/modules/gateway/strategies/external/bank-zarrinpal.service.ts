import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { returnEnvName } from 'src/common/helpers/return-env-name.helper';
import { Gateway } from '../../entity/gateway.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { ITransfer } from 'src/modules/transfer/interface/transfer.interface';
import { Invoice } from 'src/modules/invoice/entity/invoice.entity';
import { GatewayProviderEnum } from 'src/common/enums/gateway-provider.enum';
import {
  INavToPaymentRes,
  IZarrinpalValidated,
} from '../../interface/zarrinpal-gateway.interface';
import {
  IGatewayCallback,
  IVerifyPaymentArgs,
  PaymentCallbackResponse,
  PaymentVerifyResponse,
} from '../../interface/gateway.interface';

@Injectable()
export class ZarrinpalService implements IGatewayCallback {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Gateway) private gatewayRepo: Repository<Gateway>,
  ) {}

  async navToZarrinpalBankPayment(
    Zgateway: Gateway,
    body: ITransfer,
  ): Promise<INavToPaymentRes> {
    const payload: Pick<ITransfer, 'amount' | 'description'> = {
      amount: body.amount,
      description: body.description,
    };
    let myAuthority: string;

    try {
      const resCanUserGoToPayment = await firstValueFrom(
        this.httpService.post(Zgateway?.endpoints[returnEnvName()].requestUrl, {
          merchant_id: Zgateway?.credentials.merchantId,
          callback_url: Zgateway?.endpoints[returnEnvName()].callbackUrl,
          amount: payload.amount,
          description: payload.description || 'default!!!!!!!!11',
          currency: 'IRR',
        }),
      );

      myAuthority = resCanUserGoToPayment.data.data.authority;

      return {
        redirUrl: `${Zgateway?.endpoints[returnEnvName()].paymentUrl}/${myAuthority}`,
        authority: myAuthority,
      };
    } catch (error) {
      throw new PreconditionFailedException(
        `ZARINPAL gives error for accepting payment>>${error}`,
      );
    }
  }

  async zCheckPayment({
    invoiceTotalAmount,
    invoicePaymentAuthority,
  }: IVerifyPaymentArgs): Promise<IZarrinpalValidated> {
    try {
      const existGateway = await this.gatewayRepo.findOne({
        where: { provider: GatewayProviderEnum.ZARRINPAL },
      });
      if (!existGateway)
        throw new BadGatewayException('such a gateway not found!');

      const IsPaymentProccessedSuccessRes = await firstValueFrom(
        this.httpService.post(
          `${existGateway?.endpoints[returnEnvName()].verifyUrl}`,
          {
            merchant_id: existGateway.credentials.merchantId,
            amount: parseInt(invoiceTotalAmount),
            authority: invoicePaymentAuthority,
            currency: 'IRR',
          },
        ),
      );

      return IsPaymentProccessedSuccessRes.data.data;
    } catch (error) {
      //update invoice by <req.query.Authority> to cancelled
      throw new PreconditionFailedException(
        `ZARINPAL gives error in verification the payment>>${error}`,
      );
    }
  }

  async extractCallbackData(req: Request): Promise<PaymentCallbackResponse> {
    return {
      authority: req.query.Authority as string,
      status: req.query.Status === 'OK' ? req.query.Status : 'FAILED', //????
    };
  }

  async verifyPayment(
    payload: IVerifyPaymentArgs,
  ): Promise<PaymentVerifyResponse> {
    const verificationRes: IZarrinpalValidated =
      await this.zCheckPayment(payload);
    if (verificationRes.code == 101)
      throw new BadRequestException(
        'This Transaction done/validated already successfully!',
      );
    if (verificationRes.code == 100) {
      //?????? for 101
      return {
        success: true,
        referenceId: verificationRes.ref_id.toString(),
      };
    } else {
      return {
        success: true,
      };
    }
  }
}
