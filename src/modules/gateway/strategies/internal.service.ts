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
import { isAmountGreaterThanUnlockedBalance } from '../helper/helper';

@Injectable()
export class InternalGatewayService {
  // constructor(
  //   private cartSrvice: CartService,
  //   private invoiceService: InvoiceService,
  //   private walletService: WalletService,
  //   private dataSource: DataSource,
  // ) {}
  // async withdrawToBankCart(
  //   body: ITransfer,
  //   user: ValidatedJwtUser,
  //   gatewayId: string,
  // ): Promise<any> {
  //   //PAYLOAD=>bankCartId, withdrawOriginWalletId, amount
  //   const payload: Pick<
  //     ITransfer,
  //     'bankCartId' | 'withdrawOriginWalletId' | 'amount'
  //   > = {
  //     bankCartId: body.bankCartId,
  //     withdrawOriginWalletId: body.withdrawOriginWalletId,
  //     amount: body.amount,
  //   };
  //   const bankCard = await this.cartSrvice.findOneById(
  //     payload.bankCartId as string,
  //   );
  //   //1)check if bankCartId exist
  //   if (!bankCard) throw new NotFoundException('Such a Bank cart not found!');
  //   //2)check if bankCartId is for this user
  //   if (bankCard.user.id !== user.id)
  //     throw new BadRequestException('cart is for another user!');
  //   const irrWalletForThisUserId =
  //     await this.walletService.findOneByIdForThisUserId(
  //       +(payload.withdrawOriginWalletId as string),
  //       user.id,
  //     );
  //   //3)check if irrWallet is for this user
  //   if (!irrWalletForThisUserId)
  //     throw new BadRequestException(
  //       'Wrong wallet! this wallet is not belong to you!',
  //     );
  //   //4)if demanded wallet is not IRR wallet, throw error:
  //   if (irrWalletForThisUserId.type !== WalletTypeEnum.IRR)
  //     throw new BadRequestException('Wrong wallet! should be IRR wallet');
  //   //5)if amount is higher than unblocked in IRR wallet, throw error:
  //   if (
  //     this.isAmountGreaterThanUnlockedBalance({
  //       invoiceAmount: payload.amount,
  //       walletBalance: irrWalletForThisUserId.balance,
  //       walletLockedBalance: irrWalletForThisUserId.lockedBalance,
  //     })
  //   )
  //     throw new BadRequestException(
  //       'amount is greater than your IRR-wallet balance!',
  //     );
  //   //Todo=>Email code send......
  //   //6):
  //   //6-1)create invoice
  //   //6-2)write locked amount in wallet
  //   return await this.dataSource.transaction(async (manager) => {
  //     const invoice = await this.invoiceService.createInvoiceWithManager(
  //       manager,
  //       {
  //         paymentGatewayId: gatewayId,
  //         type: TransactionType.WITHDRAWAL,
  //         title: 'localized-title???',
  //         description: 'localized-desc',
  //         subtotal: payload.amount,
  //         tax: 0, //??
  //         discount: 0, //?
  //         user: bankCard.user,
  //         fromWallet: irrWalletForThisUserId as Wallet,
  //         toBankCartId: bankCard.id,
  //       },
  //     );
  //     await this.walletService.lockAmountWithManager(
  //       manager,
  //       irrWalletForThisUserId.id,
  //       payload.amount,
  //     );
  //     return {
  //       currency: 'IRR',
  //       invoiceNumber: invoice.invoiceNumber,
  //       fromWallet: irrWalletForThisUserId,
  //       bankCard,
  //       amount: payload.amount,
  //     };
  //   });
  // }
  // async depostCryptoWallet(
  //   body: ITransfer,
  //   user: ValidatedJwtUser,
  //   gatewayId: string,
  // ): Promise<any> {
  //   //PAYLOAD=>amount,depositWalletId, network
  //   const payload: Pick<
  //     ITransfer,
  //     'cryptoDepositNetwork' | 'cryptoDepositWalletId' | 'amount'
  //   > = {
  //     cryptoDepositNetwork: body.cryptoDepositNetwork,
  //     cryptoDepositWalletId: body.cryptoDepositWalletId,
  //     amount: body.amount,
  //   };
  //   //1)check if depositWallet exist and check if depositWallet is for this user:
  //   const depositWalletForThisUserId =
  //     await this.walletService.findOneByIdForThisUserId(
  //       +(payload.cryptoDepositWalletId as string),
  //       user.id,
  //     );
  //   if (!depositWalletForThisUserId)
  //     throw new BadRequestException(
  //       'such a wallet not found OR this wallet is not belong to you!!',
  //     );
  //   //create invoice
  //   const savedInvoice = await this.invoiceService.createInvoice({
  //     paymentGatewayId: gatewayId,
  //     type: TransactionType.DEPOSIT,
  //     title: 'localized-title???',
  //     description: 'localized-desc',
  //     subtotal: payload.amount,
  //     tax: 0, //??
  //     discount: 0, //?
  //     user: depositWalletForThisUserId.user,
  //     toWallet: depositWalletForThisUserId,
  //     cryptoNetwork: payload.cryptoDepositNetwork,
  //   });
  //   //=>return address + tracing code
  //   return {
  //     currency: depositWalletForThisUserId.type,
  //     network: savedInvoice.cryptoNetwork,
  //     tracingCode: savedInvoice.invoiceNumber,
  //     amount: savedInvoice.subtotal,
  //     tax: savedInvoice.tax,
  //     discount: savedInvoice.discount,
  //     neAmount: savedInvoice._totalAmount,
  //     walletAddressForDeposit: '???????????????????????????',
  //   };
  //   //Todo: in after, will ad doc of deposit
  // }
  // async withdrawCrypto(
  //   body: ITransfer,
  //   user: ValidatedJwtUser,
  //   gatewayId: string,
  // ): Promise<any> {
  //   //PAYLOAD=>bankCartId, withdrawOriginWalletId, amount
  //   const payload: Pick<
  //     ITransfer,
  //     | 'withdrawOriginWalletId'
  //     | 'withdrawDestinationWalletAddress'
  //     | 'amount'
  //     | 'cryptoDepositNetwork'
  //   > = {
  //     withdrawOriginWalletId: body.withdrawOriginWalletId,
  //     withdrawDestinationWalletAddress: body.withdrawDestinationWalletAddress,
  //     amount: body.amount,
  //     cryptoDepositNetwork: body.cryptoDepositNetwork,
  //   };
  //   //1)check if withdrawOriginWalletId exist AND check if withdrawOriginWalletId is for this user:
  //   const withdrawOriginWallet =
  //     await this.walletService.findOneByIdForThisUserId(
  //       +(payload.withdrawOriginWalletId as string),
  //       user.id,
  //     );
  //   if (!withdrawOriginWallet)
  //     throw new NotAcceptableException(
  //       'such a wallet not found OR this wallet is not belong to you!!',
  //     );
  //   //2)check if amount is not greater than wallet balance.
  //   if (
  //     isAmountGreaterThanUnlockedBalance({
  //       invoiceAmount: payload.amount,
  //       walletLockedBalance: withdrawOriginWallet.lockedBalance,
  //       walletBalance: withdrawOriginWallet.balance,
  //     })
  //   )
  //     throw new BadRequestException(
  //       'The demanded amount is greater than wallet balance...',
  //     );
  //   //3)Check: withdrawDestinationWalletAddress is exist but not belong to this user:
  //   const withdrawDestinationWallet = await this.walletService.findOneByAddress(
  //     payload.withdrawDestinationWalletAddress as string,
  //   );
  //   if (
  //     withdrawDestinationWallet &&
  //     user.id !== withdrawDestinationWallet.user.id
  //   )
  //     if (user.id !== withdrawDestinationWallet.user.id)
  //       throw new BadRequestException('This wallet is not belong to you!');
  //   //Todo=>Email code send......
  //   //6):
  //   //6-1)create invoice:
  //   //6-2)write locked amount in wallet
  //   return await this.dataSource.transaction(async (manager) => {
  //     const invoice = await this.invoiceService.createInvoiceWithManager(
  //       manager,
  //       {
  //         paymentGatewayId: gatewayId,
  //         type: TransactionType.WITHDRAWAL,
  //         title: 'localized-title???',
  //         description: 'localized-desc',
  //         subtotal: payload.amount,
  //         tax: 0, //??
  //         discount: 0, //?
  //         user: withdrawOriginWallet.user,
  //         fromWallet: withdrawOriginWallet as Wallet,
  //         cryptoNetwork: payload.cryptoDepositNetwork,
  //         toWalletAddress: payload.withdrawDestinationWalletAddress,
  //       },
  //     );
  //     await this.walletService.lockAmountWithManager(
  //       manager,
  //       withdrawOriginWallet.id,
  //       payload.amount,
  //     );
  //     return {
  //       currency: withdrawOriginWallet.type, //UDS,USDT,IRR...
  //       invoiceNumber: invoice.invoiceNumber,
  //       fromWallet: withdrawOriginWallet,
  //       address: payload.withdrawDestinationWalletAddress,
  //       network: payload.cryptoDepositNetwork,
  //       amount: payload.amount,
  //     };
  //   });
  // }
  // isAmountGreaterThanUnlockedBalance(args: {
  //   invoiceAmount: number;
  //   walletBalance: number;
  //   walletLockedBalance: number;
  // }) {
  //   const amount = new Decimal(args.invoiceAmount);
  //   const balance = new Decimal(args.walletBalance);
  //   const lockedBalance = new Decimal(args.walletLockedBalance);
  //   const available = balance.minus(lockedBalance);
  //   return amount.greaterThan(available);
  // }
}
