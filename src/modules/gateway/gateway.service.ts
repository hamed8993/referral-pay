import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Gateway } from './entity/gateway.entity';
import { IcreateGateway } from './interface/create-gateway.interface';
import { Request } from 'express';
import { InvoiceService } from '../invoice/invoice.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletTypeEnum } from '../wallet/enum/wallet-type.enum';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import {
  PaymentCallbackResponse,
  PaymentVerifyResponse,
} from './interface/gateway.interface';
import { GatewayProviderEnum } from 'src/common/enums/gateway-provider.enum';
import { PaymentGatewayFactory } from './factory/payment-gateway.factory';

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(Gateway) private gatewayRepo: Repository<Gateway>,
    private invoiceService: InvoiceService,
    private dataSource: DataSource,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private paymentGatewayFactory: PaymentGatewayFactory,
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

  async paymentCallback(req: Request): Promise<any> {
    // console.log('req.url>>', req.url);
    // req.url>> /gateway/callback?Authority=S00000000000000000000000000000087zy8&Status=OK
    // req.url>> /gateway/callback?Authority=S000000000000000000000000000000plrvg&Status=NOK

    const invoice = await this.invoiceService.findOneByInvoiceAuthority(
      req.query.Authority as string,
    );

    const gateway = await this.gatewayRepo.findOne({
      where: {
        id: invoice.paymentGatewayId,
      },
    });
    if (!gateway)
      throw new NotFoundException(
        'Could not find any Gateway for this Invoice!',
      );

    const gatewayService = this.paymentGatewayFactory.getGateway(
      gateway.provider,
    );
    const callbackRes: PaymentCallbackResponse =
      await gatewayService.extractCallbackData(req);

    if (callbackRes.status === 'OK') {
      const verificationRes: PaymentVerifyResponse =
        await gatewayService.verifyPayment({
          invoiceTotalAmount: invoice.totalAmount,
          invoicePaymentAuthority: invoice.paymentGatewayAuthority,
        });

      // if (verificationRes.code == 100 || verificationRes.code == 101) {
      if (verificationRes.success) {
        return this.dataSource.transaction(async (manager) => {
          //1)update invoice by <req.query.Authority> to submitted
          const submittedInvoice =
            await this.invoiceService.submitPaymentInvoiceByAuthorityByManager(
              manager,
              req.query.Authority as string,
              ['user'],
            );
          //2)update wallet
          const updatedWallet =
            await this.walletService.depositWalletByUserByManagerByError(
              manager,
              {
                userId: submittedInvoice.user.id,
                walletType: WalletTypeEnum.IRR,
                amount: submittedInvoice.totalAmount,
              },
              ['user'],
            );
          // 3)create transaction
          const newTransaction =
            await this.transactionService.createTransactionByManager(manager, {
              amount: submittedInvoice.totalAmount,
              title: submittedInvoice.title || 'def title', //????????
              type: TransactionType.DEPOSIT,
              transactionTracingCode: verificationRes.referenceId as string,
              toWallet: updatedWallet,
              invoice: submittedInvoice,
              user: updatedWallet.user,
            });
          return {
            id: newTransaction.id,
            created_at: newTransaction.created_at,
            tracingCode: newTransaction.transactionTracingCode,
            invoiceId: newTransaction.invoiceId,
          };
        });
        //return where????
      } else {
        //update invoice by <req.query.Authority> to cancelled
        await this.invoiceService.cancellPaymentInvoiceByAuthorityOrError(
          req.query.Authority as string,
        );
      }
    } else {
      //update invoice by <req.query.Authority> to cancelled
      const cancelledInvoice =
        await this.invoiceService.cancellPaymentInvoiceByAuthorityOrError(
          req.query.Authority as string,
        );
      //return where????
      return cancelledInvoice;
    }
  }
}
