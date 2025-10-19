import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { TransactionType } from 'src/common/enums/transaction-type.enum';
import { Wallet } from 'src/modules/wallet/entity/wallet.entity';
import { isAmountGreaterThanUnlockedBalance } from '../../helper/helper';
import { ValidatedJwtUser } from 'src/modules/auth/interfaces/payload.interface';
import { ITransfer } from 'src/modules/transfer/interface/transfer.interface';
import { DataSource } from 'typeorm';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { OtpService } from 'src/modules/otp/otp.service';
import { EmailProducer } from 'src/queue/producers/email.producer';
import { OtpTypeEnum } from 'src/modules/otp/enum/otp-type.enum';

@Injectable()
export class WithdrawCryptoService {
  constructor(
    private invoiceService: InvoiceService,
    private walletService: WalletService,
    private dataSource: DataSource,
    private otpService: OtpService,
    private emailProducer: EmailProducer,
  ) {}

  async withdrawCrypto(
    body: ITransfer,
    user: ValidatedJwtUser,
    gatewayId: string,
  ): Promise<any> {
    //PAYLOAD=>bankCartId, withdrawOriginWalletId, amount
    const payload: Pick<
      ITransfer,
      | 'withdrawOriginWalletId'
      | 'withdrawDestinationWalletAddress'
      | 'amount'
      | 'cryptoDepositNetwork'
    > = {
      withdrawOriginWalletId: body.withdrawOriginWalletId,
      withdrawDestinationWalletAddress: body.withdrawDestinationWalletAddress,
      amount: body.amount,
      cryptoDepositNetwork: body.cryptoDepositNetwork,
    };
    //1)check if withdrawOriginWalletId exist AND check if withdrawOriginWalletId is for this user:

    const withdrawOriginWallet =
      await this.walletService.findOneByIdForThisUserId(
        +(payload.withdrawOriginWalletId as string),
        user.id,
      );
    if (!withdrawOriginWallet)
      throw new NotAcceptableException(
        'such a origin wallet not found OR this wallet is not belong to you!!',
      );

    //2)check if amount is not greater than wallet balance.
    if (
      isAmountGreaterThanUnlockedBalance({
        invoiceAmount: payload.amount,
        walletLockedBalance: withdrawOriginWallet.lockedBalance,
        walletBalance: withdrawOriginWallet.balance,
      })
    )
      throw new BadRequestException(
        'The demanded amount is greater than wallet balance...',
      );

    //3)Check: withdrawDestinationWalletAddress is exist but not belong to this user:
    const withdrawDestinationWallet = await this.walletService.findOneByAddress(
      payload.withdrawDestinationWalletAddress as string,
    );
    if (
      withdrawDestinationWallet &&
      user.id !== withdrawDestinationWallet.user.id
    )
      if (user.id !== withdrawDestinationWallet.user.id)
        throw new BadRequestException('This wallet is not belong to you!');

    //6):
    //6-1)create invoice:
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
          user: withdrawOriginWallet.user,
          fromWallet: withdrawOriginWallet as Wallet,
          cryptoNetwork: payload.cryptoDepositNetwork,
          toWalletAddress: payload.withdrawDestinationWalletAddress,
        },
      );

      await this.walletService.lockAmountWithManager(
        manager,
        withdrawOriginWallet.id,
        payload.amount,
      );

      //Done=> 7)Email code send......
      const otpToSend = await this.otpService.createOtp({
        withDrawInvoiceId: invoice.id,
        userId: user.id.toString(),
        otpType: OtpTypeEnum.WITHDRW,
      });
      await this.emailProducer.addOtpEmailJob({
        sendTo: user.email,
        code: otpToSend.rawOtpCode,
        fullName: invoice.user.fullName,
        title: `withdraw to crypto wallet of <${payload.withdrawDestinationWalletAddress}> cart admittion!`,
      });

      return {
        otpId: otpToSend.otpSavedRes.id,
        currency: withdrawOriginWallet.type, //UDS,USDT,IRR...
        invoiceNumber: invoice.invoiceNumber,
        fromWallet: withdrawOriginWallet,
        address: payload.withdrawDestinationWalletAddress,
        network: payload.cryptoDepositNetwork,
        amount: payload.amount,
      };
    });
  }
}
