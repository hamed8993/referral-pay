import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { ValidatedJwtUser } from 'src/modules/auth/interfaces/payload.interface';
import { CartService } from 'src/modules/cart/cart.service';
import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { ITransfer } from 'src/modules/transfer/interface/transfer.interface';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { WalletTypeEnum } from 'src/modules/wallet/enum/wallet-type.enum';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { DataSource } from 'typeorm';
import { isAmountGreaterThanUnlockedBalance } from '../../helper/helper';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { OtpService } from 'src/modules/otp/opt.service';
import { EmailProducer } from 'src/queue/producers/email.producer';

@Injectable()
export class WithdrawBankCart {
  constructor(
    private cartSrvice: CartService,
    private invoiceService: InvoiceService,
    private walletService: WalletService,
    private dataSource: DataSource,
    private otpService: OtpService,
    private emailProducer: EmailProducer,
  ) {}
  async withdrawToBankCart(
    body: ITransfer,
    user: ValidatedJwtUser,
    gatewayId: string,
  ): Promise<any> {
    //PAYLOAD=>bankCartId, withdrawOriginWalletId, amount
    const payload: Pick<
      ITransfer,
      'bankCartId' | 'withdrawOriginWalletId' | 'amount'
    > = {
      bankCartId: body.bankCartId,
      withdrawOriginWalletId: body.withdrawOriginWalletId,
      amount: body.amount,
    };
    const bankCard = await this.cartSrvice.findOneById(
      payload.bankCartId as string,
    );
    //1)check if bankCartId exist
    if (!bankCard) throw new NotFoundException('Such a Bank cart not found!');

    //2)check if bankCartId is for this user
    if (bankCard.user.id !== user.id)
      throw new BadRequestException('cart is for another user!');

    const irrWalletForThisUserId =
      await this.walletService.findOneByIdForThisUserId(
        +(payload.withdrawOriginWalletId as string),
        user.id,
      );

    //3)check if irrWallet is for this user
    if (!irrWalletForThisUserId)
      throw new BadRequestException(
        'Wrong wallet! this wallet is not belong to you!',
      );

    //4)if demanded wallet is not IRR wallet, throw error:
    if (irrWalletForThisUserId.type !== WalletTypeEnum.IRR)
      throw new BadRequestException('Wrong wallet! should be IRR wallet');

    //5)if amount is higher than unblocked in IRR wallet, throw error:
    if (
      isAmountGreaterThanUnlockedBalance({
        invoiceAmount: payload.amount,
        walletBalance: irrWalletForThisUserId.balance,
        walletLockedBalance: irrWalletForThisUserId.lockedBalance,
      })
    )
      throw new BadRequestException(
        'amount is greater than your IRR-wallet balance!',
      );

    //6):
    //6-1)create invoice
    //6-2)write locked amount in wallet
    return await this.dataSource.transaction(async (manager) => {
      const invoice = await this.invoiceService.createInvoiceWithManager(
        manager,
        {
          status: InvoiceStatus.OTP_PENDING,
          paymentGatewayId: gatewayId,
          type: TransactionType.WITHDRAWAL,
          title: 'localized-title???',
          description: 'localized-desc',
          subtotal: payload.amount,
          tax: 0, //??
          discount: 0, //?
          user: bankCard.user,
          fromWallet: irrWalletForThisUserId as Wallet,
          toBankCartId: bankCard.id,
        },
      );

      await this.walletService.lockAmountWithManager(
        manager,
        irrWalletForThisUserId.id,
        payload.amount,
      );

      //Todo=> 7)Email code send......
      await this.emailProducer.addOtpEmailJob({
        sendTo: user.email,
        code: await this.otpService.createOpt({
          withDrawInvoiceId: invoice.id,
          userId: user.id.toString(),
        }),
        fullName: invoice.user.fullName,
        title: 'withdraw to bank cart admittion!',
      });
      return {
        currency: 'IRR',
        invoiceNumber: invoice.invoiceNumber,
        fromWallet: irrWalletForThisUserId,
        bankCard,
        amount: payload.amount,
      };
    });
  }
}
