import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class InternalGatewayService {
  constructor(
    private cartSrvice: CartService,
    private invoiceService: InvoiceService,
    private walletService: WalletService,
    private dataSource: DataSource,
  ) {}

  async withdrawToBankCart(
    body: ITransfer,
    user: ValidatedJwtUser,
    gatewayId: string,
  ): Promise<any> {
    const bankCard = await this.cartSrvice.findOneById(
      body.bankCartId as string,
    );
    //1)check if bankCartId exist
    if (!bankCard) throw new NotFoundException('Such a Bank cart not found!');

    //2)check if bankCartId is for this user
    if (bankCard.user.id !== user.id)
      throw new BadRequestException('cart is for another user!');

    //origin wallet is IRR wallet.
    const irrWallet = await this.walletService.findOneById(
      +(body.withdrawOriginWalletId as string),
    );

    //3)if demanded wallet is not IRR wallet, throw error:
    if (irrWallet.type !== WalletTypeEnum.IRR)
      throw new BadRequestException('Wrong wallet! should be IRR wallet');

    //4)if amount is higher than unblocked in IRR wallet, throw error:
    if (
      this.isAmountGreaterThanUnlockedBalance({
        invoiceAmount: body.amount,
        walletBalance: irrWallet.balance,
        walletLockedBalance: irrWallet.lockedBalance,
      })
    )
      throw new BadRequestException(
        'amount is greater than your IRR-wallet balance!',
      );

    //5):
    //5-1)create invoice
    //5-2)write locked amount in wallet
    return await this.dataSource.transaction(async (manager) => {
      const invoice = await this.invoiceService.createInvoiceWithManager(
        manager,
        {
          paymentGatewayId: gatewayId,
          type: TransactionType.WITHDRAWAL,
          title: 'localized-title???',
          description: 'localized-desc',
          subtotal: body.amount,
          tax: 0, //??
          discount: 0, //?
          user: bankCard.user,
          fromWallet: irrWallet as Wallet,
          toBankCartId: bankCard.id,
        },
      );

      await this.walletService.lockAmountWithManager(
        manager,
        irrWallet.id,
        body.amount,
      );

      return invoice;
    });
  }

  async depostCryptoWallet(
    body: ITransfer,
    user: ValidatedJwtUser,
  ): Promise<any> {
    //check if depositWallet exist
    //check if depositWallet is for this user
    //=>return address
  }

  async withdrawCrypto(body: ITransfer, user: ValidatedJwtUser): Promise<any> {
    //check if withdrawOriginWalletId exist
    //check if withdrawOriginWalletId is for this user
    //check if amount is not greater than wallet balance.
  }

  isAmountGreaterThanUnlockedBalance(args: {
    invoiceAmount: number;
    walletBalance: number;
    walletLockedBalance: number;
  }) {
    const amount = new Decimal(args.invoiceAmount);
    const balance = new Decimal(args.walletBalance);
    const lockedBalance = new Decimal(args.walletLockedBalance);

    const available = balance.minus(lockedBalance);

    return amount.greaterThan(available);
  }
}
