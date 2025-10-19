import { BadRequestException, Injectable } from '@nestjs/common';
import { Otp } from '../entity/otp.entity';
import { ValidatedJwtUser } from 'src/modules/auth/interfaces/payload.interface';
import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { DataSource } from 'typeorm';
import { OtpService } from '../otp.service';
import { OtpTypeEnum } from '../enum/otp-type.enum';
import { EmailProducer } from 'src/queue/producers/email.producer';
import { CartService } from 'src/modules/cart/cart.service';

@Injectable()
export class OtpWithdrawService {
  constructor(
    private invoiceService: InvoiceService,
    private dataSource: DataSource,
    private otpService: OtpService,
    private emailProducer: EmailProducer,
    private cartService: CartService,
  ) {}
  async handleResend(existOtp: Otp, user: ValidatedJwtUser): Promise<any> {
    //1)If Invoice exists
    // AND is for this user
    // AND Is this OTP for this Invoice
    // AND inspect invoice status that should be <otp pending>...
    const existInvoice = await this.invoiceService.findOneByRelations(
      {
        id: +(existOtp.withDrawInvoiceId as string),
        user: { id: user.id },
        status: InvoiceStatus.OTP_PENDING,
      },
      ['user', 'fromWallet'],
    );
    if (!existInvoice)
      throw new BadRequestException(
        'this OTP is not related to you or this invocie!',
      );

    this.dataSource.transaction(async (manager) => {
      //2)invalidate this OTP...
      existOtp.used = true;
      manager.save(Otp, existOtp);

      //3)create new OTP...
      const otpToSend = await this.otpService.createOtpByManager(manager, {
        withDrawInvoiceId: existInvoice.id,
        userId: user.id.toString(),
        otpType: OtpTypeEnum.WITHDRW,
      });

      const withDrawTitle = async () => {
        console.log('existInvoice>>>', existInvoice);
        if (existInvoice.toWalletAddress) {
          return `from <${existInvoice.fromWallet.id}> to <${existInvoice.toWalletAddress}> wallet address`;
        } else if (existInvoice.toBankCartId) {
          const bankCart = await this.cartService.findOneByIdByManager(
            manager,
            existInvoice.toBankCartId,
          );
          return `from ${existInvoice.fromWallet.id} to ${bankCart.bankNumber + ' - ' + bankCart.bankName} wallet address`;
        } else {
          throw new Error('Internal error!!!!!');
        }
      };

      //4)send Email...
      await this.emailProducer.addOtpEmailJob({
        sendTo: user.email,
        code: otpToSend.rawOtpCode,
        fullName: existInvoice.user.fullName,
        title: await withDrawTitle(),
      });
    });
  }
}
